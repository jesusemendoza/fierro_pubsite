# Phase 5: Performance Audit and Launch Polish - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Validate the complete site meets Lighthouse 95+ performance target, loads fast on constrained networks, ships near-zero client-side JavaScript, and works flawlessly across devices with full WCAG 2.1 AA accessibility. This is an audit-and-fix phase — no new marketing pages or features. Fix what the audit surfaces, add missing accessibility patterns, and establish automated CI gates for ongoing validation.

</domain>

<decisions>
## Implementation Decisions

### Remediation scope
- Strict 95+ on Lighthouse Performance, Accessibility, and Best Practices for every page — no exceptions
- Keep scroll animations (CSS transitions + IntersectionObserver) — only cut if proven bottleneck after measurement
- Leave inline scripts as-is (Nav scroll, IntersectionObserver x3, PricingToggle custom element, MobileMenu) — they're small and page-specific, don't consolidate
- Image optimization is Lighthouse-driven only — fix what Lighthouse flags, don't proactively scan beyond that

### Font loading
- Add `font-display: swap` to DM Sans Variable — text renders immediately with system fallback, swaps when loaded
- Subset to Latin characters only — English-only site, drop unused character ranges for smaller file
- No preload hint — let browser discover font naturally via CSS
- Keep full variable weight range (100-900) — single file serves all weights, no additional subsetting

### Accessibility (Full WCAG 2.1 AA)
- Full WCAG 2.1 AA audit — not just contrast ratios but keyboard navigation, focus management, screen reader compatibility, aria labels, form labels, semantic HTML
- Add skip-to-content link — visually hidden, appears on focus, jumps past sticky nav to main content
- Verify and fix mobile menu focus trapping — Tab cycles within open menu, Escape closes it
- SVG illustrations marked as decorative — `role="presentation"` or `aria-hidden="true"`, surrounding text conveys meaning

### Launch readiness gate
- Automated Lighthouse CI via @lhci/cli integrated with Playwright test suite — scores checked programmatically
- 3 responsive breakpoints: Mobile (375px), Tablet (768px), Desktop (1280px)
- Add cache headers to `_headers` file — long-lived cache (1 year) for hashed assets (CSS, JS, fonts), shorter cache for HTML
- Green CI = done — all Lighthouse checks pass 95+ across all pages, responsive tests pass at 3 breakpoints, accessibility audit clean

### Claude's Discretion
- Exact cache-control header values and path patterns
- Which Lighthouse categories to assert (Performance, Accessibility, Best Practices — likely all three)
- Lighthouse CI configuration details (number of runs, median vs average, throttling settings)
- How to implement font subsetting with Fontsource (CSS import path or build config)
- Skip-to-content link styling and animation
- Focus trap implementation approach for mobile menu
- Whether to add `aria-label` to nav, footer, and landmark regions
- Specific responsive test assertions per breakpoint

</decisions>

<specifics>
## Specific Ideas

- Performance IS the brand promise — "If a contractor hits getfierro.com and it feels slow, they'll never click Sign Up" (from PROJECT.md)
- The site is intentionally zero-JS-by-default — only inline scripts for interactivity. This should score exceptionally well
- Phase 3 decisions (vanilla JS custom element, native details/summary) were made specifically for performance — validate that payoff
- Automated CI gate means performance regressions are caught before deploy, not after

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/BaseLayout.astro` — Central `<head>` where font preload, skip link, and meta optimizations go
- `src/styles/global.css` — Already has `@media (prefers-reduced-motion: reduce)` block for animation accessibility
- `public/_headers` — Security headers in place, needs cache headers added
- Playwright test suite established in prior phases — extend for Lighthouse CI and responsive checks

### Established Patterns
- Tailwind v4 CSS-first config with @theme directive and OKLch brand color tokens
- Inline `<script>` blocks (not Astro islands) — Nav, IntersectionObserver x3, PricingToggle custom element
- `[data-animate]` / `[data-animate-stagger]` system for scroll reveal animations
- DM Sans Variable via `@fontsource-variable/dm-sans` import in global.css
- Static PNG OG images in `public/og/` (bypass Astro image optimization)

### Integration Points
- `astro.config.mjs` — No SSR adapter, pure static output (good for performance)
- `public/_headers` — Cloudflare Workers reads this for HTTP response headers
- Playwright config — extend with Lighthouse CI integration
- `@fontsource-variable/dm-sans` — font subsetting controlled by import path

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-performance-audit-and-launch-polish*
*Context gathered: 2026-03-09*
