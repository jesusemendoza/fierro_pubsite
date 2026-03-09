# Architecture Patterns

**Domain:** Static marketing site for construction SaaS (Astro + Cloudflare Pages)
**Researched:** 2026-03-09

## Recommended Architecture

Fierro's public site is a purely static, multi-page marketing site. No SSR adapter. No runtime JavaScript by default. Astro builds HTML at compile time; Cloudflare Pages serves it from the edge. Every architectural decision flows from this constraint: build-time only, zero runtime.

### High-Level Structure

```
[Browser] <-- edge CDN --> [Cloudflare Pages]
                                |
                          [Static Assets]
                           /     |     \
                     HTML    CSS(TW)  Images
                    (Astro   (Vite    (Sharp at
                     built)  bundled)  build time)
```

There is no backend, no API, no database. CTAs link to `app.getfierro.com`. The site is a collection of pre-rendered HTML pages with optimized assets.

### Project Directory Structure

```
fierro_pubsite/
├── public/                          # Unprocessed static assets
│   ├── fonts/                       # DM Sans woff2 files (self-hosted)
│   ├── favicon.svg                  # Favicon
│   ├── og-image.png                 # Default Open Graph image
│   ├── robots.txt                   # Or generate dynamically (see below)
│   └── _headers                     # Cloudflare Pages custom headers
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── global/                  # Site-wide: Header, Footer, Nav, MobileMenu
│   │   ├── ui/                      # Primitives: Button, Card, Badge, Container
│   │   ├── sections/                # Page sections: Hero, ValueProps, CTA, Pricing
│   │   └── seo/                     # BaseHead, SEO meta, JSON-LD structured data
│   │
│   ├── layouts/                     # Page shell templates
│   │   └── BaseLayout.astro         # Single layout: <html>, <head>, <body> shell
│   │
│   ├── pages/                       # File-based routing (only reserved dir)
│   │   ├── index.astro              # Landing page (/)
│   │   ├── features.astro           # Features page (/features)
│   │   ├── pricing.astro            # Pricing page (/pricing)
│   │   ├── privacy.astro            # Privacy policy (/privacy)
│   │   ├── terms.astro              # Terms of service (/terms)
│   │   └── robots.txt.ts            # Dynamic robots.txt generation (optional)
│   │
│   ├── styles/                      # Global styles
│   │   └── global.css               # Tailwind v4 import + @theme design tokens
│   │
│   ├── images/                      # Images processed by Astro (Sharp at build)
│   │   ├── hero/                    # Hero section imagery
│   │   ├── features/                # Feature screenshots/illustrations
│   │   └── logos/                    # Trust logos, partner logos
│   │
│   ├── data/                        # Typed data objects (no CMS)
│   │   ├── features.ts              # Feature list with titles, descriptions, icons
│   │   ├── pricing.ts               # Pricing tier definitions
│   │   └── navigation.ts            # Nav links, footer links
│   │
│   └── lib/                         # Utilities
│       └── constants.ts             # URLs, brand values, site metadata
│
├── astro.config.mjs                 # Astro configuration
├── tailwind.config.ts               # Not needed with TW v4 (CSS-first)
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies and scripts
└── wrangler.toml                    # Optional: Cloudflare config for headers/redirects
```

**Key insight:** `src/pages/` is the only directory Astro reserves. Everything else is convention. But this convention is battle-tested across the Astro ecosystem and should be followed exactly.

## Component Boundaries

### Component Hierarchy

```
BaseLayout.astro
├── BaseHead.astro          (in <head>: meta, OG, fonts, global CSS)
├── Header.astro            (logo, nav links, mobile menu trigger, CTA button)
│   └── MobileMenu.astro    (slide-out nav for mobile -- only island if JS needed)
├── <slot />                (page content injected here)
└── Footer.astro            (links, legal, copyright)
```

### Component Boundary Definitions

