# Phase 4: Legal, SEO, and Documentation - Research

**Researched:** 2026-03-09
**Domain:** Legal content pages, SEO infrastructure (meta/OG/JSON-LD/sitemap), AI-agent discoverability (llms.txt), internal documentation
**Confidence:** HIGH

## Summary

Phase 4 covers three distinct workstreams: (1) legal pages sourced from fierro_web, (2) comprehensive SEO infrastructure across all pages, and (3) internal documentation for deployment, migration, and the deep-link signup flow. The legal content already exists as React/JSX in the sibling repo and needs conversion to Astro HTML with marketing-site styling. SEO work centers on extending BaseLayout.astro to accept meta/OG props, adding JSON-LD structured data, configuring the @astrojs/sitemap integration, and creating static OG images. Documentation is prose-only, written for the developer audience.

All three workstreams are well-understood with established patterns. The Astro ecosystem provides first-party support for sitemaps. JSON-LD structured data follows schema.org standards. The llms.txt specification is a lightweight Markdown convention. No new dependencies are needed beyond @astrojs/sitemap.

**Primary recommendation:** Extend BaseLayout with SEO props, add @astrojs/sitemap integration, inline JSON-LD in the layout head, convert legal JSX to Astro HTML, and write docs as Markdown files.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Pull Privacy Policy and Terms of Service content directly from fierro_web repo (sibling directory at ../fierro_web)
- Restyle for marketing site -- same content, consistent visual treatment
- Clean prose layout with clear section headings (h2/h3), readable line length (~65ch), no sidebar or TOC
- Small dark Gunmetal header band with page title (not full hero, not plain) -- consistent with other pages but appropriately lightweight for utility pages
- Static PNG images (1200x630) committed to src/assets/og/ -- one per page
- Branded template: dark Gunmetal background, Fierro logo, page title in DM Sans, Molten Orange accent
- Include tagline ("Every dollar. Every pour. Accounted for.") alongside page title and logo
- Same template for all pages, swap the title text
- Builder voice for all meta descriptions -- direct, confident, same tone as site content
- Every page gets unique title and meta description
- BaseLayout needs to be extended with description, OG, and Twitter card props
- Organization + SoftwareApplication JSON-LD with standard fields only (name, URL, logo, description, pricing tiers)
- llms.txt file at site root for AI-agent discoverability -- site summary, page descriptions, MCP server mention
- Structured JSON-LD surfaces pricing tiers, feature lists, and MCP capabilities in machine-parseable format
- MCP server mentioned in documentation and discoverable via llms.txt and structured data
- Generated at build time via Astro's built-in sitemap integration
- Accessible at /sitemap.xml
- Audience: future me / small team -- clear commands, covers gotchas, no hand-holding on basics
- docs/DEPLOYMENT.md -- Cloudflare Workers Static Assets setup, build commands, CI/CD pipeline
- docs/MIGRATION.md -- DNS changes, Vercel domain update, Supabase auth redirects, OAuth callbacks, Stripe webhooks, env vars, verification checklist
- fierro_web/docs/plans/deep-link-signup-flow.md -- written to sibling repo at ../fierro_web, describes query-param-based signup flow (?plan=<tier>&billing=<cycle>) and MCP server integration points

### Claude's Discretion
- Exact meta description copy per page
- SEO keyword selection per page
- llms.txt content structure and depth
- OG image visual design details (font sizes, spacing, accent placement)
- Legal page section heading hierarchy
- Sitemap configuration options
- Structured data field values beyond what's specified

