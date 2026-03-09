# Technology Stack

**Project:** Fierro Public Site (getfierro.com)
**Researched:** 2026-03-09
**Overall Confidence:** HIGH

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro | ^5.18 | Static site framework | Zero-JS default, content-focused, Vite-powered builds. The purpose-built choice for static marketing sites. Astro 5 is stable (5.18.0 as of March 2026). Astro 6 is in beta -- do NOT adopt yet; wait for stable release. | HIGH |
| Node.js | ^20.x LTS | Build runtime | LTS release, required by Astro 5 | HIGH |

**Why Astro 5 and not Astro 6 beta:** Astro 6 entered beta in January 2026 with experimental features graduating to stable. For a production marketing site, use the battle-tested Astro 5.x line. Upgrading to 6 later will be straightforward since most v6 features are already available behind experimental flags in v5.

**Why Astro over Next.js:** The project is a pure static marketing site with zero auth, zero API routes, zero dynamic content. Next.js carries SSR/RSC overhead that provides no value here. Astro ships zero JavaScript by default -- exactly what the PROJECT.md performance constraints demand (Lighthouse 95+, TTI < 1.5s on 3G).

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | ^4.2 | Utility-first CSS framework | v4 uses OKLCH color space natively (matches fierro_web's OKLCh system), CSS-first configuration via `@theme` (no `tailwind.config.js`), 5x faster builds. Brand consistency with fierro_web. | HIGH |
| @tailwindcss/vite | ^4.2 | Vite plugin for Tailwind | Official Tailwind v4 integration for Vite-based frameworks like Astro. Replaces the deprecated `@astrojs/tailwind` integration. | HIGH |

**Critical: Do NOT use `@astrojs/tailwind`.** That integration is deprecated and only supports Tailwind v3. Use `@tailwindcss/vite` directly in Astro's Vite config.

**Tailwind v4 setup in Astro:**

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  /* Brand colors -- use OKLCH for perceptual consistency with fierro_web */
  --color-gunmetal: oklch(0.27 0.01 264);     /* #2B2D31 - authority */
  --color-molten: oklch(0.58 0.18 38);         /* #E8600A - energy/CTAs */
  --color-offwhite: oklch(0.96 0.005 90);      /* #F5F4F0 - surfaces */
  --color-concrete: oklch(0.62 0.01 264);      /* #8B8D92 - secondary */
  --color-rebar: oklch(0.53 0.12 155);         /* #2D8B55 - success */
  --color-overrun: oklch(0.55 0.17 25);        /* #D93636 - danger */

  /* Typography */
  --font-sans: 'DM Sans Variable', sans-serif;
}
```

### Typography / Fonts

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @fontsource-variable/dm-sans | ^5.2 | Self-hosted DM Sans variable font | Ships font files from your own domain (no Google Fonts requests = privacy, performance, reliability). Variable font covers weights 100-900 in a single file. Eliminates FOIT/FOUT with proper `font-display`. | HIGH |

**Why Fontsource over Google Fonts CDN:** Self-hosting via Fontsource eliminates the third-party DNS lookup + connection to fonts.googleapis.com (saves ~100ms). The variable font file serves all weights (100-900) in one request instead of multiple. No GDPR concerns about sending user data to Google.

**Why NOT the experimental Astro Fonts API:** As of March 2026, the Fonts API is still experimental and has known bugs (only the first font loads when multiple are configured, per GitHub issue #13637). Use Fontsource until the API stabilizes.

**Usage:**

```javascript
// In your base layout
import '@fontsource-variable/dm-sans';
```

### Images

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| astro:assets (built-in) | Included with Astro | Image optimization | Built-in `<Image />` and `<Picture />` components handle format conversion (WebP/AVIF), responsive srcset generation, dimension inference (prevents CLS), and lazy loading. Uses Sharp at build time. No additional packages needed. | HIGH |
| sharp | Included with Astro | Image processing engine | Default image service in Astro 5 (Squoosh was removed in v5). Handles WebP/AVIF conversion, resizing, and quality optimization at build time for static sites. | HIGH |

**Best practices for this project:**
- Store all images in `src/assets/` (NOT `public/`) so Astro can optimize them at build time
- Use `<Image />` for single-format optimized images, `<Picture />` for multi-format with AVIF/WebP fallback
- Set `width` and `height` on all images to prevent CLS
- Use `loading="lazy"` for below-fold images (default), `loading="eager"` for hero/LCP images
- Prefer AVIF as primary format with WebP fallback: `<Picture formats={['avif', 'webp']} />`

### SEO

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| astro-seo | ^1.1 | Meta tags, Open Graph, Twitter Cards | Lightweight component that lives in `<head>` and generates all SEO meta tags. Most popular Astro SEO package, actively maintained. | MEDIUM |
| astro-seo-schema | ^5.2 | JSON-LD structured data | Generates JSON-LD for rich search results (Organization, Product, BreadcrumbList). Pairs with astro-seo. | MEDIUM |
| @astrojs/sitemap | ^3.7 | Sitemap generation | Official Astro integration. Auto-generates sitemap-index.xml and sitemap-0.xml at build time. Requires `site` in astro.config.mjs. | HIGH |

**Why astro-seo over manual meta tags:** For a marketing site with 5-7 pages, manually writing meta tags is viable but error-prone. astro-seo provides a type-safe component with all Open Graph, Twitter Card, and canonical URL props. Worth the minimal dependency.

### Animations

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Astro View Transitions (built-in) | Included with Astro | Page transition animations | Browser-native cross-document view transitions. Zero JavaScript added to page load. Adds fade/slide/morph animations between page navigations. 85%+ browser support (Chrome 111+, Edge 111+, Safari 18+). | HIGH |
| CSS animations + `@keyframes` | N/A | Scroll-reveal, hover effects | For the "premium animations with restraint" design goal, use CSS-only animations with `animation-timeline: view()` (CSS Scroll-driven Animations). No JS library needed. Falls back gracefully in unsupported browsers. | HIGH |

**Why NOT Motion/Framer Motion:** The project demands zero or near-zero client-side JavaScript. Motion.dev (~16KB) and Framer Motion (~30KB) require JavaScript bundles. CSS animations with `animation-timeline: view()` achieve scroll-triggered reveals with zero JS. For the rare case needing JS animation (e.g., a number counter), use a tiny Astro island with a `<script>` tag.

### Deployment / Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Cloudflare Pages | N/A | Static hosting | Edge-deployed to 300+ PoPs globally, free tier handles marketing site traffic, automatic HTTPS, custom domain support. Matches the domain-split architecture (getfierro.com = Pages, app.getfierro.com = Vercel). | HIGH |
| wrangler | ^3.91+ | CLI for Cloudflare deployment | Deploy via `wrangler pages deploy ./dist`. Also supports GitHub integration for auto-deploy on push. | HIGH |

**No adapter needed.** For a purely static Astro site, do NOT install `@astrojs/cloudflare`. That adapter is only for sites using on-demand/SSR rendering. A static build outputs to `dist/` and deploys directly.

**Recommended wrangler.jsonc:**

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "fierro-pubsite",
  "compatibility_date": "2026-03-01",
  "pages_build_output_dir": "./dist"
}
```

