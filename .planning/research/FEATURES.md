# Feature Landscape

**Domain:** Construction SaaS marketing site (static, Astro + Cloudflare Pages)
**Researched:** 2026-03-09
**Overall confidence:** HIGH (cross-referenced against Procore, ingenious.build, JobTread, Buildertrend, and 2026 SaaS landing page best practices)

---

## Table Stakes

Features users expect. Missing = site feels incomplete or untrustworthy. Construction professionals are skeptical by default -- they evaluate software the same way they evaluate subcontractors: fast gut check on credibility, then detailed scrutiny.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Dark/premium hero section with outcome headline** | Every construction SaaS competitor (ingenious.build, Procore, JobTread) leads with a high-contrast hero. Contractors decide in 3-5 seconds. Headline must answer "what does this do for me?" not "what is this product?" | Medium | Use the tagline "Every dollar. Every pour. Accounted for." as supporting copy, but lead with an outcome headline like "Stop Losing Money on Every Job" or "Know Your True Job Costs Before It's Too Late." Dark hero (Gunmetal bg) with Molten Orange CTA. |
| **Product screenshot in hero** | 2026 SaaS standard: show the actual product, not abstract illustrations. ingenious.build and JobTread both embed dashboard visuals above the fold. Static screenshots are passable; abstract 3D shapes are not. | Low | Use a polished screenshot of the Fierro dashboard. Real UI > stock imagery. Can be a styled browser frame mockup. |
| **Primary + secondary CTA above the fold** | Dual CTA is universal across construction SaaS: "Start Free" (primary, Molten Orange) + "See How It Works" or "Watch Demo" (secondary, ghost/outline). Procore uses "See Pricing" + "Request Demo." JobTread uses "Sign Up Today" + "Watch a Full Demo." | Low | Primary: "Start Free" links to app.getfierro.com/signup. Secondary: scrolls to features or links to a walkthrough section. Never hide the signup CTA below the fold. |
| **Client/partner logo bar** | ingenious.build shows 15+ logos (Cushman & Wakefield, JLL, Turner). Procore references 2M+ users. JobTread shows "$25B+ jobs sold." Even early-stage products need *some* trust signal here. | Low | If Fierro has paying customers or beta users, show their logos. If not, use "Built for builders" messaging with construction iconography. Can substitute with "Trusted by X contractors" once real numbers exist. Placeholder section is acceptable for launch but must be replaced quickly. |
| **Value proposition / benefits section** | 3-4 quantified benefit cards below the hero. Every competitor does this. ingenious.build: "5x faster collaboration, 10x fewer change order disputes." JobTread: "$25B+ jobs sold, 48K+ active users." Pattern: icon + benefit headline + supporting sentence. | Low | Propose: "See Every Dollar in Real Time" / "Track Costs Before They Become Overruns" / "Manage Your Team from the Field" / "Stop Drowning in Spreadsheets." Quantify where possible. |
| **Feature showcase section** | Module-by-module breakdown with screenshots. ingenious.build uses 3 expandable modules (Financials, PM, CA). JobTread uses 4 pillars. Procore uses role-based product cards. Fierro has 5 capabilities: budget tracking, expenses, team management, vendor management, analytics. | Medium | Use alternating left/right layout: screenshot on one side, feature copy on the other. Each feature gets a clear headline, 2-3 bullet benefits, and a screenshot. Z-pattern reading flow. |
| **Pricing page with transparent tiers** | Fierro already has defined tiers (Free/$0, Plus/$49, Builder/custom). Transparent pricing is a *differentiator* against Procore and Buildertrend (both hide pricing). JobTread shows per-user pricing with a slider. SaaS best practice: 3 tiers, highlight the recommended plan, include annual discount. | Medium | Three columns. Highlight Plus as "Most Popular." Show monthly and annual toggle ($49/mo vs $470/yr = save ~20%). Builder tier gets "Contact Sales" CTA. Include feature comparison table below the cards. Add FAQ section addressing common pricing questions. |
| **Navigation with clear information architecture** | All competitors use mega-menu or dropdown nav: product/features, pricing, resources, login/signup. ingenious.build segments by role AND by product module. Procore uses Solutions / Who We Serve / Why Procore / Resources. | Low | Keep it simple for a startup: Logo | Features | Pricing | Why Fierro | Login | **Start Free** (CTA button). Mobile: hamburger menu. Sticky nav on scroll. |
| **Responsive mobile-first design** | 63%+ of construction visitors use mobile from the field. Construction workers check sites on phones between tasks. If it doesn't work on mobile, it doesn't work. | Medium | Already in requirements. Verify: touch targets 44px+, hero CTA visible without scroll on mobile, pricing table stacks cleanly, nav collapses to hamburger. |
| **Footer with trust signals** | Standard SaaS footer: product links, company info, legal (Privacy/Terms), social links. Plus construction-specific: no physical address needed for SaaS but "Built in [city]" adds local trust. | Low | Columns: Product (Features, Pricing), Company (About, Why Fierro), Legal (Privacy, Terms), Social (LinkedIn, Twitter/X). Include "Built for the construction industry" tagline. |
| **Privacy and Terms pages** | Legal requirements. Already in PROJECT.md scope. Users checking pricing always look for these. | Low | Duplicate from fierro_web. Ensure consistent styling with marketing site. |
| **SEO meta tags and Open Graph** | Already in requirements. Table stakes for any modern marketing site. Construction professionals share links in group chats and Slack channels. | Low | Unique title/description per page. OG images for social sharing. Structured data (Organization, SoftwareApplication schema). |
| **Fast load times (Lighthouse 95+)** | Already a core constraint. Construction workers on cell networks at job sites need fast loads. Procore and Buildertrend are heavy; this is a chance to win on speed. | Low | Astro handles this by default. Verify with real device testing on 3G. Images optimized (WebP/AVIF), fonts preloaded, zero JS by default. |

