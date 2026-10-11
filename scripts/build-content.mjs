import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import katex from 'katex'
import { articlePage, archivePage } from './reading-template.mjs'

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const origin = 'https://tooonnnnyyy.github.io/knowledge-base/'
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const unique = (values) => [...new Set(values)]

export function privacyFindings(text) {
  const rules = [
    ['local file path', /(?:file:\/\/|\/Users\/|\/home\/|[A-Z]:\\Users\\)/i],
    ['email address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
    ['credential', /(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9_-]{20,}|xox[baprs]-[A-Za-z0-9-]{12,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/],
    ['webhook address', /https?:\/\/[^\s)"<>]*(?:webhook|\/hook\/|hooks\.slack)/i],
    ['private identity or course reference', /\b(?:DTI\s*\d{4}|student\s*(?:id|number)|student_number|personal_career_simulator_context)\b/i],
    ['phone number', /(?:\+?1[ .-])?\(\d{3}\)[ .-]*\d{3}[ .-]*\d{4}\b/],
  ]
  return rules.filter(([, expression]) => expression.test(text)).map(([label]) => label)
}

function normalizeDate(value, fallback = '2026-10-10') {
  const date = value instanceof Date ? value.toISOString().slice(0, 10) : String(value || fallback)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) throw new Error('Invalid article date')
  return date
}

export function readPosts(directory) {
  const posts = []
  for (const name of fs.readdirSync(directory).filter((name) => name.endsWith('.md')).sort()) {
    const source = fs.readFileSync(path.join(directory, name), 'utf8')
    const findings = privacyFindings(source)
    if (findings.length) throw new Error(`${name}: remove ${findings.join(', ')} before putting content in the public repository`)
    const { data, content } = matter(source)
    if (data.public !== true || data.draft === true) continue
    const slug = data.slug || name.slice(0, -3)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${name}: use a stable kebab-case slug`)
    if (!data.title || !data.summary || !Array.isArray(data.tags) || !data.tags.length) throw new Error(`${name}: title, summary and at least one topic tag are required`)
    if (!/^## English\s*$/m.test(content)) throw new Error(`${name}: start the article with an English section`)
    const chinese = content.indexOf('## 中文')
    if (chinese !== -1 && chinese < content.indexOf('## English')) throw new Error(`${name}: English must precede Chinese`)
    if (/[\u3400-\u9fff]/.test(content) && chinese === -1) throw new Error(`${name}: place Chinese text in the Chinese section after English`)
    if (/^# /m.test(content)) throw new Error(`${name}: the title belongs in frontmatter; use section headings in the body`)
    if ((data.links && !Array.isArray(data.links)) || (data.aliases && !Array.isArray(data.aliases))) throw new Error(`${name}: links and aliases must be arrays`)
    const tags = unique(data.tags.map(String))
    const rawEnglish = content.slice(content.indexOf('## English') + 10, chinese === -1 ? undefined : chinese)
    const plainText = content.replace(/```[\s\S]*?```/g, ' ').replace(/[#*`|$>]/g, ' ').replace(/\s+/g, ' ').trim()
    posts.push({ slug, title: String(data.title), summary: String(data.summary), date: normalizeDate(data.date || data.updated),
      type: String(data.type || 'note'), tags, links: unique(data.links || []), aliases: data.aliases || [],
      readingMinutes: Math.max(1, Math.ceil(rawEnglish.split(/\s+/).length / 210)), plainText,
      markdown: content.trim(), contentUrl: `articles/${slug}.json` })
  }
  if (new Set(posts.map((post) => post.slug)).size !== posts.length) throw new Error('Article slugs must be unique')
  return posts
}

function mathPlugin(md) {
  md.inline.ruler.after('escape', 'inline_math', (state, silent) => {
    const start = state.pos
    if (state.src[start] !== '$' || state.src[start + 1] === '$' || /\s/.test(state.src[start + 1] || ' ')) return false
    let end = start + 1
    while ((end = state.src.indexOf('$', end)) !== -1 && state.src[end - 1] === '\\') end++
    if (end === -1 || /\s/.test(state.src[end - 1]) || /\d/.test(state.src[end + 1] || '')) return false
    if (!silent) { const token = state.push('inline_math', 'math', 0); token.content = state.src.slice(start + 1, end) }
    state.pos = end + 1
    return true
  })
  md.block.ruler.before('fence', 'display_math', (state, start, end, silent) => {
    const first = state.src.slice(state.bMarks[start] + state.tShift[start], state.eMarks[start]).trim()
    if (!first.startsWith('$$')) return false
    if (silent) return true
    let next = start + 1
    let content = first.slice(2)
    if (content.endsWith('$$')) content = content.slice(0, -2)
    else {
      const lines = [content]
      let closed = false
      for (; next < end; next++) {
        const line = state.src.slice(state.bMarks[next] + state.tShift[next], state.eMarks[next])
        if (line.trim().endsWith('$$')) { lines.push(line.slice(0, line.lastIndexOf('$$'))); next++; closed = true; break }
        lines.push(line)
      }
      if (!closed) return false
      content = lines.join('\n')
    }
    const token = state.push('display_math', 'math', 0)
    token.block = true; token.content = content; token.map = [start, next]
    state.line = next
    return true
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] })
  for (const kind of ['inline_math', 'display_math']) {
    md.renderer.rules[kind] = (tokens, index) => katex.renderToString(tokens[index].content, { displayMode: kind === 'display_math', throwOnError: false, trust: false, strict: 'ignore', output: 'htmlAndMathml' })
  }
}

