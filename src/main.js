import './styles.css'

let data
const app = document.querySelector('#app')
const topicColors = { AI: '#1f6fe5', Product: '#2e5fa8', Thinking: '#b88a00', Engineering: '#5c6b73', Data: '#8e63b0', Research: '#287c6c', Systems: '#b65f49', Privacy: '#a04f72', Learning: '#cf7b29' }
const palette = { ink: '#111111', blue: '#1f6fe5', yellow: '#fff3a8' }
let selected = null
let query = ''
let activeTopic = 'All'
let zoom = 1
let pan = { x: 0, y: 0 }
let drag = null

function icon(name) {
  const paths = {
    search: '<circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 5 5"></path>',
    linkedin: '<path d="M5 8.7V20M5 5.1v.1M10 20v-6.1a3.4 3.4 0 0 1 6.8 0V20M10 11.1a3.4 3.4 0 0 1 6.8 0"></path>',
    arrow: '<path d="M5 12h13M13 6l6 6-6 6"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    plus: '<path d="M12 5v14M5 12h14"></path>',
    minus: '<path d="M5 12h14"></path>',
    reset: '<path d="M5 9a7 7 0 1 1 1 8"></path><path d="M5 4v5h5"></path>',
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`
}

function esc(value) { return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]) }
function colorFor(post) { return topicColors[post.tags[0]] || palette.blue }
function postBySlug(slug) { return data.posts.find((p) => p.slug === slug) }
function relatedPosts(post) {
  return data.posts.filter((item) => item.slug !== post.slug && item.tags.some((tag) => post.tags.includes(tag))).sort((a, b) => sharedTags(post, b) - sharedTags(post, a))
}
function sharedTags(a, b) { return a.tags.filter((tag) => b.tags.includes(tag)).length }

function graphModel() {
  const posts = data.posts
  const topics = [...new Set(posts.flatMap((post) => post.tags))]
  const visible = posts.filter((post) => (activeTopic === 'All' || post.tags.includes(activeTopic)) && (!query || `${post.title} ${post.summary} ${post.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())))
  const nodes = []
  const edges = []
  topics.forEach((topic, i) => nodes.push({ id: `topic:${topic}`, label: topic, kind: 'topic', x: 50 + 35 * Math.cos((i / topics.length) * Math.PI * 2 - 1), y: 48 + 30 * Math.sin((i / topics.length) * Math.PI * 2 - 1), color: topicColors[topic] || palette.blue }))
  visible.forEach((post, i) => {
    const source = post.tags[0]
    const ti = topics.indexOf(source)
    const angle = (i / Math.max(visible.length, 1)) * Math.PI * 2 + ti * 0.31
    const radius = 11 + (i % 3) * 3.7
    nodes.push({ id: `post:${post.slug}`, label: post.title, kind: 'post', slug: post.slug, x: 50 + 27 * Math.cos(angle) + radius * .22 * Math.cos(angle * 2), y: 50 + 22 * Math.sin(angle) + radius * .16 * Math.sin(angle * 3), color: colorFor(post) })
    post.tags.forEach((tag) => { if (topics.includes(tag)) edges.push({ source: `post:${post.slug}`, target: `topic:${tag}`, kind: 'topic' }) })
  })
  data.edges.filter((e) => e.kind !== 'topic').forEach((e) => { if (visible.some((p) => `post:${p.slug}` === e.source) && visible.some((p) => `post:${p.slug}` === e.target)) edges.push(e) })
  return { nodes, edges }
}

