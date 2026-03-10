# Milestones: Fierro Public Site

## v1.0 — Static Marketing Site Launch

**Completed:** 2026-03-10
**Phases:** 7 (Phase 1–7)
**Requirements:** 43/43 complete

### What Shipped

A complete static marketing site for getfierro.com built with Astro 5, Tailwind CSS v4, deployed on Cloudflare Workers:

- **Foundation:** Astro project with brand design tokens (OKLch), DM Sans typography, Cloudflare Workers deployment
- **Navigation & Chrome:** Sticky nav with mobile hamburger, footer with link columns, all CTAs linking to app.getfierro.com
- **Landing Page:** Dark premium hero, value prop cards, 5-feature showcase, How It Works walkthrough, scroll animations (CSS-only)
- **Pricing:** Three-tier cards (Free/Plus/Builder), monthly/annual toggle, feature comparison table, FAQ, deep-linked CTAs
- **Why Fierro:** Pain-first narrative in builder voice, quantified ROI claims, AI integration section
- **Legal:** Privacy and Terms pages styled consistently
- **SEO & Performance:** Lighthouse 95+ mobile, <1s TTFR, near-zero JS, OG images, JSON-LD structured data, sitemap
- **Documentation:** Deployment guide, migration guide, deep-link signup flow spec
- **CI/CD:** GitHub Actions workflow deploying to Cloudflare Workers on push to main

### Key Decisions

| Decision | Outcome |
|----------|---------|
| Astro over Next.js | ✓ Good — zero JS by default, Lighthouse 95+ achieved |
| Cloudflare Workers over Pages | ✓ Good — edge-deployed, Workers Routes for custom domain |
| Tailwind v4 via @tailwindcss/vite | ✓ Good — OKLch tokens, no deprecated adapter |
| CSS-only scroll animations | ✓ Good — IntersectionObserver + CSS transitions, zero animation JS |
| Vanilla JS custom elements (pricing toggle, mobile nav) | ✓ Good — minimal JS, ClientRouter compatible |
| Native details/summary for FAQ | ✓ Good — zero JS, built-in accessibility |

### Phases

| # | Phase | Plans | Completed |
|---|-------|-------|-----------|
| 1 | Foundation and Site Chrome | 3 | 2026-03-09 |
| 2 | Landing Page | 3 | 2026-03-09 |
| 3 | Pricing and Why Fierro | 2 | 2026-03-09 |
| 4 | Legal, SEO, and Documentation | 3 | 2026-03-10 |
| 5 | Performance Audit and Launch Polish | 2 | 2026-03-10 |
| 6 | Phase 1 Traceability Closure | 1 | 2026-03-10 |
| 7 | CI/CD Pipeline and Initial Deploy | 1 | 2026-03-10 |
