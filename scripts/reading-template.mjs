const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

function shell(title, description, body, depth, canonical = '') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}">${canonical ? `<link rel="canonical" href="${canonical}">` : ''}<link rel="stylesheet" href="${depth}reading.css"><link rel="stylesheet" href="${depth}katex/katex.min.css"></head><body><main class="reading-page">${body}</main></body></html>`
}

export function articlePage(post, body, posts, origin) {
  const connections = [...new Set([...post.links, ...post.backlinks])].map((slug) => posts.find((item) => item.slug === slug)).filter(Boolean)
  const content = `<nav><a href="../../#note/${post.slug}">← Open in graph</a><a href="../">All notes</a></nav><header><p class="meta">${escape(post.type)} · ${post.date} · ${post.readingMinutes} min read</p><h1>${escape(post.title)}</h1><p class="summary">${escape(post.summary)}</p><div class="topics">${post.tags.map((tag) => `<a href="../../#topic/${encodeURIComponent(tag)}">${escape(tag)}</a>`).join('')}</div></header><article class="post-content">${body}</article>${connections.length ? `<footer><h2>Connected notes</h2><ul>${connections.map((item) => `<li><a href="../${item.slug}/">${escape(item.title)}</a></li>`).join('')}</ul></footer>` : ''}`
  return shell(post.title, post.summary, content, '../../', `${origin}notes/${post.slug}/`)
}

export function archivePage(posts) {
  const content = `<nav><a href="../">← Back to graph</a></nav><header><h1>Notes</h1></header><ul class="archive">${[...posts].sort((a, b) => a.title.localeCompare(b.title)).map((post) => `<li><a href="${post.slug}/">${escape(post.title)}</a><p>${escape(post.summary)}</p></li>`).join('')}</ul>`
  return shell('Notes', 'All published notes in the graph.', content, '../')
}
