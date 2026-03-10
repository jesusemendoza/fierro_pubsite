# Requirements: Fierro Public Site

**Defined:** 2026-03-09
**Core Value:** The site must load fast and look trustworthy — performance is the brand's first impression.

## v1 Requirements

### Foundation

- [x] **FNDN-01**: Project scaffolded with Astro 5, Tailwind CSS v4 (via `@tailwindcss/vite`), and self-hosted DM Sans font
- [x] **FNDN-02**: Brand design tokens defined in CSS `@theme` using OKLch color space — Gunmetal, Molten Orange, Off-White, Concrete Gray, Rebar Green, Overrun Red
- [x] **FNDN-03**: Base layout with View Transitions, responsive meta viewport, and favicon
- [x] **FNDN-04**: Site deployed to Cloudflare Workers Static Assets with getfierro.com custom domain
- [x] **FNDN-05**: All images stored in `src/assets/` and served via Astro's built-in image optimization (WebP/AVIF)

### Navigation & Chrome

- [x] **NAV-01**: Sticky top navigation with Logo | Features | Pricing | Why Fierro | Login | **Start Free** CTA button
- [x] **NAV-02**: Mobile hamburger menu that collapses nav on small screens with 44px+ touch targets
- [x] **NAV-03**: Footer with columns: Product (Features, Pricing), Company (Why Fierro), Legal (Privacy, Terms), and social links
- [x] **NAV-04**: "Login" nav link points to app.getfierro.com/login

### Landing Page

- [x] **LAND-01**: Dark premium hero section with Gunmetal background, outcome-focused headline, and product dashboard screenshot
- [x] **LAND-02**: Primary CTA ("Start Free" → app.getfierro.com/signup) and secondary CTA ("See How It Works" → scrolls to features) above the fold
- [x] **LAND-03**: Client/partner trust bar below the hero (placeholder section if no customer logos yet, e.g. "Built for builders" with construction iconography)
- [x] **LAND-04**: 3-4 value proposition cards with quantified benefits (e.g. "See Every Dollar in Real Time", "Track Costs Before They Become Overruns")
- [x] **LAND-05**: Feature showcase section with alternating left/right layout — screenshot + copy for each capability (budget tracking, expenses, team management, vendor management, analytics)
- [x] **LAND-06**: "How It Works" 3-step walkthrough section (Create budget → Track expenses → Know true costs)
- [x] **LAND-07**: Role-based persona callouts section ("For General Contractors" / "For Subcontractors" / "For Project Owners") with tailored one-liners
- [x] **LAND-08**: Closing CTA section with "Start Free" button
- [x] **LAND-09**: Scroll-triggered CSS animations (fade/slide-in) for section reveals — zero JS, using CSS `animation-timeline: view()` or Astro View Transitions

### Pricing

- [x] **PRIC-01**: Three-tier card layout — Free ($0/mo), Plus ($49/mo or $470/yr), Builder (Custom)
- [x] **PRIC-02**: "Most Popular" visual highlight on the Plus tier
- [x] **PRIC-03**: Monthly/annual pricing toggle as an Astro island with savings callout ("Save $118/year")
- [x] **PRIC-04**: Feature comparison table below tier cards showing what's included in each plan
- [x] **PRIC-05**: FAQ section addressing common pricing questions
- [x] **PRIC-06**: Competitive messaging: "No sales calls required. No hidden fees. Start free, upgrade when you're ready."
- [x] **PRIC-07**: Deep-linked CTAs that pass plan context — "Start Free" → `app.getfierro.com/signup`, "Start Plus" → `app.getfierro.com/signup?plan=plus&billing=monthly`, annual variant passes `&billing=annual`, "Contact Sales" → mailto or Calendly

### Why Fierro

- [x] **WHY-01**: Dedicated "Why Fierro" page with pain-first narrative structure (the problem → why it happens → how Fierro fixes it → proof)
- [x] **WHY-02**: Written in "builder voice" — direct, confident, no jargon, like talking to a superintendent at a job trailer
- [x] **WHY-03**: Quantified ROI claims where defensible (e.g. "Catch overruns days earlier", "Eliminate end-of-month spreadsheet panic")
- [x] **WHY-04**: Closing CTA driving to signup

### Legal

- [x] **LEGL-01**: Privacy policy page with content from fierro_web, styled consistently with marketing site
- [x] **LEGL-02**: Terms of service page with content from fierro_web, styled consistently with marketing site

### SEO & Performance

- [x] **PERF-01**: Lighthouse Performance score 95+ on mobile
- [x] **PERF-02**: Time to First Render < 1s and Time to Interactive < 1.5s on simulated 3G
- [x] **PERF-03**: Zero or near-zero client-side JavaScript (only Astro islands for pricing toggle and mobile nav if needed)
- [x] **PERF-04**: Unique title and meta description per page
- [x] **PERF-05**: Open Graph tags and social sharing image per page
- [x] **PERF-06**: Structured data (Organization + SoftwareApplication schema)
- [x] **PERF-07**: Sitemap generated at build time
- [x] **PERF-08**: Responsive design — mobile-first, works across all screen sizes, WCAG AA contrast ratios

