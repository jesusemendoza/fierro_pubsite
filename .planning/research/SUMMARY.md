# Project Research Summary

**Project:** Fierro Public Site (getfierro.com)
**Domain:** Static marketing site for construction SaaS
**Researched:** 2026-03-09
**Confidence:** HIGH

## Executive Summary

Fierro's public marketing site is a purely static, zero-JavaScript-by-default marketing site targeting construction professionals -- a skeptical audience that evaluates software the way they evaluate subcontractors: fast credibility check, then detailed scrutiny. The research converges on a clear approach: Astro 5 (stable, not the v6 beta) with Tailwind CSS v4 for styling, deployed as static assets to Cloudflare Workers (not the deprecated Cloudflare Pages). The stack is intentionally minimal -- no React, no SSR, no CMS, no runtime JavaScript except for one or two tiny islands (mobile nav toggle, pricing period toggle). Every technology choice optimizes for the PROJECT.md constraint of Lighthouse 95+ and TTI < 1.5s on 3G.

The competitive landscape (Procore, ingenious.build, JobTread, Buildertrend) reveals that transparent pricing is Fierro's biggest competitive weapon -- enterprise players deliberately hide their pricing, and construction buyers hate it. The site needs five pages at launch: landing, features (or folded into landing), pricing, privacy, and terms, plus a "Why Fierro" narrative page that speaks in builder voice rather than generic SaaS marketing copy. The architecture is straightforward: a single BaseLayout, section-based page composition, typed data files instead of a CMS, and build-time image optimization via Sharp. This is a well-documented pattern with high confidence across all research areas.

The top risks are infrastructure-level: deploying to the deprecated Cloudflare Pages instead of Workers Static Assets, using the deprecated `@astrojs/tailwind` integration instead of the Tailwind v4 Vite plugin, and placing images in `public/` where they bypass optimization. A subtler but equally important risk is tonal -- construction professionals will bounce immediately if the site reads like generic SaaS marketing. Copy must use construction vocabulary ("cost codes," "change orders," "subs"), show the actual product UI, and quantify dollar-impact claims. All critical pitfalls are preventable through correct Phase 1 scaffolding decisions.

## Key Findings

### Recommended Stack

The stack is deliberately lean. Astro 5 ships zero JavaScript by default, which directly serves the performance constraints. Tailwind CSS v4's native OKLCH color space matches the fierro_web brand system, and its CSS-first `@theme` configuration eliminates the need for a separate config file. Self-hosted DM Sans via Fontsource removes the Google Fonts CDN dependency (saves ~100ms, eliminates GDPR concerns). Deployment targets Cloudflare Workers with Static Assets -- not the deprecated Cloudflare Pages.

**Core technologies:**
- **Astro 5.18** (stable): Zero-JS static site framework -- purpose-built for content/marketing sites. Do NOT use v6 beta.
- **Tailwind CSS v4.2** via `@tailwindcss/vite`: CSS-first config, OKLCH color support, 5x faster builds. Do NOT use deprecated `@astrojs/tailwind`.
- **Sharp** (built into Astro): Build-time image optimization -- WebP/AVIF conversion, responsive srcset, CLS prevention.
- **Fontsource DM Sans Variable**: Self-hosted variable font, single file for all weights, no third-party requests.
- **Cloudflare Workers Static Assets**: Edge-deployed to 300+ PoPs. Replaces the deprecated Cloudflare Pages.
- **TypeScript 5.x**: Type-safe props, data files, and component interfaces throughout.
- **Astro View Transitions**: Browser-native page transitions, zero JS overhead, 85%+ browser support.

**Critical version/configuration notes:**
- Do NOT install `@astrojs/cloudflare` adapter -- it is for SSR sites, not static. Deploy `dist/` directly.
- Do NOT install `@astrojs/tailwind` -- it is deprecated and only supports Tailwind v3.
- Use `wrangler.jsonc` with `assets.directory` (Workers), not `pages_build_output_dir` (deprecated Pages).

### Expected Features

