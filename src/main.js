import './styles.css'
import { KnowledgeGraph } from './graph.js'
import { KnowledgeGraph3D } from './graph-3d.js'

const app = document.querySelector('#app')
const topicColors = { AI: '#1f6fe5', Product: '#a68038', Thinking: '#84699a', Engineering: '#64798c', Data: '#6783ad', Research: '#478d80', Systems: '#bd7761', Privacy: '#a46980', Learning: '#a88446', Probability: '#557d98', Simulation: '#a17255', Mathematics: '#866fa3', Design: '#c68372', Agents: '#617fb4' }
const fallbackColors = ['#1f6fe5', '#688c84', '#a67f57', '#89789e', '#758396', '#b6766c']
let data, graph, graphMode = '3d', selectedId = null, activeTopic = null, query = ''
let searchMatches = []
let lastActiveNode = null
let readingFullscreen = false
const themes = ['dark', 'light', 'paper']
const posts = new Map()
const nodes = new Map()
const articleRequests = new Map()
let selectionVersion = 0

function icon(name) {
  const paths = {
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    linkedin: '<circle cx="5" cy="5" r="2"/><path d="M3 9h4v12H3zM10 9h4v1.6c.8-1.2 1.9-1.9 3.4-1.9 3.1 0 4.6 1.9 4.6 5.4V21h-4v-6.3c0-1.7-.6-2.6-1.9-2.6-1.4 0-2.1 1-2.1 2.6V21h-4z"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    external: '<path d="M14 4h6v6m0-6L10 14M9 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-4"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    fit: '<path d="M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5"/><circle cx="12" cy="12" r="2"/>',
    arrange: '<circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="m7 8 4 8m6-8-4 8M8 6h8"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2.5M12 17v.1"/>',
    moon: '<path d="M20 14.1A8.5 8.5 0 0 1 9.9 4a8.5 8.5 0 1 0 10.1 10.1Z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
    link: '<path d="m10 13 4-4m-6 6-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0m2 2 1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.1M4 12h.1M4 18h.1"/>',
    back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    expand: '<path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4"/>',
    compress: '<path d="M9 4v5H4m16 0h-5V4M9 20v-5H4m16 0h-5v5"/>',
    cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v9m8-4.5-8 4.5m-8-4.5 8 4.5"/>',
    plane: '<path d="M4 5h16v14H4zM8 9h8M8 13h5M8 17h8"/>',
    paper: '<path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7"/>',
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.link}</svg>`
}
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]) }
function colorForTopic(topic) { return data?.topics?.find((item) => item.label === topic || item.id === topic)?.color || topicColors[topic] || fallbackColors[[...topic].reduce((sum, character) => sum + character.charCodeAt(0), 0) % fallbackColors.length] }
function colorForPost(post) { return colorForTopic(post.tags?.[0] || '') }
function humanDate(value) {
  const date = new Date(`${value}T12:00:00`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })
}
function announce(message) { document.querySelector('#announcer').textContent = message }
function descendantTopics(topic) {
  const result = new Set([topic])
  let changed = true
  while (changed) {
    changed = false
    for (const node of data.nodes.filter((item) => item.kind === 'topic')) {
      const parent = node.parent?.replace(/^topic:/, '') || topicDetails(node.label)?.parent?.replace(/^topic:/, '')
      if (parent && result.has(parent) && !result.has(node.label)) { result.add(node.label); changed = true }
    }
  }
  return result
}
function topicPosts(topic) { const descendants = descendantTopics(topic); return data.posts.filter((post) => post.tags.some((tag) => descendants.has(tag))) }
function topicNodeIds(topic) { return new Set([...descendantTopics(topic)].map((tag) => `topic:${tag}`).concat(topicPosts(topic).map((post) => `post:${post.slug}`))) }
function topicDetails(topic) { return data.topics?.find((item) => item.label === topic || item.id === topic || item.id === `topic:${topic}`) }
function themeIcon(theme) { return theme === 'paper' ? 'paper' : theme === 'light' ? 'sun' : 'moon' }
function updateThemeControl() {
  const theme = document.documentElement.dataset.theme
  const next = themes[(themes.indexOf(theme) + 1) % themes.length]
  const button = document.querySelector('#theme-toggle')
  button.innerHTML = icon(themeIcon(theme))
  button.title = `${theme[0].toUpperCase() + theme.slice(1)} · Switch to ${next}`
  button.setAttribute('aria-label', `Switch to ${next} theme`)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#191a1a' : theme === 'paper' ? '#d6cbb8' : '#f4f4f3')
}

function mount() {
  const savedTheme = (() => { try { return localStorage.getItem('tony-graph-theme') } catch { return null } })()
  const savedMode = (() => { try { return localStorage.getItem('tony-graph-mode') } catch { return null } })()
  graphMode = savedMode === '2d' ? '2d' : '3d'
  document.documentElement.dataset.theme = themes.includes(savedTheme) ? savedTheme : 'dark'
  app.innerHTML = `
    <main class="workspace" aria-label="Connected notes">
      <div class="graph-stage" id="graph-stage" role="group" aria-label="Interactive knowledge graph. Select any node to read. Drag nodes or empty space to move. Use zoom controls to change scale.">
        <canvas id="connections" aria-hidden="true"></canvas>
        <div id="nodes" class="node-layer"></div>
      </div>
      <div class="top-controls">
        <div class="search-box" id="search-box">
          <label class="search-field">${icon('search')}<input id="search" type="search" autocomplete="off" spellcheck="false" placeholder="Search thoughts…" aria-label="Search notes and topics" aria-controls="search-results" aria-expanded="false"/><kbd>/</kbd></label>
          <div id="search-results" class="search-results" hidden></div>
        </div>
        <nav class="navigation" aria-label="Primary navigation">
          <a class="portfolio-link" href="https://jiantaobi.my.canva.site/go" target="_blank" rel="noreferrer" aria-label="View portfolio (opens in a new tab)">View portfolio ${icon('external')}</a>
          <a class="icon-button linkedin-link" href="https://www.linkedin.com/in/tony-jiantaobi/" target="_blank" rel="noreferrer" aria-label="LinkedIn (opens in a new tab)" title="Connect on LinkedIn">${icon('linkedin')}</a>
        </nav>
      </div>
      <div id="filter-state" class="filter-state" hidden></div>
      <div class="bottom-left">
        <button class="graph-count" id="open-index" aria-label="Browse all ${data.posts.length} notes and ${data.nodes.filter((node) => node.kind === 'topic').length} topics" title="${data.posts.length} notes · ${data.nodes.filter((node) => node.kind === 'topic').length} topics">${icon('list')}<span>${data.posts.length} notes <span class="count-separator">/</span> ${data.nodes.filter((node) => node.kind === 'topic').length} topics</span></button>
      </div>
      <div class="graph-tools" role="toolbar" aria-label="Graph controls">
        <button class="icon-button" id="mode-toggle" aria-label="Switch to ${graphMode === '3d' ? '2D' : '3D'} graph" title="Switch to ${graphMode === '3d' ? '2D' : '3D'} graph">${icon(graphMode === '3d' ? 'plane' : 'cube')}</button>
        <div class="theme-control">
          <button class="icon-button" id="theme-toggle" aria-label="Switch color theme" title="Switch color theme">${icon(themeIcon(document.documentElement.dataset.theme))}</button>
          <section class="theme-tip" id="theme-tip" aria-label="Reading theme guide" hidden>
            <button class="theme-tip-close" id="dismiss-theme-tip" aria-label="Dismiss theme tip">${icon('close')}</button>
            <h2>Switch reading themes</h2>
            <p id="theme-tip-description">Click the highlighted icon below to cycle between Dark, Light and Paper.</p>
            <div class="theme-tip-options" aria-hidden="true"><span><i class="theme-swatch-dark"></i>Dark</span><span><i class="theme-swatch-light"></i>Light</span><span><i class="theme-swatch-paper"></i>Paper</span></div>
          </section>
        </div>
        <button class="icon-button" id="help-toggle" aria-label="Graph controls help" aria-expanded="false" title="Graph controls help">${icon('help')}</button>
        <span class="tool-divider"></span>
        <button class="icon-button" id="arrange" aria-label="Reset node layout" title="Reset node layout">${icon('arrange')}</button>
        <button class="icon-button" id="fit" aria-label="Fit all nodes in view" title="Fit all nodes · F">${icon('fit')}</button>
        <span class="tool-divider"></span>
        <button class="icon-button" id="zoom-out" aria-label="Zoom out" title="Zoom out · −">${icon('minus')}</button>
        <output id="zoom-level" aria-label="Zoom level">100%</output>
        <button class="icon-button" id="zoom-in" aria-label="Zoom in" title="Zoom in · +">${icon('plus')}</button>
      </div>
      <div class="help-popover" id="help" hidden>
        <h2>Explore the graph</h2>
        <p>Click any node to open it. Larger nodes are topics.</p>
        <dl><div><dt>Move a node</dt><dd>Drag it</dd></div><div><dt>Move the map</dt><dd>Drag empty space</dd></div><div><dt>Zoom</dt><dd>Scroll or pinch</dd></div><div><dt>Search</dt><dd><kbd>/</kbd></dd></div><div><dt>Fit the map</dt><dd><kbd>F</kbd> or double-click</dd></div><div><dt>Close a note</dt><dd><kbd>Esc</kbd></dd></div></dl>
        <p class="help-footnote">Your layout stays on this device. Keyboard: Tab to a node, Enter to open; Alt + arrow keys to move it.</p>
        <div class="edge-key"><span><i></i>Linked notes & topics</span><span><i class="dashed"></i>Topic hierarchy</span></div>
      </div>
      <aside id="detail-panel" class="detail-panel" aria-label="Reading panel" hidden></aside>
      <div class="sr-only" id="announcer" role="status" aria-live="polite"></div>
    </main>`
  createGraphRenderer()
  updateThemeControl()
  bindEvents()
  applyHash()
  showThemeTip()
}

function showThemeTip() {
  document.querySelector('#theme-tip').hidden = false
  document.querySelector('#theme-toggle').setAttribute('aria-describedby', 'theme-tip-description')
}

function dismissThemeTip({ restoreFocus = false } = {}) {
  const tip = document.querySelector('#theme-tip')
  if (!tip || tip.hidden) return
  tip.hidden = true
  const button = document.querySelector('#theme-toggle')
  button.removeAttribute('aria-describedby')
  if (restoreFocus) button.focus({ preventScroll: true })
}

function rendererOptions() {
  return {
    stage: document.querySelector('#graph-stage'), canvas: document.querySelector('#connections'), layer: document.querySelector('#nodes'),
    nodes: data.nodes.map((node) => ({ ...node, tags: node.tags || posts.get(node.slug)?.tags || [], color: node.kind === 'topic' ? colorForTopic(node.label) : colorForPost(posts.get(node.slug) || { tags: node.tags }) })),
    edges: data.edges,
    onSelect: openNode,
    onBackgroundClick: () => { if (selectedId || !document.querySelector('#detail-panel').hidden) closePanel() },
    onViewChange: (zoom) => { document.querySelector('#zoom-level').textContent = `${zoom}%` },
    onFallback: () => switchGraphMode('2d', { persist: true, announce: true }),
  }
}

function updateModeControl() {
  const control = document.querySelector('#mode-toggle')
  if (!control) return
  const next = graphMode === '3d' ? '2D' : '3D'
  control.innerHTML = icon(graphMode === '3d' ? 'cube' : 'plane')
  control.setAttribute('aria-label', `Switch to ${next} graph`)
  control.title = `${graphMode.toUpperCase()} view · Switch to ${next}`
  control.setAttribute('aria-pressed', String(graphMode === '3d'))
  document.querySelector('#graph-stage').dataset.mode = graphMode
  document.querySelector('#help dl').innerHTML = `<div><dt>Move a node</dt><dd>Drag it</dd></div>${graphMode === '3d' ? '<div><dt>Orbit</dt><dd>Drag empty space</dd></div><div><dt>Pan</dt><dd>Shift + drag / right drag</dd></div>' : '<div><dt>Move the map</dt><dd>Drag empty space</dd></div>'}<div><dt>Zoom</dt><dd>Scroll or pinch</dd></div><div><dt>Search</dt><dd><kbd>/</kbd></dd></div><div><dt>Fit the map</dt><dd><kbd>F</kbd> or double-click</dd></div><div><dt>Exit full reading</dt><dd><kbd>Esc</kbd></dd></div>`
  document.querySelector('#help .edge-key').innerHTML = graphMode === '3d' ? '<span><i></i>Links & topic hierarchy</span>' : '<span><i></i>Linked notes & topics</span><span><i class="dashed"></i>Topic hierarchy</span>'
}

function resetGraphSurface() {
  const stage = document.querySelector('#graph-stage')
  stage.innerHTML = '<canvas id="connections" aria-hidden="true"></canvas><div id="nodes" class="node-layer"></div>'
  stage.removeAttribute('data-ready')
  stage.removeAttribute('style')
  stage.classList.remove('is-dragging')
}

function createGraphRenderer() {
  resetGraphSurface()
  try {
    graph = graphMode === '3d' ? new KnowledgeGraph3D(rendererOptions()) : new KnowledgeGraph(rendererOptions())
    updateModeControl()
  } catch (error) {
    if (graphMode === '3d') {
      graphMode = '2d'
      resetGraphSurface()
      graph = new KnowledgeGraph(rendererOptions())
      updateModeControl()
      announce('3D is unavailable here; showing the 2D graph')
    } else throw error
  }
}

function switchGraphMode(mode, { persist = true, announce: shouldAnnounce = false } = {}) {
  if (mode === graphMode && graph) return
  graph?.destroy?.()
  graphMode = mode === '2d' ? '2d' : '3d'
  createGraphRenderer()
  if (persist) { try { localStorage.setItem('tony-graph-mode', graphMode) } catch { /* Optional preference. */ } }
  graph.setSelection(selectedId)
  if (selectedId) graph.focus(selectedId, Math.min(490, window.innerWidth * .42) + 24)
  updateHighlights()
  graph.setPaused?.(readingFullscreen)
  if (shouldAnnounce) announce(graphMode === '3d' ? '3D graph enabled' : '3D is unavailable here; showing the 2D graph')
}

function renderSearch() {
  const results = document.querySelector('#search-results')
  const term = query.trim().toLocaleLowerCase()
  const input = document.querySelector('#search')
  if (!term) {
    searchMatches = []
    results.hidden = true
    input.setAttribute('aria-expanded', 'false')
    updateHighlights()
    return
  }
  searchMatches = data.nodes.filter((node) => {
    const post = posts.get(node.slug)
    return `${node.label} ${post?.summary || ''} ${post?.tags?.join(' ') || ''} ${post?.plainText || post?.searchText || ''}`.toLocaleLowerCase().includes(term)
  }).sort((a, b) => {
    const rank = (node) => {
      const label = node.label.toLocaleLowerCase()
      return label === term ? 4 : label.startsWith(term) ? 3 : label.includes(term) ? 2 : 1
    }
    return rank(b) - rank(a) || a.label.localeCompare(b.label)
  })
  results.hidden = false
  input.setAttribute('aria-expanded', 'true')
  results.innerHTML = `<div class="search-meta">${searchMatches.length} ${searchMatches.length === 1 ? 'match' : 'matches'}</div>${searchMatches.slice(0, 12).map((node) => `<button class="search-result" data-select="${esc(node.id)}"><span class="result-dot ${node.kind === 'topic' ? 'topic-dot' : ''}" style="--node-color:${colorForTopic(node.kind === 'topic' ? node.label : posts.get(node.slug)?.tags?.[0] || '')}"></span><span>${esc(node.label)}<small>${node.kind === 'topic' ? `${topicPosts(node.label).length} notes in this topic` : esc(posts.get(node.slug)?.tags?.slice(0, 2).join(' · ') || 'Note')}</small></span>${icon('arrow')}</button>`).join('') || '<p class="empty-state">No matches yet. Try a broader word.</p>'}`
  updateHighlights()
}

function updateHighlights() {
  let highlighted = null
  if (activeTopic) highlighted = topicNodeIds(activeTopic)
  if (query.trim()) {
    const matches = new Set(searchMatches.map((node) => node.id))
    highlighted = highlighted ? new Set([...highlighted].filter((id) => matches.has(id))) : matches
  }
  graph.highlight(highlighted)
  const filter = document.querySelector('#filter-state')
  filter.hidden = !activeTopic
  filter.innerHTML = activeTopic ? `<span style="--node-color:${colorForTopic(activeTopic)}"><i></i>${esc(activeTopic)}</span><button id="clear-filter" aria-label="Show all topics">${icon('close')}</button>` : ''
}

function connectionRows(items, kind = '') {
  return items.map((post) => `<button class="connection-row" data-select="post:${esc(post.slug)}"><span class="connection-dot" style="background:${colorForPost(post)}"></span><span><strong>${esc(post.title)}</strong><small>${esc(kind || post.tags.slice(0, 2).join(' · '))}</small></span>${icon('arrow')}</button>`).join('')
}
function section(label, items, kind) { return items.length ? `<section class="connection-section"><h3>${esc(label)} <span>${items.length}</span></h3>${connectionRows(items, kind)}</section>` : '' }

function panelToolbar(kind, color = null, copy = true) {
  return `<div class="panel-toolbar"><span class="panel-kind">${color ? `<i style="background:${color}"></i>` : ''}${esc(kind)}</span><div><button class="icon-button reader-theme" data-cycle-theme aria-label="Switch reading theme" title="Switch reading theme">${icon(themeIcon(document.documentElement.dataset.theme))}</button>${copy ? `<button class="icon-button" id="copy-link" aria-label="Copy link to this note" title="Copy link">${icon('link')}</button>` : ''}<button class="icon-button" id="expand-panel" aria-label="${readingFullscreen ? 'Restore side panel' : 'Expand reading panel'}" aria-pressed="${readingFullscreen}" title="${readingFullscreen ? 'Restore side panel · Esc' : 'Full-page reading'}">${icon(readingFullscreen ? 'compress' : 'expand')}</button><button class="icon-button" id="close-panel" aria-label="Close reading panel" title="Close reading panel">${icon('close')}</button></div></div>`
}

function syncReadingState() {
  const panel = document.querySelector('#detail-panel')
  panel.classList.toggle('is-fullscreen', readingFullscreen)
  panel.setAttribute('role', readingFullscreen ? 'dialog' : 'complementary')
  if (readingFullscreen) panel.setAttribute('aria-modal', 'true')
  else panel.removeAttribute('aria-modal')
  document.querySelector('.workspace').classList.toggle('is-reading', readingFullscreen)
  for (const element of document.querySelector('.workspace').children) {
    if (element !== panel && element.id !== 'announcer') element.inert = readingFullscreen
  }
  const button = document.querySelector('#expand-panel')
  if (button) {
    button.innerHTML = icon(readingFullscreen ? 'compress' : 'expand')
    button.setAttribute('aria-label', readingFullscreen ? 'Restore side panel' : 'Expand reading panel')
    button.setAttribute('aria-pressed', String(readingFullscreen))
    button.title = readingFullscreen ? 'Restore side panel · Esc' : 'Full-page reading'
  }
  graph.setPaused?.(readingFullscreen)
}

function setReadingFullscreen(expanded) {
  const panel = document.querySelector('#detail-panel')
  if (panel.hidden && expanded) return
  const scroller = panel.querySelector('.panel-scroll')
  const top = scroller?.getBoundingClientRect().top || 0
  const anchor = [...(scroller?.querySelectorAll('h1, h2, h3, p, li, figure, pre, table') || [])].find((element) => element.getBoundingClientRect().bottom > top + 8)
  const offset = anchor?.getBoundingClientRect().top
  readingFullscreen = expanded
  syncReadingState()
  // Keep the same passage visible through the change in line length, without
  // replacing article markup or restarting video/audio playback.
  if (anchor && scroller) scroller.scrollTop += anchor.getBoundingClientRect().top - offset
  document.querySelector('#expand-panel')?.focus({ preventScroll: true })
  announce(expanded ? 'Full-page reading. Press Escape to restore the side panel.' : 'Side panel restored')
}

function cycleTheme() {
  dismissThemeTip()
  const theme = themes[(themes.indexOf(document.documentElement.dataset.theme) + 1) % themes.length]
  document.documentElement.dataset.theme = theme
  try { localStorage.setItem('tony-graph-theme', theme) } catch { /* Optional preference. */ }
  updateThemeControl()
  document.querySelectorAll('[data-cycle-theme]').forEach((button) => { button.innerHTML = icon(themeIcon(theme)); button.title = `${theme} theme · Switch theme` })
  graph.requestDraw()
  announce(`${theme[0].toUpperCase() + theme.slice(1)} theme`)
}

function renderArticle(post) {
  const outgoing = (post.links || []).map((slug) => posts.get(slug)).filter(Boolean)
  const incoming = data.posts.filter((item) => item.slug !== post.slug && item.links?.includes(post.slug))
  const linked = new Set([...outgoing, ...incoming].map((item) => item.slug))
  const related = data.posts.filter((item) => item.slug !== post.slug && !linked.has(item.slug) && item.tags.some((tag) => post.tags.includes(tag))).sort((a, b) => b.tags.filter((tag) => post.tags.includes(tag)).length - a.tags.filter((tag) => post.tags.includes(tag)).length).slice(0, 5)
  const wordCount = post.body.replace(/<[^>]+>/g, ' ').split(/\s+/).length
  const readingTime = post.readingMinutes || Math.max(1, Math.round(wordCount / 210))
  const body = document.createElement('div')
  body.innerHTML = post.body
  const firstHeading = body.querySelector('h1,h2')
  if (firstHeading?.textContent === post.title && firstHeading === body.firstElementChild) firstHeading.remove()
  return `${panelToolbar(post.type || 'Note', colorForPost(post))}
    <div class="panel-scroll"><header class="article-header"><div class="article-meta"><time datetime="${esc(post.date)}">${esc(humanDate(post.date))}</time><span>${readingTime} min read</span></div><h1>${esc(post.title)}</h1><p class="article-summary">${esc(post.summary)}</p><div class="article-tags">${post.tags.map((tag) => `<button data-select="topic:${esc(tag)}"><i style="background:${colorForTopic(tag)}"></i>${esc(tag)}</button>`).join('')}</div></header>
    <article class="post-content">${body.innerHTML}</article>
    <div class="article-connections">${section('Links from this note', outgoing, 'Linked from this note')}${section('Linked here', incoming, 'Backlink')}${section('Explore nearby', related)}</div></div>`
}

function renderTopic(node) {
  const items = topicPosts(node.label).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
  const details = topicDetails(node.label)
  const parent = node.parent?.replace(/^topic:/, '') || details?.parent?.replace(/^topic:/, '')
  const children = data.nodes.filter((item) => item.kind === 'topic' && (item.parent === node.id || topicDetails(item.label)?.parent?.replace(/^topic:/, '') === node.label))
  const descendants = descendantTopics(node.label)
  const relatedTopics = [...new Set(items.flatMap((post) => post.tags))].filter((tag) => !descendants.has(tag) && tag !== parent)
  return `${panelToolbar('Topic', colorForTopic(node.label))}<div class="panel-scroll"><header class="article-header topic-header">${parent ? `<button class="topic-breadcrumb" data-select="topic:${esc(parent)}">${icon('back')}${esc(parent)}</button>` : ''}<div class="topic-symbol" style="--node-color:${colorForTopic(node.label)}">${icon('arrange')}</div><h1>${esc(node.label)}</h1><p class="article-summary">${esc(details?.description || `${items.length} connected ${items.length === 1 ? 'note' : 'notes'}. Follow an idea into its surrounding context.`)}</p><button class="focus-topic" data-focus-topic="${esc(node.label)}">${icon('fit')} Focus this topic</button></header>${children.length ? `<section class="connection-section"><h2>Within this topic</h2><div class="index-topics child-topics">${children.map((child) => `<button data-select="${esc(child.id)}"><i style="background:${colorForTopic(child.label)}"></i>${esc(child.label)}<span>${topicPosts(child.label).length}</span></button>`).join('')}</div></section>` : ''}<section class="connection-section topic-notes"><h2>Notes <span>${items.length}</span></h2>${connectionRows(items)}</section>${relatedTopics.length ? `<section class="connection-section"><h2>Related topics</h2><div class="article-tags">${relatedTopics.map((tag) => `<button data-select="topic:${esc(tag)}"><i style="background:${colorForTopic(tag)}"></i>${esc(tag)}</button>`).join('')}</div></section>` : ''}</div>`
}

async function loadArticle(post) {
  if (post.body) return post
  if (!articleRequests.has(post.slug)) {
    const request = fetch(`${import.meta.env.BASE_URL}${post.contentUrl || `articles/${post.slug}.json`}`).then((response) => {
      if (!response.ok) throw new Error('Article unavailable')
      return response.json()
    }).then((article) => {
      if (typeof article.body !== 'string') throw new Error('Article unavailable')
      post.body = article.body
      return post
    }).catch((error) => { articleRequests.delete(post.slug); throw error })
    articleRequests.set(post.slug, request)
  }
  return articleRequests.get(post.slug)
}

async function openNode(id, { history = true, focus = true } = {}) {
  const node = nodes.get(id)
  if (!node) return
  dismissThemeTip()
  pausePanelMedia()
  const version = ++selectionVersion
  selectedId = id
  lastActiveNode = id
  graph.setSelection(id)
  const panel = document.querySelector('#detail-panel')
  panel.hidden = false
  document.querySelector('.workspace').classList.add('has-panel')
  document.querySelector('#search-results').hidden = true
  document.querySelector('#search').setAttribute('aria-expanded', 'false')
  if (history) window.history.pushState(null, '', `#${node.kind === 'topic' ? 'topic' : 'note'}/${encodeURIComponent(node.kind === 'topic' ? node.label : node.slug)}`)
  document.title = `${node.label} · Tony's Field Notes`
  if (focus) graph.focus(id, Math.min(490, window.innerWidth * .42) + 24)
  if (node.kind === 'topic') panel.innerHTML = renderTopic(node)
  else {
    const post = posts.get(node.slug)
    const toolbar = panelToolbar('Note')
    panel.innerHTML = `${toolbar}<div class="panel-scroll"><header class="article-header"><h1>${esc(post.title)}</h1><p class="article-summary">${esc(post.summary)}</p></header><p class="article-loading" role="status">Opening note…</p></div>`
    syncReadingState()
    if (readingFullscreen) document.querySelector('#expand-panel')?.focus({ preventScroll: true })
    try {
      await loadArticle(post)
      if (selectedId !== id || selectionVersion !== version) return
      panel.innerHTML = renderArticle(post)
    } catch {
      if (selectedId !== id || selectionVersion !== version) return
      panel.innerHTML = `${toolbar}<div class="panel-scroll"><header class="article-header"><h1>${esc(post.title)}</h1></header><p class="article-summary">This note could not load. Check your connection and try again.</p><button class="focus-topic" data-retry="${esc(id)}">Try again</button><a class="static-article-link" href="${import.meta.env.BASE_URL}notes/${encodeURIComponent(post.slug)}/">Open readable page ${icon('arrow')}</a></div>`
    }
  }
  syncReadingState()
  if (readingFullscreen) document.querySelector('#expand-panel')?.focus({ preventScroll: true })
  announce(`${node.kind === 'topic' ? 'Topic' : 'Note'} opened: ${node.label}`)
}

