# Phase 1: Foundation and Site Chrome - Research

**Researched:** 2026-03-09
**Domain:** Astro 5 + Tailwind CSS v4 + Cloudflare Workers Static Assets
**Confidence:** HIGH

## Summary

This phase scaffolds a static Astro 5 site with Tailwind CSS v4, self-hosted DM Sans via Fontsource, brand design tokens in OKLch, and deploys it to Cloudflare Workers Static Assets at getfierro.com. It also builds a sticky navigation with transparent-to-solid scroll transition, a mobile hamburger menu, and a lightweight footer -- all wrapping five stub pages.

The stack is well-established: Astro 5.18+ is mature and stable, Tailwind CSS v4 integrates via its native Vite plugin (`@tailwindcss/vite`), Cloudflare Workers Static Assets is their recommended path for new static projects, and Fontsource provides zero-CDN self-hosted fonts. The fierro_web codebase already uses OKLch color tokens with `@theme` in Tailwind v4, so the pubsite adopts the same pattern for brand consistency.

**Primary recommendation:** Use `npm create astro@latest` for scaffolding, add `@tailwindcss/vite` + `@fontsource-variable/dm-sans` manually, configure `wrangler.jsonc` for static-only Workers deployment, and build nav/footer as pure Astro components with a tiny inline `<script>` for mobile toggle and scroll-based nav background transition.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions
- Navigation: Transparent background over dark hero, transitions to solid Gunmetal (#2B2D31) on scroll. White text links, Molten Orange (#E8600A) hover/active. "Start Free" is a ghost/outline button (Molten Orange border, fills on hover). "Login" is a plain text link to app.getfierro.com/login. Sticky at top.
- Mobile nav: Full-screen dark Gunmetal overlay on hamburger tap. 44px+ touch targets. Same link styling as desktop.
- Logo: SVG at `src/assets/logo.svg` with `currentColor` fill and `viewBox="58 93 285 213"`. Keeps brand colors on dark backgrounds. Favicon at `src/assets/favicon.ico`.
- Footer: Off-White (#F5F4F0) background with subtle top border. Single row: logo, key links (Features, Pricing, Why Fierro, Privacy, Terms), copyright. Small signup CTA ("Ready to take control?" + "Start Free"). No social links.
- Page scaffolding: All 5 routes created (/, /pricing, /why-fierro, /privacy, /terms). Stub pages show centered "Coming soon" with page name. All wrapped in BaseLayout with nav + footer. Nav links work immediately.

### Claude's Discretion
- Exact scroll threshold for nav background transition (e.g. 50px, 100px, or IntersectionObserver-based)
- Spacing and padding values for nav and footer
- Exact font weights for nav links vs CTA
- "Coming soon" placeholder styling
- Whether mobile nav toggle uses a tiny `<script>` or CSS-only (`:target` or checkbox hack)
- Build/deploy pipeline details (wrangler.jsonc configuration)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDN-01 | Project scaffolded with Astro 5, Tailwind CSS v4 (via `@tailwindcss/vite`), and self-hosted DM Sans font | Astro 5.18 scaffolding, `@tailwindcss/vite` plugin config, `@fontsource-variable/dm-sans` installation |
| FNDN-02 | Brand design tokens defined in CSS `@theme` using OKLch color space | Tailwind v4 `@theme` directive with OKLch colors, pattern from fierro_web globals.css |
| FNDN-03 | Base layout with View Transitions, responsive meta viewport, and favicon | Astro 5 `<ClientRouter />` component (renamed from ViewTransitions), base layout pattern |
| FNDN-04 | Site deployed to Cloudflare Workers Static Assets with getfierro.com custom domain | wrangler.jsonc static config, custom domain routing, Workers Builds git integration |
| FNDN-05 | All images stored in `src/assets/` and served via Astro's built-in image optimization | Astro `<Image>` and `<Picture>` components with WebP/AVIF format support |
| NAV-01 | Sticky top navigation with Logo, Features, Pricing, Why Fierro, Login, Start Free CTA | Astro component with transparent-to-solid scroll transition, inline script |
| NAV-02 | Mobile hamburger menu with 44px+ touch targets | Full-screen overlay with inline script toggle, WCAG touch target sizing |
| NAV-03 | Footer with Product, Company, Legal link columns | Astro component with Off-White background, single-row layout per user decision |
| NAV-04 | "Login" nav link points to app.getfierro.com/login | External link configuration, "Start Free" to app.getfierro.com/signup |

</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| astro | ^5.18 | Static site framework | Zero JS by default, file-based routing, built-in image optimization |
| tailwindcss | ^4.0 | Utility-first CSS | Same as fierro_web, `@theme` directive for OKLch tokens |
| @tailwindcss/vite | ^4.0 | Vite integration for Tailwind | Official Tailwind v4 integration, replaces deprecated @astrojs/tailwind |
| @fontsource-variable/dm-sans | latest | Self-hosted DM Sans variable font | Supports weights 100-900, no CDN dependency, WOFF2 format |
| wrangler | ^3 (latest) | Cloudflare Workers CLI | Build, preview, and deploy to Workers Static Assets |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| typescript | ^5.7 | Type checking | Default in Astro 5 scaffolding ("strict" preset) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @fontsource-variable/dm-sans | @fontsource/dm-sans (static) | Variable font is smaller (1 file for all weights vs per-weight files), better for using multiple weights |
| Inline `<script>` for nav | CSS-only checkbox hack | CSS-only lacks smooth overlay animation control and is harder to maintain; tiny script is idiomatic Astro |
| Workers Builds (Git integration) | GitHub Actions with wrangler-action | Workers Builds is zero-config; GitHub Actions offers more control but more setup |

**Installation:**
```bash
npm create astro@latest fierro-pubsite -- --template basics
cd fierro-pubsite
npm install tailwindcss @tailwindcss/vite @fontsource-variable/dm-sans
npm install -D wrangler
```

## Architecture Patterns

### Recommended Project Structure
```
fierro_pubsite/
├── public/
│   └── _headers              # Cloudflare custom headers (security, caching)
├── src/
│   ├── assets/
│   │   ├── logo.svg           # Fierro logo (already exists)
│   │   └── favicon.ico        # Favicon (already exists)
│   ├── components/
│   │   ├── Nav.astro           # Sticky navigation
│   │   ├── MobileMenu.astro    # Full-screen mobile overlay
│   │   └── Footer.astro        # Site footer
│   ├── layouts/
│   │   └── BaseLayout.astro    # <html>, <head>, <body>, nav + footer wrapper
│   ├── pages/
│   │   ├── index.astro         # / (stub)
│   │   ├── pricing.astro       # /pricing (stub)
│   │   ├── why-fierro.astro    # /why-fierro (stub)
│   │   ├── privacy.astro       # /privacy (stub)
│   │   └── terms.astro         # /terms (stub)
│   └── styles/
│       └── global.css          # Tailwind import + @theme tokens + font import
├── astro.config.mjs            # Astro + Tailwind Vite plugin config
├── wrangler.jsonc              # Cloudflare Workers Static Assets config
├── tsconfig.json               # TypeScript config (Astro generates this)
└── package.json
```

### Pattern 1: Tailwind v4 with @theme for Brand Tokens
**What:** Define all Fierro brand colors as OKLch values in `@theme` so they generate utility classes (e.g., `bg-gunmetal`, `text-molten-orange`).
**When to use:** Always -- this is the single source of truth for brand colors.
**Example:**
```css
/* src/styles/global.css */
@import "tailwindcss";
@import "@fontsource-variable/dm-sans";

@theme {
  /* Brand Colors (OKLch) */
  --color-gunmetal: oklch(0.235 0.006 265);
  --color-molten-orange: oklch(0.62 0.19 48);
  --color-off-white: oklch(0.97 0.005 90);
  --color-concrete-gray: oklch(0.63 0.006 265);
  --color-rebar-green: oklch(0.53 0.12 160);
  --color-overrun-red: oklch(0.55 0.22 25);

  /* Typography */
  --font-sans: 'DM Sans Variable', system-ui, sans-serif;
}
```
**Source:** [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme), fierro_web globals.css OKLch values

### Pattern 2: BaseLayout with ClientRouter
**What:** Single layout wrapping all pages with `<ClientRouter />` for smooth page transitions, responsive viewport meta, favicon, and nav + footer.
**When to use:** Every page imports this layout.
**Example:**
```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
    <title>{title} | Fierro</title>
    <ClientRouter />
  </head>
  <body class="bg-off-white text-gunmetal font-sans">
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```
**Source:** [Astro View Transitions docs](https://docs.astro.build/en/guides/view-transitions/) -- `ClientRouter` replaced deprecated `ViewTransitions` in Astro 5.0

### Pattern 3: Inline Script for Nav Scroll + Mobile Toggle
**What:** A small `<script>` tag in the Nav component handles scroll-based background transition and mobile menu toggle. This is idiomatic Astro -- ship minimal JS only where needed.
**When to use:** Navigation interactivity that cannot be CSS-only.
**Example:**
```astro
<!-- Inside Nav.astro -->
<script>
  // Re-run on each page navigation with ClientRouter
  document.addEventListener('astro:page-load', () => {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Scroll-based background transition
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav?.classList.add('bg-gunmetal');
        nav?.classList.remove('bg-transparent');
      } else {
        nav?.classList.remove('bg-gunmetal');
        nav?.classList.add('bg-transparent');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run on load

    // Mobile menu toggle
    toggle?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('hidden');
      document.body.classList.toggle('overflow-hidden');
    });
  });
</script>
```
**Source:** [Astro tutorial: scripts](https://docs.astro.build/en/tutorial/3-components/4/), [Astro view transitions event](https://docs.astro.build/en/guides/view-transitions/)

### Pattern 4: Static-Only Cloudflare Workers Deployment
**What:** Configure `wrangler.jsonc` for asset-only deployment (no Worker code). Cloudflare serves static files from `./dist`.
**When to use:** Static Astro sites with no SSR.
**Example:**
```jsonc
// wrangler.jsonc
{
  "name": "fierro-pubsite",
  "compatibility_date": "2026-03-09",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "routes": [
    {
      "pattern": "getfierro.com",
      "custom_domain": true
    }
  ]
}
```
**Source:** [Cloudflare Workers Astro guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/), [Workers Static Assets docs](https://developers.cloudflare.com/workers/static-assets/)

### Anti-Patterns to Avoid
- **Using @astrojs/tailwind integration:** Deprecated for Tailwind v4. Use `@tailwindcss/vite` directly in Astro's Vite config instead.
- **Using `<ViewTransitions />`:** Deprecated in Astro 5, will be removed in v6. Use `<ClientRouter />` from `astro:transitions`.
- **Deploying to Cloudflare Pages:** The project decision is Workers Static Assets. Pages is the legacy path; Workers is where Cloudflare invests.
- **Adding `@astrojs/cloudflare` adapter for static sites:** The adapter is only needed for SSR/on-demand rendering. A purely static site only needs `wrangler.jsonc` with `assets.directory`.
- **Google Fonts CDN for DM Sans:** Defeats performance goals. Use `@fontsource-variable/dm-sans` for self-hosted WOFF2.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image optimization | Custom sharp/imagemin pipeline | Astro `<Image>` and `<Picture>` components | Built-in WebP/AVIF conversion, width/height, lazy loading, srcset |
| Font loading | Manual @font-face declarations | `@fontsource-variable/dm-sans` | Handles WOFF2 files, font-display swap, unicode-range, all weights in one import |
| CSS utility framework | Custom utility classes | Tailwind CSS v4 `@theme` | Generates utilities from tokens, tree-shakes unused CSS, consistent with fierro_web |
| View transitions | Custom page transition JS | Astro `<ClientRouter />` | Handles browser compatibility, fallback, route caching, animation coordination |
| Static asset deployment | Custom build scripts | wrangler deploy | Handles hashing, edge caching, CDN distribution, certificate management |
| Security headers | Manual Worker code | `_headers` file in `public/` | Cloudflare Workers Static Assets parses and applies headers to static responses |

**Key insight:** Astro + Tailwind + Cloudflare Workers is a batteries-included stack for static marketing sites. Every problem in this phase has a well-supported, zero-config solution. Resist the urge to customize.

## Common Pitfalls

### Pitfall 1: Wrong Tailwind Integration for v4
**What goes wrong:** Installing `@astrojs/tailwind` instead of `@tailwindcss/vite`. The Astro integration is deprecated for Tailwind v4 and will not work correctly.
**Why it happens:** Older tutorials and docs reference `npx astro add tailwind` which historically installed the Astro integration.
**How to avoid:** Install `tailwindcss` and `@tailwindcss/vite` directly, configure in `astro.config.mjs` under `vite.plugins`.
**Warning signs:** Error messages about missing `tailwind.config.js`, or utility classes not generating.

### Pitfall 2: Using ViewTransitions Instead of ClientRouter
**What goes wrong:** Importing `ViewTransitions` from `astro:transitions` triggers deprecation warnings and will break in Astro 6.
**Why it happens:** Many tutorials and blog posts still reference the old name.
**How to avoid:** Always import `ClientRouter` from `astro:transitions`.
**Warning signs:** TypeScript deprecation warnings in the editor.

### Pitfall 3: Mobile Menu Script Not Re-Running After Navigation
**What goes wrong:** With `<ClientRouter />` enabled, inline scripts run once but don't re-execute on client-side navigations, breaking mobile menu toggle on subsequent pages.
**Why it happens:** `<ClientRouter />` intercepts navigation and swaps page content without full page reload.
**How to avoid:** Wrap all DOM setup in `document.addEventListener('astro:page-load', () => { ... })` instead of running at top level.
**Warning signs:** Mobile menu works on first page load but stops responding after clicking a nav link.

### Pitfall 4: Deploying to Workers Without Custom Domain Config
**What goes wrong:** Site deploys to a `*.workers.dev` subdomain but not to `getfierro.com`.
**Why it happens:** Custom domain requires explicit `routes` configuration in `wrangler.jsonc` with `custom_domain: true`.
**How to avoid:** Add `routes` array with the target domain pattern. Ensure the domain's DNS is managed by Cloudflare.
**Warning signs:** `wrangler deploy` succeeds but the site is only accessible at the workers.dev URL.

### Pitfall 5: Logo SVG Not Rendering Correctly
**What goes wrong:** The logo SVG uses `currentColor` fill, so it inherits the wrong text color in some contexts.
**Why it happens:** `currentColor` is inherited from the parent element's `color` CSS property.
**How to avoid:** Set explicit `color` on the logo wrapper element (e.g., white on dark nav background) or apply specific fill colors via CSS class.
**Warning signs:** Logo appears invisible or wrong color against certain backgrounds.

### Pitfall 6: Favicon Not Found at Root
**What goes wrong:** Favicon at `src/assets/favicon.ico` is not automatically served at `/favicon.ico`.
**Why it happens:** Files in `src/assets/` are processed by Astro's build pipeline. Only files in `public/` are served as-is at root paths.
**How to avoid:** Either place `favicon.ico` in `public/` for direct serving, or reference it in the `<head>` using an Astro import from `src/assets/`. For a simple ICO file, `public/favicon.ico` is simpler.
**Warning signs:** Browser shows default favicon or 404 in network tab.

### Pitfall 7: _headers File Placed in Wrong Directory
**What goes wrong:** Custom security headers defined in `_headers` are not applied.
**Why it happens:** The file must be in the final `dist/` output, so it needs to be authored in `public/` (Astro copies `public/` contents to `dist/` at build time).
**How to avoid:** Create `public/_headers` -- Astro copies it to `dist/_headers` -- Cloudflare Workers parses it.
**Warning signs:** Security headers missing from response in browser DevTools.

## Code Examples

### Astro Config with Tailwind v4 Vite Plugin
```javascript
// astro.config.mjs
// Source: https://tailwindcss.com/docs/installation/framework-guides/astro
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://getfierro.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Global CSS with Brand Tokens
```css
/* src/styles/global.css */
/* Source: https://tailwindcss.com/docs/theme + fierro_web/src/app/globals.css */
@import "tailwindcss";
@import "@fontsource-variable/dm-sans";

@theme {
  /* Brand Colors (OKLch) -- matched from fierro_web */
  --color-gunmetal: oklch(0.235 0.006 265);
  --color-molten-orange: oklch(0.62 0.19 48);
  --color-off-white: oklch(0.97 0.005 90);
  --color-concrete-gray: oklch(0.63 0.006 265);
  --color-rebar-green: oklch(0.53 0.12 160);
  --color-overrun-red: oklch(0.55 0.22 25);

  /* Typography */
  --font-sans: 'DM Sans Variable', system-ui, sans-serif;
}
```

### Static Workers Deployment Config
```jsonc
// wrangler.jsonc
// Source: https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/
{
  "name": "fierro-pubsite",
  "compatibility_date": "2026-03-09",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "routes": [
    {
      "pattern": "getfierro.com",
      "custom_domain": true
    }
  ]
}
```

### Security Headers File
```
# public/_headers
# Source: https://developers.cloudflare.com/workers/static-assets/headers/

/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Stub Page Template
```astro
---
// src/pages/pricing.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Pricing">
  <section class="flex min-h-[60vh] items-center justify-center">
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gunmetal">Pricing</h1>
      <p class="mt-4 text-lg text-concrete-gray">Coming soon</p>
    </div>
  </section>
</BaseLayout>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@astrojs/tailwind` integration | `@tailwindcss/vite` Vite plugin | Tailwind v4 (Jan 2025) | No more Astro integration needed; configure directly in Vite |
| `tailwind.config.js` file | `@theme` directive in CSS | Tailwind v4 (Jan 2025) | Config lives in CSS, no JS config file, generates CSS variables |
| `<ViewTransitions />` | `<ClientRouter />` | Astro 5.0 (Dec 2024) | Name clarifies purpose; old name deprecated, removed in v6 |
| Cloudflare Pages | Cloudflare Workers Static Assets | 2024-2025 | Workers is the recommended path for new projects; Pages is maintenance mode |
| `wrangler.toml` | `wrangler.jsonc` | Wrangler v3 | JSONC is now the preferred config format (TOML still supported) |
| Google Fonts / CDN fonts | Fontsource self-hosted | Ongoing | Better performance (no external DNS), GDPR compliance, offline capability |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Do not use for Tailwind v4 projects
- `ViewTransitions` component: Deprecated in Astro 5, use `ClientRouter`
- Cloudflare Pages for new projects: Use Workers Static Assets instead
- `tailwind.config.js`: Not needed with Tailwind v4's CSS-first configuration

## Open Questions

1. **Workers Builds vs GitHub Actions for CI/CD**
   - What we know: Cloudflare Workers Builds offers built-in Git integration (auto-detect framework, deploy on push). GitHub Actions with `cloudflare/wrangler-action@v3` offers more control.
   - What's unclear: Whether Workers Builds supports all the build steps needed (Astro build + wrangler deploy). User said "git push triggers a build-and-deploy pipeline" -- either approach satisfies this.
   - Recommendation: Start with Workers Builds (zero-config). Fall back to GitHub Actions if constraints emerge. This is Claude's discretion per CONTEXT.md.

2. **Custom Domain DNS Prerequisites**
   - What we know: Custom domains require the zone to be active on Cloudflare (DNS managed by Cloudflare). Cloudflare auto-creates DNS records and certificates.
   - What's unclear: Whether getfierro.com DNS is already on Cloudflare or needs migration. The domain may currently point to the fierro_web Vercel deployment.
   - Recommendation: Plan assumes Cloudflare DNS is configured. Flag as a prerequisite with verification step.

3. **Nav scroll threshold value**
   - What we know: User left this to Claude's discretion. Common values are 50px, 100px, or IntersectionObserver-based.
   - Recommendation: Use 50px -- quick enough to feel responsive, avoids jarring snap. Add `transition-colors duration-300` for smooth CSS transition.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright (latest) |
| Config file | none -- see Wave 0 |
| Quick run command | `npx playwright test --project=chromium` |
| Full suite command | `npx playwright test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FNDN-01 | Astro site builds successfully | smoke | `npm run build` | N/A (build script) |
| FNDN-02 | Brand colors render correctly | e2e | `npx playwright test tests/brand.spec.ts -x` | Wave 0 |
| FNDN-03 | Page has viewport meta, favicon, view transitions | e2e | `npx playwright test tests/layout.spec.ts -x` | Wave 0 |
| FNDN-04 | Site deploys and serves from getfierro.com | manual-only | Manual DNS/deployment verification | N/A |
| FNDN-05 | Images served from src/assets via Astro optimization | manual-only | No images in Phase 1 stubs | N/A |
| NAV-01 | Sticky nav with correct links visible | e2e | `npx playwright test tests/nav.spec.ts -x` | Wave 0 |
| NAV-02 | Mobile hamburger menu toggles, 44px+ touch targets | e2e | `npx playwright test tests/nav-mobile.spec.ts -x` | Wave 0 |
| NAV-03 | Footer renders with correct links | e2e | `npx playwright test tests/footer.spec.ts -x` | Wave 0 |
| NAV-04 | Login link href is app.getfierro.com/login | e2e | `npx playwright test tests/nav.spec.ts -x` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npm run build` (build succeeds)
- **Per wave merge:** `npx playwright test` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `playwright.config.ts` -- Playwright config with webServer pointing to Astro dev/preview
- [ ] `tests/nav.spec.ts` -- covers NAV-01, NAV-04
- [ ] `tests/nav-mobile.spec.ts` -- covers NAV-02
- [ ] `tests/footer.spec.ts` -- covers NAV-03
- [ ] `tests/layout.spec.ts` -- covers FNDN-03
- [ ] `tests/brand.spec.ts` -- covers FNDN-02
- [ ] Framework install: `npm install -D @playwright/test && npx playwright install chromium`

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS Astro Installation Guide](https://tailwindcss.com/docs/installation/framework-guides/astro) -- Vite plugin setup, verified current
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) -- @theme directive, OKLch colors, inline modifier
- [Cloudflare Workers Astro Guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/) -- static site wrangler.jsonc config
- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) -- asset serving, caching, routing
- [Cloudflare Workers Static Assets Headers](https://developers.cloudflare.com/workers/static-assets/headers/) -- _headers file syntax and limits
- [Cloudflare Workers Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) -- domain routing config
- [Cloudflare Workers Builds Git Integration](https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/github-integration/) -- auto-deploy on push
- [Astro Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) -- Workers vs Pages, build commands
- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/) -- ClientRouter component
- [Astro Upgrade to v5](https://docs.astro.build/en/guides/upgrade-to/v5/) -- ViewTransitions renamed to ClientRouter
- [Fontsource DM Sans Install](https://fontsource.org/fonts/dm-sans/install) -- variable font package, CSS reference
- fierro_web/src/app/globals.css -- OKLch color token values (local file, verified)

### Secondary (MEDIUM confidence)
- [Astro 5.2 Release](https://astro.build/blog/astro-520/) -- first-class Tailwind v4 support
- [Cloudflare wrangler-action GitHub](https://github.com/cloudflare/wrangler-action) -- GitHub Actions CI/CD alternative
- [Astro Project Structure](https://docs.astro.build/en/basics/project-structure/) -- src/pages, src/layouts, src/components conventions

### Tertiary (LOW confidence)
- [Migrate Astro from Pages to Workers](https://cai.im/blog/migrate-astro-site-from-cloudflare-pages-to-workers/) -- community blog, confirms static config pattern
- [Astro responsive nav tutorial](https://web3templates.com/blog/create-responsive-navigation-menu-in-astro-javascript) -- nav implementation patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified via official docs, versions confirmed on npm
- Architecture: HIGH -- patterns directly from official guides and fierro_web codebase
- Pitfalls: HIGH -- each pitfall verified against official docs or confirmed via community reports
- Deployment: MEDIUM -- custom domain routing depends on DNS state (unknown), Workers Builds auto-config is newer feature

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (30 days -- stable ecosystem, no breaking changes expected)