**Must have (table stakes):**
- Dark/premium hero section with outcome headline and product screenshot (not stock imagery)
- Primary + secondary CTAs above the fold ("Start Free" + "See How It Works")
- Client/partner logo bar or trust signals (placeholder acceptable at launch)
- 3-4 quantified value proposition cards
- Feature showcase with alternating screenshot/copy layout
- Pricing page with transparent tiers (Free/$0, Plus/$49, Builder/custom) -- a competitive weapon
- Responsive mobile-first design (63%+ of construction visitors use mobile from the field)
- Sticky navigation with clear IA: Logo | Features | Pricing | Why Fierro | Login | **Start Free**
- Footer with trust signals and legal links
- Privacy and Terms pages (duplicated from fierro_web)
- SEO meta tags, Open Graph, and JSON-LD structured data
- Fast load times (Lighthouse 95+, TTI < 1.5s on 3G)

**Should have (differentiators):**
- "Why Fierro" narrative page -- pain-first, builder-voiced, the emotional core of the site
- Quantified ROI claims ("Average user saves X hours/week")
- Interactive pricing toggle (monthly/annual) -- one of the few justified Astro islands
- "How it works" 3-step walkthrough section on homepage
- Role-based persona messaging (lightweight: homepage callouts for GCs, subs, owners)
- Dark mode / premium aesthetic (Gunmetal base with Molten Orange accents)
- CSS-only scroll-triggered animations (restrained, no parallax)

**Defer to v2+:**
- Blog / content hub (high maintenance, stale blog damages credibility)
- Interactive product demo / embedded app sandbox
- Live chat widget (requires staffing; use email or Calendly instead)
- ROI calculator (needs real user data)
- A/B testing infrastructure (need traffic first)
- CMS / headless content management (< 10 pages, content in code)
- Competitor comparison pages
- Full persona landing pages
- Video testimonials (require customer relationships and production)

### Architecture Approach

The architecture follows Astro's canonical static site pattern: a single `BaseLayout.astro` wrapping all pages, section-based composition (Hero, ValueProps, FeatureGrid, PricingTable, CTABanner), typed data files in `src/data/` instead of a CMS, and build-time image optimization with images stored in `src/images/` (never `public/`). Data flows one direction -- down from pages through sections to UI primitives -- with zero state management. Pages are thin orchestrators that import sections and data.

**Major components:**
1. **BaseLayout** -- HTML shell with `<head>` (meta, fonts, CSS), Header, Footer, and `<slot />` for page content
2. **Global components** (Header, Footer, MobileMenu) -- site-wide chrome imported by BaseLayout
3. **UI primitives** (Button, Card, Badge, Container, Section) -- stateless, prop-driven building blocks
4. **Section components** (Hero, ValueProps, FeatureGrid, PricingTable, CTABanner, TrustLogos) -- full-width visual blocks that compose primitives
5. **Data files** (`src/data/pricing.ts`, `features.ts`, `navigation.ts`) -- typed TypeScript objects as the single source of structured content
6. **SEO components** (BaseHead, JsonLd) -- meta tags, OG, structured data in `<head>`

### Critical Pitfalls

1. **Cloudflare Pages is deprecated** -- Deploy to Workers Static Assets from day one. Use `assets.directory` in `wrangler.jsonc`, not `pages_build_output_dir`. Configure `not_found_handling: "404-page"` explicitly. (Pitfall 1)

2. **Deprecated Tailwind integration** -- Use `@tailwindcss/vite` in Astro's Vite config, not `@astrojs/tailwind` (which only supports Tailwind v3). Define brand tokens in CSS `@theme` blocks, not `tailwind.config.mjs`. (Pitfall 3)

3. **Images in `public/` bypass all optimization** -- All raster images must go in `src/images/` (or `src/assets/`) to be processed by Sharp at build time. Images in `public/` get no format conversion, resizing, or CLS prevention. This is the single biggest performance killer. (Pitfall 8)