function pausePanelMedia() {
  document.querySelectorAll('#detail-panel video, #detail-panel audio').forEach((media) => media.pause())
}

function closePanel({ history = true, restoreFocus = false } = {}) {
  pausePanelMedia()
  selectionVersion++
  selectedId = null
  readingFullscreen = false
  syncReadingState()
  graph.setSelection(null)
  document.querySelector('#detail-panel').hidden = true
  document.querySelector('.workspace').classList.remove('has-panel')
  if (history) window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`)
  document.title = "Tony's Field Notes"
  if (restoreFocus && lastActiveNode) graph.elements.get(lastActiveNode)?.focus({ preventScroll: true })
}

function openIndex() {
  dismissThemeTip()
  pausePanelMedia()
  window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`)
  document.title = "All notes · Tony's Field Notes"
  selectionVersion++
  selectedId = null
  graph.setSelection(null)
  const panel = document.querySelector('#detail-panel')
  const sorted = [...data.posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
  panel.innerHTML = `${panelToolbar(`${sorted.length} notes · ${data.topics.length} topics`, null, false)}<div class="panel-scroll index-content"><div class="index-topics">${data.nodes.filter((node) => node.kind === 'topic').map((node) => `<button data-select="${esc(node.id)}"><i style="background:${colorForTopic(node.label)}"></i>${esc(node.label)}<span>${topicPosts(node.label).length}</span></button>`).join('')}</div><div class="index-notes">${connectionRows(sorted)}</div></div>`
  panel.hidden = false
  document.querySelector('.workspace').classList.add('has-panel')
  syncReadingState()
}

