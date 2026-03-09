# Domain Pitfalls

**Domain:** Static marketing site for construction SaaS (Astro + Cloudflare Pages + Tailwind CSS)
**Researched:** 2026-03-09

---

## Critical Pitfalls

Mistakes that cause rewrites, deployment failures, or fundamentally undermine the site's purpose.

### Pitfall 1: Cloudflare Pages Is Deprecated -- Build on Workers Static Assets Instead

**What goes wrong:** Cloudflare deprecated Pages in April 2025 in favor of Workers with Static Assets. Pages still functions but receives zero new features. All development effort is on Workers. Teams that deploy to Pages now will face a mandatory migration later when Cloudflare auto-migrates or removes Pages entirely. The migration is not trivial -- serving behavior differs (Workers serves static assets first vs. Pages serving Functions first), wrangler commands change, and 404/SPA handling requires explicit configuration that Pages handled implicitly.

**Why it happens:** Most tutorials, blog posts, and even parts of Astro's own documentation still reference "Cloudflare Pages" as a deployment target. The deprecation was announced quietly and Cloudflare hasn't set a hard removal date, creating a false sense of safety.

**Consequences:**
- Technical debt from day one -- you're building on a deprecated platform
- Migration later requires changing wrangler config (`pages_build_output_dir` to `assets.directory`), updating CLI commands (`wrangler pages deploy` to `wrangler deploy`), and reconfiguring 404 handling
- Custom domain setup may differ between Pages and Workers
- Any future features (like better observability or routing) will only be available on Workers

**Prevention:**
- Deploy to Cloudflare Workers with Static Assets from the start
- Use `wrangler.jsonc` with `assets.directory: "./dist"` instead of `pages_build_output_dir`
- Configure `not_found_handling: "404-page"` explicitly since Workers doesn't auto-detect this
- For a purely static Astro site (no SSR), no adapter is needed -- just deploy the `dist/` folder as static assets to Workers
- Reference the official migration guide: https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/

**Detection:** If `wrangler.jsonc` contains `pages_build_output_dir` or deployment scripts use `wrangler pages deploy`, you're on the deprecated path.

**Phase:** Must be addressed in Phase 1 (project scaffolding and deployment pipeline). Getting this wrong early means migrating everything later.

**Confidence:** HIGH -- confirmed via Cloudflare official docs and multiple community migration reports.

---

### Pitfall 2: Sharp Image Service Incompatibility with Cloudflare Runtime

**What goes wrong:** Astro's default image optimization uses Sharp (a Node.js native module). Sharp is incompatible with Cloudflare's runtime -- it relies on native binaries (`linux-x64` shared objects) that don't exist in the Workers/Pages build environment. Builds fail with errors like `Could not load the "sharp" module` or missing Node.js built-ins like `util` and `stream`.

**Why it happens:** Astro defaults to Sharp for `<Image />` and `<Picture />` component optimization. Developers add these components expecting automatic optimization, then discover at deploy time that the build breaks on Cloudflare.

**Consequences:**
- Broken deployments with cryptic native module errors
- Developers revert to raw `<img>` tags in frustration, losing CLS prevention and responsive image generation
- Images in `public/` folder receive no processing at all -- no format conversion, no resizing, no responsive `srcset`

**Prevention:**
- For a static site (pre-rendered at build time), Sharp works fine during `astro build` on your local machine or CI runner -- the issue is only at runtime on Cloudflare's edge. Since Fierro is fully static, Sharp should work during build.
- If any SSR routes are added later, configure `passthroughImageService()` for those routes
- Pre-optimize all images at build time using `astro:assets` -- import images into `.astro` files so they're processed during build, not at runtime
- Never put critical images in `public/` -- they bypass all optimization. Import them from `src/assets/` instead
- Use `<Image />` component for all raster images to get automatic `width`/`height` (CLS prevention), `loading="lazy"` defaults, and format conversion to WebP/AVIF

**Detection:** Build errors mentioning `sharp`, `linux-x64`, or Node.js built-in modules during Cloudflare deployment. Also: images in `public/` folder that should be in `src/assets/`.

**Phase:** Must be established in Phase 1 (project scaffolding). Set the convention early: all images go in `src/assets/`, never `public/` for anything that needs optimization.

