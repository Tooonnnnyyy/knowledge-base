# Knowledge Base content workflow

This repository is the public source of truth for the Knowledge Base. A small
change to `content/posts/` can become a new graph node, a new relationship and
a new article page after GitHub Actions finishes.

The public repository is not a private draft space. Review every sentence and
every uploaded asset before committing it. Never publish personal identifiers,
private vault exports, credentials, raw logs, account screenshots, course
identifiers or anything that should stay private.

## The five-minute writing flow

### 1. Start from GitHub

On a phone or computer:

1. Open the repository and go to `content/posts/`.
2. Choose **Add file → Create new file** for a new note, or open an existing
   `.md` file and choose the pencil **Edit** button.
3. Use a stable English filename in kebab case, such as
   `a-question-about-learning.md`.

For a longer draft, write it in Obsidian or a local editor first, then paste
the reviewed version into GitHub. GitHub's mobile editor is best for short
notes and small corrections.

### 2. Copy the note shape

Start with [`content/new-note.template`](../content/new-note.template):

```yaml
---
title: A clear title for one idea
date: 2026-10-10
type: note
public: true
tags: [Thinking]
summary: One sentence explaining what the reader will learn.
links: []
---
```

Then write:

```md
## English

The English version comes first.

## 中文

If the source is Chinese, put the edited Chinese version here after the full
English version. Remove this section when it is not needed.
```

The build checks that every published note has a title, summary, date, at
least one topic tag and an English section. `public: true` is a publication
checklist, not privacy protection; a file committed to this public repository
can still be read even when `public` is false.

### 3. Connect the idea

Use an existing topic from [`content/topics.json`](../content/topics.json)
whenever it fits. A tag becomes a topic node in the graph. Add a new topic
only when several notes will genuinely use it; define its parent and
description in `topics.json` at the same time.

Create a relationship only when the article explains a real connection:

```md
This extends [[model-evaluation|model evaluation]] and contrasts with
[[synthetic-data|synthetic data]].
```

You can also use frontmatter:

```yaml
links: [model-evaluation, synthetic-data]
```

The build creates backlinks automatically. It does not connect every pair of
notes merely because they share a tag.

### 4. Add media safely

Small images can live in the repository under `public/media/`. Create the
folder with **Add file → Create new file**, type `public/media/.gitkeep`, and
then use **Add file → Upload files** to upload the image. Keep filenames in
kebab case and avoid names that contain personal information.

Reference an image with the stable GitHub Pages URL:

```md
![A short accessible caption](https://tooonnnnyyy.github.io/knowledge-base/media/example-image.jpg)
```

Use a descriptive alt text. The image is copied into the generated site by
Vite; it is not a graph node unless the article itself is published.

For audio and video, prefer a stable public URL from a service that is meant
for embedding. A normal link is the safest first version:

```md
[Listen to the audio note](https://example.com/audio-note)

[Watch the demonstration](https://example.com/video)
```

Before relying on an inline player, open the built article and verify it on
desktop and mobile. Do not upload large media files, copyrighted material,
private recordings or raw screen captures containing accounts or messages.

### 5. Review and commit

Before pressing **Commit changes**:

- Read the English version once as a visitor.
- Confirm Chinese follows the complete English version when present.
- Check that every `[[wikilink]]` target exists.
- Check that tags are intentional and that no private information appears in
  the body, filename, image, alt text or URL.
- Keep one focused article change per commit when possible.

Use an imperative commit message such as `Add note about model evaluation`.
Commit directly to `main` for this personal site.

## What happens after commit

The workflow in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
will:

1. install the locked dependencies;
2. validate content and privacy rules;
3. rebuild article JSON, static article pages, graph nodes, backlinks, RSS and
   sitemap;
4. run the browser checks; and
5. deploy the `dist/` output to GitHub Pages.

Open the **Actions** tab and wait for both `build` and `deploy` to turn green.
Then open the live site and verify the new title in search, click its node,
check its connections and open every new media link. Deployment is usually a
few minutes, but the green workflow is the evidence to trust rather than a
local preview.

## Fixing or rolling back a mistake

For a typo, edit the same Markdown file and commit again. Keep its filename and
slug stable so saved node positions and links continue to work.

For a bad publication or broken asset:

1. open the offending commit on GitHub;
2. choose **Revert**;
3. wait for the new Actions run to deploy; and
4. verify the live page again.

Do not force-push or hand-edit generated files under `dist/` or `public/`.

## Optional local checks

For content-only changes, GitHub Actions is the normal check. If you have the
repository locally, run:

```sh
npm ci --no-audit --no-fund
npm test
npm run build
```

Run `npm run test:browser` as well when changing interaction code, rendering
rules or media behavior. Generated output is disposable; edit the Markdown,
topic configuration or source code instead.

## Quick checklist

```text
Write English → add Chinese if needed → choose existing tags
→ add only meaningful links → review privacy → commit to main
→ wait for Actions → check the live node, article and media
```