export function makeRenderer(posts, { staticPage = false } = {}) {
  const lookup = new Map()
  for (const post of posts) for (const name of [post.slug, post.title, ...post.aliases]) {
    const key = name.toLocaleLowerCase()
    if (lookup.has(key) && lookup.get(key).slug !== post.slug) throw new Error(`Ambiguous article alias: ${name}`)
    lookup.set(key, post)
  }
  const resolve = (name) => lookup.get(String(name).trim().replace(/\.md$/, '').split('#')[0].toLocaleLowerCase())
  const md = new MarkdownIt({ html: false, linkify: true, typographer: true }).use(mathPlugin)
  md.inline.ruler.before('link', 'wikilink', (state, silent) => {
    if (state.src.slice(state.pos, state.pos + 2) !== '[[') return false
    const end = state.src.indexOf(']]', state.pos + 2)
    if (end === -1) return false
    const [target, label] = state.src.slice(state.pos + 2, end).split('|')
    const post = resolve(target)
    if (!post) throw new Error(`Unresolved wikilink: ${target}`)
    if (!silent) {
      state.env.links?.add(post.slug)
      const open = state.push('link_open', 'a', 1)
      open.attrSet('href', staticPage ? `../${post.slug}/` : `#note/${post.slug}`)
      open.attrSet('class', 'wikilink')
      const text = state.push('text', '', 0); text.content = label || post.title
      state.push('link_close', 'a', -1)
    }
    state.pos = end + 2
    return true
  })
  const defaultLink = md.renderer.rules.link_open || ((tokens, index, options, env, self) => self.renderToken(tokens, index, options))
  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const href = tokens[index].attrGet('href') || ''
    if (/^https?:/.test(href)) { tokens[index].attrSet('target', '_blank'); tokens[index].attrSet('rel', 'noopener noreferrer') }
    return defaultLink(tokens, index, options, env, self)
  }
  const baseFence = md.renderer.rules.fence
  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    if (/^(?:math|latex|katex)\s*$/.test(tokens[index].info)) return katex.renderToString(tokens[index].content, { displayMode: true, throwOnError: false, trust: false })
    return baseFence(tokens, index, options, env, self)
  }
  md.renderer.rules.table_open = () => '<div class="table-scroll"><table>\n'
  md.renderer.rules.table_close = () => '</table></div>\n'
  return { md, resolve }
}

