# Pubsite Redesign — Execution Plan

> Handoff doc for agent execution. Read this + REWRITE-PLAN.md for full context.

## Strategy Summary

Pivot the pubsite from contractor/builder marketing to **homeowners (primary)** and **flippers/investors (secondary)**. The existing app features already serve these audiences — the site just needs to speak their language and show real product screenshots.

Full rationale: `docs/plans/OVERVIEW.md`
Full copy plan: `docs/plans/REWRITE-PLAN.md`

---

## Phase 0: Image Pipeline + Supabase Upload

### Goal
Compress all 18 raw PNG screenshots to WebP and upload to Supabase public bucket. Create a helper for consistent URL generation.

### Source Assets

**Desktop** (`docs/assets/screenshots/desktop/`) — 10 PNGs, 1.3MB total:
- homeowner-dashboard.png (144KB)
- homeowner-expenses.png (203KB)
- homeowner-expense-detail.png (75KB)
- homeowner-approvals.png (154KB)
- homeowner-audit.png (93KB)
- homeowner-team.png (72KB)
- flipper-portfolio.png (83KB)
- flipper-project-detail.png (146KB)
- contractor-dashboard.png (189KB)
- contractor-add-expense.png (176KB)

**Mobile** (`docs/assets/screenshots/mobile/`) — 8 PNGs, 2.8MB total:
- homeowner-dashboard-mobile.png (394KB)
- homeowner-expenses-mobile.png (427KB)
- homeowner-approval-action-mobile.png (295KB)
- flipper-project-mobile.png (391KB)
- flipper-audit-log-mobile.png (321KB)
- flipper-project-permissions.png (374KB)
- contractor-expenses-mobile.png (395KB)
- contractor-add-expense-mobile.png (242KB)

Note: Mobile screenshots are in **dark mode**. Desktop screenshots are in **light mode**.

### Supabase Target

- **Project ID:** `lzvvfmkwrvkfymmvosgl`
- **Bucket:** `public-assets` (public, no restrictions)
- **Path pattern:** `pubsite/screenshots/desktop/{filename}.webp` and `pubsite/screenshots/mobile/{filename}.webp`
- **Base URL:** `https://lzvvfmkwrvkfymmvosgl.supabase.co/storage/v1/object/public/public-assets/`

### Tasks

