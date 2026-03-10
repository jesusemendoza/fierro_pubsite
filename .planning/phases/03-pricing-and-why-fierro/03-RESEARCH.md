# Phase 3: Pricing and Why Fierro - Research

**Researched:** 2026-03-09
**Domain:** Static marketing pages with interactive pricing toggle (Astro 5 / Tailwind v4)
**Confidence:** HIGH

## Summary

Phase 3 builds two content-heavy pages -- `/pricing` and `/why-fierro` -- replacing existing stub pages. The pricing page introduces the project's first client-side interactivity: a monthly/annual toggle that switches displayed prices and savings callouts. The why-fierro page is purely static narrative content. Both pages follow established project patterns (BaseLayout, `data-animate` scroll reveals, Tailwind v4 with OKLch tokens, DM Sans) and end with CTAs driving to `app.getfierro.com/signup`.

The critical technical decision is how to implement the pricing toggle (PRIC-03). The project already uses vanilla JS with `document.addEventListener('astro:page-load', ...)` for the Nav scroll behavior and IntersectionObserver animations. A custom element (web component) is the ideal pattern: zero framework dependencies, automatic re-initialization via `connectedCallback()` on view transitions, and aligns with the project's zero-JS-by-default philosophy. No framework (React, Preact, etc.) is needed for a simple toggle.

**Primary recommendation:** Use a vanilla JS custom element for the pricing toggle, native `<details>/<summary>` for the FAQ accordion, and static Astro components for everything else. No framework dependencies added.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Builder tier CTA links to external form (placeholder URL `#contact-sales` or TODO comment for now); Builder card shows "Custom" only -- no price hint, no "starting at"; Builder card gets subtle visual distinction (border or background tint) but stays in same card grid
- Pricing FAQ focuses on value objections only (no billing mechanics): (1) "We're too small for this" (2) "We already use spreadsheets" (3) "Our existing tools already do this" (4) "What if we outgrow a tier?" (5) "I don't have time to onboard a new tool"
- Competitive messaging: subtle only -- "No sales calls required. No hidden fees." No competitor names anywhere. Use "your existing tools" language
- Positioning: complementary tool -- "Works alongside your existing tools for projects that need you to be nimble"
- Feature comparison table: 8-12 rows of key differentiators showing actual limits ("1 project", "5 projects", "Unlimited") not checkmarks; AI/MCP integration tiered (Free = limited/basic access, Plus & Builder = fully configurable)
- Why Fierro narrative: pain-first structure (problem -> why it happens -> how Fierro fixes it)
- Two primary pain points: (1) Field/office disconnect (2) End-of-month surprise
- Two additional pain points: (3) Investor/stakeholder visibility (4) AI integration gap
- AI integration gets dedicated section: "Built for the AI era" or similar, mentioning ChatGPT and Claude by name as supported workflows via MCP server
- Narrative only for v1 -- no testimonials, case studies, or customer stats
- Builder voice: direct, confident, construction vocabulary
- Pricing tiers locked: Free ($0, 1 project, 6 sub-projects, 3 team members), Plus ($49/mo or $470/yr, 5 projects, 20 sub-projects, 10 team members), Builder (custom, unlimited)

### Claude's Discretion
- Pricing toggle implementation (vanilla JS island vs Preact -- whatever is lightest)
- Toggle animation style and visual treatment
- "Most Popular" badge design on Plus tier
- Exact FAQ question/answer copy (following the five objections above)
- Why Fierro section headings, copy flow, and visual layout
- How It Works-style illustrations or icons on Why Fierro page
- Whether to reuse ClosingCta component from landing page or create page-specific variants
- Exact feature comparison table rows (following the 8-12 key differentiators guidance)