### Deferred Ideas (OUT OF SCOPE)
- Move AI section from /why-fierro to main landing page (noted in Phase 3 UAT)
- Remove "Most Popular" badge from Plus tier card (noted in Phase 3 UAT)
- Comparison table content refinement (noted in Phase 3 UAT)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LEGL-01 | Privacy policy page with content from fierro_web, styled consistently with marketing site | Legal content conversion patterns, Astro prose styling, lightweight header band pattern |
| LEGL-02 | Terms of service page with content from fierro_web, styled consistently with marketing site | Same patterns as LEGL-01, content source identified in fierro_web/(legal)/ |
| PERF-04 | Unique title and meta description per page | BaseLayout prop extension pattern, per-page SEO data approach |
| PERF-05 | Open Graph tags and social sharing image per page | OG meta tag pattern, static PNG OG image strategy, Twitter card tags |
| PERF-06 | Structured data (Organization + SoftwareApplication schema) | JSON-LD inline script pattern, schema.org types and required fields |
| PERF-07 | Sitemap generated at build time | @astrojs/sitemap integration configuration |
| DOCS-01 | docs/DEPLOYMENT.md -- Cloudflare Workers Static Assets setup | Existing wrangler.json config, deploy commands, project structure |
| DOCS-02 | docs/MIGRATION.md -- Full domain migration guide | Domain-split plan from fierro_web, Supabase/OAuth/Stripe update steps |
| DOCS-03 | Deep-link signup flow doc in fierro_web | Existing pricing CTA deep-link structure from Phase 3, query param pattern |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @astrojs/sitemap | latest (^6.x) | Build-time sitemap generation | Official Astro integration, zero config for static sites |
| astro (existing) | ^5.18 | Static site framework | Already installed, provides the build pipeline |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| (none) | - | - | All other work is native HTML/Astro -- no libraries needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @astrojs/sitemap | Manual sitemap.xml in public/ | Loses auto-discovery of pages, manual maintenance burden |
| Inline JSON-LD | astro-seo package | Adds dependency for something achievable with a `<script type="application/ld+json">` tag |
| Static OG PNGs | @vercel/og or satori | Dynamic generation is overkill for 5 pages; static PNGs are simpler and faster |

**Installation:**
```bash
npx astro add sitemap
```
This will auto-update `astro.config.mjs` to include the sitemap integration.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── assets/
│   └── og/                    # Static OG images (1200x630 PNG per page)
│       ├── home.png
│       ├── pricing.png
│       ├── why-fierro.png
│       ├── privacy.png
│       └── terms.png
├── layouts/
│   └── BaseLayout.astro       # Extended with SEO props (description, og, jsonld)
├── pages/
│   ├── privacy.astro          # Legal page -- replace stub
│   └── terms.astro            # Legal page -- replace stub
public/
├── llms.txt                   # AI-agent discoverability file
├── robots.txt                 # Search engine directives (new)
├── favicon.ico                # Existing
└── _headers                   # Existing Cloudflare headers
docs/
├── DEPLOYMENT.md              # New -- Cloudflare Workers deployment guide
└── MIGRATION.md               # New -- Domain migration guide
../fierro_web/docs/plans/
└── deep-link-signup-flow.md   # New -- Written to sibling repo
```

### Pattern 1: BaseLayout SEO Extension
**What:** Extend the existing BaseLayout.astro Props interface to accept optional SEO metadata, with sensible defaults.
**When to use:** Every page -- all pages pass through BaseLayout.
**Example:**
```astro
---
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';
import Nav from '../components/Nav.astro';
import MobileMenu from '../components/MobileMenu.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
  ogType?: string;
  canonicalURL?: string;
}

const {
  title,
  description = 'Fierro is construction job cost control software. Track budgets, expenses, and project health in real time.',
  ogImage = '/og/home.png',
  ogType = 'website',
  canonicalURL = new URL(Astro.url.pathname, Astro.site).href,
} = Astro.props;

const fullTitle = `${title} | Fierro`;
const ogImageURL = new URL(ogImage, Astro.site).href;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="canonical" href={canonicalURL} />

    <title>{fullTitle}</title>
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImageURL} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content={ogType} />
    <meta property="og:site_name" content="Fierro" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImageURL} />

    <ClientRouter />
    <slot name="head" />
  </head>
  <body class="bg-off-white text-gunmetal font-sans antialiased">
    <Nav />
    <MobileMenu />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Key details:**
- `Astro.site` is already configured as `https://getfierro.com` in astro.config.mjs -- this provides the base for absolute OG image URLs
- A `<slot name="head" />` allows pages to inject page-specific content (like JSON-LD) into the `<head>`
- Default description provides a reasonable fallback
- OG images are served from `/og/` as static files in the `public/` directory (not processed through Astro image pipeline since they need stable absolute URLs)

