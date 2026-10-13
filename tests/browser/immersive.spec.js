import { test, expect } from '@playwright/test'

const runtimeErrors = new WeakMap()

test.beforeEach(async ({ page }) => {
  const errors = []
  runtimeErrors.set(page, errors)
  page.on('pageerror', (error) => errors.push({ text: error.message, url: null }))
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const externalFont = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(message.location().url || '')
    if (externalFont && /Failed to load resource|net::ERR_/.test(message.text())) return
    errors.push({ text: message.text(), url: message.location().url || null })
  })
})

test.afterEach(async ({ page }, testInfo) => {
  const errors = runtimeErrors.get(page) || []
  const expectedWebGLFailure = testInfo.title === 'WebGL initialization failure falls back to the supported 2D renderer'
  const expectedDiagnostic = /^(?:THREE\.WebGLRenderer: ){1,2}Error creating WebGL context\.$/
  const unexpected = expectedWebGLFailure ? errors.filter((error) => !expectedDiagnostic.test(error.text)) : errors
  expect(unexpected, 'Unexpected browser runtime, shader or local resource errors').toEqual([])
})

async function ready(page) {
  await page.goto('/')
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-ready', 'true')
  const data = await page.request.get('/data.json').then((response) => response.json())
  await expect(page.locator('.graph-node')).toHaveCount(data.nodes.length)
  await expect(page.locator('.graph-node:visible').first()).toBeVisible()
  return { data, errors: runtimeErrors.get(page) }
}

async function nextFrame(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
}

async function clickNodeCenter(page, node) {
  await expect(node).toBeVisible()
  const box = await node.boundingBox()
  expect(box).not.toBeNull()
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
}

async function openNodeInSpace(page, node) {
  // A foreground sphere can legitimately cover a different node's projected
  // center. A real visitor orbits to expose it instead of clicking through it.
  const offsets = [null, { x: 80, y: -32 }, { x: -110, y: 48 }, { x: 160, y: 65 }, { x: -180, y: -50 }]
  const attempts = []
  for (const [attempt, offset] of offsets.entries()) {
    if (attempt === 0) await page.locator('#fit').click()
    else {
      await page.locator('#arrange').click()
      await nextFrame(page)
      const start = await backgroundPoint(page, offset)
      await page.mouse.move(start[0], start[1])
      await page.mouse.down()
      await page.mouse.move(start[0] + offset.x, start[1] + offset.y, { steps: 8 })
      await page.mouse.up()
      await page.locator('#fit').click()
    }
    await nextFrame(page)
    await clickNodeCenter(page, page.locator(`[data-node="${node.id}"]`))
    await nextFrame(page)
    const opened = await page.evaluate(() => ({
      id: document.querySelector('.graph-node[aria-pressed="true"]')?.dataset.node || null,
      title: document.querySelector('#detail-panel h1')?.textContent || null,
      hidden: document.querySelector('#detail-panel').hidden,
    }))
    attempts.push({ orbit: offset, actual: opened })
    if (!opened.hidden && opened.id === node.id) {
      await expect(page.locator('#detail-panel h1')).toHaveText(node.label)
      return
    }
  }
  expect(attempts.at(-1).actual.id, `Expected a real pointer click to open ${node.id} (${node.label}); attempts: ${JSON.stringify(attempts)}`).toBe(node.id)
}

async function openArticle(page, post) {
  await page.getByRole('searchbox').fill(post.title)
  await page.getByRole('searchbox').press('Enter')
  await expect(page.locator('#detail-panel h1')).toHaveText(post.title)
  await expect(page.locator('.post-content')).toBeVisible()
}

