# Knowledge Base memory

This file records the product decisions confirmed for the first public version and the maintenance rules that should survive future sessions. It is repository documentation, not a copy of any private source or chat transcript.

## Confirmed product direction

- **Current live version frozen:** the owner asked to preserve the deployed site at `6170201` after the theme-guide release. Further changes are allowed only as review work until deployment is explicitly resumed. All work stays in `Tooonnnnyyy/knowledge-base`; never publish review changes automatically. The separate `tony-knowledge-garden` repository is obsolete. See [repository map](docs/REPOSITORIES.md).

- The repository is named **Knowledge Base**. Preserve the approved graph-first interface through the 3D extension below; do not add a visible “Knowledge Base” heading, hero, landing page, slogan, footer, or extra navigation.
- The domain opens directly to the full-screen interactive graph. The only primary navigation links are the existing portfolio link and LinkedIn icon.
- The graph is the homepage: every article and topic is a real accessible node. Clicking opens the reading panel; topics open their hierarchy and notes.
- Preserve the current warm gray, ink, blue, fine-border, restrained-texture visual language and the current responsive behavior.

## Interaction contract

- Keep node click and keyboard activation, node dragging, empty-space navigation, wheel/touch zoom, fit and reset layout controls, search, URL history, topic filtering, hierarchy breadcrumbs, backlinks, related notes, and reading themes.
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

The owner-facing bilingual quick entry is [docs/MAINTENANCE_GUIDE.md](docs/MAINTENANCE_GUIDE.md). GitHub access uses [docs/GITHUB_ACCESS_SOP.md](docs/GITHUB_ACCESS_SOP.md): reuse the saved login, diagnose within two minutes, distinguish network from authentication failure, and stop identical blocked retries. The user explicitly wants this behavior across maintenance sessions.

## Repository structure

- `src/graph.js`: graph layout, drawing, coordinates, camera, and gestures.
- `src/graph-3d.js`: optional WebGL renderer with orbit, pan, zoom, accessible HTML node labels and independent saved positions.
- `src/edge-motion.js`: transmission speed, direction, fade and category tint shared by both renderers.
- `src/main.js`: search, selection, URL history, and reading panel.
- `src/styles.css`: visual tokens and responsive layout.
- `scripts/build-content.mjs`: validation and generated public content.
- `scripts/export-review.mjs`: self-contained local review export. Keep it as a classic script so Chrome can open `preview.html` from `file://`.
- `public/data.json`, `public/articles/`, `public/notes/`, `public/katex/`, RSS, and sitemap are generated output and should not be hand-edited.

## Privacy and maintenance guardrails

- Review every new note for sensitive data before committing. Automated privacy checks are a backstop, not a substitute for human review.
- Do not add credentials, tokens, webhooks, private MCP configuration, raw vault exports, or private audit files.
- Keep this memory file current when a product contract, content boundary, deployment path, or interaction behavior is explicitly changed. Record the decision and date without adding private source material.

## Approved immersive extension — 2026-10-12

- First-time visitors start in **3D and Dark**; saved preferences take precedence. Keep a one-click **2D/3D** switch in the existing bottom-right toolbar. WebGL initialization failure or context loss falls back to 2D.
- Keep the graph as the immediate entry view. Preserve the bottom-right controls. The bottom-left index is an icon; its tooltip and accessible label retain note/topic counts.
- Every visible connection receives the same restrained traveling pulse in either mode: consistent speed, short tapered tail, soft endpoint fade and category tint. No bloom, decorative lightning, arbitrary flashing or unrelated visual effects. Reduced-motion stops autonomous animation.
- Topic color is defined in `content/topics.json`. Root families use distinct hues; children use related shades; an article inherits its primary tag. Keep hierarchy and labels meaningful without relying only on color.
- Three reading themes: **Dark**, **Light**, **Paper**. Paper uses a warm beige background, brown ink and a comfortable serif body in full-page reading; it is a palette/readability treatment, not a new homepage design.
- On **every page load**, show a small English guide above the bottom-right theme button, with an arrow pointing at that button and the Dark / Light / Paper choices. Keep it in the current theme, without a backdrop or forced focus. Clicking the theme button, close icon, Escape, opening a note/index or graph help dismisses it for that page visit. Do not save a permanent dismissed state; returning/reloading should show it again. The visitor's saved theme remains unchanged until they explicitly switch it.
- An article/topic can expand from the side panel to a full-page reader and restore via its toolbar or Escape. Preserve the article DOM, media playback and reading passage when expanding/restoring. Pause media when closing or changing the article.
- Safe fenced `video` and `audio` blocks support direct public HTTPS media files; normal Markdown images continue to work. The reader gives media a wider column than body text. Raw HTML remains disabled.
- **Desktop browser usability is the current priority. Dedicated mobile layout, gesture and performance polish is deferred** and must remain in the maintenance backlog. Existing mobile fallback behavior is retained, not newly certified.
- Technology choices prioritize delivery efficiency and low maintenance. Tailwind CSS or higher-level frameworks are welcome when they save work; they are not a mandatory migration. Continue the existing JavaScript, Three.js and shared CSS tokens for this extension instead of rebuilding the site solely to change frameworks.
- This round changes presentation and media support, not the approved article corpus. Do not bulk-import a private vault or expose its source mapping.

### Release and recovery boundary

The owner accepted the offline 3D preview and authorized publishing. The immersive release `2c4edc5` was pushed to `main` and its [Pages run](https://github.com/Tooonnnnyyy/knowledge-base/actions/runs/38336528965) completed successfully on 2026-10-12; the live 75-node graph, themes and full reader were checked in Chrome. Later changes use the same verified workflow. The pre-3D revision is `e314dca22b96b651af7d2696a5faf5f766394087`, tagged `baseline-2d-e314dca` locally and on GitHub. The renderers keep separate layout storage, so switching back to 2D preserves the old arrangement. See [docs/IMMERSIVE_REVIEW.md](docs/IMMERSIVE_REVIEW.md) for recovery instructions.
