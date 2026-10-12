import test from 'node:test'
import assert from 'node:assert/strict'
import { edgeSeed, pulseAt, pulseTint } from '../src/edge-motion.js'

test('different connection lengths and directions share a steady travel speed', () => {
  for (const length of [180, 720, 1500]) {
    for (const directional of [true, false]) {
      const start = pulseAt(100, length, 0, directional)
      const end = pulseAt(200, length, 0, directional)
      assert.ok(Math.abs((end.t - start.t) * length - 7.2) < 1e-8)
    }
  }
})

test('pulses fade into endpoints without a visible wrap or reversal', () => {
  const length = 360
  assert.equal(pulseAt(0, length).opacity, 0)
  assert.equal(pulseAt(5000, length).opacity, 0)
  assert.equal(pulseAt(5000, length, 0, true).opacity, 0)
  assert.equal(pulseAt(4999, length).direction, 1)
  assert.equal(pulseAt(5001, length).direction, -1)
  for (const time of [4999, 5001]) assert.ok(pulseAt(time, length).opacity < .001)
})

test('every edge has deterministic motion and a symmetric category tint', () => {
  const seed = edgeSeed('topic:AI|post:agents')
  assert.equal(seed, edgeSeed('topic:AI|post:agents'))
  assert.notEqual(seed, edgeSeed('topic:Systems|post:simulation'))
  for (const dark of [true, false]) {
    assert.equal(pulseTint('#bd7761', '#1f6fe5', dark), pulseTint('#1f6fe5', '#bd7761', dark))
  }
  for (const length of [1, 200, 2500]) {
    for (const time of [0, 30, 1000, 60000]) {
      const motion = pulseAt(time, length, seed)
      assert.ok(Number.isFinite(motion.t) && motion.t >= 0 && motion.t <= 1)
      assert.ok(Number.isFinite(motion.opacity) && motion.opacity >= 0 && motion.opacity <= 1)
    }
  }
})