### Deferred Ideas (OUT OF SCOPE)
- Add AI automation/MCP server value prop card to landing page (noted in Phase 2 UAT enhancement notes)
- Hero SVG illustration: use more Molten Orange for stronger visual pop (Phase 2 UAT note)
- Direct competitor comparison pages (Fierro vs X) -- v2 requirement (CONV-02)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PRIC-01 | Three-tier card layout -- Free ($0/mo), Plus ($49/mo or $470/yr), Builder (Custom) | Card grid pattern with Tailwind; tier data as frontmatter array; pricing data from PROJECT.md |
| PRIC-02 | "Most Popular" visual highlight on Plus tier | Absolute-positioned badge or ribbon on Plus card; molten-orange accent |
| PRIC-03 | Monthly/annual pricing toggle as Astro island with savings callout ("Save $118/year") | Vanilla JS custom element with `connectedCallback()`; `data-*` attributes for price values; `astro:page-load` compatible |
| PRIC-04 | Feature comparison table below tier cards showing what's included in each plan | Responsive HTML table with actual limits; 8-12 rows per CONTEXT.md; sticky header column on mobile |
| PRIC-05 | FAQ section addressing common pricing questions | Native `<details>/<summary>` accordion; five value-objection questions from CONTEXT.md |
| PRIC-06 | Competitive messaging: "No sales calls required. No hidden fees. Start free, upgrade when you're ready." | Inline text near tier cards or as a callout banner |
| PRIC-07 | Deep-linked CTAs that pass plan context to signup | Query params: `?plan=plus&billing=monthly`, `&billing=annual`; Builder links to `#contact-sales` placeholder |
| WHY-01 | Dedicated "Why Fierro" page with pain-first narrative structure | Four pain-point sections with problem->cause->solution arcs; dedicated AI section |
| WHY-02 | Written in "builder voice" -- direct, confident, no jargon | Copy guidance: short sentences, construction vocabulary, second person ("you/your") |
| WHY-03 | Quantified ROI claims where defensible | Claims like "Catch overruns days earlier", "Eliminate end-of-month spreadsheet panic" -- directional, not numeric |
| WHY-04 | Closing CTA driving to signup | Reuse or adapt ClosingCta component pattern with page-appropriate copy |
</phase_requirements>

## Standard Stack

### Core (already in project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^5.18 | Static site generator with islands architecture | Already installed; zero JS by default |
| Tailwind CSS | ^4.0 (via @tailwindcss/vite) | Utility-first CSS with OKLch brand tokens | Already configured with @theme directive |
| DM Sans Variable | ^5.0 (@fontsource-variable) | Brand typeface | Already self-hosted |
| Playwright | ^1.58.2 | E2E testing | Already configured with chromium-only project |

### Supporting (no new dependencies)
| Tool | Purpose | When to Use |
|------|---------|-------------|
| Vanilla JS custom element | Pricing toggle interactivity | PRIC-03 -- the only client-side JS on these pages |
| HTML `<details>/<summary>` | FAQ accordion | PRIC-05 -- native, accessible, zero JS |
| `data-animate` system | Scroll reveal animations | All sections on both pages |
| `astro:page-load` event | Re-init after view transitions | Custom element script registration |

### Alternatives Considered
| Instead of | Could Use | Why Not |
|------------|-----------|---------|
| Vanilla JS custom element | Preact island | Overkill for a toggle; adds ~3KB framework overhead; project has zero framework deps currently |
| `<details>/<summary>` | Custom JS accordion | Native element is accessible by default, needs zero JS, and browsers in 2025 support `::details-content` for CSS animations |
| Full responsive table | Card-based comparison on mobile | Table with horizontal scroll or stacked layout is more scannable for 3-tier comparison |

**Installation:** No new packages needed. Zero dependency additions for Phase 3.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   ├── pricing/
│   │   ├── PricingToggle.astro     # Custom element wrapper + script
│   │   ├── TierCard.astro          # Reusable tier card component
│   │   ├── ComparisonTable.astro   # Feature comparison table
│   │   └── PricingFaq.astro        # FAQ section with <details>
│   ├── why-fierro/
│   │   ├── PainSection.astro       # Reusable pain->solution section
│   │   └── AiSection.astro         # "Built for the AI era" section
│   └── landing/
│       └── ClosingCta.astro        # Existing -- reuse on both pages
├── pages/
│   ├── pricing.astro               # Replace stub
│   └── why-fierro.astro            # Replace stub
```

### Pattern 1: Vanilla JS Custom Element for Pricing Toggle
**What:** A web component that toggles price display between monthly and annual
**When to use:** Any interactive UI that needs to survive view transitions without framework overhead
**Example:**
```astro
<!-- PricingToggle.astro -->
<pricing-toggle data-default="monthly">
  <div class="flex items-center justify-center gap-3">
    <span data-label="monthly" class="font-semibold">Monthly</span>
    <button
      type="button"
      role="switch"
      aria-checked="false"
      aria-label="Switch to annual billing"
      class="relative h-7 w-14 rounded-full bg-concrete-gray/30 transition-colors"
    >
      <span class="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform"></span>
    </button>
    <span data-label="annual" class="text-concrete-gray">Annual</span>
  </div>
  <p data-savings class="mt-2 hidden text-sm font-medium text-rebar-green">
    Save $118/year
  </p>
