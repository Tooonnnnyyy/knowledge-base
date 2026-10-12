// Deterministic, low-contrast edge motion shared by both graph renderers.
export function edgeSeed(text) {
  let value = 2166136261
  for (const letter of String(text)) value = Math.imul(value ^ letter.charCodeAt(0), 16777619)
  return (value >>> 0) / 4294967296
}

export function pulseAt(timeMs, edgeLength, seed = 0, directional = false) {
  const length = Math.max(16, Math.min(34, edgeLength * .14))
  // Travel at a steady world-space speed, even when connections differ in
  // length. Undirected relationships travel out and back at the same speed.
  const duration = Math.max(1, edgeLength) / 72 * 1000
  const cycle = duration * (directional ? 1 : 2)
  const phase = (seed * cycle + timeMs) / cycle
  const raw = ((phase % 1) + 1) % 1
  const t = directional ? raw : (raw < .5 ? raw * 2 : 2 - raw * 2)
  const fade = Math.min(1, Math.min(t, 1 - t) / .12)
  // Fade into the nodes so wraps and direction changes never flash.
  return { t, opacity: fade * fade * (3 - 2 * fade), length, direction: directional || raw < .5 ? 1 : -1 }
}

export function pulseTint(a, b, dark) {
  const channels = (value) => {
    const hex = /^#[\da-f]{3}$/i.test(value || '') ? value.slice(1).split('').map((part) => part + part).join('') : value?.slice(1)
    return /^[\da-f]{6}$/i.test(hex || '') ? [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16)) : [112, 145, 183]
  }
  const first = channels(a), second = channels(b)
  const neutral = dark ? [190, 208, 228] : [46, 71, 101]
  const weight = dark ? .26 : .34
  return neutral.map((value, index) => Math.round(value * (1 - weight) + (first[index] + second[index]) / 2 * weight)).join(',')
}
