import * as THREE from 'three'
import { edgeSeed, pulseAt, pulseTint } from './edge-motion.js'

const STORAGE_KEY = 'tony-graph-layout-3d-v1'
const MIN_RADIUS = 250
const MAX_RADIUS = 7000
const FIELD_OF_VIEW = 45
const GOLDEN_ANGLE = 2.399963229728653

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }
function seedNumber(value) {
  let hash = 2166136261
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619)
  return (hash >>> 0) / 4294967296
}
function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}
function pointDistance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y) }
function withVertexOpacity(material, roundPoints = false) {
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = `attribute float edgeOpacity; varying float vEdgeOpacity;\n${shader.vertexShader}`
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvEdgeOpacity = edgeOpacity;')
    shader.fragmentShader = `varying float vEdgeOpacity;\n${shader.fragmentShader}`
      .replace('#include <opaque_fragment>', `diffuseColor.a *= vEdgeOpacity;${roundPoints ? '\ndiffuseColor.a *= 1.0 - smoothstep(0.18, 0.5, length(gl_PointCoord - vec2(0.5)));' : ''}\n#include <opaque_fragment>`)
  }
  material.customProgramCacheKey = () => roundPoints ? 'knowledge-pulse-round-v1' : 'knowledge-edge-opacity-v1'
  return material
}