</pricing-toggle>

<script>
  class PricingToggle extends HTMLElement {
    connectedCallback() {
      const btn = this.querySelector('button[role="switch"]');
      const thumb = btn?.querySelector('span');
      const savingsEl = this.querySelector('[data-savings]');
      const monthlyLabel = this.querySelector('[data-label="monthly"]');
      const annualLabel = this.querySelector('[data-label="annual"]');

      let isAnnual = false;

      btn?.addEventListener('click', () => {
        isAnnual = !isAnnual;
        btn.setAttribute('aria-checked', String(isAnnual));
        btn.setAttribute('aria-label',
          isAnnual ? 'Switch to monthly billing' : 'Switch to annual billing'
        );
        // Toggle visual states
        thumb?.classList.toggle('translate-x-7', isAnnual);
        btn.classList.toggle('bg-molten-orange', isAnnual);
        btn.classList.toggle('bg-concrete-gray/30', !isAnnual);
        monthlyLabel?.classList.toggle('text-concrete-gray', isAnnual);
        monthlyLabel?.classList.toggle('font-semibold', !isAnnual);
        annualLabel?.classList.toggle('text-concrete-gray', !isAnnual);
        annualLabel?.classList.toggle('font-semibold', isAnnual);
        savingsEl?.classList.toggle('hidden', !isAnnual);

        // Update all price displays on the page
        document.querySelectorAll('[data-price-monthly]').forEach(el => {
          const monthly = el.getAttribute('data-price-monthly');
          const annual = el.getAttribute('data-price-annual');
          if (monthly && annual) {
            el.textContent = isAnnual ? annual : monthly;
          }
        });

        // Update CTA billing query params
        document.querySelectorAll('[data-billing-link]').forEach(el => {
          const href = el.getAttribute('href') || '';
          const updated = href.replace(
            /billing=(monthly|annual)/,
            `billing=${isAnnual ? 'annual' : 'monthly'}`
          );
          el.setAttribute('href', updated);
        });
      });
    }
  }
  customElements.define('pricing-toggle', PricingToggle);
</script>
```
**Key details:**
- `connectedCallback()` fires on every view transition navigation (no `astro:page-load` listener needed for the custom element itself)
- `role="switch"` + `aria-checked` is the correct ARIA pattern for a binary toggle (not `role="checkbox"`)
- Price data lives in `data-price-monthly` / `data-price-annual` attributes on price display elements
- CTA hrefs include `billing=monthly` by default, updated to `billing=annual` on toggle

### Pattern 2: Tier Data as Frontmatter Array
**What:** Define pricing tier data in the page frontmatter, pass to reusable TierCard components
**When to use:** Keeps data co-located with the page, easy to update
**Example:**
```astro
---
const tiers = [
  {
    name: 'Free',
    price: { monthly: '$0', annual: '$0' },
    period: '/mo',
    description: 'For solo contractors getting started',
    cta: { text: 'Start Free', href: 'https://app.getfierro.com/signup' },
    features: ['1 project', '6 sub-projects', '3 team members', 'Basic expense tracking', 'Limited AI access'],
    highlighted: false,
    builder: false,
  },
  {
    name: 'Plus',
    price: { monthly: '$49', annual: '$39' },
    period: '/mo',
    description: 'For growing teams managing multiple jobs',
    cta: { text: 'Start Plus', href: 'https://app.getfierro.com/signup?plan=plus&billing=monthly' },
    features: ['5 projects', '20 sub-projects', '10 team members', 'Advanced analytics', 'Vendor management', 'Fully configurable AI/MCP', 'Priority support'],
    highlighted: true,
    builder: false,
  },
  {
    name: 'Builder',
    price: { monthly: 'Custom', annual: 'Custom' },
    period: '',
    description: 'For enterprises that need everything',
    cta: { text: 'Contact Sales', href: '#contact-sales' },
    features: ['Unlimited projects', 'Unlimited sub-projects', 'Unlimited team members', 'Custom integrations', 'Fully configurable AI/MCP', 'Dedicated account manager', 'API access'],
    highlighted: false,
    builder: true,
  },
];
---
```
**Key detail:** Plus annual price is $39/mo ($470/yr divided by 12, rounded). The savings callout "Save $118/year" = ($49 x 12) - $470 = $118.

### Pattern 3: Native FAQ Accordion
**What:** Use `<details>/<summary>` for zero-JS FAQ
**When to use:** Any expandable content section
**Example:**
```astro
<div class="space-y-4">
  <details class="group rounded-lg border border-concrete-gray/20 bg-white">
    <summary class="cursor-pointer list-none px-6 py-4 font-semibold text-gunmetal flex items-center justify-between">
      <span>We're too small for this kind of tool</span>
      <svg class="h-5 w-5 text-concrete-gray transition-transform group-open:rotate-180" ...>
        <path d="M19 9l-7 7-7-7" />
      </svg>
    </summary>
    <div class="px-6 pb-4 text-concrete-gray">
      <p>Answer text here...</p>
    </div>
  </details>
