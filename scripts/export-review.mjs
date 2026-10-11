import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Export an offline copy for direct review when hosting or browser control is unavailable.
// This file contains only the same reviewed public content as the website.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const destination = path.resolve(process.argv[2] || path.join(root, '../tony-knowledge-garden-review/preview.html'))
const dist = path.join(root, 'dist')
const assets = fs.readdirSync(path.join(dist, 'assets'))
const script = fs.readFileSync(path.join(dist, 'assets', assets.find((name) => name.endsWith('.js'))), 'utf8')
// The bundled stylesheet contains a minified Google Fonts import. Match the
// complete import statement so the query string's semicolons are not treated
// as CSS statement boundaries.
const style = fs.readFileSync(path.join(dist, 'assets', assets.find((name) => name.endsWith('.css'))), 'utf8')
  .replace(/@import\s*(?:url\([^)]*\)|["'][^"']*["'])\s*;?/g, '')
const mathStyle = fs.readFileSync(path.join(dist, 'katex/katex.min.css'), 'utf8').replace(/url\(([^)]+)\)/g, (_, file) => {
  const font = fs.readFileSync(path.join(dist, 'katex', file.replace(/["']/g, '')))
  const type = file.includes('woff2') ? 'font/woff2' : file.includes('woff') ? 'font/woff' : 'font/ttf'
  return `url(data:${type};base64,${font.toString('base64')})`
})
const data = JSON.parse(fs.readFileSync(path.join(dist, 'data.json'), 'utf8'))
const responses = { 'data.json': data }
for (const post of data.posts) responses[post.contentUrl] = JSON.parse(fs.readFileSync(path.join(dist, post.contentUrl), 'utf8'))
const payload = JSON.stringify(responses).replace(/</g, '\\u003c')
const bootstrap = `const offlineContent=${payload};const originalFetch=window.fetch.bind(window);window.fetch=(url,options)=>{const key=String(url).replace(/^\.\\//,'');return key in offlineContent?Promise.resolve(new Response(JSON.stringify(offlineContent[key]),{status:200,headers:{'Content-Type':'application/json'}})):originalFetch(url,options)};`
// Vite emits this entry as a self-contained IIFE. A classic script is
// intentionally used here because Chrome restricts module execution from a
// local file origin, which previously left the review page blank.
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Connected notes — local review</title><style>${style}\n${mathStyle}</style></head><body><div id="app"></div><script>${bootstrap}</script><script>${script.replace(/<\/script/gi, '<\\/script')}</script></body></html>`
fs.mkdirSync(path.dirname(destination), { recursive: true })
fs.writeFileSync(destination, html)
console.log(`Offline review exported: ${destination} (${data.posts.length} articles, ${data.nodes.length} nodes)`)
