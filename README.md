# Hoodini Suite Documentation

Centralized documentation site for the Hoodini Suite, built with [Nextra 4](https://nextra.site/) and Next.js 15 App Router.

## 🌐 Live Site

Visit the documentation at: **https://pentamorfico.github.io/hoodini-docs/**

## 📚 Projects Documented

| Project | Description | Repository |
|---------|-------------|------------|
| **Hoodini CLI** | Python CLI for gene neighborhood analysis | [hoodini](https://github.com/pentamorfico/hoodini) |
| **Hoodini Viz** | TypeScript/React visualization library | [hoodini-viz](https://github.com/pentamorfico/hoodini-viz) |
| **Hoodini Colab** | Interactive Jupyter widget for Google Colab | [hoodini-colab](https://github.com/pentamorfico/hoodini-colab) |

## 🏗️ Architecture

This site uses **Nextra 4** with the **App Router** architecture. Documentation is synced from sibling repositories into the content/docs/ folder.

```
hoodini-docs/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with Nextra theme
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles (Tailwind 4)
│   └── docs/               # Docs route
│       └── [[...mdxPath]]/ # Nextra MDX catch-all
├── content/                # MDX content (served under /docs)
│   ├── _meta.json          # Root navigation config
│   └── docs/               # Synced docs content
│       ├── hoodini/        # Hoodini CLI docs
│       │   ├── _meta.json
│       │   ├── index.mdx
│       │   ├── installation.mdx
│       │   ├── quickstart.mdx
│       │   ├── cli-reference.mdx
│       │   └── api/
│       ├── viz/            # Hoodini Viz docs
│       │   ├── _meta.json
│       │   ├── index.mdx
│       │   └── api/
│       └── colab/          # Hoodini Colab docs
│           ├── _meta.json
│           ├── index.mdx
│           └── api/
├── public/
│   ├── images/             # Documentation images
│   └── fonts/              # Custom fonts
├── scripts/
│   ├── sync-docs.js        # Syncs docs from sibling repos
│   └── generate-api-docs.sh
└── .github/workflows/
    └── deploy.yml          # GitHub Pages deployment
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Documentation**: [Nextra 4.2](https://nextra.site/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Font**: Space Grotesk
- **Deployment**: GitHub Pages

## 🚀 Development

### Prerequisites

- Node.js 18.18+
- npm

### Setup

```bash
# Clone the repo
git clone https://github.com/pentamorfico/hoodini-docs.git
cd hoodini-docs

# Install dependencies
npm install

# Start development server (syncs docs first)
npm run dev
```

Open http://localhost:3000 to view the site.

### Project Structure (Development)

For the sync script to work, have the source repos as siblings:

```
software/
├── hoodini/           # Source: hoodini/docs/ → content/docs/hoodini/
├── hoodini-viz/       # Source: hoodini-viz/docs/ → content/docs/viz/
├── hoodini-colab/     # Source: hoodini-colab/docs/ → content/docs/colab/
└── hoodini-docs/      # This repo
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (auto-syncs docs first) |
| `npm run build` | Build for production |
| `npm run sync` | Manually sync docs from sibling repos |
| `npm run start` | Start production server |

## 📝 Writing Documentation

Documentation lives in each source repository under docs/:

```
hoodini/docs/
├── _meta.json              # Nextra navigation config
├── index.mdx               # Introduction
├── installation.mdx        # Installation guide
├── quickstart.mdx          # Quick start guide
├── cli-reference.mdx       # CLI documentation
├── AI_AGENT_GUIDE.mdx      # Guide for AI agents
├── ARCHITECTURE.mdx        # Architecture overview
├── STYLE_GUIDE.mdx         # Code style guide
└── api/
    └── reference.mdx       # API documentation
```

### Adding New Pages

1. Create a .mdx file in the source repo's docs/ folder
2. Update _meta.json to include the new page in navigation
3. Run `npm run sync` locally to test
4. Commit and push to the source repo
5. The docs site will rebuild via GitHub Actions

### Navigation Configuration

Each folder needs a _meta.json for navigation order:

```json
{
  "index": "Introduction",
  "installation": "Installation",
  "quickstart": "Quick Start",
  "cli-reference": "CLI Reference",
  "api": "API"
}
```

### Using MDX Components

Nextra 4 supports MDX with built-in components:

```mdx
import { Callout, Cards, Card, Steps, Tabs } from 'nextra/components'

<Callout type="info">
  This is an informational callout.
</Callout>

<Steps>
### Step 1
Do this first.

### Step 2
Then do this.
</Steps>
```

## 🔄 Sync Workflow

The sync-docs.js script:

1. Reads .md/.mdx files from sibling repos (../hoodini/docs/, etc.)
2. Converts .md → .mdx automatically
3. Copies to content/docs/[project]/
4. Copies images to public/images/

### Manual Sync

```bash
npm run sync
```

### Automatic Sync on Dev

Running `npm run dev` automatically syncs before starting the server.

## 🎨 Customization

### Theme & Layout

The site uses a custom layout in [app/layout.tsx](app/layout.tsx):
- Dark/light mode toggle
- Custom logo with dark mode variant
- Navigation links to each project's docs
- Footer with GitHub links

### Styling

- Global styles: [app/globals.css](app/globals.css)
- Tailwind CSS 4 with PostCSS
- Custom font: Space Grotesk

### Images

Place images in public/images/ and reference them:

```mdx
![Description](/images/example.png)
```

## 📦 Deployment

### GitHub Pages (Automatic)

Every push to `main` triggers the [deploy workflow](.github/workflows/deploy.yml):

1. Installs dependencies
2. Syncs documentation
3. Builds static site
4. Deploys to GitHub Pages

### Manual Build

```bash
npm run build
# Output is in .next/ (or ./out/ with static export)
```

## 📄 License

MIT © [pentamorfico](https://github.com/pentamorfico)