| Component | Responsibility | Receives From | Passes To |
|-----------|---------------|---------------|-----------|
| `BaseLayout` | HTML shell, head, body wrapper | Page props (title, description, ogImage) | Wraps all page content via `<slot />` |
| `BaseHead` | All `<head>` content: meta, OG, structured data, fonts, CSS | Props from BaseLayout (title, description, canonical, ogImage) | Nothing (terminal) |
| `Header` | Top navigation bar, logo, CTA button | Navigation data from `src/data/navigation.ts` | Nothing (terminal, links to pages) |
| `Footer` | Bottom section: links, legal pages, copyright | Navigation/footer data | Nothing (terminal) |
| `Hero` | Landing page hero: headline, subhead, CTA buttons | Props (title, subtitle, ctaText, ctaHref) | Nothing (terminal) |
| `Section` | Generic page section wrapper with consistent spacing | Props (id, background variant) | Children via `<slot />` |
| `Button` | CTA button primitive | Props (href, variant, size) | Nothing (terminal) |
| `Card` | Feature card, pricing card | Props (title, description, icon, variant) | Nothing (terminal) |
| `PricingTier` | Single pricing column | Tier data from `src/data/pricing.ts` | Nothing (terminal) |

### Component Categories

**Global components** (`src/components/global/`): Appear on every page. Header, Footer, MobileMenu. These are imported by BaseLayout, not by individual pages.

**UI primitives** (`src/components/ui/`): Stateless, prop-driven. Button, Card, Badge, Container, Section. No knowledge of business logic. Reusable across any page section.

**Section components** (`src/components/sections/`): Full-width page sections that compose UI primitives. Hero, ValueProps, FeatureGrid, PricingTable, CTABanner, TrustLogos. Each section is a self-contained visual block.

**SEO components** (`src/components/seo/`): BaseHead, JsonLd. Live in `<head>`. Handle meta tags, Open Graph, Twitter cards, structured data.

## Data Flow

### Build-Time Data Flow (the only flow)

```
src/data/*.ts (typed objects)
       |
       v
src/pages/*.astro (import data, pass as props)
       |
       v
src/components/sections/*.astro (receive props, render HTML)
       |
       v
src/components/ui/*.astro (receive props, render primitives)
       |
       v
dist/ (static HTML + optimized assets)
```

**All data flows one direction: down.** Pages import data and pass it to sections as props. Sections pass to UI primitives as props. There is no state management, no context, no stores. This is a static site -- data is resolved at build time.

### Page Composition Pattern

Each page file in `src/pages/` follows this pattern:

```astro
---
// 1. Import layout
import BaseLayout from '../layouts/BaseLayout.astro';
// 2. Import section components
import Hero from '../components/sections/Hero.astro';
import ValueProps from '../components/sections/ValueProps.astro';
import CTABanner from '../components/sections/CTABanner.astro';
// 3. Import data
import { features } from '../data/features';
// 4. Define page metadata
const meta = {
  title: 'Fierro - Every Dollar. Every Pour. Accounted For.',
  description: 'Construction job cost-control...',
};
---

<!-- 5. Wrap in layout, pass meta -->
<BaseLayout {...meta}>
  <!-- 6. Compose sections in order -->
  <Hero title="..." subtitle="..." ctaHref="https://app.getfierro.com/signup" />
  <ValueProps items={features} />
  <CTABanner />
</BaseLayout>
```

This is the core architectural pattern. Pages are thin orchestrators. Sections are self-contained visual blocks. UI primitives handle rendering.

### SEO Data Flow

```
Page (defines title, description, ogImage)
  --> BaseLayout (passes meta to BaseHead)
    --> BaseHead (renders <title>, <meta>, <link rel="canonical">, OG tags, JSON-LD)
```

The `astro-seo` npm package is popular but unnecessary for a 5-page site. Hand-writing the meta tags in a `BaseHead.astro` component gives full control with zero dependency. Define an `interface Props` for type safety and pass page-specific SEO data from each page through the layout.

### Navigation Data Flow

```
src/data/navigation.ts (nav items, footer links)
  --> BaseLayout imports and passes to Header + Footer
    --> Header renders nav links
    --> Footer renders footer links
```

Keep navigation data in a single typed file so adding/reordering pages only requires editing one file.

## Patterns to Follow

### Pattern 1: Single Layout with Props

**What:** One `BaseLayout.astro` that handles the HTML shell, head, global styles, header, footer, and a `<slot />` for page content.

**Why:** Five pages share identical chrome. Multiple layouts add complexity for no benefit.

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalPath?: string;
}

import BaseHead from '../components/seo/BaseHead.astro';
import Header from '../components/global/Header.astro';
import Footer from '../components/global/Footer.astro';
import '../styles/global.css';

const { title, description, ogImage, canonicalPath } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <BaseHead {title} {description} {ogImage} {canonicalPath} />
  </head>
  <body class="bg-off-white text-gunmetal font-sans antialiased">
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Pattern 2: Typed Data Files Instead of CMS