4. **Construction audience distrust** -- Generic SaaS copy ("streamline your workflow") triggers immediate bounce. Show the actual product UI, use construction vocabulary, quantify dollar impact. If you can replace "Fierro" with any SaaS name and the copy still works, it is too generic. (Pitfall 4)

5. **Cloudflare Auto Minify breaks Astro hydration** -- Disable Auto Minify in the Cloudflare dashboard. Astro already minifies at build time; Cloudflare's additional minification can silently break interactive islands (mobile nav, pricing toggle). (Pitfall 7)

## Implications for Roadmap

Based on the combined research, the project naturally decomposes into 5 phases following the architecture's build-order dependencies and the feature priority hierarchy.

### Phase 1: Foundation and Deployment Pipeline

**Rationale:** Everything depends on the project scaffold, design system, and deployment pipeline being correct. Three of the five critical pitfalls (Workers deployment, Tailwind setup, image conventions) are Phase 1 decisions. Getting these wrong poisons everything that follows.

**Delivers:** Working Astro project deployed to Cloudflare Workers with Tailwind v4 design tokens, self-hosted fonts, BaseLayout, Header, Footer, and a placeholder index page visible at getfierro.com.

**Addresses (from FEATURES.md):** Responsive navigation with sticky behavior, footer with trust signals and legal links, mobile hamburger menu.

**Avoids (from PITFALLS.md):** Pitfall 1 (deprecated Pages), Pitfall 3 (deprecated Tailwind), Pitfall 5 (font FOUT), Pitfall 7 (Auto Minify), Pitfall 8 (images in public/), Pitfall 10 (custom 404), Pitfall 11 (missing headers).

**Components built:** Project scaffolding, `astro.config.mjs`, `wrangler.jsonc`, `global.css` with `@theme`, font setup, BaseHead, BaseLayout, Header, Footer, MobileMenu, Button, Container, Section primitives, 404 page, `_headers` file, `_redirects` file.

### Phase 2: Landing Page

**Rationale:** The homepage is where 80%+ of traffic lands. If this page converts, nothing else matters at launch. It depends on the section components and UI primitives from Phase 1, plus product screenshots (an external dependency that must be prepared in parallel).

**Delivers:** Complete landing page with dark hero, product screenshot, dual CTAs, trust/logo bar, value proposition cards, feature showcase section, "how it works" walkthrough, and closing CTA banner.

**Addresses (from FEATURES.md):** Hero section with outcome headline, product screenshot, primary + secondary CTAs, logo bar, value proposition cards, feature showcase (alternating layout), scroll-triggered animations (CSS-only).

**Avoids (from PITFALLS.md):** Pitfall 4 (generic SaaS copy -- use construction vocabulary), Pitfall 9 (unnecessary JS islands -- use CSS animations), Pitfall 14 (hero without product UI).

**Components built:** Hero, TrustLogos, ValueProps, FeatureGrid/FeatureHighlights, HowItWorks, CTABanner section components. Data files: `features.ts`, `navigation.ts`.

### Phase 3: Pricing and Why Fierro Pages

**Rationale:** Pricing is the second most-visited page on any SaaS marketing site. Construction buyers comparison-shop and Fierro's transparent pricing is a deliberate weapon against Procore/Buildertrend opacity. "Why Fierro" is the emotional differentiator that turns "maybe" into "let me try it." These two pages complete the conversion funnel.

**Delivers:** Pricing page with three-column tier comparison, monthly/annual toggle (Astro island), feature comparison table, FAQ section. "Why Fierro" narrative page with pain/insight/solution/proof structure in builder voice.

**Addresses (from FEATURES.md):** Transparent pricing tiers, interactive pricing toggle, feature comparison table, "Why Fierro" narrative, role-based persona callouts, quantified ROI claims.

**Avoids (from PITFALLS.md):** Pitfall 12 (pricing data drift -- mirror from `fierro_web/src/lib/billing/plans.ts` with documented source of truth), Pitfall 4 (use builder voice, not corporate SaaS voice).