async function backgroundPoint(page, offset = { x: 0, y: 0 }) {
  return page.evaluate((drag) => {
    const stage = document.querySelector('#graph-stage').getBoundingClientRect()
    const boxes = [...document.querySelectorAll('.graph-node')]
      .filter((node) => getComputedStyle(node).visibility !== 'hidden')
      .map((node) => node.getBoundingClientRect())
    const candidates = [.08, .87, .53, .25, .75, .46].flatMap((x) => [.45, .2, .7, .84].map((y) => [stage.left + stage.width * x, stage.top + stage.height * y]))
    const point = candidates.find(([x, y]) => {
      const endX = x + drag.x, endY = y + drag.y
      return endX > stage.left + 20 && endX < stage.right - 20 && endY > stage.top + 90 && endY < stage.bottom - 70
        && boxes.every((box) => x < box.left - 24 || x > box.right + 24 || y < box.top - 24 || y > box.bottom + 24)
    })
    if (!point) throw new Error('No clear background start point is available for the graph drag')
    return point
  }, offset)
}

test('3D opens by default, exposes every node, and has no runtime errors', async ({ page }) => {
  const { data, errors } = await ready(page)
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-mode', '3d')
  await expect(page.locator('#mode-toggle')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#open-index')).toBeVisible()
  expect(await page.locator('.graph-node').count()).toBe(data.nodes.length)
  for (const node of data.nodes) {
    await openNodeInSpace(page, node)
    if (node.kind === 'post') await expect(page.locator('.post-content > h2').first()).toHaveText('English')
  }
  expect(errors).toEqual([])
})

test('3D orbit, pan and zoom change the projected graph without opening a panel', async ({ page }) => {
  await ready(page)
  const id = await page.locator('.graph-node:visible').first().getAttribute('data-node')
  const node = page.locator(`[data-node="${id}"]`)
  const beforeOrbit = await node.boundingBox()
  const orbit = await backgroundPoint(page)
  await page.mouse.move(orbit[0], orbit[1])
  await page.mouse.down()
  await page.mouse.move(orbit[0] + 120, orbit[1] + 48, { steps: 10 })
  await page.mouse.up()
  await expect(page.locator('#detail-panel')).toBeHidden()
  await expect.poll(async () => {
    const box = await node.boundingBox()
    return Math.abs(box.x - beforeOrbit.x) + Math.abs(box.y - beforeOrbit.y)
  }).toBeGreaterThan(2)

  const beforePan = await node.boundingBox()
  const pan = await backgroundPoint(page)
  await page.mouse.move(pan[0], pan[1])
  await page.mouse.down({ button: 'right' })
  await page.mouse.move(pan[0] + 55, pan[1] + 35, { steps: 8 })
  await page.mouse.up({ button: 'right' })
  await expect.poll(async () => {
    const box = await node.boundingBox()
    return Math.abs(box.x - beforePan.x) + Math.abs(box.y - beforePan.y)
  }).toBeGreaterThan(2)

  const zoomBefore = await page.locator('#zoom-level').textContent()
  const zoomPoint = await backgroundPoint(page)
  await page.mouse.move(zoomPoint[0], zoomPoint[1])
  await page.mouse.wheel(0, -260)
  await expect(page.locator('#zoom-level')).not.toHaveText(zoomBefore)
})

test('3D node dragging persists to its separate layout key', async ({ page }) => {
  const { data } = await ready(page)
  const node = page.locator('.graph-node.node-post:visible').first()
  const id = await node.getAttribute('data-node')
  const before = await node.boundingBox()
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2)
  await page.mouse.down()
  await page.mouse.move(before.x + before.width / 2 + 72, before.y + before.height / 2 + 42, { steps: 12 })
  await page.mouse.up()
  await expect(page.locator('#detail-panel')).toBeHidden()
  await expect.poll(async () => {
    const box = await node.boundingBox()
    return Math.abs(box.x - before.x) + Math.abs(box.y - before.y)
  }).toBeGreaterThan(20)
  const saved = await page.evaluate((nodeId) => JSON.parse(localStorage.getItem('tony-graph-layout-3d-v1'))?.[nodeId], id)
  expect(saved?.fixed).toBe(true)
  expect([saved?.x, saved?.y, saved?.z].every(Number.isFinite)).toBe(true)
  expect(await page.evaluate(() => localStorage.getItem('tony-graph-layout-v2'))).toBeNull()

  await page.reload()
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-mode', '3d')
  await expect(page.locator(`[data-node="${id}"]`)).toHaveClass(/is-pinned/)
  expect(await page.evaluate((nodeId) => JSON.parse(localStorage.getItem('tony-graph-layout-3d-v1'))?.[nodeId], id)).toEqual(saved)
  expect(data.nodes.some((item) => item.id === id)).toBe(true)
})