**What:** Store all content (features, pricing tiers, nav links) as typed TypeScript objects in `src/data/`.

**Why:** Content lives in code for this project (per PROJECT.md: "content is in code"). TypeScript gives you autocompletion, type checking, and refactoring safety. No CMS overhead for 5 pages.

```typescript
// src/data/pricing.ts
export interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: { text: string; href: string };
  highlighted?: boolean;
}

export const tiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'Get started with basic cost tracking',
    features: ['1 project', '6 sub-projects', '3 team members', 'Basic expense tracking'],
    cta: { text: 'Start Free', href: 'https://app.getfierro.com/signup' },
  },
  // ... Plus, Builder tiers
];
```

### Pattern 3: Section-Based Page Composition

**What:** Pages are composed of full-width section components stacked vertically. Each section is a self-contained visual block.

**Why:** Marketing pages are inherently vertical stacks of sections. This maps directly to how the page is designed and makes reordering/adding sections trivial.

```astro
<!-- src/pages/index.astro -->
<BaseLayout title="Fierro" description="...">
  <Hero />
  <TrustLogos />
  <ValueProps />
  <FeatureHighlights />
  <Testimonials />
  <CTABanner />
</BaseLayout>
```

### Pattern 4: CSS-First Design Tokens with Tailwind v4 @theme

**What:** Define all brand colors, fonts, and spacing in `src/styles/global.css` using Tailwind v4's `@theme` directive. No `tailwind.config.js`.

**Why:** Tailwind v4 is CSS-first. The `@theme` block generates utility classes and CSS custom properties simultaneously. Brand tokens are defined once, usable everywhere.

```css
/* src/styles/global.css */
@import "tailwindcss";

@theme {
  --color-gunmetal: #2B2D31;
  --color-molten: #E8600A;
  --color-off-white: #F5F4F0;
  --color-concrete: #8B8D92;
  --color-rebar: #2D8B55;
  --color-overrun: #D93636;

  --font-sans: 'DM Sans', system-ui, sans-serif;
}
```

This generates utility classes like `bg-gunmetal`, `text-molten`, `font-sans` automatically.

### Pattern 5: Self-Hosted Fonts with Preload

**What:** Host DM Sans woff2 files in `public/fonts/`. Preload the primary weights in `<head>`. Declare `@font-face` with `font-display: swap`.

**Why:** Self-hosting eliminates the Google Fonts render-blocking request. Preloading critical weights prevents FOIT (Flash of Invisible Text). `font-display: swap` shows fallback text immediately.

```astro
<!-- In BaseHead.astro -->
<link rel="preload" href="/fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/DMSans-Bold.woff2" as="font" type="font/woff2" crossorigin />
```

### Pattern 6: Build-Time Image Optimization

**What:** Store images in `src/images/`. Use Astro's `<Image />` and `<Picture />` components. Sharp optimizes at build time. Output WebP/AVIF with PNG fallback.

**Why:** Images in `src/` are processed by Sharp during `astro build` -- resized, format-converted, and dimension-injected to prevent CLS. No runtime image service needed. No Cloudflare adapter needed for static output.

**Important:** For a purely static Astro site deployed to Cloudflare Pages, you do NOT need the `@astrojs/cloudflare` adapter. The default Sharp image service works at build time. The adapter is only needed for SSR/on-demand rendering.

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../images/hero/dashboard-preview.png';
---
<Image
  src={heroImage}
  alt="Fierro dashboard showing project cost breakdown"
  widths={[400, 800, 1200]}
  formats={['avif', 'webp']}
  loading="eager"
/>
```

### Pattern 7: View Transitions for Polish

**What:** Add Astro's `<ViewTransitions />` component to BaseLayout's `<head>`. Browser-native page transitions with zero JavaScript overhead.

**Why:** Creates an SPA-like feel on a static MPA. The header and footer persist visually while page content fades/slides. Browser support exceeds 85% in 2025; Astro falls back to normal navigation in unsupported browsers. This is free polish.

```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Installing the Cloudflare Adapter for a Static Site

**What:** Adding `@astrojs/cloudflare` when the site is purely static.
**Why bad:** Forces `output: 'server'` by default, triggers Workers deployment instead of Pages static hosting, breaks Sharp image optimization at build time, and adds unnecessary complexity.
**Instead:** Use `output: 'static'` (the default). Deploy the `dist/` directory directly to Cloudflare Pages. No adapter needed.