### Pattern 2: JSON-LD Structured Data via Named Slot
**What:** Inject JSON-LD as an inline `<script>` tag in the page head using a named slot.
**When to use:** Home page for Organization + SoftwareApplication schemas.
**Example:**
```astro
---
// In src/pages/index.astro (or any page needing JSON-LD)
---
<BaseLayout title="Construction Cost Control" description="...">
  <script slot="head" type="application/ld+json" set:html={JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "name": "Fierro",
        "url": "https://getfierro.com",
        "logo": "https://getfierro.com/logo.svg",
        "description": "Construction job cost control software for contractors, project owners, and teams.",
        "email": "support@getfierro.com",
        "sameAs": []
      },
      {
        "@type": "SoftwareApplication",
        "name": "Fierro",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web, iOS, Android",
        "url": "https://getfierro.com",
        "description": "Track construction budgets, expenses, and project health in real time. Built for general contractors, subcontractors, and project owners.",
        "offers": {
          "@type": "AggregateOffer",
          "lowPrice": "0",
          "highPrice": "49",
          "priceCurrency": "USD",
          "offerCount": "3",
          "offers": [
            {
              "@type": "Offer",
              "name": "Free",
              "price": "0",
              "priceCurrency": "USD",
              "description": "For solo contractors getting started. 1 project, 3 team members."
            },
            {
              "@type": "Offer",
              "name": "Plus",
              "price": "49",
              "priceCurrency": "USD",
              "priceSpecification": {
                "@type": "UnitPriceSpecification",
                "price": "49",
                "priceCurrency": "USD",
                "referenceQuantity": {
                  "@type": "QuantitativeValue",
                  "value": "1",
                  "unitCode": "MON"
                }
              },
              "description": "For growing teams managing multiple jobs. 5 projects, 10 team members."
            },
            {
              "@type": "Offer",
              "name": "Builder",
              "description": "For enterprises that need everything. Unlimited projects, custom integrations."
            }
          ]
        },
        "featureList": [
          "Real-time budget tracking",
          "Expense management",
          "Vendor management",
          "Team collaboration",
          "Analytics dashboard",
          "AI/MCP integration",
          "API access"
        ]
      }
    ]
  })} />
  <!-- ... page content ... -->
</BaseLayout>
```

### Pattern 3: Legal Page Prose Layout
**What:** Convert fierro_web JSX legal content to semantic Astro HTML with a consistent prose-reading layout.
**When to use:** /privacy and /terms pages.
**Example:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Privacy Policy" description="..." ogImage="/og/privacy.png">
  <!-- Lightweight dark header band -->
  <section class="bg-gunmetal pt-28 pb-10">
    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-off-white">Privacy Policy</h1>
      <p class="mt-2 text-sm text-off-white/60">Effective Date: March 2, 2026</p>
    </div>
  </section>

  <!-- Prose content -->
  <section class="bg-off-white py-12 lg:py-16">
    <article class="prose-legal mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <!-- Converted HTML content from fierro_web -->
      <p>Fierro Inc. ("Fierro," "we," "us," or "our") is committed to...</p>
      <h2>1. Information We Collect</h2>
      <!-- etc -->
    </article>
  </section>
</BaseLayout>
```

**Styling approach:** Use a `prose-legal` utility class in global.css to set readable typography:
```css
/* Legal page prose styling */
.prose-legal {
  max-width: 65ch;
  line-height: 1.75;
}

.prose-legal h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.375rem;
  font-weight: 700;
}

.prose-legal h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.prose-legal p {
  margin-bottom: 1rem;
}

.prose-legal ul {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
  list-style-type: disc;
}

.prose-legal li {
  margin-bottom: 0.5rem;
}