export class KnowledgeGraph3D {
  constructor({ stage, canvas, layer, nodes, edges, onSelect, onViewChange, onBackgroundClick, onFallback }) {
    this.mode = '3d'
    this.is3D = true
    this.stage = stage
    this.canvas = canvas
    this.layer = layer
    this.onSelect = onSelect
    this.onViewChange = onViewChange
    this.onBackgroundClick = onBackgroundClick
    this.onFallback = onFallback
    this.nodes = nodes.map((node) => ({ ...node, fixed: false }))
    this.nodeMap = new Map(this.nodes.map((node) => [node.id, node]))
    this.elements = new Map()
    this.neighbors = new Map(this.nodes.map((node) => [node.id, new Set()]))
    const seen = new Map()
    for (const edge of edges) {
      if (!this.nodeMap.has(edge.source) || !this.nodeMap.has(edge.target) || edge.source === edge.target) continue
      const key = [edge.source, edge.target].sort().join('|')
      if (!seen.has(key) || edge.kind === 'link') seen.set(key, {
        ...edge,
        a: this.nodeMap.get(edge.source),
        b: this.nodeMap.get(edge.target),
        seed: edgeSeed(key),
      })
    }
    this.edges = [...seen.values()].map((edge) => ({
      ...edge,
      pulseColors: {
        dark: new THREE.Color(`rgb(${pulseTint(edge.a.color, edge.b.color, true)})`),
        light: new THREE.Color(`rgb(${pulseTint(edge.a.color, edge.b.color, false)})`),
      },
    }))
    this.edges.forEach(({ source, target }) => {
      this.neighbors.get(source).add(target)
      this.neighbors.get(target).add(source)
    })
    this.selected = null
    this.highlighted = null
    this.hovered = null
    this.pointers = new Map()
    this.gesture = null
    this.animation = null
    this.frame = null
    this.destroyed = false
    this.paused = false
    this.autoFit = true
    this.fitIds = null
    this.motionQuery = matchMedia('(prefers-reduced-motion: reduce)')
    this.motionReduced = this.motionQuery.matches
    this.yaw = .16
    this.pitch = .11
    this.radius = 1800
    this.target = new THREE.Vector3()
    this.camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, 1, 1, 12000)
    this.raycaster = new THREE.Raycaster()
    this.dragPlane = new THREE.Plane()
    this.scene = new THREE.Scene()
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.15))
    const light = new THREE.DirectionalLight(0xffffff, 1.3)
    light.position.set(-450, 650, 800)
    this.scene.add(light)
    this.meshes = new Map()
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
      this.renderer.setClearColor(0x000000, 0)
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2))
      this.sphereGeometry = new THREE.SphereGeometry(1, 12, 9)
      this.buildScene()
      this.createNodes()
      this.resetPositions(true)
      this.resizeObserver = new ResizeObserver(() => this.resize())
      this.resizeObserver.observe(stage)
      this.bindEvents()
      this.resize()
      this.fit(false)
      this.overviewRadius = this.radius
      this.requestDraw()
    } catch (error) {
      this.destroy()
      throw error
    }
  }

  buildScene() {
    const linePositions = new Float32Array(this.edges.length * 6)
    const lineColors = new Float32Array(this.edges.length * 6)
    this.lineGeometry = new THREE.BufferGeometry()
    this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
    this.lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage))
    this.lineGeometry.setAttribute('edgeOpacity', new THREE.BufferAttribute(new Float32Array(this.edges.length * 2), 1).setUsage(THREE.DynamicDrawUsage))
    this.lineMaterial = withVertexOpacity(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .35, depthWrite: false }))
    this.lineMesh = new THREE.LineSegments(this.lineGeometry, this.lineMaterial)
    this.lineMesh.frustumCulled = false
    this.scene.add(this.lineMesh)

    const tailPositions = new Float32Array(this.edges.length * 6)
    const tailColors = new Float32Array(this.edges.length * 6)
    this.tailGeometry = new THREE.BufferGeometry()
    this.tailGeometry.setAttribute('position', new THREE.BufferAttribute(tailPositions, 3).setUsage(THREE.DynamicDrawUsage))
    this.tailGeometry.setAttribute('color', new THREE.BufferAttribute(tailColors, 3).setUsage(THREE.DynamicDrawUsage))
    this.tailGeometry.setAttribute('edgeOpacity', new THREE.BufferAttribute(new Float32Array(this.edges.length * 2), 1).setUsage(THREE.DynamicDrawUsage))
    this.tailMaterial = withVertexOpacity(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1, depthWrite: false }))
    this.tailMesh = new THREE.LineSegments(this.tailGeometry, this.tailMaterial)
    this.tailMesh.frustumCulled = false
    this.scene.add(this.tailMesh)

    const headPositions = new Float32Array(this.edges.length * 3)
    const headColors = new Float32Array(this.edges.length * 3)
    this.headGeometry = new THREE.BufferGeometry()
    this.headGeometry.setAttribute('position', new THREE.BufferAttribute(headPositions, 3).setUsage(THREE.DynamicDrawUsage))
    this.headGeometry.setAttribute('color', new THREE.BufferAttribute(headColors, 3).setUsage(THREE.DynamicDrawUsage))
    this.headGeometry.setAttribute('edgeOpacity', new THREE.BufferAttribute(new Float32Array(this.edges.length), 1).setUsage(THREE.DynamicDrawUsage))
    this.headMaterial = withVertexOpacity(new THREE.PointsMaterial({ vertexColors: true, size: 3.2, sizeAttenuation: false, transparent: true, opacity: 1, depthWrite: false }), true)
    this.headMesh = new THREE.Points(this.headGeometry, this.headMaterial)
    this.headMesh.frustumCulled = false
    this.scene.add(this.headMesh)

    for (const node of this.nodes) {
      const color = new THREE.Color(node.color || '#75a9ff')
      const material = new THREE.MeshStandardMaterial({ color, roughness: .82, metalness: 0, emissive: color, emissiveIntensity: .08, transparent: true, depthWrite: true })
      const mesh = new THREE.Mesh(this.sphereGeometry, material)
      mesh.userData.nodeId = node.id
      mesh.scale.setScalar(node.kind === 'topic' ? 13 : 6)
      this.scene.add(mesh)
      this.meshes.set(node.id, mesh)
    }
  }

  createNodes() {
    this.layer.replaceChildren()
    // Keep depth-ordered node hit targets inside the graph's own stacking
    // context, below the existing navigation and reading controls.
    this.layer.style.zIndex = '1'
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
      // The matching WebGL sphere is the visible dot; the HTML button remains
      // the accessible hit target and label.
      dot.style.visibility = 'hidden'
      const label = document.createElement('span')
      label.className = 'node-label'
      label.textContent = node.label
      button.append(dot, label)
      button.addEventListener('click', (event) => { if (event.detail === 0) this.onSelect(node.id) })
      button.addEventListener('focus', () => { this.hovered = node.id; this.requestDraw() })
      button.addEventListener('blur', () => { this.hovered = null; this.requestDraw() })
      button.addEventListener('keydown', (event) => {
        if (!event.altKey || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return
        event.preventDefault()
        const distance = event.shiftKey ? 30 : 10
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion)
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion)
        const dx = (event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0) * distance
        const dy = (event.key === 'ArrowUp' ? 1 : event.key === 'ArrowDown' ? -1 : 0) * distance
        node.x += right.x * dx + up.x * dy
        node.y += right.y * dx + up.y * dy
        node.z += right.z * dx + up.z * dy
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
    const radius = Math.max(400, Math.sqrt(this.nodes.length) * 54)
    roots.forEach((node, index) => {
      const angle = index / Math.max(roots.length, 1) * Math.PI * 2 - Math.PI / 2
      node.x = Math.cos(angle) * radius
      node.y = Math.sin(angle) * radius * .63
      node.z = Math.sin(angle * 2 + .4) * radius * .34
    })
    const positioned = new Set(roots.map((node) => node.id))
    const placeTopic = (node, ancestors = new Set()) => {
      if (positioned.has(node.id)) return
      const parent = this.nodeMap.get(node.parent)
      if (!parent || ancestors.has(node.id)) {
        node.x = node.y = node.z = 0
        positioned.add(node.id)
        return
      }
      placeTopic(parent, new Set([...ancestors, node.id]))
      const siblings = topics.filter((item) => item.parent === node.parent)
      const angle = Math.atan2(parent.y, parent.x) + (siblings.indexOf(node) - (siblings.length - 1) / 2) * .8
      node.x = parent.x + Math.cos(angle) * 190
      node.y = parent.y + Math.sin(angle) * 150
      node.z = parent.z + (seedNumber(node.id) - .5) * 230
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
        const angle = index * GOLDEN_ANGLE + seedNumber(node.id) * .7
        const radial = 80 + Math.sqrt(index + 1) * 56
        node.x = (topic?.x || 0) + Math.cos(angle) * radial
        node.y = (topic?.y || 0) + Math.sin(angle) * radial * .7
        node.z = (topic?.z || 0) + Math.sin(angle * 1.7) * radial * .62 + (seedNumber(node.id + ':depth') - .5) * 60
      })
    }
    const saved = restore ? readSaved() : {}
    for (const node of this.nodes) {
      const point = saved[node.id]
      if (point && [point.x, point.y, point.z].every((value) => Number.isFinite(value) && Math.abs(value) < 20000)) {
        node.x = point.x
        node.y = point.y
        node.z = point.z
        node.fixed = Boolean(point.fixed)
      } else node.fixed = false
    }
  }

  savePositions() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(this.nodes.map((node) => [node.id, {
        x: Math.round(node.x * 100) / 100,
        y: Math.round(node.y * 100) / 100,
        z: Math.round(node.z * 100) / 100,
        fixed: node.fixed,
      }]))))
    } catch { /* A blocked storage API must not disable navigation. */ }
  }

  updateCamera() {
    const cp = Math.cos(this.pitch)
    this.camera.position.set(
      this.target.x + this.radius * Math.sin(this.yaw) * cp,
      this.target.y + this.radius * Math.sin(this.pitch),
      this.target.z + this.radius * Math.cos(this.yaw) * cp,
    )
    this.camera.lookAt(this.target)
    this.camera.updateMatrixWorld()
  }

  resize() {
    if (this.destroyed) return
    const previousAspect = this.camera.aspect
    const initialized = Boolean(this.width)
    const bounds = this.stage.getBoundingClientRect()
    this.width = Math.max(bounds.width, 1)
    this.height = Math.max(bounds.height, 1)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height, false)
    for (const node of this.nodes) {
      node.labelWidth = node.labelElement.offsetWidth
      node.labelHeight = node.labelElement.offsetHeight
    }
    if (initialized && this.autoFit) this.fit(false, this.fitIds)
    else if (initialized && this.camera.aspect < previousAspect) this.radius = clamp(this.radius * previousAspect / this.camera.aspect, MIN_RADIUS, MAX_RADIUS)
    this.requestDraw()
  }

  point(event) {
    const bounds = this.stage.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }

  project(node) {
    const vector = new THREE.Vector3(node.x, node.y, node.z)
    const cameraDepth = -vector.clone().applyMatrix4(this.camera.matrixWorldInverse).z
    const perspectiveScale = (this.overviewRadius || this.radius) / Math.max(cameraDepth, 1)
    vector.project(this.camera)
    return {
      x: (vector.x + 1) * this.width / 2,
      y: (1 - vector.y) * this.height / 2,
      visible: cameraDepth > 0 && vector.z >= -1 && vector.z <= 1,
      depth: cameraDepth,
      perspectiveScale,
      scale: clamp(perspectiveScale, .84, 1.35),
    }
  }

  nearestNodeAt(point, maxDistance = 25) {
    this.updateCamera()
    const candidates = []
    const meshes = []
    for (const node of this.nodes) {
      const projected = this.project(node)
      if (!projected.visible) continue
      const mesh = this.meshes.get(node.id)
      if (!mesh?.visible || mesh.material.opacity <= 0) continue
      mesh.position.set(node.x, node.y, node.z)
      mesh.updateMatrixWorld(true)
      candidates.push({ node, projected })
      meshes.push(mesh)
    }
    this.raycaster.setFromCamera(new THREE.Vector2(point.x / this.width * 2 - 1, 1 - point.y / this.height * 2), this.camera)
    const hit = this.raycaster.intersectObjects(meshes, false)[0]
    if (hit) return this.nodeMap.get(hit.object.userData.nodeId)

    // A small screen-space allowance keeps distant nodes easy to target. For
    // virtually overlapping hit targets, the foreground node wins.
    let nearest = null
    let distance = Infinity
    let depth = Infinity
    for (const { node, projected } of candidates) {
      const candidate = pointDistance(projected, point)
      if (candidate > maxDistance) continue
      if (candidate < distance - 1.5 || (Math.abs(candidate - distance) <= 1.5 && projected.depth < depth)) {
        distance = candidate
        depth = projected.depth
        nearest = node
      }
    }
    return nearest
  }

  worldAt(point, plane) {
    const normalized = new THREE.Vector2(point.x / this.width * 2 - 1, 1 - point.y / this.height * 2)
    this.raycaster.setFromCamera(normalized, this.camera)
    return this.raycaster.ray.intersectPlane(plane, new THREE.Vector3())
  }

  panBy(dx, dy) {
    const unitsPerPixel = 2 * this.radius * Math.tan(THREE.MathUtils.degToRad(FIELD_OF_VIEW / 2)) / this.height
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion)
    this.target.addScaledVector(right, -dx * unitsPerPixel)
    this.target.addScaledVector(up, dy * unitsPerPixel)
    this.updateCamera()
  }

  bindEvents() {
    const down = (event) => {
      if (event.pointerType !== 'touch' && ![0, 1, 2].includes(event.button)) return
      event.preventDefault()
      if (this.pointers.size >= 2) return
      this.animation = null
      this.autoFit = false
      const point = this.point(event)
      this.pointers.set(event.pointerId, point)
      this.stage.setPointerCapture(event.pointerId)
      if (this.pointers.size === 2) {
        if (this.gesture?.node) { this.gesture.node.dragging = false; this.gesture.node.fixed = true }
        const [a, b] = [...this.pointers.values()]
        this.gesture = { type: 'pinch', center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, distance: pointDistance(a, b), radius: this.radius, target: this.target.clone() }
        return
      }
      const node = event.button === 0 ? this.nearestNodeAt(point, event.pointerType === 'touch' ? 27 : 24) : null
      const type = node ? 'node' : event.button === 1 || event.button === 2 || event.shiftKey ? 'pan' : 'orbit'
      this.gesture = { type, node, start: point, previous: point, moved: false }
      if (node) {
        node.dragging = true
        const normal = new THREE.Vector3()
        this.camera.getWorldDirection(normal)
        this.dragPlane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(node.x, node.y, node.z))
        const hit = this.worldAt(point, this.dragPlane)
        this.gesture.offset = hit ? new THREE.Vector3(node.x, node.y, node.z).sub(hit) : new THREE.Vector3()
      }
      this.stage.classList.add('is-dragging')
    }
    const move = (event) => {
      const point = this.point(event)
      if (!this.pointers.has(event.pointerId)) {
        if (event.pointerType !== 'touch') {
          const hovered = this.nearestNodeAt(point)?.id || null
          if (hovered !== this.hovered) { this.hovered = hovered; this.requestDraw() }
        }
        return
      }
      this.pointers.set(event.pointerId, point)
      const gesture = this.gesture
      if (!gesture) return
      if (gesture.type === 'pinch') {
        if (this.pointers.size < 2) return
        const [a, b] = [...this.pointers.values()]
        const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        const distance = pointDistance(a, b)
        this.radius = clamp(gesture.radius * Math.max(gesture.distance, 1) / Math.max(distance, 1), MIN_RADIUS, MAX_RADIUS)
        this.target.copy(gesture.target)
        this.updateCamera()
        this.panBy(center.x - gesture.center.x, center.y - gesture.center.y)
      } else {
        const dx = point.x - gesture.previous.x
        const dy = point.y - gesture.previous.y
        if (pointDistance(point, gesture.start) > 4) gesture.moved = true
        if (gesture.type === 'node' && gesture.moved) {
          const hit = this.worldAt(point, this.dragPlane)
          if (hit) {
            hit.add(gesture.offset)
            gesture.node.x = hit.x
            gesture.node.y = hit.y
            gesture.node.z = hit.z
            gesture.node.fixed = true
          }
        } else if (gesture.type === 'pan') this.panBy(dx, dy)
        else if (gesture.type === 'orbit' && gesture.moved) {
          this.yaw -= dx * .005
          this.pitch = clamp(this.pitch + dy * .005, -Math.PI / 2 + .015, Math.PI / 2 - .015)
          this.updateCamera()
        }
        gesture.previous = point
      }
      this.requestDraw()
    }
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
      if ((gesture?.type === 'pan' || gesture?.type === 'orbit') && !gesture.moved && event.type === 'pointerup') this.onBackgroundClick?.()
      if (this.pointers.size === 1) {
        const point = [...this.pointers.values()][0]
        this.gesture = { type: 'orbit', start: point, previous: point, moved: true }
      } else {
        this.gesture = null
        this.stage.classList.remove('is-dragging')
      }
      this.requestDraw()
    }
    const wheel = (event) => {
      event.preventDefault()
      this.animation = null
      this.autoFit = false
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? this.height : 1)
      this.radius = clamp(this.radius * Math.exp(delta * (event.ctrlKey ? .006 : .0012)), MIN_RADIUS, MAX_RADIUS)
      this.requestDraw()
    }
    const dblclick = (event) => {
      if (event.target.closest('[data-node]')) return
      this.onBackgroundClick?.()
      this.fit()
    }
    const blur = () => {
      if (this.gesture?.node) { this.gesture.node.dragging = false; this.savePositions() }
      this.pointers.clear()
      this.gesture = null
      this.stage.classList.remove('is-dragging')
      this.requestDraw()
    }
    const visibility = () => { if (document.hidden && this.frame) { cancelAnimationFrame(this.frame); this.frame = null } else this.requestDraw() }
    const contextLost = (event) => { event.preventDefault(); if (!this.destroyed) this.onFallback?.() }
    const contextMenu = (event) => event.preventDefault()
    const pointerLeave = () => { if (!this.gesture && this.hovered) { this.hovered = null; this.requestDraw() } }
    const motionChange = (event) => { this.motionReduced = event.matches; this.requestDraw() }
    this.handlers = { down, move, end, wheel, dblclick, blur, visibility, contextLost, contextMenu, pointerLeave, motionChange }
    this.stage.addEventListener('pointerdown', down)
    this.stage.addEventListener('pointermove', move)
    this.stage.addEventListener('pointerleave', pointerLeave)
    this.stage.addEventListener('pointerup', end)
    this.stage.addEventListener('pointercancel', end)
    this.stage.addEventListener('lostpointercapture', end)
    this.stage.addEventListener('wheel', wheel, { passive: false })
    this.stage.addEventListener('dblclick', dblclick)
    this.stage.addEventListener('contextmenu', contextMenu)
    window.addEventListener('blur', blur)
    document.addEventListener('visibilitychange', visibility)
    this.canvas.addEventListener('webglcontextlost', contextLost)
    this.motionQuery.addEventListener?.('change', motionChange)
  }

  setSelection(id) { this.selected = id; this.updateNodeStates(); this.requestDraw() }
  highlight(ids) { this.highlighted = ids; this.updateNodeStates(); this.requestDraw() }
  updateNodeStates() {
    for (const node of this.nodes) {
      const element = this.elements.get(node.id)
      const selected = node.id === this.selected
      const connected = this.selected && this.neighbors.get(this.selected)?.has(node.id)
      const dimmed = !selected && (this.highlighted ? !this.highlighted.has(node.id) : this.selected && !connected)
      element.classList.toggle('is-selected', selected)
      element.classList.toggle('is-connected', Boolean(connected))
      element.classList.toggle('is-dimmed', Boolean(dimmed))
      element.classList.toggle('is-pinned', node.fixed)
      element.setAttribute('aria-pressed', String(selected))
      const mesh = this.meshes.get(node.id)
      mesh.material.opacity = dimmed ? .25 : 1
      mesh.material.depthWrite = !dimmed
      mesh.scale.setScalar((node.kind === 'topic' ? 13 : 6) * (selected ? 1.3 : this.hovered === node.id ? 1.17 : 1))
    }
  }

  zoom(direction) { this.animation = null; this.autoFit = false; this.radius = clamp(this.radius * (direction > 0 ? 1 / 1.2 : 1.2), MIN_RADIUS, MAX_RADIUS); this.requestDraw() }

  fit(animate = true, ids = null) {
    const nodes = ids ? this.nodes.filter((node) => ids.has(node.id)) : this.nodes
    if (!nodes.length || !this.width) return
    const center = new THREE.Vector3(
      (Math.min(...nodes.map((node) => node.x)) + Math.max(...nodes.map((node) => node.x))) / 2,
      (Math.min(...nodes.map((node) => node.y)) + Math.max(...nodes.map((node) => node.y))) / 2,
      (Math.min(...nodes.map((node) => node.z)) + Math.max(...nodes.map((node) => node.z))) / 2,
    )
    this.updateCamera()
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion)
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion)
    const backward = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion)
    const tangent = Math.tan(THREE.MathUtils.degToRad(FIELD_OF_VIEW / 2))
    const horizontal = tangent * this.camera.aspect * .8
    const vertical = tangent * .77
    let radius = MIN_RADIUS
    for (const node of nodes) {
      const offset = new THREE.Vector3(node.x, node.y, node.z).sub(center)
      const z = offset.dot(backward)
      radius = Math.max(radius, z + (Math.abs(offset.dot(right)) + 26) / horizontal, z + (Math.abs(offset.dot(up)) + 34) / vertical)
    }
    radius = clamp(radius, MIN_RADIUS, MAX_RADIUS)
    this.autoFit = true
    this.fitIds = ids ? new Set(ids) : null
    if (!ids) this.overviewRadius = radius
    this.moveCamera(center, radius, animate)
  }

  focus(id, panelWidth = 0) {
    const node = this.nodeMap.get(id)
    if (!node) return
    this.autoFit = false
    const isMobile = this.width <= 800
    const radius = clamp(Math.min(this.radius, this.overviewRadius * .75), 460, this.overviewRadius)
    const target = new THREE.Vector3(node.x, node.y, node.z)
    this.updateCamera()
    const unitsPerPixel = 2 * radius * Math.tan(THREE.MathUtils.degToRad(FIELD_OF_VIEW / 2)) / this.height
    if (isMobile) target.addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion), -this.height * .35 * unitsPerPixel)
    else target.addScaledVector(new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion), panelWidth * .5 * unitsPerPixel)
    this.moveCamera(target, radius, true)
  }

  moveCamera(target, radius, animate) {
    if (!animate || this.motionReduced) {
      this.target.copy(target)
      this.radius = radius
      this.animation = null
    } else this.animation = { startTarget: this.target.clone(), endTarget: target.clone(), startRadius: this.radius, endRadius: radius, time: performance.now() }
    this.requestDraw()
  }

  arrange() {
    this.resetPositions()
    this.yaw = .16
    this.pitch = .11
    this.savePositions()
    this.fit()
    this.updateNodeStates()
    this.requestDraw()
  }

  requestDraw() {
    if (this.frame || this.destroyed || this.paused || document.hidden) return
    this.frame = requestAnimationFrame((time) => {
      this.frame = null
      if (this.animation) {
        const progress = clamp((time - this.animation.time) / 450, 0, 1)
        const eased = 1 - (1 - progress) ** 3
        this.target.copy(this.animation.startTarget).lerp(this.animation.endTarget, eased)
        this.radius = this.animation.startRadius + (this.animation.endRadius - this.animation.startRadius) * eased
        if (progress === 1) this.animation = null
      }
      this.draw(time)
      if (!this.motionReduced || this.animation) this.requestDraw()
    })
  }

  setPaused(paused) {
    this.paused = Boolean(paused)
    if (this.paused && this.frame) { cancelAnimationFrame(this.frame); this.frame = null }
    if (!this.paused) this.requestDraw()
  }

  draw(time = performance.now()) {
    this.updateCamera()
    const dark = document.documentElement.dataset.theme === 'dark'
    const focus = this.hovered || this.selected
    const baseColor = new THREE.Color(dark ? '#9aa9ba' : '#5d6a7a')
    const linePositions = this.lineGeometry.attributes.position.array
    const lineColors = this.lineGeometry.attributes.color.array
    const lineOpacities = this.lineGeometry.attributes.edgeOpacity.array
    const tailPositions = this.tailGeometry.attributes.position.array
    const tailColors = this.tailGeometry.attributes.color.array
    const tailOpacities = this.tailGeometry.attributes.edgeOpacity.array
    const headPositions = this.headGeometry.attributes.position.array
    const headColors = this.headGeometry.attributes.color.array
    const headOpacities = this.headGeometry.attributes.edgeOpacity.array
    this.lineMaterial.opacity = dark ? .5 : .28
    for (let index = 0; index < this.edges.length; index++) {
      const edge = this.edges[index]
      const { a, b } = edge
      const base = index * 6
      linePositions.set([a.x, a.y, a.z, b.x, b.y, b.z], base)
      const connected = focus && (edge.source === focus || edge.target === focus)
      const filtered = this.highlighted && (!this.highlighted.has(edge.source) || !this.highlighted.has(edge.target))
      const faded = filtered || (focus && !connected)
      const strength = faded ? .13 : connected ? 1 : edge.kind === 'hierarchy' ? .43 : edge.kind === 'topic' ? .48 : .56
      for (let endpoint = 0; endpoint < 2; endpoint++) {
        const offset = base + endpoint * 3
        lineColors[offset] = baseColor.r
        lineColors[offset + 1] = baseColor.g
        lineColors[offset + 2] = baseColor.b
        lineOpacities[index * 2 + endpoint] = strength
      }
      const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z
      const length = Math.hypot(dx, dy, dz)
      const motion = this.motionReduced ? { t: 0, opacity: 0, length: 0, direction: 1 } : pulseAt(time, length, edge.seed, edge.kind === 'link')
      const t = clamp(motion.t, 0, 1)
      const tailSpan = clamp(motion.length / Math.max(length, 1), 0, .45)
      const previous = clamp(t - motion.direction * tailSpan, 0, 1)
      tailPositions.set([
        a.x + dx * previous, a.y + dy * previous, a.z + dz * previous,
        a.x + dx * t, a.y + dy * t, a.z + dz * t,
      ], base)
      headPositions.set([a.x + dx * t, a.y + dy * t, a.z + dz * t], index * 3)
      const strengthPulse = clamp(motion.opacity, 0, 1) * (faded ? .065 : connected ? .85 : dark ? .46 : .36)
      const pulseColor = edge.pulseColors[dark ? 'dark' : 'light']
      for (let channel = 0; channel < 3; channel++) {
        const component = pulseColor[['r', 'g', 'b'][channel]]
        tailColors[base + channel] = component
        tailColors[base + 3 + channel] = component
        headColors[index * 3 + channel] = component
      }
      tailOpacities[index * 2] = 0
      tailOpacities[index * 2 + 1] = strengthPulse * .7
      headOpacities[index] = strengthPulse
    }
    for (const node of this.nodes) {
      this.meshes.get(node.id).position.set(node.x, node.y, node.z)
    }
    this.lineGeometry.attributes.position.needsUpdate = true
    this.lineGeometry.attributes.color.needsUpdate = true
    this.lineGeometry.attributes.edgeOpacity.needsUpdate = true
    this.tailGeometry.attributes.position.needsUpdate = true
    this.tailGeometry.attributes.color.needsUpdate = true
    this.tailGeometry.attributes.edgeOpacity.needsUpdate = true
    this.headGeometry.attributes.position.needsUpdate = true
    this.headGeometry.attributes.color.needsUpdate = true
    this.headGeometry.attributes.edgeOpacity.needsUpdate = true
    this.tailMesh.visible = !this.motionReduced
    this.headMesh.visible = !this.motionReduced
    this.updateNodeStates()
    this.renderer.render(this.scene, this.camera)
    const frames = this.nodes.map((node) => {
      const projected = this.project(node)
      const { x, y, scale } = projected
      const element = this.elements.get(node.id)
      const offscreen = !projected.visible || x < -180 || y < -100 || x > this.width + 180 || y > this.height + 100
      element.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`
      element.style.visibility = offscreen ? 'hidden' : 'visible'
      const fontSize = `${((node.kind === 'topic' ? 13 : 11) / scale).toFixed(2)}px`
      const measureLabel = node.labelFontSize !== fontSize || !node.labelHeight
      if (measureLabel) {
        node.labelElement.style.fontSize = fontSize
        node.labelFontSize = fontSize
      }
      return { node, projected, element, offscreen, measureLabel }
    })
    // Depth controls both the DOM hit-target stack and label priority. All
    // font writes happen before measuring their actual wrapped dimensions.
    frames.sort((a, b) => b.projected.depth - a.projected.depth).forEach((frame, index) => {
      frame.element.style.zIndex = String(index + 1)
    })
    for (const { node, measureLabel } of frames) {
      if (!measureLabel) continue
      node.labelWidth = node.labelElement.offsetWidth
      node.labelHeight = node.labelElement.offsetHeight
    }
    const occupied = []
    const prioritized = frames.sort((a, b) => {
      const priority = (node) => node.id === this.hovered ? 5 : node.id === this.selected ? 4 : node.kind === 'topic' ? 3 : this.neighbors.get(this.selected)?.has(node.id) ? 2 : 1
      return priority(b.node) - priority(a.node) || a.projected.depth - b.projected.depth
    })
    for (const { node, projected, element, offscreen } of prioritized) {
      const { x, y, scale } = projected
      const width = (node.labelWidth || 168) * scale
      const height = (node.labelHeight || 35) * scale
      const labelTop = node.kind === 'topic' ? y - 15 * scale - height : y + 12 * scale
      const rect = { left: x - width / 2 - 5, right: x + width / 2 + 5, top: labelTop - 4, bottom: labelTop + height + 4 }
      const forced = node.id === this.hovered || node.id === this.selected
      const eligible = forced || node.kind === 'topic' || projected.perspectiveScale > .75
      const collides = occupied.some((other) => rect.left < other.right && rect.right > other.left && rect.top < other.bottom && rect.bottom > other.top)
      const visible = !offscreen && eligible && (forced || !collides)
      element.classList.toggle('is-label-hidden', !visible)
      if (visible) occupied.push(rect)
    }
    this.stage.dataset.ready = 'true'
    this.onViewChange?.(Math.round(this.overviewRadius / this.radius * 100))
  }

  destroy() {
    if (this.destroyed) return
    this.destroyed = true
    if (this.frame) cancelAnimationFrame(this.frame)
    this.resizeObserver?.disconnect()
    if (this.handlers) {
      const { down, move, end, wheel, dblclick, blur, visibility, contextLost, contextMenu, pointerLeave, motionChange } = this.handlers
      this.stage.removeEventListener('pointerdown', down)
      this.stage.removeEventListener('pointermove', move)
      this.stage.removeEventListener('pointerleave', pointerLeave)
      this.stage.removeEventListener('pointerup', end)
      this.stage.removeEventListener('pointercancel', end)
      this.stage.removeEventListener('lostpointercapture', end)
      this.stage.removeEventListener('wheel', wheel)
      this.stage.removeEventListener('dblclick', dblclick)
      this.stage.removeEventListener('contextmenu', contextMenu)
      window.removeEventListener('blur', blur)
      document.removeEventListener('visibilitychange', visibility)
      this.canvas.removeEventListener('webglcontextlost', contextLost)
      this.motionQuery.removeEventListener?.('change', motionChange)
    }
    this.lineGeometry?.dispose()
    this.lineMaterial?.dispose()
    this.tailGeometry?.dispose()
    this.tailMaterial?.dispose()
    this.headGeometry?.dispose()
    this.headMaterial?.dispose()
    this.sphereGeometry?.dispose()
    for (const mesh of this.meshes.values()) mesh.material.dispose()
    this.renderer?.dispose()
    this.renderer?.forceContextLoss()
    this.elements.clear()
    this.layer.replaceChildren()
  }
}
