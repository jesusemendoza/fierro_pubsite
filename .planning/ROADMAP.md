# Roadmap: Fierro Public Site

## Overview

This roadmap delivers a static marketing site for getfierro.com -- the public face of Fierro's construction cost-control SaaS. The work progresses from foundational scaffolding and site chrome, through the primary conversion surface (landing page), into the conversion-closing pages (pricing, "Why Fierro"), then legal/SEO/documentation, and finally a performance audit that validates the site meets its Lighthouse 95+ target before launch. Every phase delivers a coherent, verifiable capability and each builds on the previous.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation and Site Chrome** - Astro project scaffold, design tokens, deployment pipeline, and global navigation/footer
- [ ] **Phase 2: Landing Page** - Complete homepage with hero, value props, feature showcase, and conversion CTAs
- [ ] **Phase 3: Pricing and Why Fierro** - Transparent pricing page with toggle and the persuasion-driven "Why Fierro" narrative page
- [ ] **Phase 4: Legal, SEO, and Documentation** - Privacy/Terms pages, comprehensive SEO pass, and deployment/migration docs
- [ ] **Phase 5: Performance Audit and Launch Polish** - Lighthouse 95+ validation, 3G performance verification, JS audit, and responsive/accessibility confirmation
- [ ] **Phase 6: Phase 1 Traceability Closure** - Create missing Phase 1 documentation artifacts (01-02-SUMMARY.md, VERIFICATION.md) and update REQUIREMENTS.md for NAV-01–04

## Phase Details

### Phase 1: Foundation and Site Chrome
**Goal**: A working Astro site deployed to Cloudflare Workers with brand design tokens, responsive navigation, and footer -- visible at getfierro.com with a placeholder index page
**Depends on**: Nothing (first phase)
**Requirements**: FNDN-01, FNDN-02, FNDN-03, FNDN-04, FNDN-05, NAV-01, NAV-02, NAV-03, NAV-04
**Success Criteria** (what must be TRUE):
  1. Visiting getfierro.com loads a page styled with Fierro brand colors (Gunmetal, Molten Orange, Off-White) and DM Sans typography
  2. A sticky top navigation with Logo, Features, Pricing, Why Fierro, Login, and "Start Free" CTA is visible on all screen sizes, collapsing to a hamburger menu on mobile with 44px+ touch targets
  3. A footer with Product, Company, and Legal link columns renders at the bottom of every page
  4. "Login" link navigates to app.getfierro.com/login and "Start Free" navigates to app.getfierro.com/signup
  5. The site is deployed to Cloudflare Workers Static Assets (not deprecated Pages) and a `git push` triggers a build-and-deploy pipeline
**Plans**: 3 plans

Plans:
- [ ] 01-01-PLAN.md -- Scaffold Astro 5 project with Tailwind v4, DM Sans, brand tokens, and BaseLayout
- [ ] 01-02-PLAN.md -- Build Nav, MobileMenu, Footer components and all 5 stub pages
- [ ] 01-03-PLAN.md -- Configure Cloudflare Workers deployment and Playwright test suite

### Phase 2: Landing Page
**Goal**: A complete homepage that communicates Fierro's value to construction professionals, showcases the product, and drives visitors toward signup
**Depends on**: Phase 1
**Requirements**: LAND-01, LAND-02, LAND-03, LAND-04, LAND-05, LAND-06, LAND-07, LAND-08, LAND-09
**Success Criteria** (what must be TRUE):
  1. The homepage opens with a dark premium hero section featuring an outcome-focused headline, a product dashboard screenshot, and two CTAs above the fold -- "Start Free" (links to signup) and "See How It Works" (scrolls to features)
  2. Below the hero, a trust/logo bar, 3-4 quantified value proposition cards, and an alternating-layout feature showcase section present Fierro's capabilities (budget tracking, expenses, team management, vendor management, analytics)
  3. A "How It Works" 3-step walkthrough and role-based persona callouts (GC, Sub, Owner) are visible below the feature showcase
  4. A closing CTA banner with "Start Free" button appears at the bottom of the page content
  5. Sections animate into view on scroll using CSS-only animations (no JavaScript)
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md -- Animation CSS infrastructure, Hero section, and Value Proposition cards
- [ ] 02-02-PLAN.md -- Feature showcase with 5 alternating rows, How It Works walkthrough, and Closing CTA
- [ ] 02-03-PLAN.md -- Page assembly (index.astro composition + IntersectionObserver) and Playwright test suite

### Phase 3: Pricing and Why Fierro
**Goal**: Visitors can evaluate Fierro's pricing transparently and read a persuasive, builder-voiced narrative explaining why Fierro exists and what makes it different
**Depends on**: Phase 2
**Requirements**: PRIC-01, PRIC-02, PRIC-03, PRIC-04, PRIC-05, PRIC-06, PRIC-07, WHY-01, WHY-02, WHY-03, WHY-04
**Success Criteria** (what must be TRUE):
  1. The /pricing page displays three tiers (Free at $0/mo, Plus at $49/mo or $470/yr, Builder at custom pricing) in a card layout with "Most Popular" highlighted on Plus
  2. A monthly/annual toggle switches displayed prices and shows a savings callout ("Save $118/year"), and CTA buttons deep-link to signup with plan and billing context in query params
  3. A feature comparison table and FAQ section appear below the tier cards, answering common pricing questions with competitive messaging ("No sales calls required")
  4. The /why-fierro page presents a pain-first narrative (problem, why it happens, how Fierro fixes it, proof) written in direct, construction-vocabulary builder voice with quantified ROI claims
  5. Both pages end with a clear CTA driving visitors to app.getfierro.com/signup
