# Phase 2: Landing Page - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete homepage that communicates Fierro's value to construction professionals, showcases the product (web dashboard AND mobile app), and drives visitors toward signup. Replaces the current stub index.astro with a full landing page containing hero, value props, feature showcase, "How It Works" walkthrough, and closing CTA. No social proof, testimonials, logo bar, or persona callouts in v1.

</domain>

<decisions>
## Implementation Decisions

### Hero section
- Solid dark Gunmetal background (no gradient, no texture)
- Headline: "Every dollar. Every pour. Accounted for." (existing tagline) with a supporting subtitle below ("Construction cost control that keeps your projects profitable" or similar)
- Hero visual: Abstract SVG illustration as placeholder — geometric shapes suggesting dashboards/construction. Will be replaced with real product screenshots later
- Two CTAs: "Start Free" as filled Molten Orange button (primary), "See How It Works" as ghost/outline button (secondary, scrolls to features)
- Nav remains transparent over the dark hero (established in Phase 1)

### Value proposition cards
- 3-4 quantified benefit cards positioned between hero and feature showcase
- Specific but aspirational claims — benefit framing, not hard stats: "Real-time cost tracking", "Zero budget surprises", "Field + office in one app"
- Off-white background section (visual break from dark hero)
- No logo/trust bar — too early for social proof

### Feature showcase
- Alternating left/right row layout (text one side, visual other side)
- 5 features: Budget Tracking, Expense Management, Team Management, Vendor Management, Analytics
- Mixed visuals per feature — some rows show desktop dashboard placeholder, others show phone mockup placeholder (pick whichever surface best represents each capability, e.g. expense capture = phone, analytics = desktop)
- All visuals are abstract SVG illustrations as placeholders (consistent style with hero)
- Each row: feature name heading + one-line benefit claim + 2-3 bullet points. Builder-voiced copy.

### How It Works
- 3-step numbered walkthrough in a horizontal row on dark Gunmetal background
- Steps: "1. Add your project → 2. Track expenses → 3. Stay profitable" (or similar)
- Each step: number, short title, brief description, icon or small visual
- Scannable, not narrative

### Closing CTA
- Dark Gunmetal background (continues from How It Works section)
- Clear headline + "Start Free" button linking to app.getfierro.com/signup
- Simple, focused — one CTA, no clutter

### Page flow (visual rhythm)
- Hero (dark) → Value props (off-white) → Feature rows (off-white with subtle dividers) → How It Works (dark) → Closing CTA (dark)
- Alternating dark/light creates visual separation and rhythm

### Scroll animations
- Subtle fade + slide up: each section fades in and slides up ~20px as it enters viewport
- CSS @keyframes with a small IntersectionObserver script
- Duration: ~600ms ease-out, children stagger ~100ms apart
- No heavy animation libraries — CSS-only with minimal JS for observation

### Social proof — SKIPPED for v1
- No logo bar, testimonials, or customer stats
- No persona callouts (GC, Sub, Owner) — need validated messaging first
- Can add in a future phase when real customer data exists

### Claude's Discretion
- Exact value prop card copy and icon choices
- Feature row copy (headlines, bullet points, benefit claims)
- Abstract SVG illustration designs for hero and feature placeholders
- How It Works step copy and icons
- Closing CTA headline copy
- Exact spacing, padding, and section heights
- IntersectionObserver threshold and animation timing details
- Whether "See How It Works" scrolls to features section or How It Works section

</decisions>

<specifics>
## Specific Ideas

- Fierro has BOTH a web dashboard (fierro_web/Next.js) and a React Native mobile app (fierro_app) — the landing page must represent both platforms, not just web
- Feature showcase visuals should mix desktop and phone mockups per feature (expense capture feels mobile, analytics feels desktop)
- All placeholder visuals (hero + features) use consistent abstract SVG illustration style — swap for real screenshots later
- Design inspiration from ingenious.build carries forward: premium, tech-forward, not generic SaaS
- "Built for builders" voice: direct, confident, construction vocabulary

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/BaseLayout.astro` — All pages wrap in this; includes Nav, MobileMenu, Footer, ClientRouter
- `src/styles/global.css` — 6 OKLch brand color tokens available as Tailwind utilities (bg-gunmetal, text-molten-orange, etc.)
- `src/components/Nav.astro` — Sticky nav already transparent over dark backgrounds, transitions to solid on scroll
- `src/assets/logo.svg` — Fierro logo SVG with currentColor fill

### Established Patterns
- Tailwind v4 CSS-first config with @theme directive (no tailwind.config.js)
- Astro 5 with ClientRouter for view transitions between pages
- DM Sans Variable via Fontsource (self-hosted, no CDN)
- Playwright test suite pattern from Phase 1 (tests/nav.spec.ts, etc.)

### Integration Points
- `src/pages/index.astro` — Current stub will be replaced with full landing page
- Nav "Features" link (href="/#features") — needs a #features anchor on the page
- All CTAs link to app.getfierro.com/signup (external)
- "See How It Works" CTA needs scroll-to anchor

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-landing-page*
*Context gathered: 2026-03-09*