</div>
```
**Key detail:** The `group` / `group-open:` Tailwind pattern handles open/close styling. The `list-none` class removes the default disclosure triangle. No JavaScript required.

### Anti-Patterns to Avoid
- **Don't use `client:load` with a framework component for the toggle:** Adding Preact/React just for a toggle bloats the bundle unnecessarily. Vanilla JS custom element is ~0.5KB vs ~3KB+ for Preact.
- **Don't duplicate ClosingCta logic:** Reuse the existing `ClosingCta.astro` component or make it accept props. Don't create separate CTA components per page.
- **Don't hardcode prices in multiple places:** Define tier data once (frontmatter array) and pass to components. Avoid scattering "$49" across HTML strings.
- **Don't use JavaScript for the FAQ accordion:** `<details>/<summary>` is natively accessible, keyboard-navigable, and screen-reader friendly with zero JS.
- **Don't use checkmarks in the comparison table:** CONTEXT.md explicitly says to show actual limits ("1 project", "5 projects", "Unlimited").

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| FAQ accordion | Custom JS expand/collapse | `<details>/<summary>` | Built-in accessibility, keyboard nav, focus management, zero JS |
| Toggle switch | Custom div with click handler | `<button role="switch">` | Correct ARIA semantics, keyboard accessible, screen reader announces state |
| Scroll animations | Custom IntersectionObserver per page | Existing `data-animate` system | Already built, already handles `prefers-reduced-motion`, already tested |
| Responsive tables | Custom card-based comparison | HTML `<table>` with overflow-x-auto | Semantic structure, screen readers understand table relationships |
| View transition compat | Manual event listeners | Custom element `connectedCallback()` | Auto-fires on DOM insertion, no need for `astro:page-load` wrapper |

**Key insight:** Phase 3's interactivity needs are minimal. A single toggle is the only JS-requiring feature. Everything else (FAQ, comparison table, narrative content) is pure static HTML/CSS. Keep it that way.

## Common Pitfalls

### Pitfall 1: Toggle State Not Surviving View Transitions
**What goes wrong:** User toggles to annual, navigates away, comes back -- toggle resets to monthly
**Why it happens:** View transitions replace DOM; custom element re-mounts with default state
**How to avoid:** Accept this as expected behavior. The toggle defaults to monthly on every page load, which is the standard SaaS pattern (show the lower price first). Don't try to persist toggle state across navigations.
**Warning signs:** Overengineering with sessionStorage or URL params for toggle state

### Pitfall 2: Annual Price Calculation Error
**What goes wrong:** Displaying wrong annual per-month price or wrong savings amount
**Why it happens:** Plus annual is $470/yr, which is ~$39.17/mo. Must decide on display: "$39/mo" (rounded) or "$470/yr"
**How to avoid:** When toggle is on annual: show "$39/mo" with "billed annually at $470" subtitle. Savings = ($49 x 12) - $470 = $118/year. Define these values once in the tier data array.
**Warning signs:** Prices scattered across HTML without a single source of truth

### Pitfall 3: Comparison Table Unreadable on Mobile
**What goes wrong:** 4-column table (Feature + 3 tiers) overflows or becomes too cramped on small screens
**Why it happens:** Tables with many columns don't naturally adapt to narrow viewports
**How to avoid:** Use `overflow-x-auto` wrapper with horizontal scroll on mobile. Alternatively, consider a stacked card layout on mobile showing one tier at a time. Minimum approach: sticky first column + horizontal scroll.
**Warning signs:** Table text wrapping into unreadable narrow columns

### Pitfall 4: CTA Deep Links Missing Query Params
**What goes wrong:** "Start Plus" CTA doesn't pass `?plan=plus&billing=monthly` to signup URL
**Why it happens:** Static href doesn't update when toggle switches to annual billing
**How to avoid:** Use `data-billing-link` attribute on CTA anchors; custom element updates href on toggle. Default href includes `billing=monthly`.
**Warning signs:** CTAs that don't change when user toggles billing period

### Pitfall 5: Nav Transparency Bug on Non-Hero Pages
**What goes wrong:** Nav starts transparent (designed for dark hero) but pricing/why-fierro pages have light backgrounds, making white nav text invisible
**Why it happens:** Nav scroll handler assumes dark hero at top of page
**How to avoid:** Check if pricing and why-fierro pages have a dark hero section at top. If not, Nav needs to start with `bg-gunmetal` on these pages (not transparent). The existing Nav script adds `bg-gunmetal` after 50px scroll -- on pages without a dark hero, nav should start opaque. Use a page-level prop or data attribute to control this.
**Warning signs:** White text on white background at top of page

### Pitfall 6: Missing noscript Fallback for Pricing Toggle
**What goes wrong:** Without JS, the toggle doesn't work and only monthly prices show
**Why it happens:** Custom element requires JavaScript
**How to avoid:** Default HTML shows monthly prices (the more common view). Add a `<noscript>` note mentioning annual pricing is available, or show both price points in the static HTML. Monthly-first is acceptable since JS-disabled users are a tiny fraction.
**Warning signs:** Annual pricing completely hidden with no fallback

## Code Examples

### Pricing Card Component
```astro
<!-- TierCard.astro -->
---
interface Props {
  name: string;
  price: { monthly: string; annual: string };
  period: string;
  description: string;
  cta: { text: string; href: string };
  features: string[];
  highlighted: boolean;
  builder: boolean;
}