**Components built:** PricingTable, PricingTier, PricingToggle (island), FAQ/Accordion, `pricing.ts` data file. Why Fierro page sections.

### Phase 4: Legal Pages and SEO

**Rationale:** Legal pages are a launch requirement and low complexity (content duplicated from fierro_web). SEO is a final pass that should happen after all pages exist so structured data and OG tags can be validated comprehensively. Combining these maximizes the value of the SEO audit.

**Delivers:** Privacy and Terms pages with consistent styling. Complete SEO implementation: unique meta per page, OG images, JSON-LD structured data (Organization, SoftwareApplication, Offer schemas), sitemap, robots.txt.

**Addresses (from FEATURES.md):** Privacy and Terms pages, SEO meta tags, Open Graph for social sharing, structured data for rich results.

**Avoids (from PITFALLS.md):** Pitfall 6 (missing/malformed OG tags and structured data -- validate with Google Rich Results Test).

**Components built:** Privacy page, Terms page, JsonLd component updates, OG image generation, sitemap verification. SEO audit pass across all pages.

### Phase 5: Performance Audit, Animation Polish, and Launch

**Rationale:** Performance testing must happen on the complete site, not individual pages. Animations are polish that should be layered on last. This phase is the quality gate before production launch.

**Delivers:** Lighthouse 95+ scores on all pages (mobile), verified 3G performance (TTI < 1.5s), View Transitions between pages, CSS scroll-triggered animations, final cross-browser and device testing.

**Addresses (from FEATURES.md):** Fast load times (Lighthouse 95+), scroll-triggered animations (restrained), responsive mobile-first design verification, View Transitions for SPA-like feel.

**Avoids (from PITFALLS.md):** Pitfall 13 (dev machine results not reflecting real-world -- test on actual 3G / mid-range Android), Pitfall 9 (audit for unnecessary JS bundles).

**Deliverables:** Lighthouse reports, WebPageTest results, View Transitions integration, CSS animation implementation, cross-browser testing, production deployment verification, pre-deployment checklist sign-off.

### Phase Ordering Rationale

- **Phase 1 before everything:** The architecture research is unambiguous -- BaseLayout, design tokens, and deployment pipeline are prerequisites for all other work. Three critical pitfalls are Phase 1 decisions.
- **Phase 2 immediately after:** The landing page is the conversion surface. It exercises the full component hierarchy (layout > sections > primitives) and validates the architecture end-to-end.
- **Phase 3 completes the funnel:** Pricing and "Why Fierro" are the two pages that close a visitor. They depend on the section component patterns established in Phase 2.
- **Phase 4 is a sweep:** Legal pages are low-complexity. SEO is best done as a comprehensive pass after all pages exist.
- **Phase 5 is the quality gate:** Performance and polish should be verified on the complete site, not incrementally. View Transitions and animations are additive -- they should not influence core layout decisions.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** Cloudflare Workers Static Assets deployment -- the Pages-to-Workers migration is recent (April 2025 deprecation) and documentation is still catching up. Verify `_headers` file behavior on Workers vs. Pages. Consider running `/gsd:research-phase` to validate the exact `wrangler.jsonc` configuration and CI/CD setup.
- **Phase 3:** Pricing toggle island implementation -- this is the one interactive component that requires an Astro island. Research whether a CSS-only `:checked` approach can replace the island entirely, avoiding any JS bundle.

Phases with standard patterns (skip research-phase):
- **Phase 2:** Landing page section composition is a thoroughly documented Astro pattern. The architecture research provides exact component hierarchy and code examples.
- **Phase 4:** Legal pages and SEO meta tags are well-documented. `@astrojs/sitemap`, OG tags, and JSON-LD have established patterns with high confidence.
- **Phase 5:** Lighthouse auditing and CSS animations are standard web performance practices.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All technologies are stable releases with official documentation. Astro 5.18, Tailwind v4.2, Sharp -- all verified against npm and official guides. |
| Features | HIGH | Cross-referenced against 5+ construction SaaS competitors (Procore, ingenious.build, JobTread, Buildertrend) plus 2026 SaaS landing page best practices from multiple sources. |
| Architecture | HIGH | Astro's static site patterns are canonical and well-documented. Single-layout, section composition, typed data files -- all battle-tested in the ecosystem. |
| Pitfalls | HIGH | Critical pitfalls (Workers deprecation, Tailwind v4 setup, image optimization) confirmed via official docs and GitHub issues. Construction audience trust pitfall draws from B2B marketing research (MEDIUM confidence on specific conversion numbers, HIGH confidence on directional advice). |

