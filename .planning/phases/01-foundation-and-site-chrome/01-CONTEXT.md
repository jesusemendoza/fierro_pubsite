# Phase 1: Foundation and Site Chrome - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold an Astro 5 project with Tailwind CSS v4, self-hosted DM Sans, and brand design tokens in OKLch. Deploy to Cloudflare Workers Static Assets. Build responsive sticky navigation and a minimal footer that wrap all pages. Create stub pages for all 5 routes. This phase delivers the shell that every subsequent phase builds content into.

</domain>

<decisions>
## Implementation Decisions

### Navigation visual style
- Transparent background over the dark hero section, transitions to solid Gunmetal (#2B2D31) on scroll
- Nav links are white text, Molten Orange (#E8600A) on hover/active
- "Start Free" CTA is a ghost/outline button (transparent with Molten Orange border, fills on hover) — lets the hero CTA dominate
- "Login" is a plain text link to app.getfierro.com/login
- Sticky — stays at top as user scrolls

### Mobile navigation
- Full-screen dark Gunmetal overlay when hamburger is tapped
- Touch targets 44px+ minimum
- Same link styling as desktop (white text, orange hover)

### Logo treatment
- User will provide a logo file (SVG expected)
- Logo keeps brand colors on dark backgrounds (not inverted to all-white)
- Favicon derived from the logo mark/icon portion

### Footer design
- Off-White (#F5F4F0) background with subtle top border
- Minimal layout: single row with logo, key page links (Features, Pricing, Why Fierro, Privacy, Terms), and copyright
- Includes a small signup CTA (e.g. "Ready to take control?" + "Start Free" link)
- No social links for now — add when accounts are active

### Page scaffolding
- All 5 routes created in Phase 1: /, /pricing, /why-fierro, /privacy, /terms
- Stub pages show a centered "Coming soon" message with the page name
- All stubs wrapped in BaseLayout with nav + footer functional
- Nav links work immediately (no dead links)

### Claude's Discretion
- Exact scroll threshold for nav background transition (e.g. 50px, 100px, or IntersectionObserver-based)
- Spacing and padding values for nav and footer
- Exact font weights for nav links vs CTA
- "Coming soon" placeholder styling
- Whether mobile nav toggle needs a tiny `<script>` or can be CSS-only (`:target` or checkbox hack)
- Build/deploy pipeline details (wrangler.jsonc configuration)

</decisions>

<specifics>
## Specific Ideas

- Design inspiration from ingenious.build: dark nav that feels premium and tech-forward, not generic SaaS
- The transparent-to-solid nav transition should feel smooth — not a jarring snap
- Footer should feel lightweight, not competing with page content above it
- "Built for builders" tone should come through even in the chrome — confident, not decorative

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing code — greenfield project

### Established Patterns
- fierro_web uses OKLch color tokens in CSS variables (e.g. `oklch(0.62 0.19 48)` for Molten Orange) — adopt same values for brand consistency
- fierro_web uses Tailwind CSS v4 with `@theme` directive in globals.css — same pattern works in Astro
- fierro_web uses DM Sans via next/font — this site uses Fontsource instead (self-hosted, no CDN)

### Integration Points
- Nav "Login" → app.getfierro.com/login (external link)
- Nav "Start Free" → app.getfierro.com/signup (external link)
- Footer links → internal routes (/, /pricing, /why-fierro, /privacy, /terms)
- Cloudflare Workers Static Assets deployment (research flag: verify `_headers` file behavior)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-foundation-and-site-chrome*
*Context gathered: 2026-03-09*
