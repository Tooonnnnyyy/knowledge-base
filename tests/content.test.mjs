import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { readPosts, makeRenderer, buildGraph, privacyFindings } from '../scripts/build-content.mjs'

const note = (slug, extras = {}) => ({ slug, title: slug, date: '2026-10-10', summary: 'An example note.', type: 'note', tags: ['Probability'], links: [], aliases: [], markdown: '## English\n\nA useful idea.', ...extras })
const topics = [{ id: 'Systems', label: 'Systems', parent: null }, { id: 'Probability', label: 'Probability', parent: 'Systems' }]

test('wikilinks resolve aliases, create backlinks and draw one connection per pair', () => {
  const a = note('one', { markdown: '## English\n\nSee [[Another name|the related idea]].' })
  const b = note('two', { aliases: ['Another name'], links: ['one'] })
  const graph = buildGraph([a, b], topics)
  assert.deepEqual(a.links, ['two'])
  assert.deepEqual(a.backlinks, ['two'])
  assert.match(a.body, /href="#note\/two"/)
  assert.equal(graph.edges.filter((edge) => edge.kind === 'link').length, 1)
})

test('topic ancestors include descendants without generating all-pairs shared-tag edges', () => {
  const graph = buildGraph([note('one', { tags: ['Systems', 'Probability'] }), note('two')], topics)
  assert.equal(graph.topics.find((topic) => topic.id === 'Systems').count, 2)
  assert.equal(graph.edges.filter((edge) => edge.kind === 'topic').length, 2)
  assert.equal(graph.edges.filter((edge) => edge.kind === 'hierarchy').length, 1)
  assert.equal(graph.edges.some((edge) => edge.kind === 'shared'), false)
})

test('broken links and cyclic taxonomy fail the build', () => {
  assert.throws(() => buildGraph([note('one', { links: ['missing'] })], topics), /unknown linked note/)
  assert.throws(() => buildGraph([note('one', { markdown: '[[missing]]' })], topics), /Unresolved wikilink/)
  assert.throws(() => buildGraph([note('one')], [{ id: 'Probability', parent: 'Probability' }]), /Cycle/)
})

test('rendering supports readable tables, lists, code and math without executing HTML', () => {
  const { md } = makeRenderer([note('one')])
  const rendered = md.render('## English\n\n<script>alert(1)</script>\n\n- one\n- two\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n$x^2$\n\n```js\nconst value = 1\n```')
  assert.match(rendered, /&lt;script&gt;/)
  assert.doesNotMatch(rendered, /<script>/)
  assert.match(rendered, /<ul>/)
  assert.match(rendered, /table-scroll/)
  assert.match(rendered, /katex/)
  assert.match(rendered, /language-js/)
})

test('publication requires explicit public true and English-first text', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'garden-content-'))
  try {
    const target = path.join(directory, 'sample.md')
    fs.writeFileSync(target, '---\ntitle: Sample\nsummary: Example\ntags: [Systems]\n---\n## English\n\nA draft.')
    assert.equal(readPosts(directory).length, 0)
    fs.writeFileSync(target, '---\npublic: true\ntitle: Sample\nsummary: Example\ntags: [Systems]\n---\n## English\n\nAn idea.\n\n## 中文\n\n一个想法。')
    assert.equal(readPosts(directory).length, 1)
    fs.writeFileSync(target, '---\npublic: true\ntitle: Sample\nsummary: Example\ntags: [Systems]\n---\n## 中文\n\n想法。\n\n## English\n\nAn idea.')
    assert.throws(() => readPosts(directory), /English must precede Chinese/)
  } finally { fs.rmSync(directory, { recursive: true, force: true }) }
})

test('privacy guard blocks common credentials, source paths and contact details', () => {
  assert.ok(privacyFindings('file:///Users/example/private.md').length)
  assert.ok(privacyFindings('person@example.com').length)
  assert.ok(privacyFindings('ghp_' + 'a'.repeat(35)).length)
  assert.ok(privacyFindings('https://example.com/webhook/secret').length)
  assert.equal(privacyFindings('OAuth scopes limit which resources an application can access.').length, 0)
})