.prose-legal a {
  color: oklch(0.62 0.19 48); /* molten-orange */
  text-decoration: underline;
}
```

### Pattern 4: OG Images as Static Public Files
**What:** Static PNG files in `public/og/` (NOT in `src/assets/`) so they have stable, predictable URLs.
**When to use:** Social sharing images for all pages.
**Why public/ not src/assets/:** OG images must have absolute URLs that social media crawlers can fetch. Astro's image pipeline in src/assets/ hashes filenames, which breaks OG tag URLs. Files in `public/` are served as-is at predictable paths.

**Image specs:**
- Dimensions: 1200 x 630 pixels
- Format: PNG
- File size target: under 300KB
- Design: Dark Gunmetal (#2B3544) background, Fierro logo centered top, page title in DM Sans bold, "Every dollar. Every pour. Accounted for." tagline below, Molten Orange accent line or element

### Pattern 5: Astro Sitemap Integration
**What:** Add @astrojs/sitemap to astro.config.mjs for automatic sitemap generation at build time.
**When to use:** One-time configuration.
**Example:**
```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://getfierro.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Result:** Generates `/sitemap-index.xml` and `/sitemap-0.xml` in the build output. The `site` property is already set, which is the only prerequisite.

**Note on /sitemap.xml:** The @astrojs/sitemap integration generates `sitemap-index.xml` as the root file. To make it accessible at `/sitemap.xml`, either: (a) reference `sitemap-index.xml` in robots.txt (standard practice), or (b) use the integration's `filenameBase` option to control naming if needed. Most search engines accept either path.

### Anti-Patterns to Avoid
- **OG images in src/assets/:** Astro will hash the filename, breaking OG meta tag URLs. Use public/ instead.
- **Hardcoding full URLs in meta tags:** Use `Astro.site` and `Astro.url.pathname` to construct URLs dynamically.
- **Using @tailwindcss/typography (prose plugin):** The project uses Tailwind v4 with CSS-first config. The typography plugin adds complexity. A small custom `.prose-legal` class is lighter and more controlled.
- **Fetching legal content at build time from fierro_web filesystem:** Don't use `import.meta.glob` or `fs.readFile` to pull from the sibling repo. Convert the content once and maintain it directly in the Astro pages. The content is legal text that rarely changes, and coupling build to sibling repo filesystem introduces fragility.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sitemap generation | Manual XML sitemap builder | @astrojs/sitemap | Auto-discovers all pages, handles index files, updates on build |
| OG image generation | Canvas/Sharp runtime generation | Static PNGs committed to repo | Only 5 pages, runtime generation adds build complexity for no benefit |
| SEO meta management | Custom SEO component library | Extended BaseLayout props | 5 pages total, a dedicated SEO library is over-engineering |
| robots.txt | Custom route handler | Static file in public/ | Static site, no dynamic robots.txt needs |

**Key insight:** This is a 5-page static site. Every "clever" abstraction for SEO (astro-seo packages, dynamic OG generation, CMS-driven meta) is overkill. Simple props on BaseLayout and static files in public/ cover everything needed.

## Common Pitfalls

### Pitfall 1: OG Image URLs Must Be Absolute
**What goes wrong:** Social media crawlers (Facebook, Twitter, LinkedIn) receive relative image paths like `/og/home.png` and can't resolve them.
**Why it happens:** Meta tag content looks correct in HTML source but crawlers don't have a base URL context.
**How to avoid:** Always construct absolute URLs: `new URL(ogImage, Astro.site).href` produces `https://getfierro.com/og/home.png`.
**Warning signs:** Social share previews show no image or broken image.

### Pitfall 2: JSON-LD Must Use `set:html` in Astro
**What goes wrong:** Astro escapes HTML entities in `<script>` content by default, turning JSON into escaped garbage.
**Why it happens:** Astro's default template behavior escapes `<`, `>`, `&` etc.
**How to avoid:** Use `set:html={JSON.stringify(data)}` on the `<script type="application/ld+json">` tag.
**Warning signs:** JSON-LD shows `&quot;` instead of `"` in page source.

### Pitfall 3: Sitemap Requires `site` in astro.config.mjs
**What goes wrong:** Build fails or generates empty sitemap.
**Why it happens:** @astrojs/sitemap needs the `site` property to construct absolute URLs.
**How to avoid:** Already configured -- `site: 'https://getfierro.com'` is in astro.config.mjs. Just don't remove it.
**Warning signs:** Build warning about missing site property.

