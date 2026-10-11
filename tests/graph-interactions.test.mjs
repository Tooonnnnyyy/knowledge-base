import test from 'node:test'
import assert from 'node:assert/strict'
import { Window } from 'happy-dom'
import { KnowledgeGraph } from '../src/graph.js'

// These are DOM/event integration checks. Browser hit-testing and appearance are covered separately.
function setup() {
  const window = new Window({ url: 'http://localhost/' })
  const queued = new Map()
  let frame = 0
  Object.assign(globalThis, { window, document: window.document, localStorage: window.localStorage,
    matchMedia: () => ({ matches: true }), ResizeObserver: class { observe() {} disconnect() {} },
    devicePixelRatio: 1, requestAnimationFrame: (callback) => { queued.set(++frame, callback); return frame },
  })
  window.document.body.innerHTML = '<div id="stage"><canvas></canvas><div id="layer"></div></div>'
  const stage = window.document.querySelector('#stage')
  stage.getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, width: 1440, height: 960 })
  const capture = new Set()
  stage.setPointerCapture = (id) => capture.add(id)
  stage.hasPointerCapture = (id) => capture.has(id)
  stage.releasePointerCapture = (id) => capture.delete(id)
  const draws = []
  const context = { setTransform() {}, clearRect() { draws.length = 0 }, setLineDash() {}, beginPath() {}, stroke() {},
    moveTo(x, y) { draws.push(['from', x, y]) }, lineTo(x, y) { draws.push(['to', x, y]) } }
  const canvas = stage.querySelector('canvas')
  canvas.getContext = () => context
  const opened = []
  let backgrounds = 0
  const graph = new KnowledgeGraph({ stage, canvas, layer: stage.querySelector('#layer'),
    nodes: [{ id: 'topic:Systems', label: 'Systems', kind: 'topic', color: '#123' },
      { id: 'post:one', label: 'First idea', kind: 'post', tags: ['Systems'], color: '#123' },
      { id: 'post:two', label: 'Another idea', kind: 'post', tags: ['Systems'], color: '#123' }],
    edges: [{ source: 'post:one', target: 'post:two', kind: 'link' }, { source: 'post:one', target: 'topic:Systems', kind: 'topic' }],
    onSelect: (id) => opened.push(id), onBackgroundClick: () => backgrounds++ })
  const flush = () => { const callbacks = [...queued.values()]; queued.clear(); callbacks.forEach((callback) => callback(performance.now() + 1000)) }
  flush()
  const point = (id) => { const node = graph.nodeMap.get(id); return { x: node.x * graph.camera.zoom + graph.camera.x, y: node.y * graph.camera.zoom + graph.camera.y } }
  const pointer = (type, location, target = stage, id = 1, pointerType = 'mouse') => target.dispatchEvent(new window.PointerEvent(type, {
    bubbles: true, cancelable: true, pointerId: id, pointerType, clientX: location.x, clientY: location.y, button: 0,
  }))
  return { window, stage, graph, opened, point, pointer, flush, draws, backgrounds: () => backgrounds }
}

test('node pointer clicks and keyboard activation open the selected note', () => {
  const state = setup()
  for (const id of ['post:one', 'post:two', 'topic:Systems']) {
    const target = state.graph.elements.get(id)
    const point = state.point(id)
    state.pointer('pointerdown', point, target)
    state.pointer('pointerup', point)
    assert.equal(state.opened.at(-1), id)
  }
  state.graph.elements.get('post:one').click()
  assert.equal(state.opened.at(-1), 'post:one')
})

test('node drag moves connected line endpoints, persists coordinates and does not open an article', () => {
  const state = setup()
  const point = state.point('post:one')
  const beforeDraw = JSON.stringify(state.draws)
  const node = state.graph.nodeMap.get('post:one')
  const original = { x: node.x, y: node.y }
  const zoom = state.graph.camera.zoom
  state.pointer('pointerdown', point, state.graph.elements.get(node.id))
  state.pointer('pointermove', { x: point.x + 100, y: point.y + 70 })
  state.pointer('pointerup', { x: point.x + 100, y: point.y + 70 })
  state.flush()
  assert.equal(state.opened.length, 0)
  assert.ok(Math.abs(node.x - original.x - 100 / zoom) < .00001)
  assert.ok(Math.abs(node.y - original.y - 70 / zoom) < .00001)
  assert.notEqual(JSON.stringify(state.draws), beforeDraw)
  const persisted = JSON.parse(localStorage.getItem('tony-graph-layout-v2'))[node.id]
  assert.equal(persisted.fixed, true)
  assert.ok(Math.abs(persisted.x - node.x) < .01)
})

test('empty-space click closes selection while background dragging only pans', () => {
  const state = setup()
  const before = { ...state.graph.camera }
  state.pointer('pointerdown', { x: 10, y: 100 })
  state.pointer('pointermove', { x: 75, y: 150 })
  state.pointer('pointerup', { x: 75, y: 150 })
  assert.equal(state.graph.camera.x, before.x + 65)
  assert.equal(state.graph.camera.y, before.y + 50)
  assert.equal(state.backgrounds(), 0)
  state.pointer('pointerdown', { x: 10, y: 100 })
  state.pointer('pointerup', { x: 10, y: 100 })
  assert.equal(state.backgrounds(), 1)
})

test('pinch changes zoom and cancellation does not select a node', () => {
  const state = setup()
  const before = state.graph.camera.zoom
  state.pointer('pointerdown', { x: 200, y: 200 }, state.stage, 1, 'touch')
  state.pointer('pointerdown', { x: 400, y: 200 }, state.stage, 2, 'touch')
  state.pointer('pointermove', { x: 500, y: 200 }, state.stage, 2, 'touch')
  assert.ok(state.graph.camera.zoom > before)
  state.pointer('pointercancel', { x: 500, y: 200 }, state.stage, 2, 'touch')
  state.pointer('pointercancel', { x: 200, y: 200 }, state.stage, 1, 'touch')
  assert.equal(state.opened.length, 0)
  assert.equal(state.graph.pointers.size, 0)
  assert.equal(state.graph.gesture, null)
})
