# AGENTS.md — Hoodini Docs

> Context file for AI coding agents (Copilot, Cursor, Claude, etc.)

## Setup Commands

```bash
# Install dependencies
npm install

# Start development server (syncs docs automatically)
npm run dev

# Build for production
npm run build

# Sync docs from sibling repos manually
npm run sync
```

## Project Overview

**Hoodini Docs** is the centralized documentation site for the Hoodini Suite built with Nextra 4 and Next.js 15 App Router.

- **Framework:** Next.js 15 with App Router
- **Documentation:** Nextra 4.2
- **Styling:** Tailwind CSS 4
- **Deployment:** GitHub Pages (static export)

## Architecture

```
hoodini-docs/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with Nextra theme
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── config.ts               # basePath configuration
│   ├── demo/                   # Interactive demo pages
│   │   ├── kongmin/            # Kongmin defense system demo
│   │   ├── basel/              # BASEL demo
│   │   ├── cas9/               # Cas9 demo
│   │   ├── aca5/               # Aca5 demo
│   │   ├── typeIV/             # Type IV CRISPR demo
│   │   └── typeVI/             # Type VI Retrons demo
│   ├── gallery/                # Gallery page
│   │   └── page.tsx            # Gallery with all examples
│   ├── docs/                   # Nextra docs route
│   │   └── [[...mdxPath]]/     # MDX catch-all
│   └── components/             # React components
│       └── HoodiniDemo.tsx     # Visualization component
├── content/                    # MDX content (served under /docs)
│   ├── _meta.json              # Root navigation
│   ├── hoodini/                # Hoodini CLI docs
│   ├── hoodini-viz/            # Hoodini Viz docs
│   └── hoodini-colab/          # Hoodini Colab docs
├── public/
│   ├── data/                   # Demo parquet data
│   │   ├── kongmin/            # Kongmin dataset
│   │   ├── basel/              # BASEL dataset
│   │   ├── cas9/               # Cas9 dataset
│   │   ├── aca5/               # Aca5 dataset
│   │   ├── typeIV/             # Type IV dataset
│   │   └── typeVI/             # Type VI dataset
│   └── images/                 # Documentation images
├── scripts/
│   └── sync-docs.js            # Syncs docs from sibling repos
└── .github/workflows/
    └── deploy.yml              # GitHub Pages deployment
```

## Key Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, navbar, footer, pageMap filtering |
| `app/page.tsx` | Landing page with hero, features, CTAs |
| `app/config.ts` | basePath export for GitHub Pages |
| `app/gallery/page.tsx` | Gallery with real-world examples |
| `app/components/HoodiniDemo.tsx` | Wraps hoodini-viz for demos |
| `mdx-components.tsx` | MDX component exports for Nextra |
| `content/_meta.json` | Sidebar navigation structure |
| `scripts/sync-docs.js` | Pulls docs from hoodini, hoodini-viz, hoodini-colab |

## basePath Configuration

For GitHub Pages deployment, all paths must include the basePath:

```tsx
// app/config.ts
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

// Usage in components
import { basePath } from '../config'
<img src={`${basePath}/images/logo.svg`} />
<a href={`${basePath}/gallery`}>Gallery</a>
```

> ⚠️ **Important:** `<Link>` from Next.js handles basePath automatically, but `<a>` and `src` attributes need manual interpolation.

## Doc Syncing

Documentation is synced from sibling repositories:

```
software/
├── hoodini/           # docs/ → content/hoodini/
├── hoodini-viz/       # docs/ → content/hoodini-viz/
├── hoodini-colab/     # docs/ → content/hoodini-colab/
└── hoodini-docs/      # This repo
```

The sync script (`scripts/sync-docs.js`) runs automatically on `npm run dev`.

## Demo Pages

Each demo page in `app/demo/{name}/` loads parquet data from `public/data/{name}/`:

```tsx
const DATA_PATHS = {
  newick: `${basePath}/data/{name}/tree.nwk`,
  gffParquet: `${basePath}/data/{name}/parquet/gff.parquet`,
  hoodsParquet: `${basePath}/data/{name}/parquet/hoods.parquet`,
  // ... more parquet files
}
```

Demo pages are filtered from the sidebar (see `filterPageMap` in `layout.tsx`) but remain accessible via direct URL and Gallery links.

## Navigation Structure

Sidebar navigation is controlled by `_meta.json` files in `content/`:

```json
// content/_meta.json
{
  "index": "Home",
  "hoodini": "Hoodini",
  "hoodini-colab": "Hoodini Colab",
  "hoodini-viz": "Hoodini Viz"
}
```

## Styling

- **Tailwind 4** with CSS variables for theming
- **Space Grotesk** font
- **Dark mode** supported via Nextra theme
- Custom styles in `app/globals.css`

## Deployment

GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages:

1. Syncs docs from sibling repos
2. Builds static export (`npm run build`)
3. Deploys to `gh-pages` branch

## Development Priorities

1. **Gallery:** Add more real-world examples from publications
2. **API docs:** Auto-generate from TypeScript/Python source
3. **Playground:** Interactive hoodini-viz component builder
4. **Search:** Implement Algolia or local search
5. **i18n:** Multi-language support

## Common Tasks

### Add a new demo

1. Copy data to `public/data/{name}/` (parquet folder + tree.nwk)
2. Create `app/demo/{name}/page.tsx` following existing pattern
3. Add entry to `galleryItems` in `app/gallery/page.tsx`

### Update navigation

Edit `content/_meta.json` or `content/{section}/_meta.json`

### Fix broken links

Check that:
- `<Link>` components use relative paths (basePath handled automatically)
- `<a>` tags and `src` attributes use `${basePath}` interpolation
