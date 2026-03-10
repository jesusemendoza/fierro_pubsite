# Pubsite Rewrite Plan — Homeowner & Flipper/Investor First

## Strategy

Stop marketing to GCs and builders. Speak directly to:
1. **Homeowners** (primary) — DIYers, remodelers, new home builds. Mass market, high volume.
2. **Flippers / Real Estate Investors** (secondary) — Higher ARPU, multi-project, ROI-obsessed.

Stack social proof from these audiences, then go after GCs later from a position of strength.

---

## Phase 1: Screenshots from Demo Account

Before touching copy, we need product images. These replace the SVG illustrations.

### Task 1.1 — Generate demo account data
- Create a realistic demo account in the Fierro app with two personas:
  - **Homeowner persona**: "Kitchen & Bath Remodel" project with sub-projects (demo, cabinets, plumbing, electrical, flooring, countertops). Realistic expenses ($2,800 plumber invoice, $450 Home Depot receipt, etc.)
  - **Flipper persona**: "2847 Elm St Flip" project with sub-projects (structural, kitchen, bath, exterior, landscaping). Show a portfolio view if possible with 3 properties.

### Task 1.2 — Capture screenshots
Capture clean, high-res screenshots (1280x800 desktop, 390x844 mobile) of:

| Screenshot | What it shows | Replaces | Used on |
|-----------|--------------|----------|---------|
| `hero-dashboard.png` | Budget overview of kitchen remodel — spent vs. budget bars, green/orange status | `hero-dashboard.svg` | Homepage hero |
| `feature-budget.png` | Line-item budget for a remodel — categories homeowners recognize | `feature-budget.svg` | Homepage features |
| `feature-expenses.png` | Mobile receipt capture — photo of a Home Depot receipt being logged | `feature-expenses.svg` | Homepage features |
| `feature-team.png` | Team view showing "Owner," "Contractor," "Designer" roles | `feature-team.svg` | Homepage features |
| `feature-vendor.png` | Vendor list: plumber, electrician, cabinet company, tile supplier | `feature-vendor.svg` | Homepage features |
| `feature-analytics.png` | Dashboard with budget health, spend trends, category breakdown | `feature-analytics.svg` | Homepage features |
| `flipper-portfolio.png` | Multi-project view showing 3 flips with margins | New | Homepage audience section |
| `homeowner-mobile.png` | Mobile view of budget tracking for a remodel | New | Homepage audience section |

### Task 1.3 — Add screenshots to repo
- Save to `public/screenshots/` directory (PNG, optimized)
- Update FeatureShowcase and Hero to use `<img>` tags with these PNGs instead of imported SVG components
- Add proper `alt` text for each screenshot

---

## Phase 2: Homepage Rewrite

### Task 2.1 — Hero (`src/components/landing/Hero.astro`)

**Current:**
> "Every dollar. Every pour. Accounted for."
> "Construction cost control that keeps your projects profitable."

**New:**
> "Know exactly where your money goes."
> "Whether you're remodeling your home or flipping your next investment — track every dollar, catch every overrun, and stay on budget."

- Replace SVG illustration with `hero-dashboard.png` screenshot
- CTAs stay: "Start Free" + "See How It Works"

### Task 2.2 — Value Props (`src/components/landing/ValueProps.astro`)

**Current:** Contractor jargon (Real-Time Cost Visibility, Field + Office in One App, etc.)

**New — 4 cards rewritten for homeowner/flipper language:**

| # | Title | Description |
|---|-------|-------------|
| 1 | "See Every Dollar in Real Time" | "Watch your renovation or flip budget update live. No more wondering where you stand." |
| 2 | "Catch Overruns Before They Hurt" | "Get alerts when a category is trending over budget — before your contractor delivers the bad news." |
| 3 | "Track From Anywhere" | "Snap a receipt on your phone at the hardware store. Review your budget on your laptop at home. Same data, always in sync." |
| 4 | "Built for Real Projects, Not Accountants" | "No accounting degree required. Fierro is designed for people managing real renovation and investment projects." |

- Update `sr-only` heading from "Why contractors choose Fierro" → "Why homeowners and investors choose Fierro"

### Task 2.3 — Audience Section (NEW component)
**File:** `src/components/landing/AudienceSection.astro`

New section inserted between ValueProps and FeatureShowcase. Three columns:

| Column | Heading | Copy | Image |
|--------|---------|------|-------|
| 1 | "Homeowners & DIYers" | "Remodeling a kitchen? Building an addition? Finally finishing that basement? Set your budget, track every expense, and never wonder where your money went." | `homeowner-mobile.png` |
| 2 | "Flippers & Investors" | "Know your all-in cost per property in real time. Compare rehab budgets across flips. Catch the overruns that kill your margins before closing day." | `flipper-portfolio.png` |
| 3 | "Real Estate Teams" | "Give every partner, PM, and stakeholder real-time visibility into project costs. One source of truth across your entire portfolio." | `feature-analytics.png` |

