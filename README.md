# Knowledge Base

[Open the graph](https://tooonnnnyyy.github.io/knowledge-base/)

This is the canonical repository. The current live version is frozen at
`6170201`; new work is saved on review branches until deployment is explicitly
resumed. See the [repository map and publishing boundary](docs/REPOSITORIES.md) and the [cross-project privacy SOP](docs/CROSS_PROJECT_PRIVACY_SOP.md).

The homepage is a full-screen network of articles and topics. Click to read, drag a node to move it, and scroll or pinch to zoom. In 3D, drag the background to orbit and Shift-drag to pan; in 2D, drag the background to pan. The toolbar switches between 3D/2D and Dark/Light/Paper themes. Articles can expand into full-page reading. Dragged positions stay on the visitor's device. The graph has keyboard controls and a searchable article index; individual articles also have plain HTML pages.

## Write from a phone or computer

Use the [bilingual maintenance guide](docs/MAINTENANCE_GUIDE.md) as the fastest repeatable workflow. The longer phone, desktop, media and rollback explanation is in [the content workflow guide](docs/CONTENT_WORKFLOW.md).

1. In GitHub, open `content/posts/` and choose **Add file → Create new file**. Or open an existing article and choose **Edit**.
2. Use a stable English filename, such as `a-question-about-learning.md`, and copy the small header from [the note template](content/new-note.template).
3. Write the English article first. If the original is Chinese, put the edited Chinese text immediately afterwards under `## 中文`.
4. Set one or more `tags`. Use `[[another-note-slug|readable label]]` or the `links` list to make an explicit connection.
5. Run the [privacy gate](docs/CROSS_PROJECT_PRIVACY_SOP.md). While the live version is frozen, commit to the canonical review branch; after deployment is explicitly resumed, commit to `main`. GitHub Actions then checks the content, rebuilds the graph and deploys Pages. Confirm the workflow is green before calling it published.

For small images, upload files to `public/media/` and reference them with the stable Pages URL, for example `https://tooonnnnyyy.github.io/knowledge-base/media/example-image.jpg`. For audio and video, prefer a stable public link and check it after deployment. Never publish private recordings, credentials, personal information or raw vault exports.

The repository is public. Only put writing you intend to publish here. Keep private drafts, original source snapshots and credentials outside it. The `public: true` field is a publication checklist, not encryption: even unpublished files committed to a public repository remain visible.

## How the network grows

- Each reviewed, published Markdown file becomes one article node.
- Topic tags become topic nodes. [topics.json](content/topics.json) defines the parent/child hierarchy and descriptions. A new tag works immediately; add it there when it needs a parent or description.
- An explicit wikilink produces a visible connection and a backlink at the destination. Reciprocal links draw only one line.
- Child-topic membership also counts toward the parent. The graph avoids redundant parent edges and does not invent an article-to-article relationship merely because two articles share a tag.
- The build generates article HTML, per-article JSON, search text, RSS and a sitemap. Article bodies load only when opened.
- Content editing, translations and taxonomy decisions remain editorial work. The pipeline updates the graph on every commit; it does not silently publish changes from a private source or pretend to perform ongoing AI curation.

The initial collection was adapted from a locally reviewed knowledge vault. Public articles preserve reusable concepts, worked examples and relevant links. Personal context, raw logs, credentials, private project records and sensitive provenance are excluded. A private source-to-article audit is deliberately kept outside the repository.

## Development

```sh
npm ci
npm test
npm run build
npm run dev
```

`src/graph.js` owns layout, coordinates, camera, drawing and gestures. `src/main.js` owns search, selection, URL history and the reading panel. `scripts/build-content.mjs` validates and compiles curated source files. Generated files under `public/articles`, `public/notes`, `public/katex` and `public/data.json` are not hand-edited or committed.

Build failures identify unresolved links, invalid metadata, missing language sections or recognizable private data. Automated scanning is a backstop; review the prose before committing. GitHub Pages serves the output of the tested build rather than a local preview.