const { name, price, period, description, cta, features, highlighted, builder } = Astro.props;
---

<div class:list={[
  'relative flex flex-col rounded-xl border p-6 lg:p-8',
  highlighted && 'border-molten-orange ring-2 ring-molten-orange',
  builder && 'border-molten-orange/30 bg-gunmetal/5',
  !highlighted && !builder && 'border-concrete-gray/20 bg-white',
]}>
  {highlighted && (
    <span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-molten-orange px-4 py-1 text-xs font-bold text-white uppercase tracking-wide">
      Most Popular
    </span>
  )}

  <h3 class="text-xl font-bold text-gunmetal">{name}</h3>
  <p class="mt-1 text-sm text-concrete-gray">{description}</p>

  <div class="mt-4">
    {builder ? (
      <p class="text-3xl font-bold text-gunmetal">Custom</p>
    ) : (
      <>
        <p
          class="text-3xl font-bold text-gunmetal"
          data-price-monthly={price.monthly}
          data-price-annual={price.annual}
        >
          {price.monthly}
        </p>
        {period && <span class="text-sm text-concrete-gray">{period}</span>}
      </>
    )}
  </div>

  <ul class="mt-6 flex-1 space-y-3">
    {features.map(f => (
      <li class="flex items-start gap-2 text-sm text-gunmetal">
        <span class="mt-0.5 text-rebar-green">&#x2713;</span>
        <span>{f}</span>
      </li>
    ))}
  </ul>

  <a
    href={cta.href}
    data-billing-link={!builder ? '' : undefined}
    class:list={[
      'mt-8 block rounded-md px-6 py-3 text-center font-semibold transition-colors',
      highlighted
        ? 'bg-molten-orange text-white hover:bg-molten-orange/90'
        : 'border border-gunmetal text-gunmetal hover:bg-gunmetal hover:text-white',
    ]}
  >
    {cta.text}
  </a>
