# Phase 3: Pricing and Why Fierro - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Two new pages replacing stubs: /pricing with transparent three-tier pricing, interactive monthly/annual toggle, feature comparison table, and FAQ; and /why-fierro with a pain-first narrative explaining why Fierro exists, what makes it different, and why construction teams need it. Both pages end with CTAs driving to app.getfierro.com/signup.

</domain>

<decisions>
## Implementation Decisions

### Builder tier CTA
- "Contact Sales" links to an external form (Typeform/Tally) — use placeholder URL for now (e.g., `#contact-sales` or TODO comment), will swap in real URL before launch
- Builder card pricing shows "Custom" only — no price hint, no "starting at"
- Builder card gets subtle visual distinction (border or background tint) to signal premium tier, but stays in the same card grid as Free/Plus

### Pricing FAQ
- Focus on value objections only — no billing mechanics questions
- Five key objections to address:
  1. "We're too small for this" — Free tier is genuinely useful at small scale
  2. "We already use spreadsheets" — cost of manual tracking, what you're missing
  3. "Our existing tools already do this" — Fierro is complementary, works alongside your existing tools for projects that need you to be nimble
  4. "What if we outgrow a tier?" — smooth upgrade path, no data loss
  5. "I don't have time to onboard a new tool" — Fierro works alongside your stack, not replacing it. Low friction to adopt
- Competitive messaging: subtle only — "No sales calls required. No hidden fees." No competitor names anywhere. Use "your existing tools" language
- Positioning: complementary tool — "Works alongside your existing tools for projects that need you to be nimble." Lower barrier to adoption

### Feature comparison table
- Key differentiators only — 8-12 rows covering main differences (project limits, team members, sub-projects, analytics, vendor management, support level)
- Show actual limits ("1 project", "5 projects", "Unlimited") not checkmarks
- AI/MCP integration tiered: Free = limited (basic access), Plus & Builder = fully configurable. Show this distinction in the comparison table row

### Why Fierro narrative
- Pain-first structure (WHY-01): problem → why it happens → how Fierro fixes it
- Two primary pain points to lead with:
  1. Field/office disconnect — "Your PM approved a change order but nobody in the field logged the expense"
  2. End-of-month surprise — "You thought the job was profitable until you ran the numbers"
- Two additional pain points:
  3. Investor/stakeholder visibility — pain then solution arc. "Your investors are asking for updates and you're scrambling to pull numbers from three places" → "Give stakeholders a real-time window into project health"
  4. AI integration gap — existing tools don't plug into AI workflows
- AI integration gets a dedicated section: "Built for the AI era" or similar. Mention ChatGPT and Claude by name as supported workflows via MCP server
- Narrative only for v1 — no testimonials, case studies, or customer stats. Pure pain-solution story
- Builder voice carries forward: direct, confident, construction vocabulary

### Claude's Discretion
- Pricing toggle implementation (vanilla JS island vs Preact — whatever is lightest)
- Toggle animation style and visual treatment
- "Most Popular" badge design on Plus tier
- Exact FAQ question/answer copy (following the five objections above)
- Why Fierro section headings, copy flow, and visual layout
- How It Works-style illustrations or icons on Why Fierro page
- Whether to reuse ClosingCta component from landing page or create page-specific variants
- Exact feature comparison table rows (following the 8-12 key differentiators guidance)

</decisions>

<specifics>
## Specific Ideas

- AI/MCP integration is the biggest excitement driver from demos — feature prominently on both pages
- Add AI automation mention to landing page value props in a future pass (noted in Phase 2 UAT)
- No competitor names anywhere — always say "your existing tools"
- "Projects that need you to be nimble" — this is the user's language for why complementary positioning matters
- Investor visibility is a real pain point — contractors get asked for project status updates and can't produce them quickly
- Pricing tiers locked from PROJECT.md: Free ($0, 1 project, 6 sub-projects, 3 team members), Plus ($49/mo or $470/yr, 5 projects, 20 sub-projects, 10 team members), Builder (custom, unlimited)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/landing/ClosingCta.astro` — "Start Free" CTA pattern with dark Gunmetal background. Can reuse or adapt for pricing/why-fierro page CTAs
- `src/styles/global.css` — `[data-animate]` scroll animation system ready to use on new pages
- `src/layouts/BaseLayout.astro` — All pages wrap in this; Nav, Footer, transitions included
- `src/pages/pricing.astro` and `src/pages/why-fierro.astro` — Stub pages exist, ready to replace

### Established Patterns
- Tailwind v4 CSS-first config with @theme directive and OKLch brand color tokens
- Astro 5 with ClientRouter for view transitions
- DM Sans Variable self-hosted
- `data-animate` / `data-animate-stagger` for scroll reveal animations
- Inline SVG icons pattern from ValueProps component
- PRIC-03 requires first Astro island (client-side JS for pricing toggle) — new pattern for the project

### Integration Points
- Nav "Pricing" link (href="/pricing") — page exists as stub
- Nav "Why Fierro" link (href="/why-fierro") — page exists as stub
- Deep-link CTAs per PRIC-07: `app.getfierro.com/signup?plan=plus&billing=monthly`, annual variant `&billing=annual`
- Builder tier CTA: placeholder external form URL for now

</code_context>

<deferred>
## Deferred Ideas

- Add AI automation/MCP server value prop card to landing page (noted in Phase 2 UAT enhancement notes)
- Hero SVG illustration: use more Molten Orange for stronger visual pop (Phase 2 UAT note)
- Direct competitor comparison pages (Fierro vs X) — v2 requirement (CONV-02)

</deferred>

---

*Phase: 03-pricing-and-why-fierro*
*Context gathered: 2026-03-09*