## Differentiators

Features that set the site apart from competitors. Not universally expected but high-value when present. These are what make a visitor say "this is different."

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **"Why Fierro" narrative page** | Most construction SaaS sites talk about features. A dedicated "Why Fierro" page that addresses *pain* first -- spreadsheet chaos, surprise overruns, end-of-month panic -- before positioning the product resonates deeply with builders. Procore has "Why Procore" but it's corporate. Fierro can be direct and builder-voiced. | Medium | Structure: pain section (the problem), insight section (why it happens), solution section (how Fierro fixes it), proof section (testimonials or metrics). Write in "builder voice" -- direct, no jargon, like talking to a superintendent at a job trailer. This page is the emotional core of the site. |
| **Quantified ROI / benefit claims** | ingenious.build leads with "Save 2-4 hours per day" and "5x faster collaboration." JobTread: "$25B+ jobs sold." These concrete numbers convert skeptics. Most small SaaS sites use vague "save time" language. | Low | Calculate real or estimated metrics: "Average user saves X hours/week on expense entry" or "Catch overruns X days earlier." Even directional numbers ("Contractors using Fierro report 3x fewer budget surprises") outperform vague claims. Must be defensible. |
| **Transparent pricing as a competitive weapon** | Procore and Buildertrend hide pricing. This frustrates contractors. Fierro showing clear, honest pricing (Free/$0, Plus/$49, Builder/custom) immediately signals "we respect your time." This is a differentiator because the enterprise players deliberately obscure it. | Low | Already planned. Amplify it: add a line like "No sales calls required. No hidden fees. Start free, upgrade when you're ready." directly on the pricing page. |
| **Role-based or persona messaging** | ingenious.build targets 5 roles (Owners, GCs, Specialty Trades, etc.). Procore segments by GC/Owner/Specialty. Fierro's initial audience is likely small-to-mid GCs and subcontractors. Showing "Built for [your role]" creates immediate relevance. | Medium | For launch, a lightweight version: 2-3 persona callouts on the homepage ("For General Contractors" / "For Subcontractors" / "For Project Owners") with tailored one-liners. Full persona pages can come in v2. |
| **Interactive pricing toggle (monthly/annual)** | Common in SaaS but not universal in construction. The visual toggle showing savings creates a micro-interaction that engages visitors and nudges toward annual plans. | Low | Simple toggle component. Show monthly default, highlight annual savings ("Save $118/year"). Astro island for the toggle interaction -- one of the few justified JS islands. |
| **Product walkthrough / "How it works" section** | 3-step visual walkthrough: "1. Create a project budget, 2. Track expenses in real time, 3. Know your true costs." Simplifies the value prop for contractors who don't want to read feature lists. JobTread and ingenious.build both use this pattern. | Low | Can live on homepage as a section. Three steps with icons or mini-screenshots. Keep it to 3 steps max -- contractors don't want complexity. |
| **Social proof with video testimonials** | Video testimonials convert 37%+ better than text. JobTread prominently features video testimonials from real contractors. A single 60-second video from a real builder saying "I used to track everything in Excel, now I use Fierro" is worth more than 10 feature sections. | High | High complexity because it requires actual video content from real users. Plan for it but don't block launch on it. Placeholder: written testimonials with name, company, and photo. Upgrade to video as customer base grows. |
| **Award badges / review platform signals** | JobTread displays 15+ award badges (G2, Deloitte Fast 500). G2 and Capterra badges increase trust by showing third-party validation. | Low | Submit Fierro to G2 and Capterra. Even a "High Performer" badge from a small category matters. For launch: if no badges yet, omit section rather than faking it. Add as they're earned. |
| **Dark mode / premium aesthetic** | ingenious.build's dark theme signals "enterprise-grade, modern." Most construction company websites look like they were built in 2012. A dark, premium aesthetic (Gunmetal base) immediately differentiates Fierro from both cheap-looking competitors and corporate-bland enterprise tools. | Medium | Already in the brand system. Key: maintain contrast ratios for accessibility (WCAG AA minimum). Light text on Gunmetal needs careful weight/size choices. Use Molten Orange sparingly for emphasis, not decoration. |
| **Scroll-triggered animations (restrained)** | 2026 trend: sections fade/slide in on scroll. ingenious.build uses gradient overlays and glowing button effects. Adds polish without requiring JS-heavy frameworks. | Medium | Use CSS-only animations where possible (intersection observer via Astro island if needed). Rule: every animation must serve comprehension, not decoration. Feature cards sliding in = good. Parallax backgrounds = overkill for a static site. |

