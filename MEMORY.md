# Knowledge Base memory

This file records the product decisions confirmed for the first public version and the maintenance rules that should survive future sessions. It is repository documentation, not a copy of any private source or chat transcript.

## Confirmed product direction

- The repository is named **Knowledge Base**. The current webpage stays visually and editorially as approved; do not add a visible “Knowledge Base” heading, hero, landing page, slogan, footer, or extra navigation.
- The domain opens directly to the full-screen interactive graph. The only primary navigation links are the existing portfolio link and LinkedIn icon.
- The graph is the homepage: every article and topic is a real accessible node. Clicking opens the reading panel; topics open their hierarchy and notes.
- Preserve the current warm gray, ink, blue, fine-border, restrained-texture visual language and the current responsive behavior.

## Interaction contract

- Keep node click and keyboard activation, node dragging, empty-space pan, wheel/touch zoom, fit and reset layout controls, search, URL history, topic filtering, hierarchy breadcrumbs, backlinks, related notes, and light/dark reading states.
- Dragged positions are saved on the visitor’s device. A mobile selection opens as a readable bottom sheet. Static article pages remain available as a fallback.
- Do not replace the graph with a static list. A list/index may remain an auxiliary way to browse the same nodes.

## Content contract

- `content/posts/*.md` is the public editorial source of truth. `content/topics.json` owns the small topic hierarchy.
- The first reviewed corpus contains 63 public-safe articles, 12 topics, 75 nodes, and 393 relationships. English comes first; when a source has Chinese content, the edited Chinese version follows the complete English version under `## 中文`.
- Public writing must be readable, structured Markdown with headings, lists, tables, code, and math where useful. Preserve assumptions, examples, equations, uncertainty, and meaningful explicit links.
- Use stable slugs. Reuse an existing article when the idea is the same. Add a topic only when repeated content justifies it, and define its parent in `topics.json`.
- Only reviewed public-safe writing belongs here. Exclude identity/background details, course or assignment identifiers, personal records, raw logs, credentials, local file paths, private project context, source snapshots, and the private source-to-article audit.
- `public: true` is a publication decision, not access control. Never commit a private draft to this public repository.

## Editing and publishing workflow

1. Add or edit one Markdown file in `content/posts/` from GitHub on desktop or phone.
2. Keep English first, add Chinese immediately after it when applicable, and use explicit `links` or wikilinks for meaningful relationships.
3. Run `npm test`, `npm run build`, and `npm run test:browser` before publishing interaction or content-pipeline changes.
4. Commit to `main`. GitHub Actions validates content, rebuilds graph data, article pages, RSS, and sitemap, then deploys GitHub Pages.
5. Verify the workflow and the live Pages URL before describing the change as published. A local preview is only a review artifact.

The step-by-step phone, media and rollback guide is [docs/CONTENT_WORKFLOW.md](docs/CONTENT_WORKFLOW.md). Small images may be uploaded under `public/media/`; use stable Pages URLs in Markdown. Keep audio/video links public and lightweight, and review every media file for privacy before committing.

## Repository structure

- `src/graph.js`: graph layout, drawing, coordinates, camera, and gestures.
- `src/main.js`: search, selection, URL history, and reading panel.
- `src/styles.css`: visual tokens and responsive layout.
- `scripts/build-content.mjs`: validation and generated public content.
- `scripts/export-review.mjs`: self-contained local review export. Keep it as a classic script so Chrome can open `preview.html` from `file://`.
- `public/data.json`, `public/articles/`, `public/notes/`, `public/katex/`, RSS, and sitemap are generated output and should not be hand-edited.

## Privacy and maintenance guardrails

- Review every new note for sensitive data before committing. Automated privacy checks are a backstop, not a substitute for human review.
- Do not add credentials, tokens, webhooks, private MCP configuration, raw vault exports, or private audit files.
- Keep this memory file current when a product contract, content boundary, deployment path, or interaction behavior is explicitly changed. Record the decision and date without adding private source material.