function applyHash() {
  let hash
  try { hash = decodeURIComponent(location.hash.slice(1)) } catch { return }
  if (!hash) { closePanel({ history: false }); return }
  const id = hash.startsWith('note/') ? `post:${hash.slice(5)}` : hash.startsWith('topic/') ? `topic:${hash.slice(6)}` : `post:${hash}`
  if (nodes.has(id)) openNode(id, { history: false })
}

function bindEvents() {
  const search = document.querySelector('#search')
  search.addEventListener('input', () => { query = search.value; renderSearch() })
  search.addEventListener('focus', () => { if (query.trim()) renderSearch() })
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchMatches.length) { event.preventDefault(); openNode(searchMatches[0].id); search.blur() }
    if (event.key === 'ArrowDown') { event.preventDefault(); document.querySelector('.search-result')?.focus() }
  })
  document.querySelector('#zoom-in').addEventListener('click', () => graph.zoom(1))
  document.querySelector('#zoom-out').addEventListener('click', () => graph.zoom(-1))
  document.querySelector('#fit').addEventListener('click', () => { closePanel(); graph.fit(); announce('All nodes fit in view') })
  document.querySelector('#arrange').addEventListener('click', () => { closePanel(); activeTopic = null; query = ''; search.value = ''; renderSearch(); graph.arrange(); announce('Node layout reset') })
  document.querySelector('#open-index').addEventListener('click', openIndex)
  document.querySelector('#mode-toggle').addEventListener('click', () => { switchGraphMode(graphMode === '3d' ? '2d' : '3d'); announce(`${graphMode.toUpperCase()} graph enabled`) })
  document.querySelector('#theme-toggle').addEventListener('click', cycleTheme)
  document.querySelector('#dismiss-theme-tip').addEventListener('click', () => dismissThemeTip({ restoreFocus: true }))
  document.querySelector('#help-toggle').addEventListener('click', () => {
    dismissThemeTip()
    const help = document.querySelector('#help')
    help.hidden = !help.hidden
    document.querySelector('#help-toggle').setAttribute('aria-expanded', String(!help.hidden))
  })
  app.addEventListener('click', async (event) => {
    if (event.target.closest('#expand-panel')) { setReadingFullscreen(!readingFullscreen); return }
    if (event.target.closest('[data-cycle-theme]')) { cycleTheme(); return }
    const retry = event.target.closest('[data-retry]')
    if (retry) { openNode(retry.dataset.retry, { history: false, focus: false }); return }
    const select = event.target.closest('[data-select]')
    if (select) { openNode(select.dataset.select); return }
    const topic = event.target.closest('[data-focus-topic]')
    if (topic) {
      activeTopic = topic.dataset.focusTopic
      query = ''; search.value = ''; renderSearch()
      closePanel()
      graph.fit(true, topicNodeIds(activeTopic))
      return
    }
    if (event.target.closest('#clear-filter')) { activeTopic = null; updateHighlights(); graph.fit(); return }
    if (event.target.closest('#close-panel')) { closePanel({ restoreFocus: true }); return }
    const copy = event.target.closest('#copy-link')
    if (copy) {
      try { await navigator.clipboard.writeText(location.href); copy.innerHTML = icon('check'); announce('Link copied') } catch { announce('The link is available in the browser address bar') }
      return
    }
    const internal = event.target.closest('.post-content a[href^="#"]')
    if (internal) {
      const hash = decodeURIComponent(internal.getAttribute('href').slice(1))
      const id = hash.startsWith('topic/') ? `topic:${hash.slice(6)}` : `post:${hash.replace(/^note\//, '')}`
      if (nodes.has(id)) { event.preventDefault(); openNode(id) }
    }
    if (!event.target.closest('#search-box')) { document.querySelector('#search-results').hidden = true; search.setAttribute('aria-expanded', 'false') }
  })
  document.addEventListener('keydown', (event) => {
    const editing = event.target.matches('input, textarea, [contenteditable]')
    if (event.key === 'Escape') {
      if (!document.querySelector('#theme-tip').hidden) { event.preventDefault(); dismissThemeTip({ restoreFocus: Boolean(event.target.closest('#theme-tip')) }); return }
      if (readingFullscreen) { event.preventDefault(); setReadingFullscreen(false); return }
      if (!document.querySelector('#search-results').hidden || query) { query = ''; search.value = ''; renderSearch(); search.blur() }
      else { closePanel({ restoreFocus: true }); document.querySelector('#help').hidden = true; document.querySelector('#help-toggle').setAttribute('aria-expanded', 'false') }
      return
    }
    if (readingFullscreen) {
      if (event.key === 'Tab') {
        const focusable = [...document.querySelectorAll('#detail-panel button, #detail-panel a[href], #detail-panel video, #detail-panel audio')].filter((element) => element.getClientRects().length)
        const first = focusable[0], last = focusable.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
      return
    }
    if (editing || event.metaKey || event.ctrlKey || event.altKey) return
    if (event.key === '/') { event.preventDefault(); search.focus() }
    if (event.key.toLowerCase() === 'f') { closePanel(); graph.fit() }
    if (event.key === '+' || event.key === '=') graph.zoom(1)
    if (event.key === '-') graph.zoom(-1)
  })
  window.addEventListener('hashchange', applyHash)
}

app.innerHTML = '<div class="loading-state" role="status"><span></span>Connecting notes…</div>'
fetch(`${import.meta.env.BASE_URL}data.json`).then((response) => {
  if (!response.ok) throw new Error(`Content request failed: ${response.status}`)
  return response.json()
}).then((value) => {
  if (!Array.isArray(value.posts) || !Array.isArray(value.nodes) || !Array.isArray(value.edges)) throw new Error('Content is not ready')
  data = value
  data.posts.forEach((post) => posts.set(post.slug, post))
  data.nodes.forEach((node) => nodes.set(node.id, node))
  mount()
}).catch(() => {
  app.innerHTML = '<div class="loading-state error-state"><p>The notes could not load.</p><button type="button" onclick="window.location.reload()">Try again</button></div>'
})