</div>
```

### Comparison Table Row Data Structure
```typescript
// Frontmatter data structure for comparison table
const features = [
  { name: 'Projects', free: '1', plus: '5', builder: 'Unlimited' },
  { name: 'Sub-projects per project', free: '6', plus: '20', builder: 'Unlimited' },
  { name: 'Team members', free: '3', plus: '10', builder: 'Unlimited' },
  { name: 'Expense tracking', free: 'Basic', plus: 'Advanced', builder: 'Advanced' },
  { name: 'Budget analytics', free: 'Summary', plus: 'Detailed reports', builder: 'Custom dashboards' },
  { name: 'Vendor management', free: '--', plus: 'Included', builder: 'Included' },
  { name: 'AI/MCP integration', free: 'Limited', plus: 'Fully configurable', builder: 'Fully configurable' },
  { name: 'API access', free: '--', plus: '--', builder: 'Included' },
  { name: 'Custom integrations', free: '--', plus: '--', builder: 'Included' },
  { name: 'Support', free: 'Community', plus: 'Priority', builder: 'Dedicated account manager' },
];
```

### Why Fierro Pain Section Pattern
```astro
<!-- PainSection.astro -->
---
interface Props {
  problem: string;
  cause: string;
  solution: string;
  icon?: string;
}
const { problem, cause, solution } = Astro.props;
---

<div class="space-y-4" data-animate>
  <h3 class="text-2xl font-bold text-gunmetal">{problem}</h3>
  <p class="text-lg text-concrete-gray">{cause}</p>
  <p class="text-lg text-gunmetal font-medium">{solution}</p>
</div>
```

### Page-Level IntersectionObserver (reuse from index.astro)
```astro
<!-- Include on both pricing.astro and why-fierro.astro -->
<noscript>
  <style>
    [data-animate] { opacity: 1 !important; transform: none !important; }
  </style>
</noscript>

