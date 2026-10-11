const STORAGE_KEY = 'tony-graph-layout-v2'
const MIN_ZOOM = .12
const MAX_ZOOM = 2.4

export function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }
export function screenToWorld(point, camera) { return { x: (point.x - camera.x) / camera.zoom, y: (point.y - camera.y) / camera.zoom } }
export function zoomAt(camera, point, zoom) {
  const nextZoom = clamp(zoom, MIN_ZOOM, MAX_ZOOM)
  const world = screenToWorld(point, camera)
  return { x: point.x - world.x * nextZoom, y: point.y - world.y * nextZoom, zoom: nextZoom }
}

// DOM hit boxes can overlap when the whole graph fits on a phone. Resolve the
// closest visible dot, so stacking order never decides which note opens.
export function nearestNodeAt(nodes, camera, point, maxDistance = 24) {
  let nearest = null
  let distance = maxDistance
  for (const node of nodes) {
    const candidate = Math.hypot(node.x * camera.zoom + camera.x - point.x, node.y * camera.zoom + camera.y - point.y)
    if (candidate < distance) { distance = candidate; nearest = node }
  }
  return nearest
}

function seedNumber(text) {
  let value = 2166136261
  for (const letter of text) value = Math.imul(value ^ letter.charCodeAt(0), 16777619)
  return (value >>> 0) / 4294967296
}
function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}

export class KnowledgeGraph {
  constructor({ stage, canvas, layer, nodes, edges, onSelect, onViewChange, onBackgroundClick }) {
    this.stage = stage
    this.canvas = canvas
    this.layer = layer
    this.context = canvas.getContext('2d')
    this.onSelect = onSelect
    this.onBackgroundClick = onBackgroundClick
    this.onViewChange = onViewChange
    this.nodes = nodes.map((node) => ({ ...node, vx: 0, vy: 0, fixed: false }))
    this.nodeMap = new Map(this.nodes.map((node) => [node.id, node]))
    // An undirected visual connection is drawn once, while article backlinks retain direction.
    const seen = new Map()
    for (const edge of edges) {
      if (!this.nodeMap.has(edge.source) || !this.nodeMap.has(edge.target) || edge.source === edge.target) continue
      const key = [edge.source, edge.target].sort().join('|')
      if (!seen.has(key) || edge.kind === 'link') seen.set(key, { ...edge, a: this.nodeMap.get(edge.source), b: this.nodeMap.get(edge.target) })
    }
    this.edges = [...seen.values()]
    this.neighbors = new Map(this.nodes.map((node) => [node.id, new Set()]))
    this.edges.forEach(({ source, target }) => { this.neighbors.get(source).add(target); this.neighbors.get(target).add(source) })
    this.camera = { x: 0, y: 0, zoom: 1 }
    this.selected = null
    this.highlighted = null
    this.hovered = null
    this.pointers = new Map()
    this.gesture = null
    this.animation = null
    this.alpha = 0
    this.destroyed = false
    this.motionReduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    this.elements = new Map()
    this.createNodes()
    this.resetPositions(true)
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(stage)
    this.bindEvents()
    this.resize()
    // Calculate the initial layout before the first frame, then gently settle it in view.
    this.alpha = 1
    for (let i = 0; i < 160; i++) this.simulate()
    this.fit(false)
    this.alpha = this.motionReduced ? 0 : .08
    this.requestDraw()
  }

