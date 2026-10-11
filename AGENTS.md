# Connected notes: ongoing editorial and development rules

## Product contract

- The domain opens directly into the full-screen interactive graph. Do not add a homepage title, hero, slogan, introduction, marketing section or footer.
- Every node is a readable article or a real topic. Topics open the hierarchy and their notes; articles open English-first reading content with original-language text afterwards when applicable.
- Keep navigation to the portfolio link and LinkedIn icon. Other social/contact links require a user request.
- Maintain the portfolio's warm gray, ink, blue, Inter/monospace, fine borders and restrained dot texture. Support light and dark reading.
- Graph nodes are real buttons. Preserve drag, pan, pinch/wheel zoom, keyboard access, readable hit targets, selection/neighborhood highlighting and saved layouts.

## Long-term content curation

1. Read the supplied source. Extract the idea faithfully; preserve its assumptions, useful examples, equations and uncertainty. Do not invent implementation evidence.
2. Never copy a whole private vault into this public repository. Review and rewrite public-safe knowledge, excluding identity/background, assignments with identifiers, personal records, raw logs, credentials, local paths and private project context. Keep any source-to-article audit outside this repository.
3. English comes first. For a Chinese source, place the edited Chinese version immediately after the full English article. Use proper headings, lists, tables, code and math; no unprocessed exports or raw Mermaid blocks.
4. Reuse an existing article if the idea is the same. Maintain stable slugs so links and saved graph positions survive edits. A glossary and a distinct applied article may coexist when they serve different reading needs.
5. Choose from `content/topics.json` first. Prefer a small number of root subjects. Introduce a subtopic when repeated content warrants it, add its parent/description, and update the relevant articles together. Avoid synonyms that split one concept across tags.
6. Preserve meaningful source links using public slugs. Add links to related existing concepts where the text supports the relationship. Do not invent all-pairs connections based on a shared tag.
7. Set `public: true` only on reviewed public writing. This does not make a draft private in GitHub; never commit private drafts.
8. Each commit rebuilds topics, backlinks, graph data, static article pages, RSS and sitemap through GitHub Actions. Local private source changes are not published automatically.

## Architecture and checks

- `content/posts/*.md`: curated source of truth, edited in GitHub on desktop or phone.
- `content/topics.json`: small topic hierarchy.
- `scripts/build-content.mjs`: validation, Markdown/KaTeX, explicit links, backlinks, derived graph and static articles.
- `src/graph.js`: renderer, layout and gestures. `src/main.js`: UI state, URL selection and lazy article loading. `src/styles.css`: visual rules.
- Generated output is ignored; do not edit it by hand.
- Run `npm test`, `npm run build`, and `npm run test:browser` before publishing interaction changes. Browser tests use a separate profile. Distinguish passed checks from blocked/unrun checks.
- Verify deployment and the live site before claiming it is updated. If browser or hosting access fails, create a local review using `node scripts/export-review.mjs`, report the blocker precisely and do not claim visual approval.