function render() {
  const topics = [...new Set(data.posts.flatMap((post) => post.tags))]
  const model = graphModel()
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <a class="brand" href="#" aria-label="Tony's Field Notes home"><span class="brand-mark">TB</span><span><strong>Tony's Field Notes</strong><small>connected thoughts, in progress</small></span></a>
        <nav class="nav" aria-label="Primary navigation">
          <a class="portfolio-link" href="https://jiantaobi.my.canva.site/go" target="_blank" rel="noreferrer">Portfolio ${icon('arrow')}</a>
          <a class="social-link" href="https://www.linkedin.com/in/tony-jiantaobi/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile">${icon('linkedin')}</a>
        </nav>
      </header>
      <main>
        <section class="intro">
          <div><p class="eyebrow">A public notebook</p><h1>Ideas become clearer<br><em>when they connect.</em></h1><p class="lede">A growing map of notes on AI, product design, data, systems, and the questions between them.</p></div>
          <div class="intro-meta"><span>${data.meta.count} notes</span><span>${data.meta.topicCount} topics</span><span>English first · 中文 follows</span></div>
        </section>
        <section class="workspace" aria-label="Knowledge graph workspace">
          <div class="toolbar">
            <label class="search">${icon('search')}<input id="search" value="${esc(query)}" placeholder="Search notes or topics" aria-label="Search notes or topics" /></label>
            <div class="filters"><button class="filter ${activeTopic === 'All' ? 'active' : ''}" data-topic="All">All</button>${topics.map((topic) => `<button class="filter ${activeTopic === topic ? 'active' : ''}" data-topic="${esc(topic)}"><i style="background:${topicColors[topic] || palette.blue}"></i>${esc(topic)}</button>`).join('')}</div>
          </div>
          <div class="graph-wrap"><div class="graph-hint">Click a node to read · drag to explore</div><svg class="graph" viewBox="0 0 100 100" role="img" aria-label="Connected graph of published notes" style="transform:translate(${pan.x}px,${pan.y}px) scale(${zoom})"><g class="edges">${model.edges.map((edge) => { const a = model.nodes.find((n) => n.id === edge.source), b = model.nodes.find((n) => n.id === edge.target); return a && b ? `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="edge edge-${edge.kind}" />` : '' }).join('')}</g><g class="nodes">${model.nodes.map((node) => `<g class="node node-${node.kind} ${selected === node.id ? 'selected' : ''}" data-node="${esc(node.id)}" tabindex="0" role="button" aria-label="Open ${esc(node.label)}" transform="translate(${node.x} ${node.y})"><circle r="${node.kind === 'topic' ? 2.7 : 1.75}" fill="${node.color}"/><circle class="halo" r="${node.kind === 'topic' ? 4.8 : 3.8}"/><text y="${node.kind === 'topic' ? -4.6 : 4.5}" text-anchor="middle">${esc(node.label.length > 24 ? node.label.slice(0, 22) + '…' : node.label)}</text></g>`).join('')}</g></svg><div class="graph-legend"><span><i class="legend-topic"></i>topic</span><span><i class="legend-post"></i>note</span><span><i class="legend-link"></i>explicit link</span></div><div class="zoom-controls"><button data-zoom="out" aria-label="Zoom out">${icon('minus')}</button><button data-zoom="reset" aria-label="Reset view">${icon('reset')}</button><button data-zoom="in" aria-label="Zoom in">${icon('plus')}</button></div></div>
          <div class="below-graph"><div><span class="section-label">Start somewhere</span><p>There is no single order to a thinking life. Follow a topic, open a note, and see what it changes.</p></div><div class="archive"><span class="section-label">Latest notes</span>${data.posts.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4).map((post) => `<button class="latest" data-post="${post.slug}"><time>${post.date}</time><span>${esc(post.title)}</span>${icon('arrow')}</button>`).join('')}</div></div>
        </section>
      </main>
      <footer><span>Built as a small, public knowledge garden.</span><span>© ${new Date().getFullYear()} Tony Bi</span></footer>
    </div>${selected ? panelHtml(postBySlug(selected.replace('post:',''))) : ''}`
  bindEvents()
}

function panelHtml(post) {
  if (!post) return ''
  const related = relatedPosts(post).slice(0, 5)
  return `<aside class="panel" aria-label="Note details"><button class="close" id="close-panel" aria-label="Close note">${icon('close')}</button><div class="panel-head"><span class="type-dot" style="background:${colorFor(post)}"></span><span>${esc(post.type)} · ${post.date}</span></div><h2>${esc(post.title)}</h2><p class="panel-summary">${esc(post.summary)}</p><div class="panel-tags">${post.tags.map((tag) => `<button data-topic="${esc(tag)}">${esc(tag)}</button>`).join('')}</div><article class="post-content">${post.body}</article><section class="connections"><span class="section-label">Connected notes</span>${related.length ? related.map((item) => `<button class="connection" data-post="${item.slug}"><span style="background:${colorFor(item)}"></span><span>${esc(item.title)}</span>${icon('arrow')}</button>`).join('') : '<p class="empty">This note is a starting point.</p>'}</section><a class="read-link" href="#${post.slug}">Copyable link ${icon('arrow')}</a></aside>`
}

function bindEvents() {
  document.querySelector('#search')?.addEventListener('input', (e) => { query = e.target.value; render() })
  document.querySelectorAll('[data-topic]').forEach((el) => el.addEventListener('click', () => { activeTopic = el.dataset.topic; if (el.dataset.topic === 'All') activeTopic = 'All'; selected = null; render() }))
  document.querySelectorAll('[data-node]').forEach((el) => { el.addEventListener('click', () => { selected = el.dataset.node; render() }); el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selected = el.dataset.node; render() } }) })
  document.querySelectorAll('[data-post]').forEach((el) => el.addEventListener('click', () => { selected = `post:${el.dataset.post}`; render() }))
  document.querySelectorAll('.post-content a[href^="#"]').forEach((el) => el.addEventListener('click', (event) => {
    const slug = el.getAttribute('href').slice(1)
    if (!postBySlug(slug)) return
    event.preventDefault(); selected = `post:${slug}`; render()
  }))
  document.querySelector('#close-panel')?.addEventListener('click', () => { selected = null; render() })
  document.querySelectorAll('[data-zoom]').forEach((el) => el.addEventListener('click', () => { zoom = el.dataset.zoom === 'in' ? Math.min(1.8, zoom + .15) : el.dataset.zoom === 'out' ? Math.max(.75, zoom - .15) : 1; pan = el.dataset.zoom === 'reset' ? { x: 0, y: 0 } : pan; render() }))
  const graph = document.querySelector('.graph-wrap')
  graph?.addEventListener('pointerdown', (e) => { if (e.target.closest('.node,button,input,a')) return; drag = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }; graph.setPointerCapture(e.pointerId) })
  graph?.addEventListener('pointermove', (e) => { if (!drag) return; pan = { x: drag.panX + (e.clientX - drag.x) / 4, y: drag.panY + (e.clientY - drag.y) / 4 }; const svg = document.querySelector('.graph'); if (svg) svg.style.transform = `translate(${pan.x}px,${pan.y}px) scale(${zoom})` })
  graph?.addEventListener('pointerup', () => { drag = null })
}

fetch(`${import.meta.env.BASE_URL}data.json`).then((res) => res.json()).then((value) => { data = value; render() })