### CI/CD

- [x] **CICD-01**: GitHub Actions workflow that builds and deploys to Cloudflare Workers on push to main, using `cloudflare/wrangler-action@v3` with `CLOUDFLARE_API_TOKEN` secret

### Documentation

- [x] **DOCS-01**: `docs/DEPLOYMENT.md` — Cloudflare Workers Static Assets setup, build commands, CI/CD pipeline
- [x] **DOCS-02**: `docs/MIGRATION.md` — Full domain migration guide: DNS changes (Cloudflare CNAME for `app` subdomain), Vercel domain update for fierro_web, Supabase auth redirect URL updates, OAuth provider callback URL updates, Stripe webhook URL updates, environment variable changes, verification checklist
- [x] **DOCS-03**: Planning doc written to `fierro_web/docs/plans/deep-link-signup-flow.md` describing the query-param-based signup flow (`?plan=<tier>&billing=<cycle>`) so fierro_web can implement reading those params and auto-routing to Stripe Checkout for paid plans

## v2 Requirements

### Content

- **BLOG-01**: Blog with MDX content support
- **BLOG-02**: Blog post listing and individual post pages

### Social Proof

- **SOCL-01**: Video testimonials from real contractors
- **SOCL-02**: G2/Capterra award badges once earned
- **SOCL-03**: Full persona pages for each role (GC, Sub, Owner)

### Conversion

- **CONV-01**: ROI calculator with real user data
- **CONV-02**: Competitor comparison pages (Fierro vs Procore, etc.)
- **CONV-03**: Interactive product demo or embedded walkthrough

## Out of Scope

| Feature | Reason |
|---------|--------|
| Blog / content hub | High maintenance, low ROI at launch stage |
| Live chat widget | Adds third-party JS, hurts Lighthouse, requires staffing |
| Interactive product demo | Requires backend infrastructure, breaks static constraint |
| CMS / headless content | < 10 pages, content lives in code, change via git |
| A/B testing infrastructure | Need traffic before testing; premature optimization |
| Internationalization | English only for now |
| Mega-menu navigation | Only 5 pages — simple nav is appropriate |
| User authentication on marketing site | Static site; auth lives on app.getfierro.com |
| Contact form with backend | Use mailto or Calendly instead |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDN-01 | Phase 1 | Complete |
| FNDN-02 | Phase 1 | Complete |
| FNDN-03 | Phase 1 | Complete |
| FNDN-04 | Phase 1 | Complete |
| FNDN-05 | Phase 1 | Complete |
| NAV-01 | Phase 1 | Complete |
| NAV-02 | Phase 1 | Complete |
| NAV-03 | Phase 1 | Complete |
| NAV-04 | Phase 1 | Complete |
| LAND-01 | Phase 2 | Complete |
| LAND-02 | Phase 2 | Complete |
| LAND-03 | Phase 2 | Complete |
| LAND-04 | Phase 2 | Complete |
| LAND-05 | Phase 2 | Complete |
| LAND-06 | Phase 2 | Complete |
| LAND-07 | Phase 2 | Complete |
| LAND-08 | Phase 2 | Complete |
| LAND-09 | Phase 2 | Complete |
| PRIC-01 | Phase 3 | Complete |
| PRIC-02 | Phase 3 | Complete |
| PRIC-03 | Phase 3 | Complete |
| PRIC-04 | Phase 3 | Complete |
| PRIC-05 | Phase 3 | Complete |
| PRIC-06 | Phase 3 | Complete |
| PRIC-07 | Phase 3 | Complete |
| WHY-01 | Phase 3 | Complete |
| WHY-02 | Phase 3 | Complete |
| WHY-03 | Phase 3 | Complete |
| WHY-04 | Phase 3 | Complete |
| LEGL-01 | Phase 4 | Complete |
| LEGL-02 | Phase 4 | Complete |
| PERF-04 | Phase 4 | Complete |
| PERF-05 | Phase 4 | Complete |
| PERF-06 | Phase 4 | Complete |
| PERF-07 | Phase 4 | Complete |
| DOCS-01 | Phase 4 | Complete |
| DOCS-02 | Phase 4 | Complete |
| DOCS-03 | Phase 4 | Complete |
| PERF-01 | Phase 5 | Complete |
| PERF-02 | Phase 5 | Complete |
| PERF-03 | Phase 5 | Complete |
| PERF-08 | Phase 5 | Complete |
| CICD-01 | Phase 7 | Complete |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0

---
*Requirements defined: 2026-03-09*
*Last updated: 2026-03-10 after Phase 7 complete — all v1 requirements done*
