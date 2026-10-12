import { test, expect } from '@playwright/test'

// Retain the original regression contract for the fully supported 2D view.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('tony-graph-mode', '2d'))
})

async function ready(page) {
  await page.goto('/')
  await expect(page.locator('#graph-stage')).toHaveAttribute('data-ready', 'true')
  await expect(page.locator('.graph-node').first()).toBeVisible()
  return page.request.get('/data.json').then((response) => response.json())
}
async function openFromSearch(page, title) {
  await page.getByRole('searchbox').fill(title)
  await page.getByRole('searchbox').press('Enter')
  await expect(page.locator('#detail-panel h1')).toHaveText(title)
}

test('homepage is the graph and every real node opens its article or topic', async ({ page }) => {
  const failures = []
  page.on('pageerror', (error) => failures.push(error.message))
  const data = await ready(page)
  await expect(page.locator('h1:visible')).toHaveCount(0)
  await expect(page.locator('.graph-node')).toHaveCount(data.nodes.length)
  for (const node of data.nodes) {
    await page.getByRole('button', { name: 'Fit all nodes in view', exact: true }).click()
    const button = page.locator(`[data-node="${node.id}"]`)
    await button.click({ position: { x: 20, y: 20 } })
    await expect(page.locator('#detail-panel h1')).toHaveText(node.label)
    if (node.kind === 'post') {
      await expect(page.locator('.post-content > h2').first()).toHaveText('English')
      await expect(page.locator('.post-content > h2').last()).toHaveText('中文')
    }
  }
  expect(failures).toEqual([])
})

test('drag moves a node and its connections without opening it, and persists after reload', async ({ page }) => {
  const data = await ready(page)
  const node = page.locator(`[data-node="post:${data.posts[0].slug}"]`)
  const before = await node.boundingBox()
  const canvasBefore = await page.locator('#connections').evaluate((canvas) => canvas.toDataURL())
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2)
  await page.mouse.down()
  await page.mouse.move(before.x + before.width / 2 + 95, before.y + before.height / 2 + 65, { steps: 12 })
  await page.mouse.up()
  await expect(page.locator('#detail-panel')).toBeHidden()
  await expect.poll(async () => (await node.boundingBox()).x - before.x).toBeCloseTo(95, 0)
  await expect.poll(async () => (await node.boundingBox()).y - before.y).toBeCloseTo(65, 0)
  expect(await page.locator('#connections').evaluate((canvas) => canvas.toDataURL())).not.toBe(canvasBefore)
  const key = `post:${data.posts[0].slug}`
  const saved = await page.evaluate((id) => JSON.parse(localStorage.getItem('tony-graph-layout-v2'))[id], key)
  expect(saved.fixed).toBe(true)
  await page.reload()
  await expect(node).toHaveClass(/is-pinned/)
  expect(await page.evaluate((id) => JSON.parse(localStorage.getItem('tony-graph-layout-v2'))[id], key)).toEqual(saved)
  await page.getByRole('button', { name: 'Reset node layout', exact: true }).click()
  await expect(node).not.toHaveClass(/is-pinned/)
})

test('background pan, wheel zoom, search, hierarchy, backlinks and history work together', async ({ page }) => {
  const data = await ready(page)
  const node = page.locator('.graph-node').first()
  const before = await node.boundingBox()
  await page.mouse.move(20, 180)
  await page.mouse.down()
  await page.mouse.move(80, 225, { steps: 6 })
  await page.mouse.up()
  await expect.poll(async () => (await node.boundingBox()).x - before.x).toBeCloseTo(60, 0)
  await expect.poll(async () => (await node.boundingBox()).y - before.y).toBeCloseTo(45, 0)
  const zoomBefore = await page.locator('#zoom-level').textContent()
  await page.mouse.wheel(0, -250)
  await expect(page.locator('#zoom-level')).not.toHaveText(zoomBefore)
  await openFromSearch(page, 'Probability')
  await expect(page.locator('.topic-breadcrumb')).toHaveText('Systems')
  await page.locator('.topic-breadcrumb').click()
  await expect(page.locator('#detail-panel h1')).toHaveText('Systems')
  const post = data.posts.find((post) => post.links.length && post.backlinks.length)
  await openFromSearch(page, post.title)
  await expect(page.getByRole('heading', { name: /Linked here/ })).toBeVisible()
  const target = data.posts.find((item) => item.slug === post.links[0])
  await page.locator('.article-connections').locator(`[data-select="post:${target.slug}"]`).first().click()
  await expect(page.locator('#detail-panel h1')).toHaveText(target.title)
  await page.goBack()
  await expect(page.locator('#detail-panel h1')).toHaveText(post.title)
  await page.getByRole('button', { name: 'Close reading panel' }).click()
  await expect(page.locator('#detail-panel')).toBeHidden()
})

test('article failure has a working retry and selected requests cannot replace a newer selection', async ({ page }) => {
  const data = await ready(page)
  const post = data.posts[0]
  await page.route(`**/articles/${post.slug}.json`, (route) => route.fulfill({ status: 503, body: '{}' }))
  await openFromSearch(page, post.title)
  await expect(page.getByRole('button', { name: 'Try again', exact: true })).toBeVisible()
  await page.unroute(`**/articles/${post.slug}.json`)
  await page.getByRole('button', { name: 'Try again', exact: true }).click()
  await expect(page.locator('.post-content > h2').first()).toHaveText('English')

  const delayed = data.posts[1]
  const newest = data.posts[2]
  let releaseResponse
  await page.route(`**/articles/${delayed.slug}.json`, async (route) => {
    await new Promise((resolve) => { releaseResponse = resolve })
    await route.continue()
  })
  await openFromSearch(page, delayed.title)
  await expect.poll(() => typeof releaseResponse).toBe('function')
  await openFromSearch(page, newest.title)
  await expect(page.locator('.post-content > h2').first()).toHaveText('English')
  const responseFinished = page.waitForResponse(`**/articles/${delayed.slug}.json`)
  releaseResponse()
  await (await responseFinished).finished()
  await expect(page.locator('#detail-panel h1')).toHaveText(newest.title)
  await expect(page.locator('.post-content > h2').first()).toHaveText('English')
})

test('mobile tap opens a readable bottom sheet and the article has a static fallback', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  const data = await ready(page)
  await openFromSearch(page, data.posts[0].title)
  await expect(page.locator('.post-content > h2').first()).toHaveText('English')
  const panel = await page.locator('#detail-panel').boundingBox()
  expect(panel.width).toBe(390)
  expect(panel.y).toBeGreaterThan(100)
  expect(panel.y + panel.height).toBeCloseTo(844, 0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Close reading panel' }).click()
  await expect(page.locator('#detail-panel')).toBeHidden()
  await page.goto(`/notes/${data.posts[0].slug}/`)
  await expect(page.locator('h1')).toHaveText(data.posts[0].title)
  await expect(page.getByRole('link', { name: '← Open in graph' })).toBeVisible()
})