  createNodes() {
    this.layer.replaceChildren()
    for (const node of this.nodes) {
      const button = document.createElement('button')
      button.className = `graph-node node-${node.kind}`
      button.type = 'button'
      button.dataset.node = node.id
      button.setAttribute('aria-label', `${node.kind === 'topic' ? 'Explore topic' : 'Read note'}: ${node.label}`)
      button.setAttribute('aria-pressed', 'false')
      button.title = `${node.label} · Drag to move, click to ${node.kind === 'topic' ? 'explore' : 'read'}`
      button.style.setProperty('--node-color', node.color)
      const dot = document.createElement('span')
      dot.className = 'node-dot'
      const label = document.createElement('span')
      label.className = 'node-label'
      label.textContent = node.label
      button.append(dot, label)
      button.addEventListener('click', (event) => {
        // Pointer selection is handled at pointerup to distinguish a click from a drag.
        if (event.detail === 0) this.onSelect(node.id)
      })
      button.addEventListener('mouseenter', () => { this.hovered = node.id; this.requestDraw() })
      button.addEventListener('mouseleave', () => { this.hovered = null; this.requestDraw() })
      button.addEventListener('focus', () => { this.hovered = node.id; this.requestDraw() })
      button.addEventListener('blur', () => { this.hovered = null; this.requestDraw() })
      button.addEventListener('keydown', (event) => {
        if (!event.altKey || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
        event.preventDefault()
        const offset = event.shiftKey ? 30 : 10
        node.x += event.key === 'ArrowRight' ? offset : event.key === 'ArrowLeft' ? -offset : 0
        node.y += event.key === 'ArrowDown' ? offset : event.key === 'ArrowUp' ? -offset : 0
        node.vx = node.vy = 0
        node.fixed = true
        this.savePositions()
        this.requestDraw()
      })
      node.labelElement = label
      this.elements.set(node.id, button)
      this.layer.append(button)
    }
  }

  resetPositions(restore = false) {
    const topics = this.nodes.filter((node) => node.kind === 'topic')
    const topicMap = new Map(topics.map((node) => [node.label, node]))
    const roots = topics.filter((node) => !node.parent || !this.nodeMap.has(node.parent))
    const topicRadius = Math.max(240, Math.sqrt(this.nodes.length) * 44)
    roots.forEach((node, i) => {
      const angle = (i / roots.length) * Math.PI * 2 - Math.PI / 2
      node.x = node.anchorX = Math.cos(angle) * topicRadius
      node.y = node.anchorY = Math.sin(angle) * topicRadius * .58
    })
    const positioned = new Set(roots.map((node) => node.id))
    const placeTopic = (node, ancestors = new Set()) => {
      if (positioned.has(node.id)) return
      const parent = this.nodeMap.get(node.parent)
      if (!parent || ancestors.has(node.id)) {
        node.x = node.anchorX = 0; node.y = node.anchorY = 0
        positioned.add(node.id)
        return
      }
      placeTopic(parent, new Set([...ancestors, node.id]))
      const siblings = topics.filter((item) => item.parent === node.parent)
      const angle = Math.atan2(parent.y, parent.x) + (siblings.indexOf(node) - (siblings.length - 1) / 2) * .9
      node.x = node.anchorX = parent.x + Math.cos(angle) * 185
      node.y = node.anchorY = parent.y + Math.sin(angle) * 140
      positioned.add(node.id)
    }
    topics.forEach((node) => placeTopic(node))
    const groups = new Map()
    for (const node of this.nodes.filter((item) => item.kind !== 'topic')) {
      const key = node.tags?.[0] || ''
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key).push(node)
    }
    for (const [key, group] of groups) {
      const topic = topicMap.get(key)
      group.forEach((node, index) => {
        const angle = index * 2.399963 + seedNumber(node.id) * .6
        const radius = 90 + Math.sqrt(index + 1) * 58
        node.x = (topic?.x || 0) + Math.cos(angle) * radius
        node.y = (topic?.y || 0) + Math.sin(angle) * radius * .72
      })
    }
    const saved = restore ? readSaved() : {}
    for (const node of this.nodes) {
      node.vx = node.vy = 0
      const point = saved[node.id]
      if (point && Number.isFinite(point.x) && Number.isFinite(point.y) && Math.abs(point.x) < 20000 && Math.abs(point.y) < 20000) {
        node.x = point.x; node.y = point.y; node.fixed = Boolean(point.fixed)
      } else node.fixed = false
    }
  }