**Overall confidence:** HIGH

### Gaps to Address

- **Product screenshots:** The landing page and feature sections depend on polished screenshots of the Fierro dashboard. These are an external dependency -- the app must be screenshot-ready before Phase 2 hero and feature sections can be finalized. Plan for placeholder screenshots during development with a clear handoff point.
- **Pricing data sync:** The marketing site's pricing data must match `fierro_web/src/lib/billing/plans.ts`. No automated sync exists. This is a manual process for v1 -- document it and consider a build-time validation script for v2.
- **Workers `_headers` file behavior:** The `_headers` file is well-documented for Cloudflare Pages but may behave differently on Workers Static Assets. Verify during Phase 1 scaffolding. Fallback: set headers programmatically via a Worker script.
- **Construction-specific copy:** The research identifies the need for builder-voiced copy with construction vocabulary, but actual copywriting is outside the scope of technical research. Content creation (headlines, value props, "Why Fierro" narrative) should be treated as a parallel workstream.
- **Social proof assets:** Logo bar, testimonials, and award badges depend on real customer relationships. Placeholder sections are acceptable at launch but should be replaced as quickly as possible. An empty social proof section is worse than no section at all.

## Sources

### Primary (HIGH confidence)
- [Astro Official Documentation](https://docs.astro.build/) -- project structure, images, view transitions, Cloudflare deployment, fonts
- [Tailwind CSS v4 Official Docs](https://tailwindcss.com/docs/) -- Astro installation, theme configuration, color customization
- [Cloudflare Workers Static Assets Migration Guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) -- Pages deprecation, Workers config
- [Cloudflare Pages Known Issues](https://developers.cloudflare.com/pages/platform/known-issues/) -- deprecation confirmation
- [Astro GitHub Issues](https://github.com/withastro/astro/issues/) -- Sharp compatibility (#10499), Fonts API bugs (#13637)
- [ingenious.build](https://ingenious.build) -- PRIMARY design inspiration, competitor analysis
- [Procore](https://www.procore.com) -- enterprise competitor analysis
- [JobTread](https://www.jobtread.com) -- mid-market competitor analysis, transparent pricing model
- [Fontsource DM Sans](https://fontsource.org/fonts/dm-sans/install) -- self-hosted font package
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) -- sitemap generation

### Secondary (MEDIUM confidence)
- [SaaSFrame: SaaS Landing Page Trends 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples) -- design trends
- [Smashing Magazine: Designing Better Pricing Pages](https://www.smashingmagazine.com/2022/07/designing-better-pricing-page/) -- pricing page best practices
- [Powered by Search: SaaS Website Best Practices](https://www.poweredbysearch.com/blog/saas-website-best-practices/) -- Authority Architecture Framework
- [DebugBear: Web Font Layout Shift](https://www.debugbear.com/blog/web-font-layout-shift) -- font loading optimization
- [Construction Digital Marketing Trust Signals](https://constructiondigitalmarketing.com/cro/the-role-of-trust-signals-in-driving-conversions/) -- construction audience behavior
- [Buildertrend](https://buildertrend.com) -- competitor analysis (indirect, via third-party reviews)
- [astro-seo package](https://github.com/jonasmerlin/astro-seo) -- SEO component option

### Tertiary (LOW confidence)
- Specific conversion lift percentages (37% for video testimonials, 202% for personalized CTAs) -- directional, not validated for construction SaaS specifically

---
*Research completed: 2026-03-09*
*Ready for roadmap: yes*