1. **Create `scripts/optimize-screenshots.ts`** — Node script using Sharp (already in Astro's deps):
   - Read all PNGs from `docs/assets/screenshots/desktop/` and `mobile/`
   - Convert to WebP, quality 80
   - Resize: desktop max-width 1440px, mobile max-width 786px (2x for retina)
   - Output to `docs/assets/screenshots/optimized/desktop/` and `optimized/mobile/`
   - Log before/after sizes

2. **Create `scripts/upload-screenshots.ts`** — Upload optimized WebPs to Supabase:
   - Use `@supabase/supabase-js` (install as devDependency if needed, or use fetch + Supabase REST API)
   - Upload to `public-assets` bucket under `pubsite/screenshots/`
   - Requires `SUPABASE_SERVICE_ROLE_KEY` env var for upload auth
   - Log public URLs after upload

3. **Create `src/utils/screenshot.ts`** — Tiny helper:
   ```typescript
   const BASE = 'https://lzvvfmkwrvkfymmvosgl.supabase.co/storage/v1/object/public/public-assets/pubsite/screenshots';
   export function screenshotUrl(path: string): string {
     return `${BASE}/${path}`;
   }
   // Usage: screenshotUrl('desktop/homeowner-dashboard.webp')
   ```

4. **Update `public/_headers`** — No changes needed (external images bypass Cloudflare headers).

### Acceptance
- All 18 images uploaded as WebP to Supabase
- Total size reduced from ~4.1MB to under ~1.5MB
- `screenshotUrl()` helper works in Astro components
- Script is re-runnable (idempotent upload with upsert)

---

## Phase 1: Homepage Rewrite

### Goal
Replace all SVG illustrations with real screenshots. Rewrite all copy for homeowner/flipper audience. Add new AudienceSection.

### Files to Modify

| File | Action |
|------|--------|
| `src/components/landing/Hero.astro` | Replace SVG with `homeowner-dashboard.png` screenshot. New H1: "Know exactly where your money goes." New subhead and description per REWRITE-PLAN.md Task 2.1 |
| `src/components/landing/ValueProps.astro` | Rewrite 4 cards per REWRITE-PLAN.md Task 2.2 |
| `src/components/landing/AudienceSection.astro` | **CREATE** — 3-column section (Homeowners, Flippers, Real Estate Teams) per Task 2.3. Use mobile screenshots for homeowner column, desktop flipper-portfolio for flipper column |
| `src/components/landing/FeatureShowcase.astro` | Replace SVG imports with `<img>` tags using `screenshotUrl()`. Rewrite all copy per Task 2.4 |
| `src/components/landing/FeatureRow.astro` | Update to accept `imageUrl: string` + `alt: string` props instead of Astro component slot for image. Add `loading="lazy"` `decoding="async"` with explicit dimensions |
| `src/components/landing/HowItWorks.astro` | Rewrite 3 steps per Task 2.5 |
| `src/components/landing/ClosingCta.astro` | New copy per Task 2.6 |
| `src/pages/index.astro` | Import AudienceSection, update metadata + Schema.org per Task 2.7 |

### Screenshot Mapping for Features

| Feature Section | Screenshot | Alt Text |
|----------------|------------|----------|
| Hero | `desktop/homeowner-dashboard.webp` | "Fierro project dashboard showing budget overview for a kitchen remodel" |
| Budget Tracking | `desktop/homeowner-dashboard.webp` or `mobile/homeowner-dashboard-mobile.webp` | "Real-time budget tracking with spent vs. remaining amounts" |
| Expense Management | `desktop/homeowner-expenses.webp` | "Expense timeline with status badges and vendor details" |
| Team Management | `desktop/homeowner-team.webp` | "Project team view showing owner, contractor, and trade roles" |
| Vendor Management | `desktop/homeowner-expense-detail.webp` | "Expense detail with vendor, category, and approval information" |
| Analytics | `desktop/homeowner-audit.webp` | "Project audit log with expense activity timeline" |
| Audience — Homeowner | `mobile/homeowner-dashboard-mobile.webp` | "Mobile view of renovation budget tracking" |
| Audience — Flipper | `desktop/flipper-portfolio.webp` | "Multi-property portfolio view with budget progress" |
| Audience — Teams | `desktop/flipper-project-detail.webp` | "Detailed project dashboard for a property flip" |

### Image Tag Pattern

All screenshot `<img>` tags should follow this pattern:

```html
<img
  src={screenshotUrl('desktop/homeowner-dashboard.webp')}
  alt="Fierro project dashboard showing budget overview"
  width="1440"
  height="900"
  loading="lazy"
  decoding="async"
  class="rounded-lg shadow-xl"
/>
```

Hero image should use `loading="eager"` (above the fold).

### Acceptance
- Zero SVG illustrations remain on homepage
- All images load from Supabase URLs
- Lighthouse performance score >= 90
- All copy matches REWRITE-PLAN.md

---

## Phase 2: Pricing Page

### Goal
Add Home tier ($20/mo), update grid to 4 columns, rewrite copy for homeowner/flipper audience.

### Files to Modify

| File | Action |
|------|--------|
| `src/pages/pricing.astro` | Add Home tier data, update grid to `lg:grid-cols-4`, update hero text + metadata per Tasks 3.1, 3.7, 3.6 |
| `src/components/pricing/TierCard.astro` | Support Home tier annual note per Task 3.5 |
| `src/components/pricing/ComparisonTable.astro` | Add Home column per Task 3.3 |
| `src/components/pricing/PricingToggle.astro` | Update savings text per Task 3.4 |
| `src/components/pricing/PricingFaq.astro` | Replace all 5 FAQs per Task 3.5 |

### Home Tier Data
```
name: 'Home'
price: { monthly: '$20', annual: '$16' }
description: 'For homeowners managing a renovation or remodel'
features: ['2 projects', '15 sub-projects per project', '5 team members', 'Advanced expense tracking', 'Receipt photo capture', 'Budget alerts', 'Email support']
highlighted: true  // Move from Plus to Home
```

### Acceptance
- 4 tiers render correctly at all breakpoints
- Toggle switches monthly/annual for Home tier
- Comparison table has 4 data columns
- FAQ copy matches REWRITE-PLAN.md

---

## Phase 3: Why Fierro Page

### Goal
Rewrite for homeowner/flipper pain points. Replace AI/MCP jargon with accessible "Smart Insights" section.

### Files to Modify

| File | Action |
|------|--------|
| `src/pages/why-fierro.astro` | Update hero text + metadata per Task 4.1, 4.4 |
| `src/components/why-fierro/PainSection.astro` | Rewrite 4 pain points per Task 4.2 (component structure stays, just copy) |
| `src/components/why-fierro/AiSection.astro` | Full rewrite → "Smart Budget Insights" per Task 4.3 |

### Acceptance
- Zero mentions of MCP, ChatGPT, Claude, or technical AI jargon
- Pain points resonate with homeowner/flipper personas
- Page metadata updated

---

## Phase 4: Global Updates

### Files to Modify

| File | Action |
|------|--------|
| `src/components/Footer.astro` | CTA copy update per Task 5.1 |
| `src/layouts/BaseLayout.astro` | Default description per Task 5.3 |
| `src/pages/index.astro` | Schema.org updates per Task 5.2 |
| `public/llms.txt` | Update if it references contractor audience per Task 5.4 |

### Acceptance
- No contractor/builder-first language in any global element
- Schema.org reflects new audience + Home tier

---

## Phase 5: QA + Testing

### Tasks
1. Visual review — all pages, desktop + mobile breakpoints
2. Lighthouse CI — performance >= 90, no CLS from images (width/height attrs)
3. Update Playwright tests — old copy assertions will break
4. Verify PricingToggle Web Component works with 4 tiers
5. Check View Transitions still work across pages

---

## Architecture Notes

- **Framework:** Astro 5.18 (static output, no SSR)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite`
- **Colors:** gunmetal (dark bg), molten-orange (CTA/accent), off-white (light bg), concrete-gray (secondary), rebar-green (success)
- **Font:** DM Sans Variable (self-hosted via @fontsource)
- **Deploy:** Cloudflare Workers static assets (`wrangler deploy`)
- **Animation:** IntersectionObserver with `data-animate` attributes (duplicated in 3 page files — consider extracting but don't block on it)
- **No SSR/islands** except PricingToggle Web Component

## Key File Paths

```
src/
  components/landing/     — Hero, ValueProps, FeatureShowcase, FeatureRow, HowItWorks, ClosingCta
  components/pricing/     — PricingToggle, TierCard, ComparisonTable, PricingFaq
  components/why-fierro/  — PainSection, AiSection
  components/Nav.astro, Footer.astro, MobileMenu.astro
  layouts/BaseLayout.astro
  pages/index.astro, pricing.astro, why-fierro.astro, privacy.astro, terms.astro, 404.astro
  styles/global.css       — All design tokens (@theme), animation system
  assets/illustrations/   — 6 SVG files to be REPLACED (can delete after Phase 1)
docs/
  plans/OVERVIEW.md       — Strategy rationale
  plans/REWRITE-PLAN.md   — Full copy for every component rewrite
  assets/screenshots/     — Raw PNGs (source of truth for optimization)
```