### Task 2.4 — Feature Showcase (`src/components/landing/FeatureShowcase.astro`)

**Current section heading:** "Everything you need to control construction costs"
**New:** "Everything you need to stay on budget"

Rewrite each feature row's copy for homeowner/flipper language:

**Budget Tracking:**
- "Set your renovation budget and watch every dollar against the plan. No more end-of-project surprises."
- Bullets: "Create a budget in minutes — just list your categories and targets" / "See how much you've spent vs. what's left in real time" / "Get alerts before you go over in any category"

**Expense Management:**
- "Every receipt, every invoice, every payment — in one place. Stop losing track of what you've paid."
- Bullets: "Snap receipts on your phone at the store or job site" / "Attach contractor invoices to the right budget category" / "Review and approve expenses before they pile up"

**Team Management:**
- "Share access with your contractor, designer, or spouse. Everyone sees what they need."
- Bullets: "Invite people with different permission levels" / "Your contractor logs expenses, you approve them" / "See who spent what, when, from anywhere"

**Vendor Management:**
- "Keep every contractor, supplier, and service provider organized in one place."
- Bullets: "Build a directory of everyone working on your project" / "Link invoices to specific vendors and budget categories" / "Compare costs across projects to spot who's overcharging"

**Analytics & Reporting:**
- "See the big picture before small problems become big ones."
- Bullets: "Visual dashboard showing your budget health at a glance" / "Export reports for your partner, lender, or accountant" / "Spot trends — is your electrical always running over?"

Replace all SVG illustrations with PNG screenshots.

### Task 2.5 — How It Works (`src/components/landing/HowItWorks.astro`)

**New steps — rewritten for homeowner voice:**

| # | Title | Description |
|---|-------|-------------|
| 1 | "Set Your Budget" | "Create your project, add your categories (kitchen, bath, electrical — whatever you need), and set your targets. Takes about 5 minutes." |
| 2 | "Track Everything" | "Log expenses as they happen. Snap receipts, attach invoices, or add costs manually. Your contractor can log too." |
| 3 | "Stay on Budget" | "See exactly where you stand at any moment. Catch overruns early. Finish your project knowing every dollar is accounted for." |

### Task 2.6 — Closing CTA (`src/components/landing/ClosingCta.astro`)

**Current:** "Stop guessing. Start knowing." / "Take control of your construction costs before they take control of you."

**New:**
> "Stop wondering where your money went."
> "Start your next renovation or flip with total cost control. Free to start, no credit card required."

### Task 2.7 — Homepage metadata (`src/pages/index.astro`)

**Title:** "Track Your Renovation & Project Costs" (was "Construction Cost Control")
**Description:** "Track renovation budgets, remodel expenses, and project costs in real time. Built for homeowners, flippers, and real estate investors. Free to start."
**Schema.org:** Update `description` and `offers` to reflect new tiers and audience.

---

## Phase 3: New Pricing Tier + Page Rewrite

### Task 3.1 — Add Home tier to pricing data (`src/pages/pricing.astro`)

Insert between Free and Plus:

```javascript
{
  name: 'Home',
  price: { monthly: '$20', annual: '$16' },
  period: '/mo',
  description: 'For homeowners managing a renovation or remodel',
  cta: { text: 'Start Home', href: 'https://app.getfierro.com/signup?plan=home&billing=monthly' },
  features: [
    '2 projects',
    '15 sub-projects per project',
    '5 team members',
    'Advanced expense tracking',
    'Receipt photo capture',
    'Budget alerts',
    'Email support',
  ],
  highlighted: true,  // Make this the recommended tier
  builder: false,
}
```

Move `highlighted: true` from Plus to Home. Update Plus's highlighted to `false`.

**Pricing page now has 4 tiers:**

| Tier | Monthly | Annual | Target |
|------|---------|--------|--------|
| Free | $0 | $0 | Try it out |
| Home | $20 | $16 | Homeowners / DIYers |
| Plus | $49 | $39 | Flippers / investors with multiple projects |
| Builder | Custom | Custom | Future (keep but de-emphasize) |

### Task 3.2 — Update tier card grid layout