test('selected article survives repeated 2D/3D switches without duplicate nodes', async ({ page }) => {
  const { data } = await ready(page)
  const post = data.posts[0]
  await openArticle(page, post)
  const initialHash = await page.evaluate(() => location.hash)
  const articleIdentity = await page.evaluate(() => {
    window.__knowledgeArticle = document.querySelector('.post-content')
    return document.querySelector('.post-content')?.textContent
  })
  for (const mode of ['2d', '3d', '2d', '3d']) {
    await page.locator('#mode-toggle').click()
    await expect(page.locator('#graph-stage')).toHaveAttribute('data-mode', mode)
    await expect(page.locator('.graph-node')).toHaveCount(data.nodes.length)
    await expect(page.locator('#detail-panel h1')).toHaveText(post.title)
    expect(await page.evaluate(() => document.querySelector('.post-content') === window.__knowledgeArticle)).toBe(true)
    expect(await page.evaluate(() => document.querySelector('.post-content')?.textContent)).toBe(articleIdentity)
    expect(await page.evaluate(() => location.hash)).toBe(initialHash)
  }
})

test('WebGL initialization failure falls back to the supported 2D renderer', async ({ page }) => {
  await page.addInitScript(() => {
    const nativeGetContext = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function getContext(type, ...args) {
      if (type === 'webgl2' || type === 'webgl') return null
      return nativeGetContext.call(this, type, ...args)
    }
  })
  const { data } = await ready(page)
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-mode', '2d')
  await expect(page.locator('.graph-node')).toHaveCount(data.nodes.length)
  await expect(page.locator('#mode-toggle')).toHaveAttribute('aria-pressed', 'false')
})

test('runtime WebGL context loss falls back to 2D without losing the graph contract', async ({ page }) => {
  const { data } = await ready(page)
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-mode', '3d')
  await page.evaluate(() => document.querySelector('#connections').dispatchEvent(new Event('webglcontextlost', { cancelable: true })))
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-mode', '2d')
  await expect(page.locator('.graph-node')).toHaveCount(data.nodes.length)
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-ready', 'true')
})

test('theme control persists dark, light and paper modes', async ({ page }) => {
  await ready(page)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  const theme = page.locator('#theme-toggle')
  const tip = page.getByRole('region', { name: 'Reading theme guide' })
  await expect(tip).toBeVisible()
  await expect(tip).toContainText('Dark, Light and Paper')
  await expect(theme).toHaveAttribute('aria-describedby', 'theme-tip-description')
  await theme.click()
  await expect(tip).toBeHidden()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect.poll(() => page.evaluate(() => localStorage.getItem('tony-graph-theme'))).toBe('light')
  await theme.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
  expect(await page.evaluate(() => localStorage.getItem('tony-graph-theme'))).toBe('paper')
  await page.reload()
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
  await expect(tip).toBeVisible()
  await page.getByRole('button', { name: 'Dismiss theme tip', exact: true }).click()
  await expect(tip).toBeHidden()
  await expect(theme).toBeFocused()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
  await page.reload()
  await expect(tip).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(tip).toBeHidden()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
  await theme.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => localStorage.getItem('tony-graph-theme'))).toBe('dark')
})