**Why `wrangler.jsonc` over `wrangler.toml`:** Cloudflare recommends JSON config for new projects. Some newer Wrangler features are JSON-only. TOML support may be deprecated in the future.

**Deployment options:**
1. **Git integration (recommended):** Connect GitHub repo in Cloudflare Dashboard, auto-deploys on push to main
2. **CLI:** `npx astro build && npx wrangler pages deploy ./dist`

### Development Tools

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| TypeScript | ^5.x | Type safety | Astro has first-class TypeScript support. Enables type-safe props, content collections, and astro-seo configuration. | HIGH |
| prettier | ^3.x | Code formatting | Standard formatting. Use with `prettier-plugin-astro` for `.astro` file support. | HIGH |
| prettier-plugin-astro | ^0.14 | Prettier support for .astro files | Official Astro formatter plugin. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Astro 5 | Next.js 15 | Overkill for static marketing site. Ships JS runtime by default. SSR/RSC complexity unnecessary. |
| Framework | Astro 5 | Astro 6 beta | Beta software. Not production-ready. v5 is stable and fully featured. |
| Styling | Tailwind CSS v4 | CSS Modules | Tailwind matches fierro_web stack. Utility-first is faster for marketing pages. v4's OKLCH aligns with brand color system. |
| Styling integration | @tailwindcss/vite | @astrojs/tailwind | @astrojs/tailwind is deprecated, only supports Tailwind v3. |
| Fonts | Fontsource (self-hosted) | Google Fonts CDN | Third-party request adds latency. GDPR risk. Single point of failure. |
| Fonts | Fontsource | Astro experimental Fonts API | API is experimental with known bugs. Not ready for production. |
| Images | Built-in astro:assets | @astrojs/image (old) | @astrojs/image was removed in Astro 3. astro:assets is the built-in replacement. |
| Images | Sharp (default) | Squoosh | Squoosh was removed in Astro 5. Sharp is the only built-in option. |
| Animation | CSS + View Transitions | Motion.dev / Framer Motion | Adds JavaScript bundle. Violates zero-JS constraint. CSS handles all needed animations. |
| SEO | astro-seo | Manual meta tags | astro-seo prevents mistakes (missing OG tags, wrong Twitter card type). Minimal overhead. |
| Deployment | Cloudflare Pages | Vercel | Keeps marketing infra separate from app (Vercel). Matches domain-split architecture. Free tier sufficient. |
| Config format | wrangler.jsonc | wrangler.toml | JSON is Cloudflare's recommended format for new projects. Future-proof. |
| Adapter | None (static) | @astrojs/cloudflare | Adapter is for SSR/on-demand rendering. Pure static site doesn't need it. |

