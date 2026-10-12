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

The topic's `color` supplies its graph and reading-panel color in both 2D and
3D. Give root subjects distinct hues and subtopics a related shade of their
parent; notes inherit their first tag's color. No manual graph editing is needed.

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

For an inline video player, paste this block into the article. The first line
is a **direct HTTPS file URL**; the optional second line is a plain-text caption.
The player works in both the graph reader and the full article page:

````md
```video
https://media.example.com/my-demo.mp4
A short demonstration of the idea.
```
````

For an inline audio player:

````md
```audio
https://media.example.com/my-reflection.mp3
A three-minute reflection, with the transcript below.
```
````

Replace the example URL with your real public media file. Supported formats:

- Video: `.mp4`, `.webm`, `.ogg`. MP4 with H.264/AAC is usually the simplest
  choice across phones and desktop browsers.
- Audio: `.mp3`, `.m4a`, `.wav`, `.ogg`. MP3 is the simplest general choice.

Use a stable public hosting URL that does not require signing in. Query strings
are allowed, but avoid private credentials or temporary access tokens. Media
controls are shown; nothing autoplays. Add a transcript or written description
below the player, especially when speech or visual details are essential.
Captions are plain text, so put any Markdown links below the block.

For a very small owned clip, you can upload it to `public/media/` in the same
way as an image and use its Pages URL. Host larger recordings on a media service
to keep this repository quick to clone and maintain. A YouTube/Vimeo watch-page
URL is not a direct media file; keep it as a normal link:

```md
[Listen to the audio note](https://example.com/audio-note)

[Watch the demonstration](https://example.com/video)
```

After deployment, open the article, press Play and check the image or player on
your phone. A file extension alone cannot guarantee that the host allows playback
or that the video codec works in every browser. Invalid media blocks stop the
build with a message naming the required URL format. Raw HTML and iframe embeds
remain disabled; use the two fenced blocks above.

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

For the 3D extension, the graph toolbar has an instant 2D switch. The complete
pre-3D baseline and safe code recovery steps are recorded in
[IMMERSIVE_REVIEW.md](IMMERSIVE_REVIEW.md). Switching the renderer does not
change your posts, and writing/publishing follows the same workflow in both modes.

For a typo, edit the same Markdown file and commit again. Keep its filename and
slug stable so saved node positions and links continue to work.

For a bad edit, the simplest browser-only recovery is:

1. Open the affected file on GitHub, then choose **History**.
2. Open a known-good revision and copy that file's earlier content.
3. Return to the current file on `main`, choose **Edit**, paste the restored
   content and commit. For a newly added article, delete its file and remove
   any links to its slug in the same change.
4. Wait for Actions to deploy, then verify the live page again.

GitHub does not provide a **Revert** button for every arbitrary commit. To undo
one whole commit locally, run `git revert COMMIT_SHA`, resolve any conflicts,
run the checks, then `git push`. This creates a normal new commit; do not
force-push. Ask for help if that commit also contains changes you want to keep.

Authored assets under `public/media/` are yours to upload or replace. Generated
files are different: do not hand-edit `dist/`, `public/data.json`,
`public/articles/`, `public/notes/`, `public/katex/`, `public/feed.xml` or
`public/sitemap.xml`. Edit the source article or topic and let the build rebuild
those outputs.

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