### Anti-Pattern 2: Framework Islands for Non-Interactive Elements

**What:** Using React/Svelte/Vue components with `client:load` for elements that are purely visual (animated counters, scroll reveals, carousels).
**Why bad:** Adds framework runtime JavaScript. Breaks the "zero JS by default" principle. Hurts Lighthouse scores.
**Instead:** Use CSS animations and transitions. For scroll-triggered effects, use a tiny vanilla JS snippet in a `<script>` tag (Intersection Observer is ~10 lines). Astro components render to HTML with zero JS footprint.

### Anti-Pattern 3: Multiple Layouts for Similar Pages

**What:** Creating `LandingLayout.astro`, `ContentLayout.astro`, `LegalLayout.astro` for slight variations.
**Why bad:** Duplicates header/footer/head logic. Maintenance burden. For 5 pages with the same chrome, it is unnecessary.
**Instead:** One `BaseLayout.astro` with optional props for variation (e.g., `narrowContent?: boolean` for legal pages).

### Anti-Pattern 4: Dynamic Imports for Static Data

**What:** Using `fetch()` or `import()` to load content from JSON files at build time.
**Why bad:** Unnecessary indirection. TypeScript imports give type safety; dynamic imports lose it.
**Instead:** Direct TypeScript imports: `import { features } from '../data/features'`.

### Anti-Pattern 5: Storing Optimizable Images in public/

**What:** Putting product screenshots and hero images in `public/` instead of `src/images/`.
**Why bad:** Images in `public/` bypass Sharp optimization entirely. No automatic resizing, format conversion, or dimension injection. Larger files, potential CLS.
**Instead:** Only put truly static assets in `public/` (favicons, OG images used by external crawlers, font files). Everything else goes in `src/images/`.

## Deployment Configuration