  resize() {
    const bounds = this.stage.getBoundingClientRect()
    const previous = { width: this.width, height: this.height }
    this.width = bounds.width
    this.height = bounds.height
    const ratio = Math.min(devicePixelRatio || 1, 2)
    this.canvas.width = Math.round(this.width * ratio)
    this.canvas.height = Math.round(this.height * ratio)
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0)
    if (previous.width && previous.height) {
      this.camera.x += (this.width - previous.width) / 2
      this.camera.y += (this.height - previous.height) / 2
    }
    for (const node of this.nodes) {
      node.labelWidth = node.labelElement.offsetWidth
      node.labelHeight = node.labelElement.offsetHeight
    }
    this.requestDraw()
  }

  point(event) {
    const rect = this.stage.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  bindEvents() {
    this.stage.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType !== 'touch') return
      event.preventDefault()
      if (this.pointers.size >= 2) return
      this.animation = null
      const point = this.point(event)
      this.pointers.set(event.pointerId, point)
      this.stage.setPointerCapture(event.pointerId)
      if (this.pointers.size === 2) {
        if (this.gesture?.node) { this.gesture.node.fixed = true; this.gesture.node.dragging = false }
        const [a, b] = [...this.pointers.values()]
        const middle = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        this.gesture = { type: 'pinch', distance: Math.hypot(a.x - b.x, a.y - b.y), zoom: this.camera.zoom, world: screenToWorld(middle, this.camera) }
        return
      }
      const node = nearestNodeAt(this.nodes, this.camera, point, event.pointerType === 'touch' ? 26 : 23)
      this.gesture = { type: node ? 'node' : 'pan', node, start: point, current: point, camera: { ...this.camera }, moved: false }
      if (node) { node.dragging = true; node.vx = node.vy = 0; this.gesture.offset = { x: node.x - screenToWorld(point, this.camera).x, y: node.y - screenToWorld(point, this.camera).y } }
      this.stage.classList.add('is-dragging')
    })
    this.stage.addEventListener('pointermove', (event) => {
      if (!this.pointers.has(event.pointerId)) return
      const point = this.point(event)
      this.pointers.set(event.pointerId, point)
      const gesture = this.gesture
      if (!gesture) return
      if (gesture.type === 'pinch') {
        if (this.pointers.size < 2) return
        const [a, b] = [...this.pointers.values()]
        const middle = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        const zoom = clamp(gesture.zoom * Math.hypot(a.x - b.x, a.y - b.y) / Math.max(gesture.distance, 1), MIN_ZOOM, MAX_ZOOM)
        this.camera = { x: middle.x - gesture.world.x * zoom, y: middle.y - gesture.world.y * zoom, zoom }
      } else {
        const dx = point.x - gesture.start.x, dy = point.y - gesture.start.y
        if (Math.hypot(dx, dy) > 4) gesture.moved = true
        if (gesture.type === 'node' && gesture.moved) {
          const world = screenToWorld(point, this.camera)
          gesture.node.x = world.x + gesture.offset.x
          gesture.node.y = world.y + gesture.offset.y
          gesture.node.fixed = true
          this.alpha = this.motionReduced ? 0 : Math.max(this.alpha, .08)
        } else if (gesture.type === 'pan') {
          this.camera.x = gesture.camera.x + dx
          this.camera.y = gesture.camera.y + dy
        }
      }
      this.requestDraw()
    })
    const end = (event) => {
      if (!this.pointers.has(event.pointerId)) return
      const gesture = this.gesture
      this.pointers.delete(event.pointerId)
      if (this.stage.hasPointerCapture(event.pointerId)) this.stage.releasePointerCapture(event.pointerId)
      if (gesture?.node) {
        gesture.node.dragging = false
        if (gesture.moved) this.savePositions()
        else if (event.type === 'pointerup') this.onSelect(gesture.node.id)
      }
      if (gesture?.type === 'pan' && !gesture.moved && event.type === 'pointerup') this.onBackgroundClick?.()
      if (this.pointers.size === 1) {
        const point = [...this.pointers.values()][0]
        this.gesture = { type: 'pan', start: point, camera: { ...this.camera }, moved: true }
      } else {
        this.gesture = null
        this.stage.classList.remove('is-dragging')
      }
      this.requestDraw()
    }
    this.stage.addEventListener('pointerup', end)
    this.stage.addEventListener('pointercancel', end)
    this.stage.addEventListener('lostpointercapture', end)
    window.addEventListener('blur', () => {
      if (this.gesture?.node) { this.gesture.node.dragging = false; this.savePositions() }
      this.pointers.clear()
      this.gesture = null
      this.stage.classList.remove('is-dragging')
      this.requestDraw()
    })
    this.stage.addEventListener('wheel', (event) => {
      event.preventDefault()
      this.animation = null
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.height : 1)
      const factor = Math.exp(-delta * (event.ctrlKey ? .008 : .0015))
      this.camera = zoomAt(this.camera, this.point(event), this.camera.zoom * factor)
      this.requestDraw()
    }, { passive: false })
    this.stage.addEventListener('dblclick', (event) => {
      if (event.target.closest('[data-node]')) return
      this.onBackgroundClick?.()
      this.fit()
    })
  }

  simulate() {
    const alpha = this.alpha
    const movable = (node) => !node.fixed && !node.dragging
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i]
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j]
        let dx = b.x - a.x, dy = b.y - a.y
        if (Math.abs(dx) + Math.abs(dy) < .01) { dx = .1; dy = .1 }
        const distance2 = Math.max(dx * dx + dy * dy, 100)
        const force = Math.min(170 / distance2, 4) * alpha
        if (movable(a)) { a.vx -= dx * force; a.vy -= dy * force * .55 }
        if (movable(b)) { b.vx += dx * force; b.vy += dy * force * .55 }
        // Labels have a rectangular footprint: resolve both node and text overlap.
        const width = a.kind === 'topic' || b.kind === 'topic' ? 180 : 162
        const height = 74
        if (Math.abs(dx) < width && Math.abs(dy) < height) {
          const overlapX = width - Math.abs(dx), overlapY = height - Math.abs(dy)
          if (overlapX < overlapY * 2.1) {
            const push = Math.sign(dx) * overlapX * .08 * alpha
            if (movable(a)) a.vx -= push
            if (movable(b)) b.vx += push
          } else {
            const push = Math.sign(dy) * overlapY * .12 * alpha
            if (movable(a)) a.vy -= push
            if (movable(b)) b.vy += push
          }
        }
      }
    }
    for (const edge of this.edges) {
      const { a, b } = edge
      const dx = b.x - a.x, dy = b.y - a.y
      const distance = Math.max(Math.hypot(dx, dy), 1)
      const desired = edge.kind === 'hierarchy' ? 210 : edge.kind === 'topic' ? 195 : edge.kind === 'link' ? 245 : 300
      const strength = edge.kind === 'shared' ? .00035 : edge.kind === 'topic' || edge.kind === 'hierarchy' ? .007 : .0035
      const force = (distance - desired) * strength * alpha
      if (movable(a)) { a.vx += dx / distance * force; a.vy += dy / distance * force }
      if (movable(b)) { b.vx -= dx / distance * force; b.vy -= dy / distance * force }
    }
    for (const node of this.nodes) {
      if (!movable(node)) continue
      const tx = node.kind === 'topic' ? node.anchorX : 0
      const ty = node.kind === 'topic' ? node.anchorY : 0
      const strength = node.kind === 'topic' ? .012 : .0009
      node.vx += (tx - node.x) * strength * alpha
      node.vy += (ty - node.y) * strength * (node.kind === 'topic' ? 1 : 4) * alpha
      node.vx *= .67; node.vy *= .67
      node.x += clamp(node.vx, -18, 18)
      node.y += clamp(node.vy, -18, 18)
    }
    this.alpha *= .976
    if (this.alpha < .003) { this.alpha = 0; this.savePositions() }
  }

  setSelection(id) {
    this.selected = id
    this.updateNodeStates()
    this.requestDraw()
  }
  highlight(ids) {
    this.highlighted = ids
    this.updateNodeStates()
    this.requestDraw()
  }
  updateNodeStates() {
    for (const node of this.nodes) {
      const element = this.elements.get(node.id)
      const selected = node.id === this.selected
      const connected = this.selected && this.neighbors.get(this.selected)?.has(node.id)
      const dimmed = !selected && (this.highlighted ? !this.highlighted.has(node.id) : this.selected && !connected)
      element.classList.toggle('is-selected', selected)
      element.classList.toggle('is-connected', Boolean(connected))
      element.classList.toggle('is-dimmed', Boolean(dimmed))
      element.setAttribute('aria-pressed', String(selected))
    }
  }

  zoom(direction) {
    this.animation = null
    this.camera = zoomAt(this.camera, { x: this.width / 2, y: this.height / 2 }, this.camera.zoom * (direction > 0 ? 1.2 : 1 / 1.2))
    this.requestDraw()
  }

  fit(animate = true, ids = null) {
    const nodes = ids ? this.nodes.filter((node) => ids.has(node.id)) : this.nodes
    if (!nodes.length || !this.width) return
    const xs = nodes.map((node) => node.x), ys = nodes.map((node) => node.y)
    const minX = Math.min(...xs) - 100, maxX = Math.max(...xs) + 100
    const minY = Math.min(...ys) - 80, maxY = Math.max(...ys) + 80
    const zoom = clamp(Math.min((this.width - 80) / (maxX - minX), (this.height - 160) / (maxY - minY)), MIN_ZOOM, 1.15)
    this.moveCamera({ x: this.width / 2 - (minX + maxX) / 2 * zoom, y: this.height / 2 - (minY + maxY) / 2 * zoom, zoom }, animate)
  }

  focus(id, panelWidth = 0) {
    const node = this.nodeMap.get(id)
    if (!node) return
    const isMobile = this.width <= 800
    const availableWidth = this.width - (isMobile ? 0 : panelWidth)
    const zoom = clamp(Math.max(this.camera.zoom, .8), .8, 1.3)
    this.moveCamera({ x: availableWidth / 2 - node.x * zoom, y: (isMobile ? this.height * .13 : this.height * .48) - node.y * zoom, zoom }, true)
  }

  moveCamera(camera, animate) {
    if (!animate || this.motionReduced) { this.camera = camera; this.animation = null }
    else this.animation = { start: { ...this.camera }, target: camera, time: performance.now() }
    this.requestDraw()
  }

  arrange() {
    this.resetPositions()
    this.alpha = 1
    for (let i = 0; i < 160; i++) this.simulate()
    this.alpha = this.motionReduced ? 0 : .2
    this.savePositions()
    this.fit()
    this.requestDraw()
  }

  savePositions() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(this.nodes.map((node) => [node.id, { x: Math.round(node.x * 100) / 100, y: Math.round(node.y * 100) / 100, fixed: node.fixed }])))) } catch { /* Layout still works when storage is unavailable. */ }
  }

  requestDraw() {
    if (this.frame || this.destroyed) return
    this.frame = requestAnimationFrame((time) => {
      this.frame = null
      if (this.alpha > 0) this.simulate()
      if (this.animation) {
        const progress = clamp((time - this.animation.time) / 360, 0, 1)
        const ease = 1 - (1 - progress) ** 3
        for (const key of ['x', 'y', 'zoom']) this.camera[key] = this.animation.start[key] + (this.animation.target[key] - this.animation.start[key]) * ease
        if (progress === 1) this.animation = null
      }
      this.draw()
      if (this.alpha || this.animation) this.requestDraw()
    })
  }

  draw() {
    const { context: ctx, camera } = this
    ctx.clearRect(0, 0, this.width, this.height)
    const dark = document.documentElement.dataset.theme === 'dark'
    const focus = this.hovered || this.selected
    for (const edge of this.edges) {
      const connected = focus && (edge.source === focus || edge.target === focus)
      const filtered = this.highlighted && (!this.highlighted.has(edge.source) || !this.highlighted.has(edge.target))
      const faded = filtered || (focus && !connected)
      ctx.strokeStyle = connected ? (dark ? '#87b4ff' : '#1f6fe5') : (dark ? '#a2aab6' : '#8291a6')
      ctx.globalAlpha = faded ? .045 : connected ? .8 : edge.kind === 'shared' ? .09 : edge.kind === 'topic' ? .2 : .33
      ctx.lineWidth = connected ? 1.45 : edge.kind === 'link' ? .9 : .65
      ctx.setLineDash(edge.kind === 'hierarchy' ? [4, 5] : edge.kind === 'shared' ? [2, 5] : [])
      ctx.beginPath()
      ctx.moveTo(edge.a.x * camera.zoom + camera.x, edge.a.y * camera.zoom + camera.y)
      ctx.lineTo(edge.b.x * camera.zoom + camera.x, edge.b.y * camera.zoom + camera.y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    ctx.setLineDash([])
    const nodeScale = clamp(camera.zoom, .84, 1.35)
    const occupied = []
    const prioritized = [...this.nodes].sort((a, b) => {
      const priority = (node) => node.id === this.hovered ? 5 : node.id === this.selected ? 4 : node.kind === 'topic' ? 3 : this.neighbors.get(this.selected)?.has(node.id) ? 2 : 1
      return priority(b) - priority(a)
    })
    for (const node of prioritized) {
      const x = node.x * camera.zoom + camera.x, y = node.y * camera.zoom + camera.y
      const element = this.elements.get(node.id)
      const offscreen = x < -180 || y < -100 || x > this.width + 180 || y > this.height + 100
      element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${nodeScale})`
      element.style.visibility = offscreen ? 'hidden' : 'visible'
      element.classList.toggle('is-pinned', node.fixed)
      const width = (node.labelWidth || 168) * nodeScale
      const height = (node.labelHeight || 35) * nodeScale
      const labelTop = node.kind === 'topic' ? y - 15 * nodeScale - height : y + 12 * nodeScale
      const rect = { left: x - width / 2 - 5, right: x + width / 2 + 5, top: labelTop - 4, bottom: labelTop + height + 4 }
      const forced = node.id === this.hovered || node.id === this.selected
      const eligible = forced || node.kind === 'topic' || camera.zoom > .4
      const collides = occupied.some((other) => rect.left < other.right && rect.right > other.left && rect.top < other.bottom && rect.bottom > other.top)
      const visible = !offscreen && eligible && (forced || !collides)
      element.classList.toggle('is-label-hidden', !visible)
      if (visible) occupied.push(rect)
    }
    this.stage.style.setProperty('--grid-size', `${Math.max(14, 28 * camera.zoom)}px`)
    this.stage.style.setProperty('--grid-x', `${camera.x}px`)
    this.stage.style.setProperty('--grid-y', `${camera.y}px`)
    this.stage.dataset.ready = 'true'
    this.onViewChange?.(Math.round(camera.zoom * 100))
  }
}