### Pitfall 4: Legal Content JSX-to-HTML Conversion Gotchas
**What goes wrong:** `className` becomes invalid in Astro HTML, JSX expressions like `{COMPANY_NAME}` don't work, `&quot;` entities need conversion.
**Why it happens:** fierro_web legal content is React/JSX with JSX-specific syntax.
**How to avoid:** During conversion: (1) remove `className` (use `class` if needed), (2) replace JSX expressions with literal text values, (3) replace `&quot;` with `"`, (4) replace `&apos;` with `'`, (5) remove `{" "}` JSX whitespace expressions, (6) remove `<br />` self-closing syntax to `<br>`.
**Warning signs:** Build errors about unexpected JSX syntax, or garbled entity text in rendered pages.

### Pitfall 5: OG Images Not Deployed to Correct Path
**What goes wrong:** Images in `src/assets/og/` get processed and hashed; meta tags point to `/og/home.png` but the file is at `/_astro/home.abc123.png`.
**Why it happens:** Confusion between `src/assets/` (processed by Astro image pipeline) and `public/` (served as-is).
**How to avoid:** Place OG images in `public/og/` not `src/assets/og/`. The CONTEXT.md mentions `src/assets/og/` but this would break OG URLs -- use `public/og/` instead.
**Warning signs:** 404 errors when testing OG image URLs directly in browser.

### Pitfall 6: Writing to Sibling Repo (DOCS-03)
**What goes wrong:** The deep-link signup flow doc must be written to `../fierro_web/docs/plans/deep-link-signup-flow.md`, which is outside the current repo.
**Why it happens:** This is a cross-repo documentation requirement.
**How to avoid:** Create the file directly at the specified path. The directory `../fierro_web/docs/plans/` already exists (contains `domain-split-marketing-site.md` and `stripe-billing-plan.md`). The file is just a Markdown doc, not committed in this repo's git history.
**Warning signs:** File doesn't exist at the expected path after implementation.

## Code Examples

### Existing Content to Convert: Privacy Policy Source
```
Location: ../fierro_web/src/app/(legal)/privacy/page.tsx
Format: React/JSX function component
Key constants:
  EFFECTIVE_DATE = "March 2, 2026"
  COMPANY_NAME = "Fierro"
  COMPANY_LEGAL = "Fierro Inc."
  CONTACT_EMAIL = "privacy@getfierro.com"
  WEBSITE = "https://getfierro.com"
Sections: 12 sections (Information We Collect through Contact Us)
Includes: CCPA rights, AI/MCP server data access section, international data transfers
```

### Existing Content to Convert: Terms of Service Source
```
Location: ../fierro_web/src/app/(legal)/terms/page.tsx
Format: React/JSX function component
Key constants:
  EFFECTIVE_DATE = "March 2, 2026"
  COMPANY_NAME = "Fierro"
  COMPANY_LEGAL = "Fierro Inc."
  CONTACT_EMAIL = "support@getfierro.com"
  WEBSITE = "https://getfierro.com"
  GOVERNING_STATE = "California"
Sections: 17 sections (Eligibility through Contact Us)
Includes: AI/MCP disclaimer section, subscription/payments, arbitration clause
```

### llms.txt Format
```markdown
# Fierro

> Fierro is construction job cost control software that helps contractors,
> project owners, and teams track budgets, expenses, and project health
> in real time. Available as a web app and mobile app with AI/MCP
> integration for automated workflows.

## Pages

- [Home](https://getfierro.com/): Overview of Fierro's construction cost control platform
- [Pricing](https://getfierro.com/pricing): Three tiers -- Free ($0/mo), Plus ($49/mo), Builder (custom)
- [Why Fierro](https://getfierro.com/why-fierro): Pain-first narrative on why construction teams need Fierro
- [Privacy Policy](https://getfierro.com/privacy): How Fierro collects, uses, and protects your data
- [Terms of Service](https://getfierro.com/terms): Terms governing use of the Fierro platform

## AI Integration

- Fierro provides an MCP (Model Context Protocol) server for AI assistant integration
- AI agents can read and modify project data (budgets, expenses, vendors) via the MCP server
- MCP access is available on Plus and Builder plans
- App access: https://app.getfierro.com
```

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://getfierro.com/sitemap-index.xml
```

### SEO Meta Copy Per Page (Recommended)
```
Home:
  Title: "Construction Cost Control | Fierro"
  Description: "Track construction budgets, expenses, and project health in real time. Free for solo contractors. No spreadsheets, no surprises."

