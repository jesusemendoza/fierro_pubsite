# Fierro Public Site

## What This Is

A static marketing site for getfierro.com — the public face of Fierro, a construction job cost-control SaaS. Built with Astro and deployed on Cloudflare Pages, it serves as the entry point for potential customers: landing page, feature showcase, pricing, and a "Why Fierro" value proposition section. The app dashboard lives separately at app.getfierro.com. This site carries zero JavaScript by default and must score exceptionally on Time to First Render and Time to Interactive — performance and reliability are the brand's first impression.

## Core Value

The site must load fast and look trustworthy. If a contractor hits getfierro.com and it feels slow or cheap, they'll never click "Sign Up." Performance *is* the brand promise.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Static marketing site built with Astro
- [ ] Deployed on Cloudflare Pages with getfierro.com custom domain
- [ ] Landing page with hero, value props, "Why Fierro" section, and CTAs to app.getfierro.com/signup
- [ ] Features page showcasing Fierro's capabilities (budget tracking, expenses, team management, vendor management, analytics)
- [ ] Pricing page with three tiers: Free ($0), Plus ($49/mo or $470/yr), Builder (custom/sales)
- [ ] Privacy and Terms pages (duplicated from fierro_web for public access)
- [ ] Cohesive visual design with fierro_app and fierro_web — Gunmetal (#2B2D31), Molten Orange (#E8600A), Off-White (#F5F4F0), DM Sans font
- [ ] Modern construction aesthetic inspired by ingenious.build — dark premium feel, clean typography, quantified benefits, trust signals
- [ ] High Lighthouse performance scores (target 95+ on Performance, Accessibility, Best Practices)
- [ ] Zero or near-zero client-side JavaScript (Astro islands only where needed)
- [ ] Internal deployment and migration documentation in the repo (Cloudflare Pages setup, DNS, Supabase auth URL updates, Stripe webhook updates, OAuth redirect updates)
- [ ] Responsive design — mobile-first, works across all screen sizes
- [ ] SEO-optimized with meta tags, Open Graph, structured data

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
*Last updated: 2026-03-09 after initialization*
