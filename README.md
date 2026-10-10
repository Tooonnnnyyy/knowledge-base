# Tony's Knowledge Garden

An English-first public notebook with Chinese translations after the English text. Every published note becomes a graph node; topic membership and explicit note links create visible connections.

## Content workflow

1. Add or edit a Markdown file in `content/posts/`.
2. Use the frontmatter fields `title`, `date`, `type`, `tags`, `summary`, and optional `links`.
3. Run `npm run build` locally, or commit to `main` and let GitHub Actions build and deploy GitHub Pages.

The public repository contains only intentionally public, redacted writing. Do not add Vault exports, private notes, credentials, contact details, or sensitive attachments.

## Local commands

```bash
npm install --no-audit --no-fund
npm run build
npm run dev
```

The graph data is generated from Markdown during the build. The browser UI is a static Vite site; no database or login is required for readers.
