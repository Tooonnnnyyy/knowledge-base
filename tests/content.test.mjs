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

test('media fences render responsive-safe native video and audio with escaped captions and URLs', () => {
  const { md } = makeRenderer([note('one')])
  const video = md.render('```video\nhttps://media.example.com/demo.mp4?quality=hd&v=2\nA "demo" <img src=x onerror=alert(1)> & explanation\n```')
  assert.match(video, /<figure class="article-media article-media-video">/)
  assert.match(video, /<video controls playsinline preload="metadata"/)
  assert.match(video, /src="https:\/\/media\.example\.com\/demo\.mp4\?quality=hd&amp;v=2" type="video\/mp4"/)
  assert.match(video, /<figcaption>A &quot;demo&quot; &lt;img src=x onerror=alert\(1\)&gt; &amp; explanation<\/figcaption>/)
  assert.match(video, /rel="noopener noreferrer">Open video<\/a>/)
  assert.doesNotMatch(video, /<img|autoplay/)
  const audio = md.render('```audio\nhttps://media.example.com/reflection.m4a\nA short reflection.\n```')
  assert.match(audio, /<audio controls preload="metadata" aria-label="A short reflection\."/)
  assert.match(audio, /type="audio\/mp4"/)
  const withoutCaption = md.render('```audio\nhttps://media.example.com/reflection.ogg\n```')
  assert.match(withoutCaption, /aria-label="Audio recording"/)
  assert.doesNotMatch(withoutCaption, /<figcaption>/)
  assert.equal(makeRenderer([note('one')], { staticPage: true }).md.render('```audio\nhttps://media.example.com/reflection.ogg\n```'), withoutCaption)
})

test('media fences reject unsafe or unsupported sources without enabling raw HTML', () => {
  const { md } = makeRenderer([note('one')])
  for (const url of ['javascript:alert(1)', 'data:video/mp4;base64,AAAA', 'http://media.example.com/demo.mp4', 'https://user:password@media.example.com/demo.mp4', 'https://localhost/demo.mp4', 'https://127.0.0.1/demo.mp4', 'https://192.168.1.4/demo.mp4', 'https://media.example.com/watch?id=1', 'https://media.example.com/demo.html', 'https://media.example.com/demo.mp4?x=" onerror="alert(1)']) {
    assert.throws(() => md.render(`\`\`\`video\n${url}\n\`\`\``), /video block:/)
  }
  assert.throws(() => md.render('```audio\nhttps://media.example.com/demo.webm\n```'), /audio block:/)
  assert.throws(() => md.render('```video\nhttps://media.example.com/demo.mp4\nCaption\nUnexpected extra line\n```'), /one-line caption/)
  const raw = md.render('<video src="https://media.example.com/demo.mp4" autoplay></video>')
  assert.match(raw, /&lt;video/)
  assert.doesNotMatch(raw, /<video/)
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
