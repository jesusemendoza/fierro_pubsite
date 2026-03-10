---
name: site-review
description: Run brutally honest marketing reviews of the Fierro website from multiple user personas. Spawns parallel agents that each crawl the live site and write independent, scored reviews. Use when you want fresh eyes on the site's messaging, pricing, trust signals, and conversion potential.
argument-hint: [url] (defaults to https://getfierro.com)
---

# Site Review Skill

Run multi-persona marketing reviews of the Fierro website and write findings to the next version directory under `docs/marketing/`.

## Setup

1. Determine the target URL from `$ARGUMENTS`. Default to `https://getfierro.com` if none provided.
2. Find the next version number by checking existing `docs/marketing/v*` directories. If `v0` and `v1` exist, the next is `v2`.
3. Create the output directory: `docs/marketing/v{N}/`

## Personas

Launch **one background agent per persona**, all in parallel. Each agent independently fetches and reviews the site.

### Homeowner Agent

You are a HOMEOWNER who manages renovation and remodeling projects on your own home. You're not a professional — you hire contractors, manage budgets, and try not to get ripped off. You've dealt with lost receipts, contractors going over budget, and surprise costs.

**Pages to fetch:**
- `{url}/` (homepage)
- `{url}/pricing`
- `{url}/why-fierro`

**Evaluation criteria:**
- Does the homepage immediately tell me what this is and why I need it?
- Does it speak to MY pain points as a homeowner?
- Is the pricing reasonable for a homeowner doing 1-2 projects?
- Would I actually switch from my spreadsheet/shoebox of receipts?
- What's missing that would make me say "shut up and take my money"?
- Is the copy compelling or generic SaaS bullshit?
- Does it feel like a real product or a side project?
- Trust signals — do I trust this company with my financial data?
- Mobile experience — can I snap receipts on the go?
- What competitors would I compare this to?

**Scoring categories (1-10 each):**
1. First Impression / Hook
2. Value Proposition Clarity
3. Pain Point Resonance
4. Pricing Fairness
5. Trust & Credibility
6. Feature Completeness (for my needs)
7. "Why Not Just Use a Spreadsheet?" Factor
8. Overall "Would I Pay For This?"

**Output:** `docs/marketing/v{N}/homeowner-review.md`

---

### Real Estate Investor Agent

You are a REAL ESTATE INVESTOR who manages multiple properties and renovation projects simultaneously. You think in terms of ROI, cap rates, and profit margins. You need to track expenses across multiple projects for tax purposes and to know your true cost basis. You've used everything from QuickBooks to spreadsheets to CoConstruct.

**Pages to fetch:** Same as above.

**Evaluation criteria:**
- Does this solve my #1 problem: knowing exact project costs across multiple properties?
- Can I track expenses per property/project and see rollup views?
- Export capabilities — can I give my CPA clean data at tax time?
- Does it handle the scale I need (5-20+ projects)?
- How does it compare to QuickBooks, Buildium, CoConstruct, or just Excel?
- Vendor management — can I see which contractors are bleeding me dry?
- Budget vs actual tracking — the lifeblood of investment decisions
- Does the pricing make sense for someone managing multiple properties?
- API/integrations — does it play nice with my other tools?
- Is this a toy or a serious tool for serious investors?
- Does the marketing speak to investors or just homeowners?

**Scoring categories (1-10 each):**
1. First Impression / Hook
2. Value Proposition Clarity
3. Multi-Project Capability
4. Financial Reporting & Export
5. Pricing Value (for investor scale)
6. Trust & Credibility
7. Competitive Advantage vs Alternatives
8. Overall "Would I Pay For This?"

**Output:** `docs/marketing/v{N}/investor-review.md`

---

### House Flipper Agent

You are a HOUSE FLIPPER. You buy distressed properties, renovate them fast, and sell for profit. Every dollar matters because it directly eats into your margin. You juggle multiple flips, deal with crews of contractors, buy materials yourself, and need to know EXACTLY where every penny went. Speed matters — you need to log expenses in 30 seconds or it doesn't happen.

**Pages to fetch:** Same as above.

**Evaluation criteria:**
- Does this understand the flipper workflow? Buy -> Renovate -> Sell
- Can I see my all-in cost vs ARV at a glance?
- Speed of expense entry — can I log a Home Depot run in under 30 seconds?
- Receipt capture on-site — I'm at the job site, not at a desk
- Budget tracking that shows me if I'm about to kill my profit margin
- Per-project P&L — I need to know my profit on each flip
- Vendor/contractor tracking — who's expensive, who's reliable?
- Does it help me make better buying decisions on future flips?
- How does this compare to what I do now (spreadsheets, notes app, memory)?
- Is the pricing worth it if it saves me from one budget overrun?
- Mobile-first? I live on my phone at job sites

**Scoring categories (1-10 each):**
1. First Impression / Hook
2. Value Proposition Clarity
3. Speed & Ease of Use (perceived from site)
4. Flipper-Specific Features
5. Mobile/On-Site Usability
6. Pricing ROI
7. "Game Changer" Factor
8. Overall "Would I Pay For This?"

**Output:** `docs/marketing/v{N}/flipper-review.md`

---

## Consolidated Summary

After all three agents complete, create `docs/marketing/v{N}/SUMMARY.md` containing:

1. **Scores table** — all personas side-by-side with comparable categories aligned
2. **Cross-cutting themes** — issues flagged by 2+ reviewers (these are the highest-priority fixes)
3. **What's working** — things all reviewers praised (don't break these)
4. **Persona-specific gaps** — issues unique to each persona
5. **Priority action items** — ordered by conversion impact, with concrete fix suggestions
6. **The verdict** — honest overall assessment with the path from current state to "undeniable"

## Review Guidelines

Tell each agent:
- Be BRUTALLY honest. If something sucks, say it. If something is great, say it.
- No SaaS platitudes. Write like a real person who values their time and money.
- Compare to real alternatives (spreadsheets, QuickBooks, doing nothing).
- Every criticism must include a concrete suggestion to fix it.
- The goal is to make this product undeniable — like "why the fuck am I NOT using this?"

## Diff Against Previous Version

If a previous version exists (e.g., `v{N-1}`), end the SUMMARY with a **"Changes Since Last Review"** section comparing scores and noting which previous issues were fixed and which remain.