## Anti-Features

Features to explicitly NOT build for v1. These are tempting but add complexity, maintenance burden, or premature optimization that a launch-stage product does not need.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Blog / content hub** | Already out of scope per PROJECT.md. Blogs require ongoing content production. A stale blog (last post 3 months ago) damages credibility more than no blog at all. | Defer to v2. If SEO content is needed, start with a single "guide" page or link to external content. |
| **Interactive product demo / embedded app** | ingenious.build and Procore offer demos. Tempting to embed a sandbox, but this requires backend infrastructure, adds JS weight, and distracts from the static-site constraint. | Use polished screenshots and a "Watch Demo" video link (Loom or YouTube). A 2-minute walkthrough video is more effective than a half-built interactive demo. |
| **Live chat widget** | Adds third-party JS (Intercom, Drift), hurts Lighthouse scores, and requires someone to respond. At launch stage, no one is staffing a chat. An unanswered chat bubble destroys trust. | Use a simple "Contact us" email link or a Calendly scheduling link for sales conversations. "Book a 15-min call" > abandoned chat widget. |
| **ROI calculator** | Newforma and others have these. They require substantial UX work, custom JS, and real data to be credible. A bad calculator is worse than no calculator. | Use static ROI claims with footnotes: "Contractors report saving X hours/week" with a link to methodology or testimonials. Build the calculator in v2 when you have real user data. |
| **A/B testing infrastructure** | Already out of scope. Premature optimization. You need traffic before you can test. | Ship one strong version. Iterate based on analytics (Cloudflare Web Analytics is free and privacy-respecting) and qualitative feedback. |
| **CMS / headless content management** | Content is in code per PROJECT.md. Adding a CMS introduces dependencies, API calls, and maintenance overhead for a site with < 10 pages. | Keep content in Astro components/MDX files. Change content via git commits. When you need 50+ pages of content, then consider a CMS. |
| **Internationalization** | English only per PROJECT.md. Construction SaaS is inherently local-market until proven otherwise. | Revisit if/when Fierro enters non-English markets. |
| **Mega-menu navigation** | Procore and ingenious.build use mega-menus because they have dozens of product pages. Fierro has ~5 pages. A mega-menu on a 5-page site feels like wearing a suit to a pickup basketball game. | Simple horizontal nav with 4-5 links + CTA button. Expand navigation only when page count justifies it. |
| **Competitor comparison pages** | Common for established SaaS ("Fierro vs Procore"). Requires deep knowledge of competitor products, ongoing updates when they change, and can feel petty for a startup. | Focus on positive positioning ("Why Fierro") rather than negative positioning ("Why not X"). Comparison pages can come in v2 when brand is established. |
| **User-generated content / community section** | Forums, user stories, community pages require moderation, engagement, and critical mass. Empty community pages signal a dead product. | Let user stories emerge organically. Feature them as testimonials when they do. Link to social media presence instead. |
| **Contact form with backend** | Already out of scope. Requires server-side processing, spam protection, and response workflow. | Use `mailto:` link or embed a Calendly/Cal.com scheduler. External form service (Formspree, Formspark) if a form is truly needed -- they work with static sites. |

## Feature Dependencies

```
Navigation          --> All pages (must be built first as shared layout)
Hero Section        --> Product Screenshots (need dashboard visuals before building hero)
Pricing Page        --> Pricing Toggle Island (Astro island depends on pricing page structure)
Features Section    --> Product Screenshots (each feature needs a corresponding screenshot)
"Why Fierro" Page   --> Brand Voice (tone must be established before writing copy)
Social Proof        --> Real Customers (placeholder acceptable, but real logos/quotes needed soon)
Footer              --> Legal Pages (Privacy/Terms must exist before footer links work)
SEO / Open Graph    --> All Pages (meta tags are per-page, implement as pages are built)
Mobile Responsive   --> All Components (test each component as it's built, not after)
```

