# Phase 4: Legal, SEO, and Documentation - Context

**Gathered:** 2026-03-10
**Status:** Ready for planning

<domain>
## Phase Boundary

Privacy Policy and Terms of Service pages (content pulled from fierro_web), comprehensive SEO infrastructure across all pages (meta tags, OG images, structured data, sitemap), AI-agent readiness (llms.txt, MCP server visibility), and internal documentation (deployment, migration, deep-link signup flow). No new marketing pages or features.

</domain>

<decisions>
## Implementation Decisions

### Legal content source
- Pull Privacy Policy and Terms of Service content directly from fierro_web repo (sibling directory at ../fierro_web)
- Restyle for marketing site — same content, consistent visual treatment
- Clean prose layout with clear section headings (h2/h3), readable line length (~65ch), no sidebar or TOC
- Small dark Gunmetal header band with page title (not full hero, not plain) — consistent with other pages but appropriately lightweight for utility pages

### Social sharing images
- Static PNG images (1200x630) committed to src/assets/og/ — one per page
- Branded template: dark Gunmetal background, Fierro logo, page title in DM Sans, Molten Orange accent
- Include tagline ("Every dollar. Every pour. Accounted for.") alongside page title and logo
- Same template for all pages, swap the title text

### SEO meta copy
- Builder voice for all meta descriptions — direct, confident, same tone as site content
- Keywords: Claude's discretion — research competitive terms for construction SaaS and pick best fit per page
- Every page gets unique title and meta description
- BaseLayout needs to be extended with description, OG, and Twitter card props

### Structured data & AI-agent readiness
- Organization + SoftwareApplication JSON-LD with standard fields only (name, URL, logo, description, pricing tiers)
- llms.txt file at site root for AI-agent discoverability — site summary, page descriptions, MCP server mention
- Structured JSON-LD surfaces pricing tiers, feature lists, and MCP capabilities in machine-parseable format
- MCP server mentioned in documentation and discoverable via llms.txt and structured data

### Sitemap
- Generated at build time via Astro's built-in sitemap integration
- Accessible at /sitemap.xml

### Documentation
- Audience: future me / small team — clear commands, covers gotchas, no hand-holding on basics
- docs/DEPLOYMENT.md — Cloudflare Workers Static Assets setup, build commands, CI/CD pipeline
- docs/MIGRATION.md — DNS changes, Vercel domain update, Supabase auth redirects, OAuth callbacks, Stripe webhooks, env vars, verification checklist
- fierro_web/docs/plans/deep-link-signup-flow.md — written to sibling repo at ../fierro_web, describes query-param-based signup flow (?plan=<tier>&billing=<cycle>) and MCP server integration points

### Claude's Discretion
- Exact meta description copy per page
- SEO keyword selection per page
- llms.txt content structure and depth
- OG image visual design details (font sizes, spacing, accent placement)
- Legal page section heading hierarchy
- Sitemap configuration options
- Structured data field values beyond what's specified

</decisions>

<specifics>
## Specific Ideas

- AI-agent friendliness is a differentiator — Fierro's MCP server should be discoverable from the marketing site, not just the app
- llms.txt is the emerging standard for making sites AI-readable — adopt it early
- OG images should feel premium and consistent with the dark Gunmetal brand aesthetic
- Legal pages should feel professional but not heavy — thin dark header band signals "this is a Fierro page" without dominating

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/layouts/BaseLayout.astro` — Currently only accepts `title` prop. Needs extension for `description`, OG tags, structured data
- `src/pages/privacy.astro` and `src/pages/terms.astro` — Stub pages ready to replace
- `src/styles/global.css` — Brand tokens and `[data-animate]` system available
- `src/components/landing/ClosingCta.astro` — Could be reused on legal pages if a CTA is desired

### Established Patterns
- Tailwind v4 CSS-first config with @theme directive and OKLch brand color tokens
- Astro 5 with ClientRouter for view transitions
- DM Sans Variable self-hosted via Fontsource
- Dark Gunmetal hero sections established on landing, pricing, and why-fierro pages

### Integration Points
- BaseLayout `<head>` — where meta tags, OG tags, and structured data JSON-LD will live
- `astro.config.mjs` — where sitemap integration is configured
- `public/` directory — where llms.txt and robots.txt live
- `../fierro_web/docs/plans/` — target for DOCS-03 deep-link signup flow doc
- Footer legal links — already point to /privacy and /terms

</code_context>

<deferred>
## Deferred Ideas

- Move AI section from /why-fierro to main landing page (noted in Phase 3 UAT)
- Remove "Most Popular" badge from Plus tier card (noted in Phase 3 UAT)
- Comparison table content refinement (noted in Phase 3 UAT)

</deferred>

---

*Phase: 04-legal-seo-and-documentation*
*Context gathered: 2026-03-10*