Pricing:
  Title: "Pricing | Fierro"
  Description: "Simple, transparent pricing for construction teams. Start free, upgrade to Plus at $49/mo when you're ready. No sales calls required."

Why Fierro:
  Title: "Why Fierro | Fierro"
  Description: "Spreadsheets lose money. Fierro gives contractors, subs, and project owners one place to track every dollar on every job."

Privacy:
  Title: "Privacy Policy | Fierro"
  Description: "How Fierro collects, uses, and protects your data. We don't sell your information. Your construction data stays yours."

Terms:
  Title: "Terms of Service | Fierro"
  Description: "Terms governing your use of Fierro's construction job cost control platform, including AI/MCP integration terms."
```

### Existing astro.config.mjs (to be updated)
```javascript
// Current:
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://getfierro.com',
  vite: {
    plugins: [tailwindcss()],
  },
});

// Updated (add sitemap):
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://getfierro.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Existing BaseLayout (current state)
```astro
---
import { ClientRouter } from 'astro:transitions';
import Nav from '../components/Nav.astro';
import MobileMenu from '../components/MobileMenu.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
}

const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
    <title>{title} | Fierro</title>
    <ClientRouter />
  </head>
  <body class="bg-off-white text-gunmetal font-sans antialiased">
    <Nav />
    <MobileMenu />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### Deployment Config (for DOCS-01)
```json
// wrangler.json
{
  "name": "fierro-pubsite",
  "compatibility_date": "2026-03-09",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "routes": [
    {
      "pattern": "getfierro.com",
      "custom_domain": true
    }
  ]
}
```
Deploy command: `astro build && wrangler deploy` (already in package.json as `npm run deploy`).

### Pricing Data for Structured Data (from fierro_web)
```
Free:  $0/mo  -- 1 project, 6 sub-projects, 3 members
Plus:  $49/mo ($470/yr, ~20% savings) -- 5 projects, 20 sub-projects, 10 members
Builder: Custom -- unlimited everything
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| xml sitemap manually maintained | @astrojs/sitemap auto-generation | Astro 2.x+ | Zero maintenance sitemaps |
| Microdata/RDFa structured data | JSON-LD in `<script>` tags | Google recommendation since ~2020 | Google explicitly prefers JSON-LD format |
| Separate robots.txt directives | robots.txt + sitemap reference | Standard practice | Sitemap URL in robots.txt helps discovery |
| No AI discoverability | llms.txt convention | Proposed 2024, adopted by 600+ sites by mid-2025 | Early adopter advantage for AI-agent traffic |

**Deprecated/outdated:**
- `ViewTransitions` import from `astro:transitions` -- replaced by `ClientRouter` (already using correct import)
- `@astrojs/tailwind` -- replaced by direct `@tailwindcss/vite` (already using correct approach)

## Open Questions

1. **OG Image Creation Method**
   - What we know: Images should be 1200x630 static PNGs with Gunmetal background, logo, title, tagline, Molten Orange accent
   - What's unclear: How to create them programmatically vs. manually in a design tool. The implementer can use any image editor, SVG-to-PNG conversion, or a simple script.
   - Recommendation: Create them using any available tool -- the quality of the branded template matters more than the creation method. Consider an SVG template that can be exported to PNG.

2. **OG Image Storage: CONTEXT.md says src/assets/og/ but this will break**
   - What we know: CONTEXT.md specifies `src/assets/og/` but Astro processes images in src/assets/ through its image pipeline, producing hashed filenames that break OG meta tag URLs.
   - What's unclear: Whether the user specifically wants Astro-optimized images or simply wants them in the codebase.
   - Recommendation: Use `public/og/` instead. This preserves stable URLs (`/og/home.png`) that social crawlers can fetch. Flag this to the user as a technical correction during planning.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright ^1.58.2 |
