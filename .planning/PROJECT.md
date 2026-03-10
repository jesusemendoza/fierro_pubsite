# Fierro Public Site

## What This Is

A static marketing site for getfierro.com — the public face of Fierro, a construction job cost-control SaaS. Built with Astro and deployed on Cloudflare Pages, it serves as the entry point for potential customers: landing page, feature showcase, pricing, and a "Why Fierro" value proposition section. The app dashboard lives separately at app.getfierro.com. This site carries zero JavaScript by default and must score exceptionally on Time to First Render and Time to Interactive — performance and reliability are the brand's first impression.

## Core Value

The site must load fast and look trustworthy. If a contractor hits getfierro.com and it feels slow or cheap, they'll never click "Sign Up." Performance *is* the brand promise.

## Requirements

### Validated

<!-- Shipped and confirmed in v1.0 -->

- ✓ Static marketing site built with Astro 5 — v1.0
- ✓ Deployed on Cloudflare Workers with getfierro.com custom domain — v1.0
- ✓ Landing page with hero, value props, feature showcase, How It Works, and CTAs — v1.0
- ✓ Pricing page with three tiers (Free/Plus/Builder), toggle, comparison table, FAQ — v1.0
- ✓ Why Fierro narrative page with builder voice and quantified ROI — v1.0
- ✓ Privacy and Terms pages styled consistently — v1.0
- ✓ Cohesive visual design: Gunmetal, Molten Orange, Off-White, DM Sans — v1.0
- ✓ Dark premium aesthetic, clean typography, quantified benefits — v1.0
- ✓ Lighthouse 95+ on Performance, Accessibility, Best Practices — v1.0
- ✓ Zero/near-zero client-side JavaScript — v1.0
- ✓ Deployment and migration documentation — v1.0
- ✓ Responsive mobile-first design, WCAG AA contrast — v1.0
- ✓ SEO: meta tags, Open Graph, JSON-LD structured data, sitemap — v1.0
- ✓ GitHub Actions CI/CD pipeline deploying to Cloudflare Workers — v1.0

### Active

<!-- Current scope. Building toward these. -->

(Defining for next milestone)

### Out of Scope

- Blog — deferred to v2, not needed at launch
- User authentication or Supabase integration — this is a static marketing site
- CMS or dynamic content management — content is in code
- A/B testing infrastructure — premature for launch
- Internationalization — English only for now
- Contact form with backend — use mailto or external form service if needed

## Context

Fierro is a construction financial management platform with a React Native mobile app (fierro_app) and a Next.js web dashboard (fierro_web). Both share a Supabase backend and Stripe billing. The domain split strategy (documented in fierro_web/docs/plans/domain-split-marketing-site.md) moves the dashboard to app.getfierro.com and puts this marketing site at the root getfierro.com.

The existing brand system uses:
- **Colors:** Gunmetal #2B2D31 (authority), Molten Orange #E8600A (energy/CTAs), Off-White #F5F4F0 (surfaces), Concrete Gray #8B8D92 (secondary), Rebar Green #2D8B55 (success), Overrun Red #D93636 (danger)
- **Font:** DM Sans across all weights
- **Voice:** Direct, confident, sharp — "speak to builders like builders"
- **Tagline:** "Every dollar. Every pour. Accounted for."
- **OKLch color space** in fierro_web for perceptual consistency (can adopt for this site too)

Design inspiration from ingenious.build: dark hero sections, product screenshots as proof, modular feature cards, quantified benefit claims, partner/trust logos, premium animations with restraint.

Pricing tiers (from fierro_web/src/lib/billing/plans.ts):
- **Free:** $0/mo — 1 project, 6 sub-projects, 3 team members, basic expense tracking
- **Plus:** $49/mo ($470/yr) — 5 projects, 20 sub-projects, 10 team members, advanced analytics, vendor management, priority support
- **Builder:** Custom — unlimited everything, custom integrations, dedicated account manager, API access

The repo also needs internal documentation covering the full migration process: DNS changes, Vercel domain updates, Supabase auth redirects, OAuth provider updates, Stripe webhook updates, environment variable changes, and verification checklist.

## Constraints

- **Framework:** Astro — static-first, zero JS by default, content-focused
- **Hosting:** Cloudflare Pages — edge-deployed, fast globally, free tier sufficient
- **Styling:** Tailwind CSS — consistent with fierro_web, enables brand color cohesion
- **Performance:** Lighthouse Performance score 95+, TTFR < 1s, TTI < 1.5s on 3G
- **No runtime dependencies:** No Supabase, no auth, no server-side rendering
- **CTAs link to:** app.getfierro.com/signup and app.getfierro.com/login

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro over Next.js | Zero JS by default, purpose-built for static/content sites, lighter bundle | — Pending |
| Cloudflare Pages over Vercel | Matches domain split plan, edge-deployed, keeps marketing infra separate from app | — Pending |
| Subdomain split (app.getfierro.com + getfierro.com) | Industry standard, deploy independence, clean separation of concerns | — Pending |
| Tailwind CSS for styling | Same utility framework as fierro_web, enables brand consistency | — Pending |
| DM Sans as sole typeface | Brand cohesion across all Fierro products | — Pending |
| No blog for v1 | Focus on core marketing pages, blog adds content maintenance burden | — Pending |

---
*Last updated: 2026-03-10 after v1.0 milestone archived*
