# Fierro Marketing Site

The public-facing marketing site for [Fierro](https://getfierro.com) — construction job cost control software that helps contractors, project owners, and teams track budgets, expenses, and project health in real-time.

Built with [Astro](https://astro.build/), styled with [Tailwind CSS](https://tailwindcss.com/), and deployed to [Cloudflare Workers](https://workers.cloudflare.com/).

## Why Astro

Fierro's marketing site is a content-driven, performance-critical front door — it doesn't need a React runtime, client-side routing, or server-side rendering. Astro was chosen because it aligns perfectly with those constraints:

- **Zero JS by default.** Astro ships pure HTML and CSS unless you explicitly opt in to client-side JavaScript. The result is pages that load instantly with no framework overhead.
- **Islands architecture.** The few interactive pieces (mobile menu, pricing toggle, scroll animations) use small, scoped scripts — not a full SPA framework. Astro's island model keeps interactivity surgical and lightweight.
- **Static-first output.** The entire site compiles to a `dist/` folder of static assets that deploy to Cloudflare's edge network. No origin server, no cold starts, no SSR latency.
- **Built-in performance wins.** Asset hashing, automatic sitemap generation, image optimization, and scoped styles come out of the box. Lighthouse CI enforces 95%+ scores on every deploy.
- **File-based routing with component syntax.** `.astro` files combine frontmatter (metadata, props) with HTML-like templates. Pages live in `src/pages/` and map directly to routes — no router config needed.
- **Framework-agnostic.** If a page ever needs React, Vue, or Svelte, Astro can hydrate those components selectively. The site stays simple today without closing doors for tomorrow.

The bottom line: Astro lets us ship a fast, accessible, SEO-optimized site with minimal complexity. No build-time compromises, no runtime tax.

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, value props, feature showcase, how it works, CTA |
| `/pricing` | Pricing tiers (Free, Plus, Builder), comparison table, FAQ |
| `/why-fierro` | Pain-first narrative with problem/solution pairs and AI section |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Tech Stack

- **Astro** v5 — static site generator
- **Tailwind CSS** v4 — utility-first styling with a custom oklch color palette
- **TypeScript** — strict mode
- **Playwright** — E2E test suite (20 test files)
- **Lighthouse CI** — performance auditing (95%+ thresholds)
- **Cloudflare Workers** — edge hosting via static assets
- **GitHub Actions** — CI/CD pipeline (build, test, deploy on push to main)

## Getting Started

```bash
# Install dependencies
npm ci

# Start dev server (http://localhost:4321)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Testing

```bash
# Run Playwright E2E tests
npm run test

# Chromium only
npm run test:chromium

# Lighthouse performance audit
npm run test:lighthouse

# Full suite: build + lighthouse + playwright
npm run test:all
```

## Deployment

The site deploys automatically to Cloudflare Workers on every push to `main` via GitHub Actions.

Manual deploy:

```bash
npm run deploy   # astro build && wrangler deploy
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full deployment guide including DNS setup, CI/CD configuration, cache strategy, and troubleshooting.

## Project Structure

```
src/
├── pages/          Route-based .astro pages
├── components/
│   ├── landing/    Home page sections
│   ├── pricing/    Pricing page components
│   ├── why-fierro/ Why Fierro page sections
│   ├── Nav.astro   Fixed nav with scroll transition
│   ├── MobileMenu.astro
│   └── Footer.astro
├── layouts/        BaseLayout with metadata, nav, footer
├── assets/         SVG illustrations and favicon
└── styles/         Global CSS, Tailwind theme, animations
public/
├── og/             Open Graph images per page
├── robots.txt      SEO indexing + sitemap reference
└── _headers        Cloudflare cache control headers
```
