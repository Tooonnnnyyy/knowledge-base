import test from 'node:test'
import assert from 'node:assert/strict'
import { screenToWorld, zoomAt, nearestNodeAt } from '../src/graph.js'

const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < .000001, `${actual} should equal ${expected}`)

test('zooming preserves the world point under the pointer after panning', () => {
  const camera = { x: -380, y: 152, zoom: .6 }
  const pointer = { x: 721, y: 305 }
  const before = screenToWorld(pointer, camera)
  const after = screenToWorld(pointer, zoomAt(camera, pointer, 1.4))
  close(after.x, before.x)
  close(after.y, before.y)
})

test('zoom limits do not cause the pointer anchor to jump', () => {
  const camera = { x: 140, y: -79, zoom: 1.2 }
  const pointer = { x: 305, y: 690 }
  const anchor = screenToWorld(pointer, camera)
  for (const requested of [.001, 80]) {
    const result = zoomAt(camera, pointer, requested)
    assert.ok(result.zoom >= .12 && result.zoom <= 2.4)
    const point = screenToWorld(pointer, result)
    close(point.x, anchor.x)
    close(point.y, anchor.y)
  }
})

test('screen coordinates map back to the same dragged world point', () => {
  for (const camera of [{ x: 0, y: 0, zoom: 1 }, { x: -250, y: 360, zoom: .35 }, { x: 1220, y: -30, zoom: 2.2 }]) {
    const world = { x: -624.4, y: 713.9 }
    const screen = { x: world.x * camera.zoom + camera.x, y: world.y * camera.zoom + camera.y }
    const result = screenToWorld(screen, camera)
    close(result.x, world.x)
    close(result.y, world.y)
  }
})

test('dense mobile hit regions select the closest dot regardless of DOM order', () => {
  const camera = { x: 195, y: 422, zoom: .14 }
  const nodes = [
    { id: 'earlier', x: 0, y: 0 },
    { id: 'later', x: 70, y: 60 },
  ]
  assert.equal(nearestNodeAt(nodes, camera, { x: 195, y: 422 }).id, 'earlier')
  assert.equal(nearestNodeAt(nodes.toReversed(), camera, { x: 195, y: 422 }).id, 'earlier')
  assert.equal(nearestNodeAt(nodes, camera, { x: 195 + 70 * .14, y: 422 + 60 * .14 }).id, 'later')
  assert.equal(nearestNodeAt(nodes, camera, { x: 20, y: 180 }), null)
})