**Plans**: 2 plans

Plans:
- [ ] 03-01-PLAN.md -- Pricing page: tier cards, monthly/annual toggle, comparison table, FAQ, and Playwright tests
- [ ] 03-02-PLAN.md -- Why Fierro page: pain-first narrative, AI integration section, and Playwright tests

### Phase 4: Legal, SEO, and Documentation
**Goal**: The site has complete legal pages, comprehensive search engine optimization across all pages, and internal documentation covering deployment and migration procedures
**Depends on**: Phase 3
**Requirements**: LEGL-01, LEGL-02, PERF-04, PERF-05, PERF-06, PERF-07, DOCS-01, DOCS-02, DOCS-03
**Success Criteria** (what must be TRUE):
  1. /privacy and /terms pages render legal content from fierro_web styled consistently with the marketing site
  2. Every page has a unique title, meta description, and Open Graph tags (including social sharing images) that render correctly when shared on social platforms
  3. Structured data (Organization + SoftwareApplication JSON-LD) is present in page source and validates in Google's Rich Results Test
  4. A sitemap is generated at build time and accessible at /sitemap.xml
  5. docs/DEPLOYMENT.md, docs/MIGRATION.md, and fierro_web/docs/plans/deep-link-signup-flow.md exist with complete deployment, migration, and deep-link flow documentation
**Plans**: 3 plans

Plans:
- [ ] 04-01-PLAN.md -- SEO infrastructure (BaseLayout extension, sitemap, robots.txt, llms.txt) and legal pages (privacy + terms content)
- [ ] 04-02-PLAN.md -- Page-specific SEO content (OG images, meta descriptions, JSON-LD structured data) and Playwright tests
- [ ] 04-03-PLAN.md -- Documentation (DEPLOYMENT.md, MIGRATION.md, deep-link-signup-flow.md)

### Phase 5: Performance Audit and Launch Polish
**Goal**: The complete site meets its Lighthouse 95+ performance target, loads fast on constrained networks, ships near-zero client-side JavaScript, and works flawlessly across devices
**Depends on**: Phase 4
**Requirements**: PERF-01, PERF-02, PERF-03, PERF-08
**Success Criteria** (what must be TRUE):
  1. Lighthouse mobile audit scores 95+ on Performance, Accessibility, and Best Practices for every page on the site
  2. Time to First Render is under 1 second and Time to Interactive is under 1.5 seconds on simulated 3G (WebPageTest or Lighthouse throttling)
  3. The site ships zero or near-zero client-side JavaScript -- only Astro islands for pricing toggle and mobile nav (if JS is required for those)
  4. Every page renders correctly and is fully usable on mobile, tablet, and desktop viewports with WCAG AA contrast ratios verified
**Plans**: 2 plans

Plans:
- [ ] 05-01-PLAN.md -- Accessibility fixes (skip-to-content, focus trap, landmark labels, decorative SVGs) and cache headers
- [ ] 05-02-PLAN.md -- Lighthouse CI setup, accessibility and responsive Playwright tests, and full validation

### Phase 6: Phase 1 Traceability Closure
**Goal**: Close all Phase 1 audit gaps by creating missing documentation artifacts and updating requirement statuses — no code changes needed, all features are implemented
**Depends on**: Phase 5
**Requirements**: NAV-01, NAV-02, NAV-03, NAV-04 (status fix), FNDN-01, FNDN-02, FNDN-03, FNDN-04, FNDN-05 (verification)
**Gap Closure:** Closes 9 requirement gaps from v1.0 audit
**Success Criteria** (what must be TRUE):
  1. 01-02-SUMMARY.md exists documenting Nav, MobileMenu, and Footer component execution
  2. Phase 1 VERIFICATION.md exists with retroactive verification of all 9 Phase 1 requirements
  3. REQUIREMENTS.md shows NAV-01 through NAV-04 as Complete with [x] checkboxes
  4. Re-audit of Phase 1 shows 0 unsatisfied, 0 partial requirements
**Plans**: 1 plan

Plans:
- [ ] 06-01-PLAN.md -- Create 01-02-SUMMARY.md, Phase 1 VERIFICATION.md, and update REQUIREMENTS.md

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation and Site Chrome | 0/3 | Planning complete | - |
| 2. Landing Page | 0/3 | Planning complete | - |
| 3. Pricing and Why Fierro | 0/2 | Planning complete | - |
| 4. Legal, SEO, and Documentation | 0/3 | Planning complete | - |
| 5. Performance Audit and Launch Polish | 0/2 | Planning complete | - |
| 6. Phase 1 Traceability Closure | 0/1 | Planning complete | - |