### Astro Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://getfierro.com',
  output: 'static',  // This is the default, but be explicit
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  image: {
    // Sharp is the default service for static builds
    // No configuration needed unless customizing quality/formats
  },
});
```

### Cloudflare Pages Configuration

**Build settings (in Cloudflare Dashboard or wrangler.toml):**
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Production branch:** `main`
- **Node.js version:** Set `NODE_VERSION=22` in environment variables

**No adapter, no wrangler.toml required for basic static deployment.** Cloudflare Pages detects Astro and serves `dist/` from the edge.

### Custom Headers (Performance + Security)

```
# public/_headers
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
```

Astro hashes asset filenames in `_astro/`, making them safe to cache immutably. Fonts do not change, so they also get immutable caching.

### Redirects (if needed)

```
# public/_redirects
/signup  https://app.getfierro.com/signup  301
/login   https://app.getfierro.com/login   301
```

## Build Order (Dependencies Between Components)

This defines the order components should be built to avoid blocking dependencies.

### Phase 1: Foundation (no dependencies)

Build these first -- everything else depends on them.

1. **Project scaffolding** -- `npm create astro@latest`, install dependencies, configure `astro.config.mjs`
2. **Tailwind v4 setup** -- `@tailwindcss/vite` plugin, `global.css` with `@theme` brand tokens
3. **Font setup** -- DM Sans woff2 files in `public/fonts/`, `@font-face` declarations
4. **BaseHead component** -- meta tags, OG tags, font preloads, canonical URLs
5. **BaseLayout** -- HTML shell with BaseHead, `<slot />`, global CSS import

**Dependency:** Nothing else can be built without BaseLayout and the design token system.

### Phase 2: Chrome (depends on Phase 1)

Site-wide navigation and structure.

1. **Header** -- Logo, navigation, mobile menu trigger, primary CTA button
2. **Footer** -- Links, legal, copyright
3. **Navigation data** -- `src/data/navigation.ts` consumed by Header and Footer
4. **MobileMenu** -- Responsive nav (may need minimal JS for toggle; use `<script>` not a framework island)

**Dependency:** Header and Footer are imported by BaseLayout. They must exist before pages look complete.

### Phase 3: UI Primitives (depends on Phase 1)

Reusable building blocks, independent of page content.

1. **Button** -- Primary (molten orange), secondary (gunmetal outline), ghost variants
2. **Container** -- Max-width wrapper with responsive padding
3. **Section** -- Full-width section with background variants and consistent vertical spacing
4. **Card** -- Feature card, pricing card variants
5. **Badge** -- "Popular", "Coming Soon" labels

**Dependency:** Section components in Phase 4 compose these primitives.

### Phase 4: Section Components (depends on Phase 2 + 3)

Full-width page sections. Each is a self-contained visual block.

1. **Hero** -- Headline, subheadline, dual CTA buttons, optional hero image
2. **ValueProps** -- Grid of benefit cards (quantified claims per ingenious.build inspiration)
3. **FeatureGrid** -- Feature cards with icons and descriptions
4. **PricingTable** -- Three-column pricing comparison
5. **CTABanner** -- Full-width call-to-action strip
6. **TrustLogos** -- Partner/integration logo row (if applicable)

**Dependency:** These compose UI primitives and require the data files.

### Phase 5: Pages (depends on Phase 4)

Thin orchestrator files that compose sections.

1. **Landing page** (`index.astro`) -- Hero + ValueProps + FeatureHighlights + CTA
2. **Features page** (`features.astro`) -- Full feature breakdown
3. **Pricing page** (`pricing.astro`) -- PricingTable + FAQ + CTA
4. **Legal pages** (`privacy.astro`, `terms.astro`) -- Content in narrow layout

**Dependency:** Pages import sections, layout, and data. They are the final assembly step.

### Phase 6: SEO + Deploy (depends on Phase 5)

Polish and ship.

1. **Sitemap** -- `@astrojs/sitemap` integration, verify output
2. **robots.txt** -- Allow all, reference sitemap
3. **JSON-LD structured data** -- Organization schema, WebSite schema
4. **Open Graph images** -- Per-page or default
5. **Cloudflare Pages deployment** -- Connect Git repo, verify build, custom domain
6. **Custom headers** -- `_headers` file for caching and security
7. **View Transitions** -- Add `<ViewTransitions />` to BaseLayout head
8. **Lighthouse audit** -- Verify 95+ scores, fix any issues

## Scalability Considerations

| Concern | At Launch (5 pages) | At 15 pages (blog added) | At 50+ pages |
|---------|---------------------|--------------------------|--------------|
| Build time | <5 seconds | <15 seconds | <30 seconds (Astro is fast) |
| Content management | TypeScript data files | Consider Markdown content collections | Evaluate headless CMS |
| Component count | ~20 components | ~30 components | Organize by feature domain |
| Image pipeline | Sharp at build time | Same, watch build size | Consider external image CDN |
| Routing | File-based, flat | Add /blog/[slug] dynamic routes | Same pattern scales |
| Deployment | Cloudflare Pages static | Same | Same (Pages handles any static size) |

The architecture does not need to change significantly as the site grows. Astro's content collections API is the natural evolution path when blog/content pages are added later. The component/section/page hierarchy scales cleanly.

## Sources

- [Astro Project Structure (official docs)](https://docs.astro.build/en/basics/project-structure/) -- HIGH confidence
- [Astro Layouts (official docs)](https://docs.astro.build/en/basics/layouts/) -- HIGH confidence
- [Astro Components (official docs)](https://docs.astro.build/en/basics/astro-components/) -- HIGH confidence
- [Astro Images Guide (official docs)](https://docs.astro.build/en/guides/images/) -- HIGH confidence
- [Astro Fonts Guide (official docs)](https://docs.astro.build/en/guides/fonts/) -- HIGH confidence
- [Astro View Transitions (official docs)](https://docs.astro.build/en/guides/view-transitions/) -- HIGH confidence
- [Astro Cloudflare Deployment (official docs)](https://docs.astro.build/en/guides/deploy/cloudflare/) -- HIGH confidence
- [Cloudflare Pages Astro Guide](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) -- HIGH confidence
- [Tailwind CSS v4 Astro Installation (official docs)](https://tailwindcss.com/docs/installation/framework-guides/astro) -- HIGH confidence
- [Tailwind CSS v4 Theme Variables (official docs)](https://tailwindcss.com/docs/theme) -- HIGH confidence
- [astro-seo package](https://github.com/jonasmerlin/astro-seo) -- MEDIUM confidence
- [Astro SEO Complete Guide](https://eastondev.com/blog/en/posts/dev/20251202-astro-seo-complete-guide/) -- MEDIUM confidence
- [Astro Image Optimization Guide](https://eastondev.com/blog/en/posts/dev/20251203-astro-image-optimization-guide/) -- MEDIUM confidence