export function buildGraph(posts, topicConfig) {
  const { md, resolve } = makeRenderer(posts)
  const topicMap = new Map(topicConfig.map((topic) => [topic.id, { ...topic }]))
  const used = new Set()
  const includeTopic = (id, trail = new Set()) => {
    if (trail.has(id)) throw new Error(`Cycle in topic hierarchy: ${id}`)
    used.add(id)
    if (!topicMap.has(id)) topicMap.set(id, { id, label: id, parent: null, description: `Notes connected through ${id.toLowerCase()}.` })
    const parent = topicMap.get(id).parent
    if (parent) includeTopic(parent, new Set([...trail, id]))
  }
  for (const post of posts) {
    post.tags.forEach((tag) => includeTopic(tag))
    const links = new Set()
    for (const name of post.links) {
      const target = resolve(name)
      if (!target) throw new Error(`${post.slug}: unknown linked note ${name}`)
      links.add(target.slug)
    }
    post.body = md.render(post.markdown, { links })
    links.delete(post.slug)
    post.links = [...links].sort()
  }
  for (const post of posts) post.backlinks = posts.filter((other) => other.links.includes(post.slug)).map((other) => other.slug)
  const ancestors = (id) => {
    const result = [id]
    while (topicMap.get(id)?.parent) { id = topicMap.get(id).parent; result.push(id) }
    return result
  }
  const topics = [...used].sort().map((id) => ({ ...topicMap.get(id), count: posts.filter((post) => post.tags.some((tag) => ancestors(tag).includes(id))).length }))
  const nodes = posts.map((post) => ({ id: `post:${post.slug}`, label: post.title, kind: 'post', date: post.date, slug: post.slug, tags: post.tags }))
  nodes.push(...topics.map((topic) => ({ id: `topic:${topic.id}`, label: topic.label, kind: 'topic', parent: topic.parent ? `topic:${topic.parent}` : null, count: topic.count })))
  const edgeMap = new Map()
  const addEdge = (edge) => { const key = [edge.source, edge.target].sort().join('|'); if (!edgeMap.has(key)) edgeMap.set(key, edge) }
  for (const post of posts) {
    // A tagged child already implies membership in its ancestors; avoid duplicate visual edges.
    const tags = post.tags.filter((tag) => !post.tags.some((other) => other !== tag && ancestors(other).includes(tag)))
    for (const tag of tags) addEdge({ source: `post:${post.slug}`, target: `topic:${tag}`, kind: 'topic' })
    for (const slug of post.links) addEdge({ source: `post:${post.slug}`, target: `post:${slug}`, kind: 'link' })
  }
  for (const topic of topics) if (topic.parent) addEdge({ source: `topic:${topic.id}`, target: `topic:${topic.parent}`, kind: 'hierarchy' })
  const publicPosts = posts.map(({ markdown, body, aliases, ...post }) => post)
  return { meta: { count: posts.length, topicCount: topics.length, generated: posts.map((post) => post.date).sort().at(-1), schemaVersion: 2 }, posts: publicPosts, topics, nodes, edges: [...edgeMap.values()] }
}

export function build({ postsDirectory = path.join(root, 'content/posts'), output = path.join(root, 'public') } = {}) {
  const posts = readPosts(postsDirectory)
  if (!posts.length) throw new Error('No public articles: review content and set public: true')
  const topicConfig = JSON.parse(fs.readFileSync(path.join(root, 'content/topics.json'), 'utf8'))
  const graph = buildGraph(posts, topicConfig)
  fs.mkdirSync(output, { recursive: true })
  for (const directory of ['articles', 'notes']) { fs.rmSync(path.join(output, directory), { recursive: true, force: true }); fs.mkdirSync(path.join(output, directory)) }
  const staticMarkdown = makeRenderer(posts, { staticPage: true }).md
  for (const post of posts) {
    fs.writeFileSync(path.join(output, post.contentUrl), JSON.stringify({ body: post.body }))
    const directory = path.join(output, 'notes', post.slug)
    fs.mkdirSync(directory)
    fs.writeFileSync(path.join(directory, 'index.html'), articlePage(post, staticMarkdown.render(post.markdown), posts, origin))
  }
  fs.writeFileSync(path.join(output, 'notes/index.html'), archivePage(posts))
  fs.writeFileSync(path.join(output, 'data.json'), JSON.stringify(graph))
  const xml = (value) => escape(value)
  const urls = [origin, ...posts.map((post) => `${origin}notes/${post.slug}/`)]
  fs.writeFileSync(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${xml(url)}</loc></url>`).join('')}</urlset>`)
  fs.writeFileSync(path.join(output, 'feed.xml'), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Connected notes</title><link>${origin}</link><description>Notes on AI, systems, data and thinking.</description><language>en</language>${[...posts].sort((a, b) => b.date.localeCompare(a.date)).map((post) => `<item><title>${xml(post.title)}</title><link>${origin}notes/${post.slug}/</link><guid>${origin}notes/${post.slug}/</guid><pubDate>${new Date(`${post.date}T12:00:00Z`).toUTCString()}</pubDate><description>${xml(post.summary)}</description></item>`).join('')}</channel></rss>`)
  fs.mkdirSync(path.join(output, 'katex'), { recursive: true })
  fs.cpSync(path.join(root, 'node_modules/katex/dist/katex.min.css'), path.join(output, 'katex/katex.min.css'))
  fs.cpSync(path.join(root, 'node_modules/katex/dist/fonts'), path.join(output, 'katex/fonts'), { recursive: true })
  fs.cpSync(path.join(root, 'node_modules/katex/LICENSE'), path.join(output, 'katex/LICENSE'))
  console.log(`Built ${posts.length} reviewed articles, ${graph.topics.length} topics, ${graph.edges.length} relationships.`)
  console.log('Article bodies load on demand. Wikilinks, backlinks, topic hierarchy, feed and sitemap are generated.')
  return graph
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { build() } catch (error) { console.error(error.message); process.exitCode = 1 }
}
