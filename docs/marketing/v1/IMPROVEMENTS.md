# V1 → V2 Site Improvements

> Changes made 2026-03-10 based on v1 review findings. To be validated by v2 `/site-review` run.

## Changes Made

### 1. Pricing Tier Overhaul

**Free tier:**
- Label: "For solo contractors getting started" → **"For your first project"**
- Team members: 3 → **2**
- Added **Receipt capture (100 MB)** — was completely gated before
- AI: "Limited AI access" → **"ChatGPT integration (read-only)"**
- No contractor invites (no role-based access on Free)

**Home tier ($20/mo):**
- Added **5 contractors (free)** — contractors don't count against team member slots
- Receipt capture now shows **5 GB** storage limit
- Added **Role-based access** as explicit feature
- AI: added → **"ChatGPT integration (read & write)"**

**Plus tier ($49/mo):**
- Description: "For growing teams managing multiple jobs" → **"For investors & flippers managing multiple properties"**
- Projects: 5 → **8**
- Contractors: 15 → **Unlimited (free)**
- Receipt capture: **25 GB** storage
- Added **Role-based access**
- AI: "Fully configurable AI/MCP" → **"ChatGPT integration (configurable per project)"**
- Added **Audit logs**

**Builder tier (Custom):**
- Added **Unlimited contractors (free)**
- Added **Unlimited receipt storage**
- Added **Role-based access**
- AI: "Fully configurable AI/MCP" → **"ChatGPT integration (configurable per project)"**
- Added **Audit logs**

**Comparison table** updated to match all tier changes with new rows for contractor invites, role-based access, receipt storage tiers, and audit logs.

### 2. AI/MCP Language Eliminated

Every instance of "AI/MCP", "MCP", "Limited AI access", and "Fully configurable" replaced with plain language:
- Free: "ChatGPT integration (read-only)"
- Home: "ChatGPT integration (read & write)"
- Plus/Builder: "ChatGPT integration (configurable per project)"

### 3. Why Fierro — AI Section Rewritten

**Before:** "Fierro uses AI to surface what matters" — positioned Fierro as having built-in AI
**After:** "Your AI Tools, Your Data" — positions Fierro as a connector to tools users already know

- Heading: "Smart Budget Insights" → **"Your AI Tools, Your Data"**
- Copy reframes Fierro as enabling users' own AI tools (ChatGPT) to work with their project data
- Feature cards: "Trend Alerts" → **"Ask Your AI Anything"** with example questions
- "Instant Reports" updated to reference ChatGPT directly

### 4. Homepage Value Props — Card #4 Replaced

**Before:** "Built for Real Projects, Not Accountants" — dismissive of accountants, defensive tone
**After:** "Connect Your AI Tools" — sells a differentiating capability

New copy: *Ask ChatGPT about your budget. "Am I over on electrical?" Get real answers from your real data.*

### 5. Homepage Feature Showcase — AI Row Added

New **"AI Tool Integration"** feature row with:
- Custom SVG illustration showing a ChatGPT + Fierro chat exchange (no screenshot needed, avoids trademark issues)
- Three bullets: natural language queries, instant report generation, premium tier controls
- SVG shows realistic interaction: user asks about electrical budget, gets specific cost data back

### 6. Feature Showcase Reordered for Impact

**Before:** Budget → Expenses → Team → Vendors → Analytics → AI
**After:** Budget → **AI** → Expenses → Team → Analytics → Vendors

Rationale: AI is the biggest differentiator vs. competitors and spreadsheets. Placing it second creates the "oh shit" moment right after the core promise lands. Vendor management moved last as the narrowest-audience feature.

---

## Review Issues Addressed

| Issue (from v1 reviews) | Status |
|---|---|
| "AI/MCP" jargon means nothing to users | Fixed — all instances replaced with ChatGPT language |
| Free tier says "For solo contractors" but site targets homeowners | Fixed — now "For your first project" |
| Receipt capture paywalled on Free | Fixed — 100 MB included on Free |
| Pricing cliff at 5 projects (Plus) | Fixed — Plus now 8 projects |
| Plus description too vague | Fixed — "For investors & flippers managing multiple properties" |
| No contractor invite visibility | Fixed — explicit per-tier with "(free)" label |
| AI section positions Fierro as having built-in AI | Fixed — reframed as "your tools, your data" |
| Accountant-dismissive copy on homepage | Fixed — replaced with AI value prop |
| AI differentiator buried at bottom of feature showcase | Fixed — moved to position #2 |

## Issues NOT Yet Addressed

| Issue | Why |
|---|---|
| Zero social proof / testimonials | No users yet — needs real customers |
| No demo video | High effort — future iteration |
| No persona landing pages (/for-homeowners, /for-flippers) | Needs more content — future iteration |
| No competitor comparison section | Needs research on positioning — future iteration |
| No export format details for investors/CPAs | Needs product clarity on export features |
| No deal-level P&L for flippers (purchase + rehab vs ARV) | Product feature, not just site copy |
| No mobile app details | Product roadmap dependent |
| Missing mid-tier between Plus and Builder | Monitoring — 8 projects on Plus may be enough |