## Complete astro.config.mjs

```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://getfierro.com",
  output: "static", // explicit default -- zero server runtime
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  image: {
    // Sharp is the default; no config needed unless customizing
  },
});
```

## Installation

```bash
# Create project
npm create astro@latest fierro_pubsite -- --template minimal

# Core dependencies
npm install astro@latest

# Styling
npm install tailwindcss @tailwindcss/vite

# Typography
npm install @fontsource-variable/dm-sans

# SEO
npm install astro-seo astro-seo-schema @astrojs/sitemap

# Dev dependencies
npm install -D prettier prettier-plugin-astro typescript @astrojs/check
```

## Project Structure

```
fierro_pubsite/
  src/
    assets/           # Images (optimized at build time by astro:assets)
    components/       # Reusable .astro components
    layouts/          # Base layout with font imports, meta, View Transitions
    pages/            # File-based routing
      index.astro     # Landing page
      features.astro  # Feature showcase
      pricing.astro   # Pricing tiers
      privacy.astro   # Privacy policy
      terms.astro     # Terms of service
    styles/
      global.css      # Tailwind @import + @theme brand tokens
  public/
    favicon.svg       # Static assets that skip optimization
    robots.txt
  astro.config.mjs
  wrangler.jsonc
  tsconfig.json
  package.json
```

## Sources

- [Astro 5.18.0 - npm](https://www.npmjs.com/package/astro) (current stable version)
- [Astro 6 Beta announcement](https://astro.build/blog/astro-6-beta/) (beta, not for production)
- [Tailwind CSS v4 Astro installation guide](https://tailwindcss.com/docs/installation/framework-guides/astro) (official)
- [Tailwind CSS v4 color customization](https://tailwindcss.com/docs/customizing-colors) (official)
- [Astro Images documentation](https://docs.astro.build/en/guides/images/) (official)
- [Astro Cloudflare Pages deployment](https://docs.astro.build/en/guides/deploy/cloudflare/) (official)
- [Cloudflare Pages framework guide for Astro](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) (official)
- [Wrangler configuration - JSON vs TOML](https://developers.cloudflare.com/workers/wrangler/configuration/) (official)
- [Fontsource DM Sans variable](https://fontsource.org/fonts/dm-sans/install) (official)
- [Astro View Transitions documentation](https://docs.astro.build/en/guides/view-transitions/) (official)
- [Astro experimental Fonts API](https://docs.astro.build/en/reference/experimental-flags/fonts/) (official, experimental)
- [Astro Fonts API bug - issue #13637](https://github.com/withastro/astro/issues/13637) (open issue)
- [@astrojs/sitemap documentation](https://docs.astro.build/en/guides/integrations-guide/sitemap/) (official)
- [astro-seo - npm](https://www.npmjs.com/package/astro-seo) (v1.1.0)