test('reduced motion pauses transmission while all navigation and article reading remain available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  const { data } = await ready(page)
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-mode', '3d')
  await page.evaluate(() => document.fonts.ready)
  await page.mouse.move(2, 2)
  await nextFrame(page)
  const viewport = page.viewportSize()
  const clip = { x: 0, y: 85, width: viewport.width, height: viewport.height - 150 }
  const movingBefore = await page.screenshot({ clip })
  await page.waitForTimeout(450)
  const movingAfter = await page.screenshot({ clip })
  expect(movingAfter.equals(movingBefore), 'Transmission should change actual browser pixels').toBe(false)

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await nextFrame(page)
  const stillBefore = await page.screenshot({ clip })
  await page.waitForTimeout(350)
  const stillAfter = await page.screenshot({ clip })
  expect(stillAfter.equals(stillBefore), 'Reduced motion should stop autonomous graph animation').toBe(true)

  const zoomBefore = await page.locator('#zoom-level').textContent()
  await page.locator('#zoom-in').click()
  await expect(page.locator('#zoom-level')).not.toHaveText(zoomBefore)
  await page.locator('#fit').click()
  await openArticle(page, data.posts[0])
  await expect(page.locator('.post-content')).toBeVisible()
})

test('full-page reading preserves article DOM, scroll anchor, hash and modal focus boundary', async ({ page }) => {
  const { data } = await ready(page)
  const post = data.posts.find((item) => item.title.length > 20) || data.posts[0]
  await openArticle(page, post)
  const initialHash = await page.evaluate(() => location.hash)
  await page.evaluate(() => {
    const scroller = document.querySelector('#detail-panel .panel-scroll')
    scroller.scrollTop = 300
    const anchor = [...scroller.querySelectorAll('h1, h2, h3, p, li, figure, pre, table')].find((element) => element.getBoundingClientRect().bottom > scroller.getBoundingClientRect().top + 8)
    window.__readingAnchor = anchor
    window.__readingAnchorTop = anchor?.getBoundingClientRect().top
    window.__readingArticle = document.querySelector('.post-content')
  })
  const before = await page.evaluate(() => window.__readingAnchorTop)
  await page.locator('#expand-panel').click()
  await expect(page.locator('#detail-panel')).toHaveClass(/is-fullscreen/)
  await expect(page.locator('#detail-panel')).toHaveAttribute('role', 'dialog')
  await expect(page.locator('#graph-stage')).toHaveAttribute('inert', '')
  await expect(page.locator('#detail-panel h1')).toHaveText(post.title)
  expect(await page.evaluate(() => document.querySelector('.post-content') === window.__readingArticle)).toBe(true)
  expect(await page.evaluate(() => location.hash)).toBe(initialHash)
  const after = await page.evaluate(() => window.__readingAnchor?.getBoundingClientRect().top)
  expect(Number.isFinite(before) && Number.isFinite(after)).toBe(true)
  expect(Math.abs(after - before)).toBeLessThan(12)

  await page.locator('[data-cycle-theme]').click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const firstControl = page.locator('#detail-panel button:visible').first()
  await firstControl.focus()
  await page.keyboard.press('Shift+Tab')
  expect(await page.evaluate(() => Boolean(document.activeElement.closest('#detail-panel')))).toBe(true)

  await page.keyboard.press('Escape')
  await expect(page.locator('#detail-panel')).not.toHaveClass(/is-fullscreen/)
  await expect(page.locator('#detail-panel')).toHaveAttribute('role', 'complementary')
  await expect(page.locator('#graph-stage')).not.toHaveAttribute('inert', '')
  await page.locator('#expand-panel').click()
  await page.locator('#expand-panel').click()
  await expect(page.locator('#detail-panel')).not.toHaveClass(/is-fullscreen/)
  await page.locator('#expand-panel').click()
  await page.getByRole('button', { name: 'Close reading panel' }).click()
  await expect(page.locator('#detail-panel')).toBeHidden()
  await expect(page.locator('#graph-stage')).not.toHaveAttribute('inert', '')
})