**Current:** `grid-cols-1 md:grid-cols-3`
**New:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`

### Task 3.3 — Update comparison table (`src/components/pricing/ComparisonTable.astro`)

Add `home` column to every feature row:

| Feature | Free | Home | Plus | Builder |
|---------|------|------|------|---------|
| Projects | 1 | 2 | 5 | Unlimited |
| Sub-projects per project | 6 | 15 | 20 | Unlimited |
| Team members | 3 | 5 | 10 | Unlimited |
| Expense tracking | Basic | Advanced | Advanced | Advanced |
| Receipt photo capture | -- | Included | Included | Included |
| Budget analytics | Summary | Visual dashboard | Detailed reports | Custom dashboards |
| Budget alerts | -- | Included | Included | Included |
| Vendor management | -- | -- | Included | Included |
| AI insights | Limited | Basic | Fully configurable | Fully configurable |
| API access | -- | -- | -- | Included |
| Support | Community | Email | Priority | Dedicated manager |

### Task 3.4 — Update pricing toggle annual savings

**Current:** "Save $118/year" (based on Plus only)
**New:** "Save up to $118/year" (covers both Home and Plus savings)

Update `data-annual-note` on Home tier card: "billed annually at $192"
Keep Plus: "billed annually at $470"

### Task 3.5 — Rewrite pricing FAQ (`src/components/pricing/PricingFaq.astro`)

Replace all 5 FAQs with homeowner/flipper objections:

| Question | Answer |
|----------|--------|
| "I'm just doing one renovation — is this worth it?" | "The Free tier gives you 1 project with 6 budget categories — enough for a simple remodel. When your project gets more complex (or you start a second one), the Home tier at $20/mo is less than you'd lose to one surprise overrun." |
| "Can't I just use a spreadsheet?" | "You can. But spreadsheets don't alert you when your electrical budget is 80% spent with half the work remaining. They don't let your contractor log expenses directly. And they definitely don't give you a real-time dashboard of where every dollar went. Fierro does all of that in less time than maintaining a spreadsheet." |
| "Can my contractor use it too?" | "Yes. Invite your contractor as a team member. They can log expenses and receipts directly into your budget. You control what they can see and do. No more chasing invoices over text." |
| "What if I'm managing multiple flips?" | "The Plus tier at $49/mo gives you 5 active projects with 20 budget categories each — built for investors running multiple properties. Compare costs across flips, track vendor performance, and know your all-in cost per property." |
| "Is my financial data secure?" | "Your data is encrypted in transit and at rest. We use Supabase for infrastructure and follow industry best practices for data security. You own your data and can export it anytime." |

### Task 3.6 — Update pricing page metadata

**Title:** "Pricing" (keep)
**Description:** "Free for your first project. Home tier at $20/mo for renovations. Plus at $49/mo for investors and flippers. No sales calls, no hidden fees."

### Task 3.7 — Update pricing hero text

**Current:** "Simple, Transparent Pricing" / "No sales calls required. No hidden fees. Start free, upgrade when you're ready."
**New:** "Plans That Fit Your Project" / "Tracking a kitchen remodel? Free. Managing a portfolio of flips? $49/mo. No sales calls, no surprises."

---

## Phase 4: Why Fierro Page Rewrite

### Task 4.1 — Rewrite page hero

**Current:** "Construction runs on trust..."
**New:**
> "Why Fierro?"
> "Renovations and flips go over budget. Not because people are careless — because tracking costs across receipts, texts, and spreadsheets is impossible. We built Fierro so you always know where you stand."

### Task 4.2 — Rewrite pain points for homeowner/flipper audience

**Pain Point 1 (Homeowner):**
- Problem: "Your contractor sent you a bill and you have no idea if it's right"
- Cause: "When expenses are scattered across texts, emailed invoices, and verbal agreements, you're trusting the numbers blindly. Most homeowners don't realize they've overpaid until the project is done."
- Solution: "Fierro gives you and your contractor one shared place to log every cost. You see what's been spent, what's been invoiced, and how it compares to your budget — in real time."

**Pain Point 2 (Homeowner/DIY):**
- Problem: "You set a budget but you have no idea if you're actually on track"
- Cause: "You estimated $35K for the kitchen remodel. You've been paying invoices for two months. Are you at $18K or $28K? Without a system, you won't know until it's too late."
- Solution: "Fierro shows your budget health as it changes. See exactly how much is spent, how much is committed, and how much is left — for every category, updated the moment a cost is logged."

**Pain Point 3 (Flipper):**
- Problem: "You didn't realize the flip was over budget until closing day"
- Cause: "Flippers juggle multiple properties, multiple contractors, and hundreds of line items. When costs live in different spreadsheets and bank statements, overruns hide until the final accounting."
- Solution: "Fierro tracks your all-in cost per property in real time. See every flip's budget health at a glance. Catch overruns weeks earlier — before they eat your margin."

**Pain Point 4 (Investor):**
- Problem: "Your partner asked for a project update and you spent an hour pulling numbers"
- Cause: "Your costs live in emails, receipts, your contractor's texts, and maybe a spreadsheet you haven't updated in two weeks. Pulling it together for stakeholders is a project in itself."
- Solution: "Fierro gives everyone — you, your partners, your contractors — one real-time view of project costs. Share a dashboard instead of scrambling to build a report."

### Task 4.3 — Replace AI Section

**Remove** the current `AiSection.astro` with its MCP/ChatGPT/Claude jargon.

**Replace with** a simpler "Smart Insights" section:

> "Smart Budget Insights"
> "Fierro uses AI to surface what matters — like flagging a budget category that's trending over, or summarizing your project costs into a clean report. No setup required, no jargon. It just works in the background to keep you informed."

Two cards:
- "Trend Alerts" — "Get notified when spending in any category is on pace to exceed your budget."
- "Instant Reports" — "Generate a project cost summary in seconds. Share it with your partner, lender, or accountant."

### Task 4.4 — Update page metadata

**Description:** "Renovations go over budget because tracking costs is broken. Fierro fixes that — one place to track every dollar on every project."

---

## Phase 5: Navigation & Global Updates

### Task 5.1 — Footer (`src/components/Footer.astro`)

**Current CTA:** "Ready to take control?"
**New:** "Ready to know where every dollar goes?"

### Task 5.2 — Schema.org / JSON-LD (`src/pages/index.astro`)

Update:
- Organization description: "Budget tracking and cost control for homeowners, flippers, and real estate investors."
- SoftwareApplication description: "Track renovation budgets, remodel expenses, and project costs in real time. Built for homeowners, flippers, and real estate investors."
- Offers: Add Home tier ($20), update descriptions to reflect new audience
- featureList: Remove "AI/MCP integration", add "Receipt photo capture", "Budget alerts"

### Task 5.3 — BaseLayout default description

**Current:** "Fierro is construction job cost control software. Track budgets, expenses, and project health in real time."
**New:** "Fierro helps homeowners and investors track renovation budgets, project expenses, and costs in real time."

### Task 5.4 — llms.txt / robots.txt
Review and update `public/llms.txt` if it references construction/GC audience.

---

## Phase 6: Testing & QA

### Task 6.1 — Visual review
- Desktop and mobile for all pages
- Verify screenshot images load and look good
- Check 4-column pricing grid on tablet breakpoint

### Task 6.2 — Update Playwright tests
- Update any tests that assert on old copy (h3 counts, specific text, etc.)
- Add tests for new Home tier card
- Verify comparison table renders 4 columns

### Task 6.3 — Lighthouse audit
- Run Lighthouse CI to ensure no performance regression from PNG screenshots
- Optimize images if needed (WebP with PNG fallback)

---

## File Change Summary

| File | Action | Phase |
|------|--------|-------|
| `public/screenshots/*.png` | CREATE (8 files) | 1 |
| `src/components/landing/Hero.astro` | REWRITE copy + image | 2 |
| `src/components/landing/ValueProps.astro` | REWRITE copy | 2 |
| `src/components/landing/AudienceSection.astro` | CREATE new component | 2 |
| `src/components/landing/FeatureShowcase.astro` | REWRITE copy + images | 2 |
| `src/components/landing/HowItWorks.astro` | REWRITE copy | 2 |
| `src/components/landing/ClosingCta.astro` | REWRITE copy | 2 |
| `src/pages/index.astro` | UPDATE metadata, schema, add AudienceSection import | 2 |
| `src/pages/pricing.astro` | ADD Home tier, update grid, update hero text, update meta | 3 |
| `src/components/pricing/ComparisonTable.astro` | ADD Home column | 3 |
| `src/components/pricing/PricingFaq.astro` | REWRITE all FAQs | 3 |
| `src/components/pricing/PricingToggle.astro` | UPDATE savings text | 3 |
| `src/components/pricing/TierCard.astro` | UPDATE annual note logic for Home tier | 3 |
| `src/pages/why-fierro.astro` | REWRITE pain points, hero, metadata | 4 |
| `src/components/why-fierro/AiSection.astro` | REWRITE as SmartInsights | 4 |
| `src/components/Footer.astro` | UPDATE CTA copy | 5 |
| `src/layouts/BaseLayout.astro` | UPDATE default description | 5 |
| `public/llms.txt` | REVIEW and update | 5 |
| Playwright test files | UPDATE assertions | 6 |

**Total: ~19 files touched, 1-2 new files created**

---

## Execution Order

Phases 1 → 2 → 3 → 4 → 5 → 6 (sequential — each builds on the previous)

Phase 1 (screenshots) must happen first or in parallel with copy work using placeholder images. We can use the existing SVG illustrations as temporary placeholders and swap in real screenshots when ready.

**Recommendation:** Start Phases 2-5 now with placeholder `[screenshot]` comments, generate demo data and screenshots as a separate workstream, then swap images in as a final pass.