Dependency chain for build order:
```
1. Shared Layout (nav + footer) + Legal Pages
2. Homepage Hero + Value Props (need screenshots)
3. Features Section (need per-feature screenshots)
4. Pricing Page + Toggle Island
5. "Why Fierro" Page
6. Social Proof Integration (throughout, as assets become available)
7. SEO / OG tags (final pass across all pages)
8. Performance Audit + Animation Polish
```

## MVP Recommendation

**Prioritize (launch-blocking):**

1. **Homepage with hero, value props, feature showcase, and CTAs** -- This is where 80%+ of traffic lands. If this page converts, nothing else matters at launch. Include dark hero with product screenshot, outcome headline, dual CTA, logo/trust bar (even placeholder), 3-4 value prop cards, feature walkthrough section, and a closing CTA.

2. **Pricing page with transparent tiers** -- Construction professionals comparison-shop. If they can't find pricing, they leave. Fierro's transparent pricing is a *weapon* against Procore and Buildertrend's opacity. Three-column layout, monthly/annual toggle, feature comparison table, FAQ.

3. **"Why Fierro" page** -- The emotional differentiator. Addresses pain, positions the product, and establishes brand voice. This is what turns "maybe" into "let me try it." Can be lighter at launch (3-4 sections) and expanded later.

4. **Privacy and Terms pages** -- Legal requirement. Already scoped. Quick win since content is duplicated from fierro_web.

5. **Responsive nav + footer** -- Shared components that every page depends on.

**Defer to v2:**

- **Blog**: High maintenance, low ROI at launch. Focus on organic word-of-mouth first.
- **Full persona pages**: Start with homepage persona callouts, build dedicated pages when traffic justifies segmentation.
- **Video testimonials**: Require customer relationships and production. Launch with text testimonials or skip social proof until real quotes exist.
- **ROI calculator**: Needs real user data to be credible. Use static claims for now.
- **Competitor comparison pages**: Wait until brand is established and you understand positioning deeply.

## Sources

- [ingenious.build](https://ingenious.build) -- Direct analysis of homepage structure, sections, copy patterns, and visual approach. PRIMARY source for design inspiration per PROJECT.md. HIGH confidence.
- [Procore homepage and pricing](https://www.procore.com) -- Homepage and pricing page analysis. Mega-menu nav, custom pricing model, ACV-based approach, 2M+ users social proof. HIGH confidence.
- [JobTread](https://www.jobtread.com) -- Smaller construction SaaS example. Transparent per-user pricing with slider, video testimonials, award badges, impact metrics. HIGH confidence.
- [Buildertrend](https://buildertrend.com) -- Custom pricing model, hidden tiers, feature-rich positioning. Verified via third-party reviews (Capterra, GetApp, G2). MEDIUM confidence (site blocked direct fetch).
- [SaaSFrame: 10 SaaS Landing Page Trends for 2026](https://www.saasframe.io/blog/10-saas-landing-page-trends-for-2026-with-real-examples) -- Narrative-driven heroes, interactive demos, benefit-driven CTAs, authentic visuals trend. HIGH confidence.
- [SaaS Hero: Landing Page Best Practices](https://www.saashero.net/design/saas-landing-page-best-practices/) -- Social proof lifts conversions 37%. Personalized CTAs perform 202% better. Video testimonials rank #1 for conversion impact. MEDIUM confidence.
- [Powered by Search: SaaS Website Best Practices](https://www.poweredbysearch.com/blog/saas-website-best-practices/) -- Authority Architecture Framework: Homepage, How It Works, Who It's For, Pricing, Why Us. Feature explanation pattern: feature, pain-point question, benefit, proof. HIGH confidence.
- [Webflow Blog: 35 SaaS Website Design Examples](https://webflow.com/blog/saas-website-design-examples) -- General SaaS design patterns and trends for 2026. MEDIUM confidence.
- [Smashing Magazine: Designing Better Pricing Pages](https://www.smashingmagazine.com/2022/07/designing-better-pricing-page/) -- 3 tiers optimal, highlight recommended plan, column format, above-the-fold preference. HIGH confidence.
- [Construction Coverage: Software Pricing Models](https://constructioncoverage.com/construction-software-pricing-models) -- Per-user subscription is most common for cloud construction software, $30-$350+/user/month. MEDIUM confidence.
- [Marketpath: Credibility for Contractor Websites](https://www.marketpath.com/blog/credibility-key-for-contractor-websites) -- Trust signals for construction: project photos, licenses, responsiveness promises, client-focused messaging. MEDIUM confidence.