<script>
  document.addEventListener('astro:page-load', () => {
    const targets = document.querySelectorAll('[data-animate]');
    if (!targets.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
  });
</script>
```
**Note:** This script is duplicated from `index.astro`. Consider extracting to a shared component or layout-level script if it grows. For now, co-location in each page is the established project pattern.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Framework island for simple toggle | Vanilla JS custom element | Astro 3+ (2024) | Zero framework overhead, `connectedCallback()` handles view transitions natively |
| Custom JS accordion | `<details>/<summary>` with CSS styling | Interop 2025 | `::details-content` pseudo-element enables CSS animations on open/close; `name` attribute enables exclusive accordion groups |
| `@astrojs/tailwind` | `@tailwindcss/vite` directly | Tailwind v4 (2024) | Already adopted by project; CSS-first config with `@theme` |
| `ViewTransitions` import | `ClientRouter` from `astro:transitions` | Astro 5 (2024) | Already adopted by project |

**Deprecated/outdated:**
- `@astrojs/tailwind` integration: Deprecated in favor of `@tailwindcss/vite` (already correct in this project)
- `ViewTransitions` component: Renamed to `ClientRouter` in Astro 5 (already correct in this project)
- JS-based accordion libraries: Unnecessary now that `<details>/<summary>` has broad CSS animation support

## Open Questions

1. **Nav behavior on light-background pages**
   - What we know: Nav starts transparent with white text (designed for dark hero sections). Pricing and Why Fierro pages may not have dark hero sections.
   - What's unclear: Whether these pages should have dark hero banners or the Nav should start opaque on light backgrounds.
   - Recommendation: Give both pages a dark Gunmetal hero/header section (matching the landing page aesthetic) so the transparent Nav works naturally. This also provides visual consistency across all pages.

2. **Annual per-month display format**
   - What we know: $470/yr = ~$39.17/mo. Most SaaS sites round to "$39/mo" when displaying annual.
   - What's unclear: Whether to show "$39/mo billed annually" or "$470/yr" or both.
   - Recommendation: Show "$39/mo" as the big number with "billed annually at $470" as small text below. This is the standard SaaS pattern and makes the savings more visceral.

3. **IntersectionObserver script duplication**
   - What we know: The exact same `data-animate` observer script appears in `index.astro`. It will need to be duplicated in `pricing.astro` and `why-fierro.astro`.
   - What's unclear: Whether to extract to a shared component now or defer.
   - Recommendation: Duplicate for now (matches existing pattern). Extract to a shared `ScrollAnimations.astro` component if/when a fourth page needs it (Phase 4 has legal pages).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright ^1.58.2 with chromium-only project |
| Config file | `playwright.config.ts` |
| Quick run command | `npx playwright test --project=chromium --grep "PRIC\|WHY"` |
| Full suite command | `npx playwright test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PRIC-01 | Three tier cards visible with correct names and prices | e2e | `npx playwright test tests/pricing-tiers.spec.ts -x` | No -- Wave 0 |
| PRIC-02 | Plus tier has "Most Popular" badge visible | e2e | `npx playwright test tests/pricing-tiers.spec.ts -x` | No -- Wave 0 |
| PRIC-03 | Toggle switches prices between monthly/annual; savings callout appears | e2e | `npx playwright test tests/pricing-toggle.spec.ts -x` | No -- Wave 0 |
| PRIC-04 | Feature comparison table renders with correct tier columns | e2e | `npx playwright test tests/pricing-comparison.spec.ts -x` | No -- Wave 0 |
| PRIC-05 | FAQ items expand/collapse; all 5 questions present | e2e | `npx playwright test tests/pricing-faq.spec.ts -x` | No -- Wave 0 |
| PRIC-06 | Competitive messaging text visible on pricing page | e2e | `npx playwright test tests/pricing-tiers.spec.ts -x` | No -- Wave 0 |
| PRIC-07 | CTA buttons have correct deep-link hrefs; toggle updates billing param | e2e | `npx playwright test tests/pricing-toggle.spec.ts -x` | No -- Wave 0 |
| WHY-01 | Why Fierro page has pain-first narrative sections | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | No -- Wave 0 |
| WHY-02 | Builder voice present (qualitative -- verify headings and structure) | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | No -- Wave 0 |
| WHY-03 | Quantified ROI claims visible | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | No -- Wave 0 |
| WHY-04 | Closing CTA with signup link present | e2e | `npx playwright test tests/why-fierro.spec.ts -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx playwright test tests/pricing-*.spec.ts tests/why-fierro.spec.ts -x`
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/pricing-tiers.spec.ts` -- covers PRIC-01, PRIC-02, PRIC-06
- [ ] `tests/pricing-toggle.spec.ts` -- covers PRIC-03, PRIC-07
- [ ] `tests/pricing-comparison.spec.ts` -- covers PRIC-04
- [ ] `tests/pricing-faq.spec.ts` -- covers PRIC-05
- [ ] `tests/why-fierro.spec.ts` -- covers WHY-01, WHY-02, WHY-03, WHY-04

## Sources

### Primary (HIGH confidence)
- Project codebase -- existing components, patterns, and configuration directly examined
- [Astro docs: Client-side scripts](https://docs.astro.build/en/guides/client-side-scripts/) -- custom element pattern with `connectedCallback()`, script processing behavior
- [Astro docs: Islands architecture](https://docs.astro.build/en/concepts/islands/) -- client directive semantics and zero-JS philosophy
- PROJECT.md -- pricing tier data (Free/Plus/Builder with exact limits and prices)
- CONTEXT.md -- locked decisions on FAQ content, feature table format, narrative structure

### Secondary (MEDIUM confidence)
- [web.dev: Details and summary](https://web.dev/learn/html/details) -- `<details>/<summary>` accessibility and browser support
- [Astro view transitions docs](https://docs.astro.build/en/guides/view-transitions/) -- `astro:page-load` lifecycle event, custom element compatibility
- [SaaS Pricing Pages Best Practices 2025](https://www.artisangrowthstrategies.com/blog/saas-pricing-page-best-practices-2025) -- annual/monthly toggle UX patterns

### Tertiary (LOW confidence)
- None -- all findings verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all tools already in project
- Architecture: HIGH -- patterns derived directly from existing project code and verified Astro docs
- Pitfalls: HIGH -- identified from codebase analysis (Nav transparency, toggle state, price calculation)
- Toggle implementation: HIGH -- custom element pattern verified in Astro docs, matches project's existing JS approach

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- Astro 5 and Tailwind v4 are mature)