| Config file | playwright.config.ts |
| Quick run command | `npx playwright test --project=chromium` |
| Full suite command | `npx playwright test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LEGL-01 | Privacy page renders legal content with proper styling | e2e | `npx playwright test tests/legal.spec.ts --project=chromium -x` | No -- Wave 0 |
| LEGL-02 | Terms page renders legal content with proper styling | e2e | `npx playwright test tests/legal.spec.ts --project=chromium -x` | No -- Wave 0 |
| PERF-04 | Each page has unique title + meta description | e2e | `npx playwright test tests/seo-meta.spec.ts --project=chromium -x` | No -- Wave 0 |
| PERF-05 | Each page has OG tags + social image | e2e | `npx playwright test tests/seo-meta.spec.ts --project=chromium -x` | No -- Wave 0 |
| PERF-06 | JSON-LD structured data present and valid | e2e | `npx playwright test tests/structured-data.spec.ts --project=chromium -x` | No -- Wave 0 |
| PERF-07 | Sitemap generated at /sitemap-index.xml | e2e | `npx playwright test tests/sitemap.spec.ts --project=chromium -x` | No -- Wave 0 |
| DOCS-01 | DEPLOYMENT.md exists with required content | unit/smoke | manual check -- file existence and content review | No -- Wave 0 |
| DOCS-02 | MIGRATION.md exists with required content | unit/smoke | manual check -- file existence and content review | No -- Wave 0 |
| DOCS-03 | deep-link-signup-flow.md exists in fierro_web | unit/smoke | manual check -- file existence and content review | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx playwright test --project=chromium -x` (quick, fail-fast)
- **Per wave merge:** `npx playwright test` (full suite)
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/legal.spec.ts` -- covers LEGL-01, LEGL-02 (page rendering, content presence, header band, prose styling)
- [ ] `tests/seo-meta.spec.ts` -- covers PERF-04, PERF-05 (unique titles, descriptions, OG tags per page)
- [ ] `tests/structured-data.spec.ts` -- covers PERF-06 (JSON-LD presence and basic structure validation)
- [ ] `tests/sitemap.spec.ts` -- covers PERF-07 (sitemap-index.xml accessible, contains expected URLs)
- [ ] DOCS-01, DOCS-02, DOCS-03 -- manual verification (file existence), no automated test needed for markdown docs

## Sources

### Primary (HIGH confidence)
- Astro sitemap integration docs: https://docs.astro.build/en/guides/integrations-guide/sitemap/
- Google SoftwareApplication structured data: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Google Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization
- llms.txt specification: https://llmstxt.org/
- schema.org SoftwareApplication type: https://schema.org/SoftwareApplication
- schema.org Organization type: https://schema.org/Organization

### Secondary (MEDIUM confidence)
- Cloudflare Workers Static Assets docs: https://developers.cloudflare.com/workers/static-assets/
- Astro deploy to Cloudflare guide: https://docs.astro.build/en/guides/deploy/cloudflare/
- SaaS schema markup patterns: https://dantaylor.online/blog/schema-for-saas-subscription-products/

### Tertiary (LOW confidence)
- SEO keyword competitive landscape for construction SaaS -- based on web search, not validated against actual search volume data
- llms.txt adoption numbers (600+ sites) -- from web search, specific count may vary

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- @astrojs/sitemap is the official integration, JSON-LD is native HTML, no exotic dependencies
- Architecture: HIGH -- BaseLayout extension pattern follows Astro conventions, legal content source files are verified in fierro_web
- Pitfalls: HIGH -- OG image URL handling and JSX-to-HTML conversion are well-documented gotchas
- Content: MEDIUM -- SEO meta copy and keyword selection based on competitive research, not validated with keyword tools
- Documentation: HIGH -- wrangler.json, deployment commands, and migration steps all verified from existing project files and fierro_web planning docs

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable domain -- Astro 5 and schema.org standards are not fast-moving)
