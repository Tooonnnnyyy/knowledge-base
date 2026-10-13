# Immersive graph review and recovery

## Scope

The existing graph-first Knowledge Base gains 3D orbit/pan/zoom, every-edge
transmission, related category colors, Dark/Light/Paper themes and full-page
article reading. The content remains 63 reviewed articles, 12 topics, 75 nodes
and 393 relationships. Search, backlinks, filtering, index and navigation remain.

Desktop is the priority. Dedicated mobile adaptation and device performance
testing are explicitly deferred. No additional private vault material is imported.

## Controls to review

| Control | Expected behavior |
| --- | --- |
| Drag empty space in 3D | Orbit the graph |
| Shift + drag, middle drag, right drag | Pan the camera |
| Wheel/pinch or zoom icons | Change distance |
| Drag a node | Move it and retain its new position on this device |
| Click a node / Tab then Enter | Open the article or topic |
| Cube/plane icon | Switch 3D/2D without losing the open article |
| Moon/sun/paper icon | Cycle Dark → Light → Paper; remember choice |
| Expand icon in reading toolbar | Full-page reading with a wider media column |
| Restore icon / Escape in full reading | Restore the sidebar at the same passage |
| Index icon, bottom-left | Browse all notes and topics; counts in tooltip |

The graph pauses under full-page reading and in a hidden tab. With operating
system reduced-motion enabled, the connections stay static and navigation works.

## Validation boundary — 2026-10-12

- Source review repaired depth picking, material dimming/depth writes, label
  collision measurements, semantic zoom and media continuing after close.
- `npm test`: **22/22 passed**. `npm run build`: **passed**. Syntax checks and
  `git diff --check`: **passed**. Three.js increases the entry bundle to about
  594 kB minified / 154 kB gzip; this is a build warning, not a failed build.
- Node tests cover content/privacy, fenced media, 2D gestures, 3D CPU geometry
  and shared edge-motion rules. These do not establish WebGL rendering quality.
- Playwright against installed macOS Chrome completed the full suite:
  **14/14 passed**. It exercised every 2D and 3D node, 3D orbit/pan/zoom,
  node dragging and saved layout, mode switching, WebGL initialization and
  context-loss fallback, all three themes, reduced-motion behavior, and
  full-page reading with DOM, hash, focus and scroll-anchor preservation.
- The final browser run had no unexpected console or local-resource errors.
  The deliberate WebGL failure emits only the expected Three.js diagnostic;
  the missing favicon request was fixed with `public/favicon.svg`.
- Production build, offline export and the installed-Chrome suite are local
  evidence. GitHub Actions and the live Pages URL remain separate deployment
  checks until the release commit is pushed and its matching workflow succeeds.
- The offline review contains all 63 articles and 75 nodes. Both embedded
  classic scripts parse, and all article bodies load from the embedded data
  without a network call in a Node VM check. It has not been rendered in Chrome.

For a future release, rerun `npm run test:browser`, inspect desktop screenshots
for all three themes, test actual owned media playback and expand/restore, and
verify the matching GitHub Actions run plus live Pages content. Do not skip 3D
assertions merely because a runner silently fell back to 2D; verify WebGL
support first.

## Quick 2D fallback

Use the cube/plane toolbar icon to switch to 2D. The choice is remembered on this
device; switching back restores 3D. Article content and selection stay in place.
The original 2D layout storage key is retained, and 3D saves under a separate key.
An unavailable/lost WebGL context also triggers 2D automatically.

## Full version recovery

The untouched pre-3D baseline is:

```text
e314dca22b96b651af7d2696a5faf5f766394087
local tag: baseline-2d-e314dca
feature branch: feat/immersive-graph
publishing remote: knowledge-base
```

Before merge, production remains on the approved version. Keep the feature
branch separate while reviewing. To inspect the old source without discarding
new work, create a separate worktree:

```sh
git worktree add ../knowledge-base-2d-baseline baseline-2d-e314dca
```

After release, prefer `git revert FEATURE_COMMIT_SHA` for a single feature
commit, or `git revert -m 1 MERGE_COMMIT_SHA` for its merge commit. Check which
commit introduced the feature before reverting; do not reset or force-push.
Run `npm test`, `npm run build`, `npm run test:browser`, then push the recovery
commit to the **knowledge-base** remote and verify Actions plus the live page.
Preserve later article changes when restoring presentation code.

## Maintenance backlog

- Complete desktop browser and visual acceptance before release.
- Test actual owned video/audio with pause, seek, expand, restore and close.
- Then adapt mobile controls, portrait/landscape reading and touch gestures.
- Measure rendering performance on ordinary desktop and mobile GPUs with a
  growing corpus; retain 2D as a permanent supported option.

Writing, media upload and commit-to-Pages steps are in
[CONTENT_WORKFLOW.md](CONTENT_WORKFLOW.md).