**Confidence:** HIGH -- confirmed via Astro official docs, multiple GitHub issues (#10499, #191, #213), and Cloudflare community reports.

---

### Pitfall 3: Using Deprecated @astrojs/tailwind Integration Instead of Tailwind v4 Vite Plugin

**What goes wrong:** The `@astrojs/tailwind` integration package is deprecated. Tailwind CSS v4 fundamentally changed its architecture -- configuration now lives in CSS files, not `tailwind.config.mjs`. The old integration package doesn't support v4 properly, and the official Tailwind migration tool (`npx @tailwindcss/upgrade`) doesn't handle Astro's TypeScript config files.

**Why it happens:** Every tutorial from 2023-2024 (and much of 2025) shows `npx astro add tailwind` which installs the deprecated integration. Developers follow these guides and end up with an outdated setup that will cause problems as Tailwind v4 becomes standard.

**Consequences:**
- Locked into Tailwind v3 patterns that are increasingly unsupported
- `tailwind.config.mjs` approach is legacy; v4 uses CSS-based configuration (`@theme`, `@plugin` directives)
- Brand color tokens (Gunmetal, Molten Orange, Off-White, etc.) must be defined in CSS with `@theme` blocks, not in a JS config file
- Plugin compatibility issues -- `@tailwindcss/typography` in v4 is loaded via CSS `@plugin` directive, not JS config

**Prevention:**
- Use `@tailwindcss/vite` plugin in `astro.config.mjs` under `vite.plugins`, not under `integrations`
- Requires Astro 5.2+ (released January 2025)
- Define brand colors in a CSS file using `@theme { --color-gunmetal: #2B2D31; ... }` instead of `tailwind.config.mjs`
- Do not install `@astrojs/tailwind` -- install `@tailwindcss/vite` and `tailwindcss` directly
- If adopting OKLCh color space (mentioned in PROJECT.md), define colors with `oklch()` values in the `@theme` block

**Detection:** Presence of `@astrojs/tailwind` in `package.json` or `tailwind.config.mjs` at project root.

**Phase:** Must be correct in Phase 1 (project scaffolding). Wrong Tailwind setup poisons the entire styling architecture.

**Confidence:** HIGH -- confirmed via Astro official docs (integration page explicitly says "deprecated") and Tailwind v4 release notes.

---

### Pitfall 4: Construction Audience Distrust -- Website Feels Like "Another SaaS Pitch"

**What goes wrong:** Construction professionals are deeply skeptical of software marketing. They've been burned by tools that promise efficiency but deliver complexity. A website full of abstract benefits ("streamline your workflow"), stock photos of people in hard hats, and generic SaaS pricing tables triggers immediate distrust. The site looks like every other failed construction tool they've tried.

**Why it happens:** SaaS marketing playbooks are designed for tech-savvy audiences. Construction GCs, project managers, and site supervisors have different trust signals. They want to see the product, understand the dollar impact, and know it won't create more work.

**Consequences:**
- High bounce rate from the exact audience you need
- CTAs to `app.getfierro.com/signup` go unclicked because the visitor never built enough trust to explore
- B2B buyers spend 70%+ of their journey researching independently before contacting sales -- if the marketing site fails this silent evaluation, you never even know you lost them

**Prevention:**
- Show the actual product UI prominently -- 35% of SaaS websites fail to show their interface, and this is especially damaging for construction buyers who want to see the tool before committing
- Use quantified benefit claims, not vague promises: "Average user saves $12,400/project" not "Save money on your projects"
- Speak in construction language: "cost codes," "change orders," "subs," "pour schedules" -- not "team collaboration" or "workflow optimization"
- Include trust signals specific to construction: project counts, dollar amounts managed, industry certifications if applicable
- The dark/premium aesthetic from ingenious.build works well -- 70% of construction websites use dark palettes because it communicates authority and makes project photography pop
- Put real product screenshots in context (mobile app on a jobsite, dashboard showing a real budget breakdown)

**Detection:** Review copy for generic SaaS language. If you can replace "Fierro" with any other SaaS name and the copy still works, it's too generic. Run the "hard hat test" -- would a superintendent reading this on their phone at lunch feel like this was built for them?

**Phase:** Primarily Phase 2 (content and design), but the design system and component architecture in Phase 1 must support screenshot showcases, number-heavy layouts, and construction-specific content patterns.

**Confidence:** MEDIUM -- synthesized from B2B SaaS marketing research and construction industry digital marketing sources. The specific conversion impact numbers are directional, not Fierro-specific.

---

## Moderate Pitfalls

Mistakes that degrade quality, performance, or developer experience but don't require full rewrites.

### Pitfall 5: Font Loading Flash (FOUT/FOIT) with DM Sans

**What goes wrong:** DM Sans loaded via Google Fonts CDN introduces a render-blocking request to `fonts.googleapis.com`, followed by a second request to `fonts.gstatic.com`. This adds 100-200ms to initial page load and causes either invisible text (FOIT) or a flash of fallback font (FOUT). For a site that promises "performance is the brand," any visible font swap is a credibility problem.

**Why it happens:** The easiest path is a Google Fonts `<link>` tag. It works, but it introduces two external DNS lookups, a CSS file fetch, and then the font file fetch. Additionally, Google Fonts CDN collects IP addresses, which creates GDPR liability if Fierro ever targets European construction markets.

**Prevention:**
- Self-host DM Sans using WOFF2 format (smallest file size, universal browser support)
- Download from Google Fonts, subset to Latin characters only (removes unnecessary glyphs, typically cuts file size 40-60%)
- Use `font-display: swap` in `@font-face` declarations for immediate text visibility
- Preload the primary weight (400 Regular) with `<link rel="preload" as="font" type="font/woff2" crossorigin>`
- Choose a fallback font with similar metrics to DM Sans to minimize layout shift (system-ui or a size-adjusted fallback)
- Only load the weights actually used: Regular (400), Medium (500), Bold (700) -- do not load all 9 weights
- Place font files in `public/fonts/` since they don't need Astro processing

**Detection:** Lighthouse "Ensure text remains visible during webfont load" audit fails. Visible font swap on page load. Network tab shows requests to `fonts.googleapis.com`.

**Phase:** Phase 1 (project scaffolding / design system setup). Font loading is foundational -- retrofitting self-hosted fonts later means updating every `@font-face` declaration.

**Confidence:** HIGH -- well-established web performance best practice, confirmed by Lighthouse documentation and DebugBear performance guides.

---

### Pitfall 6: Missing or Malformed Structured Data and Open Graph Tags

**What goes wrong:** The site deploys without JSON-LD structured data (Organization, Product, FAQ schemas) or with incomplete Open Graph meta tags. Social shares show no preview image or a broken card. Google's rich results never appear. The site is technically invisible to search features beyond basic blue links.

**Why it happens:** Structured data and OG tags are invisible to the developer during development. Everything looks fine in the browser, so they're deprioritized or forgotten. JSON-LD syntax errors (missing required properties, wrong schema types, duplicate markup across pages) are common because there's no visual feedback.

**Consequences:**
- Social sharing (LinkedIn, Twitter/X) shows a blank card or generic URL -- catastrophic for word-of-mouth marketing in construction networks
- No rich results in Google (pricing, FAQ, organization info)
- Duplicate or incorrect schema markup can lead to Google ignoring all structured data on the site

**Prevention:**
- Create a reusable `<SEO />` Astro component that enforces required meta tags, OG properties, and JSON-LD on every page
- Install `schema-dts` as a dev dependency for TypeScript type-checking of JSON-LD objects -- autocomplete prevents typos in schema properties
- Generate OG images at build time using Satori (renders HTML/CSS to SVG/PNG without a headless browser) -- one branded OG image per page
- Validate all structured data with Google's Rich Results Test tool before deployment
- Required OG tags for every page: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Use Organization schema on the homepage, SoftwareApplication schema on the features page, and Offer/Product schemas on the pricing page

**Detection:** Run `npx astro build` and check the output HTML for `<script type="application/ld+json">` blocks. Use Google Rich Results Test on each page URL. Share the URL on LinkedIn/Twitter and check the preview card.

**Phase:** Phase 2 (content pages and SEO). But the `<SEO />` component scaffold should be created in Phase 1.

**Confidence:** HIGH -- confirmed via Astro community guides and Google structured data documentation.

---

### Pitfall 7: Cloudflare Auto Minify Breaking Astro Hydration

**What goes wrong:** Cloudflare's Auto Minify feature (enabled by default on many accounts) aggressively minifies HTML, CSS, and JavaScript. This can break Astro's island hydration by mangling the HTML structure that Astro's client-side hydration scripts depend on. Components using `client:load`, `client:visible`, or `client:idle` directives silently fail -- the interactive element appears but doesn't respond to user input.

**Why it happens:** Cloudflare's minification is a zone-level setting that applies to all traffic, not per-project. Developers test locally where minification doesn't run, then deploy and never test the live site's interactive elements because they're rare in a mostly-static site.

**Consequences:**
- Interactive components (mobile navigation toggle, pricing toggle between monthly/annual, accordion FAQs) appear to work but silently fail
- Extremely hard to debug because the site looks correct but click handlers don't fire
- Only manifests in production, not in local dev or preview deployments

**Prevention:**
- Disable Auto Minify in the Cloudflare dashboard for the zone: Settings > Speed > Optimization > Auto Minify (uncheck HTML, CSS, JS)
- Astro already minifies HTML and CSS during build -- Cloudflare's additional minification is redundant and destructive
- If using Astro islands (e.g., a React pricing toggle), test the deployed production URL, not just `localhost`
- Add a post-deployment smoke test that clicks every interactive element on the live site

**Detection:** Interactive elements work locally but fail on the deployed site. Browser console shows hydration mismatch errors. Cloudflare dashboard shows Auto Minify is enabled.

**Phase:** Phase 1 (deployment configuration). Must be part of the Cloudflare setup checklist.

**Confidence:** HIGH -- documented in Astro's official Cloudflare deployment guide as a known issue.

---

### Pitfall 8: Images in public/ Folder Bypassing All Optimization

**What goes wrong:** Developers place hero images, product screenshots, and feature illustrations in `public/images/` because it's the intuitive location. These images are copied verbatim to the build output -- no format conversion (PNG stays PNG instead of becoming WebP), no resizing, no responsive `srcset` generation, no automatic `width`/`height` for CLS prevention.

**Why it happens:** The `public/` folder "just works" -- you can reference `/images/hero.png` directly in HTML without imports. The Astro `<Image />` component requires importing from `src/assets/`, which feels like extra friction. Developers take the easy path, especially during prototyping.

**Consequences:**
- Hero images served as 2MB PNGs instead of 200KB WebPs -- devastating for the "load fast on 3G" requirement
- No responsive images means mobile users download desktop-sized assets
- Missing `width`/`height` attributes cause Cumulative Layout Shift, tanking CLS scores
- Lighthouse Performance score drops to 60-70 instead of the target 95+
- Images typically account for 60-70% of a page's total weight -- unoptimized images are the single biggest performance killer

**Prevention:**
- Establish an ironclad convention: all raster images go in `src/assets/images/`, not `public/`
- Only `public/` exceptions: `favicon.ico`, `robots.txt`, `_headers`, site manifest -- files that must be served at exact paths without processing
- Use `<Image src={import("../assets/images/hero.png")} alt="..." />` pattern for all images
- Use `<Picture />` component for hero images to generate AVIF + WebP + fallback
- Set up a lint rule or PR checklist item: "No new raster images in `public/`"
- For product screenshots that update frequently, still import them from `src/assets/` -- Astro will re-optimize on each build

**Detection:** Run `ls public/` and check for `.png`, `.jpg`, `.webp` files that should be optimized. Check built output `dist/` for large unoptimized images. Lighthouse will flag "Serve images in next-gen formats" and "Properly size images."

**Phase:** Phase 1 (project structure conventions). This is an architectural decision that must be established before any content is added.

**Confidence:** HIGH -- confirmed via Astro official docs: "Files in `public/` receive no processing or optimization."

---

### Pitfall 9: Failing to Prerender -- Accidentally Shipping JavaScript Where None Is Needed

**What goes wrong:** Developers add Astro islands (`client:load`) to components that don't actually need client-side interactivity, or they import a React/Vue component "just in case" it needs interaction later. Each island adds a JavaScript bundle. A site that should ship 0KB of JS ends up shipping 50-100KB+ of framework runtime code.

**Why it happens:** Coming from React/Next.js, developers instinctively reach for interactive components. A pricing toggle between monthly/annual feels like it needs React state, when it could be pure CSS (`:checked` pseudo-class) or a tiny `<script>` inline. The Astro island model makes it too easy to add hydration directives without considering the cost.

**Consequences:**
- The "zero JavaScript by default" promise is broken
- Each `client:load` component adds its framework runtime (React ~45KB, Preact ~4KB)
- TTI increases because the browser must parse, compile, and execute JS before the page is interactive
- Lighthouse Performance score drops due to "Reduce unused JavaScript" and "Minimize main-thread work"

**Prevention:**
- Default rule: if it doesn't need to respond to user input after page load, it doesn't need `client:*`
- Use CSS-only solutions first: accordions with `<details>`/`<summary>`, toggles with `:checked`, tabs with CSS `:target`
- If JS is truly needed, use a tiny inline `<script>` in the Astro component instead of a full framework island
- If a framework component is needed, prefer `client:visible` or `client:idle` over `client:load` to defer hydration
- Audit the built output: `astro build` reports which pages have JS bundles and their sizes
- For Fierro, likely only 1-2 components need JS: mobile nav hamburger and possibly a pricing period toggle. Both can be CSS-only or tiny inline scripts

**Detection:** After `astro build`, check the `dist/` output for `.js` files beyond Astro's minimal runtime. If you see React/Preact bundles, trace back to which component pulled them in.

**Phase:** Ongoing through all phases, but the convention must be established in Phase 1. Every PR should be reviewed for unnecessary `client:*` directives.

**Confidence:** HIGH -- core Astro philosophy, confirmed by official docs and multiple performance optimization guides.

---

## Minor Pitfalls

Issues that cause friction or suboptimal outcomes but are easily corrected.

### Pitfall 10: Custom 404 Page Not Configured for Workers Static Assets

**What goes wrong:** The site deploys but navigating to a non-existent URL shows Cloudflare's default error page instead of a branded 404 page. This looks unprofessional and breaks the site's premium feel.

**Prevention:**
- Create `src/pages/404.astro` -- Astro automatically generates `404.html` in the build output
- In `wrangler.jsonc`, configure `"not_found_handling": "404-page"` under the assets config to tell Workers to serve your custom 404 instead of a generic error
- If building a SPA-style navigation later, use `"not_found_handling": "single-page-application"` instead (but for a static marketing site, `"404-page"` is correct)

**Phase:** Phase 1 (deployment config).

**Confidence:** HIGH -- documented in Cloudflare Workers Static Assets migration guide.

---

### Pitfall 11: Missing _headers File for Security and Cache Headers

**What goes wrong:** The site deploys without custom HTTP headers. Fonts and images aren't cached long-term (browsers re-download them on every visit). Security headers (Content-Security-Policy, X-Frame-Options) are missing, which both security scanners and enterprise construction clients may flag.

**Prevention:**
- Create `public/_headers` file with cache rules for static assets:
  ```
  /fonts/*
    Cache-Control: public, max-age=31536000, immutable
  /*.webp
    Cache-Control: public, max-age=31536000, immutable
  ```
- Add security headers:
  ```
  /*
    X-Frame-Options: DENY
    X-Content-Type-Options: nosniff
    Referrer-Policy: strict-origin-when-cross-origin
  ```
- Note: Cloudflare Workers handles `_headers` differently than Pages -- verify the file is respected in your deployment target, or use a Worker script to set headers programmatically

**Phase:** Phase 1 (deployment config).

**Confidence:** MEDIUM -- `_headers` file support is well-documented for Pages but may need verification for Workers Static Assets deployment.

---

### Pitfall 12: Pricing Page Data Drift from fierro_web

**What goes wrong:** Pricing tiers, feature lists, or dollar amounts on the marketing site diverge from the actual billing configuration in `fierro_web/src/lib/billing/plans.ts`. The marketing site says "5 projects" on Plus but the app allows 3. Or the annual discount changes in the app but the marketing site still shows the old price.

**Prevention:**
- Document the source of truth: `fierro_web/src/lib/billing/plans.ts` is canonical
- Create a `src/data/pricing.ts` file in the pubsite that mirrors the plan data with a comment linking to the source file
- Add a manual checklist item: "When pricing changes in fierro_web, update fierro_pubsite pricing data"
- Consider a build-time script that validates pricing data matches (future enhancement, not needed for v1)
- Include the "prices subject to change" disclaimer on the pricing page

**Phase:** Phase 2 (pricing page build). But the data structure should be defined in Phase 1.

**Confidence:** HIGH -- this is a universal multi-repo consistency problem. The pricing tiers are documented in PROJECT.md with specific dollar amounts.

---

### Pitfall 13: Neglecting Mobile Performance Testing on Real 3G

**What goes wrong:** The site scores 100 on Lighthouse in Chrome DevTools (running on a developer's M-series MacBook with fast WiFi). But the target audience -- construction professionals -- often access websites from jobsites with spotty cellular connections. The site's actual performance on a real 3G connection with a mid-range Android phone is dramatically worse.

**Prevention:**
- Test with Lighthouse in "Applied Slow 4G throttling" mode (not simulated)
- Use WebPageTest.org with a "Moto G4 on 3G" profile for realistic results
- The PROJECT.md constraint is aggressive: "TTFR < 1s, TTI < 1.5s on 3G" -- this requires:
  - Total page weight under 500KB (HTML + CSS + fonts + images above the fold)
  - Zero render-blocking resources
  - Self-hosted fonts with preload
  - Above-the-fold images either inlined as SVG or served as highly compressed WebP
- Test on an actual Android phone, not just DevTools emulation

**Detection:** Run Lighthouse with "Mobile" device selected and compare scores to "Desktop." If there's more than a 10-point gap, mobile optimization is insufficient.

**Phase:** Every phase, but formal performance budget must be established in Phase 1 and validated in each subsequent phase.

**Confidence:** MEDIUM -- the 3G performance targets from PROJECT.md are aggressive but achievable for a well-optimized static Astro site. The specific TTFR/TTI numbers need validation against real deployment.

---

### Pitfall 14: Hero Section Design That Doesn't Show the Product

**What goes wrong:** The hero section uses an abstract illustration, a stock construction photo, or just text with a gradient background. The visitor has no idea what the product actually looks like. For construction buyers who are visual and practical, not seeing the tool is a dealbreaker.

**Prevention:**
- Hero must include a product screenshot or mockup showing the actual Fierro dashboard/app
- Use a "floating device" pattern: MacBook mockup showing the dashboard with a phone mockup showing the mobile app, positioned on a dark background
- The screenshot should show real-looking data (budget with line items, not lorem ipsum)
- Pair with a quantified headline: "Every dollar. Every pour. Accounted for." with a supporting stat
- ingenious.build inspiration: product screenshots as proof, not decoration

**Phase:** Phase 2 (hero section design and content).

**Confidence:** MEDIUM -- based on B2B SaaS marketing best practices and the 35% stat about SaaS websites failing to show UI. Construction-specific validation is directional.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project scaffolding | Wrong deployment target (Pages instead of Workers) | Use Workers Static Assets from day one (Pitfall 1) |
| Project scaffolding | Deprecated Tailwind integration | Use `@tailwindcss/vite` plugin, not `@astrojs/tailwind` (Pitfall 3) |
| Project scaffolding | Images in `public/` convention | Establish `src/assets/images/` as the only image location (Pitfall 8) |
| Design system | Font loading causes FOUT | Self-host DM Sans WOFF2, preload primary weight (Pitfall 5) |
| Design system | Unnecessary JS islands | Default to CSS-only interactivity, audit every `client:*` directive (Pitfall 9) |
| Deployment config | Cloudflare Auto Minify breaks hydration | Disable Auto Minify in Cloudflare dashboard (Pitfall 7) |
| Deployment config | No custom 404 | Create `404.astro` + configure `not_found_handling` in wrangler (Pitfall 10) |
| Content pages | Generic SaaS copy alienates construction buyers | Use construction vocabulary, show product UI, quantify benefits (Pitfall 4) |
| Content pages | Missing/broken OG images and structured data | Reusable `<SEO />` component with build-time OG image generation (Pitfall 6) |
| Pricing page | Data drift from fierro_web | Mirror pricing data with documented source of truth (Pitfall 12) |
| Performance testing | Dev machine results don't reflect real-world | Test on actual 3G / mid-range Android, not just DevTools (Pitfall 13) |
| Hero section | No product UI visible | Show actual Fierro dashboard/app screenshots in hero (Pitfall 14) |

---

## Pre-Deployment Checklist (Derived from Pitfalls)

Use this as a gate before any production deployment:

- [ ] Deploying to Workers Static Assets, not Cloudflare Pages
- [ ] `wrangler.jsonc` uses `assets.directory`, not `pages_build_output_dir`
- [ ] Tailwind configured via `@tailwindcss/vite`, not `@astrojs/tailwind`
- [ ] All raster images in `src/assets/`, none in `public/` (except favicon)
- [ ] DM Sans self-hosted as WOFF2, no Google Fonts CDN requests
- [ ] Primary font weight preloaded with `<link rel="preload">`
- [ ] Cloudflare Auto Minify disabled for the zone
- [ ] `404.astro` page exists and `not_found_handling` configured
- [ ] Every page has OG tags (title, description, image, url)
- [ ] JSON-LD structured data validates in Google Rich Results Test
- [ ] Zero unnecessary `client:*` directives -- audit JS bundle output
- [ ] Lighthouse Mobile score 95+ (Performance, Accessibility, Best Practices)
- [ ] Page weight under 500KB on initial load (3G budget)
- [ ] Product screenshots visible on landing page
- [ ] Pricing matches `fierro_web/src/lib/billing/plans.ts`
- [ ] Security headers present (`_headers` file or Worker-level config)

---

## Sources

- [Cloudflare Pages Known Issues](https://developers.cloudflare.com/pages/platform/known-issues/) -- HIGH confidence
- [Cloudflare Pages to Workers Migration Guide](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/) -- HIGH confidence
- [Astro Official: Deploy to Cloudflare](https://docs.astro.build/en/guides/deploy/cloudflare/) -- HIGH confidence
- [Astro Official: Images Guide](https://docs.astro.build/en/guides/images/) -- HIGH confidence
- [Astro Official: Tailwind Integration (Deprecated)](https://docs.astro.build/en/guides/integrations-guide/tailwind/) -- HIGH confidence
- [Astro Cloudflare Adapter: Sharp Incompatibility (GitHub #10499)](https://github.com/withastro/astro/issues/10499) -- HIGH confidence
- [Cloudflare Adapter Image Service Issues (GitHub #191, #213)](https://github.com/withastro/adapters/issues/191) -- HIGH confidence
- [Chrome Lighthouse: Font Display](https://developer.chrome.com/docs/lighthouse/performance/font-display) -- HIGH confidence
- [DebugBear: Web Font Layout Shift](https://www.debugbear.com/blog/web-font-layout-shift) -- MEDIUM confidence
- [Self-Hosting vs Google Fonts CDN](https://dev.to/web_dev-usman/why-i-switched-from-google-fonts-cdn-to-self-hosting-and-never-looked-back-3fbh) -- MEDIUM confidence
- [Astro Performance Optimization Guide](https://eastondev.com/blog/en/posts/dev/20251202-astro-performance-optimization/) -- MEDIUM confidence
- [B2B SaaS Marketing Mistakes](https://www.ideagrove.com/blog/the-25-most-common-b2b-saas-marketing-mistakes-and-how-to-avoid-them) -- MEDIUM confidence
- [Construction Digital Marketing Trust Signals](https://constructiondigitalmarketing.com/cro/the-role-of-trust-signals-in-driving-conversions/) -- MEDIUM confidence
- [Cloudflare Pages Deprecation Community Discussion](https://vibecodingwithfred.com/blog/pages-to-workers-migration/) -- MEDIUM confidence
- [Tailwind v4 Astro Integration Guide](https://tailkits.com/blog/astro-tailwind-setup/) -- MEDIUM confidence
