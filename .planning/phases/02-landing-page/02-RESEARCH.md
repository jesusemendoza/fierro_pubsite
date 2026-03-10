# Phase 2: Landing Page - Research

**Researched:** 2026-03-09
**Domain:** Static landing page construction -- Astro 5 components, Tailwind v4 styling, CSS scroll animations, inline SVG placeholders
**Confidence:** HIGH

## Summary

Phase 2 replaces the stub `src/pages/index.astro` with a full marketing landing page composed of five content sections: hero, value proposition cards, feature showcase, "How It Works" walkthrough, and closing CTA. The existing BaseLayout, Nav, MobileMenu, and Footer components from Phase 1 are reused unchanged. All new content is implemented as Astro components with Tailwind v4 utility classes and the established OKLch brand color tokens.

The scroll animation approach requires a careful decision. The CONTEXT.md specifies "CSS @keyframes with a small IntersectionObserver script" rather than pure CSS `animation-timeline: view()`. This is the correct call for broad browser support: `animation-timeline: view()` has ~82% global support (missing Firefox entirely without a flag), while IntersectionObserver + CSS @keyframes has 98%+ support. The implementation pattern is a ~15-line script that adds a CSS class when elements enter the viewport, triggering CSS-defined transitions.

All visuals are abstract SVG illustrations used as inline Astro components (Astro 5.18 ships stable SVG component imports -- no experimental flag needed). This avoids external image requests and allows `currentColor` styling.

**Primary recommendation:** Build each section as an isolated Astro component, define fade/slide animations in global.css using Tailwind v4's `@theme` block, and add a single IntersectionObserver script to the page that toggles a `.visible` class on elements with a `data-animate` attribute.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Hero: Solid dark Gunmetal background (no gradient, no texture). Headline: "Every dollar. Every pour. Accounted for." with supporting subtitle. Hero visual: abstract SVG illustration as placeholder. Two CTAs: "Start Free" (filled Molten Orange) and "See How It Works" (ghost/outline button, scrolls). Nav remains transparent over dark hero (Phase 1 behavior)
- Value prop cards: 3-4 quantified benefit cards on off-white background. Benefit framing, not hard stats. No logo/trust bar
- Feature showcase: Alternating left/right layout, 5 features (Budget Tracking, Expense Management, Team Management, Vendor Management, Analytics). Mixed desktop/phone mockup placeholders per feature. All visuals are abstract SVG illustrations
- How It Works: 3-step numbered walkthrough in horizontal row on dark Gunmetal background. Scannable, not narrative
- Closing CTA: Dark Gunmetal background, clear headline + "Start Free" button linking to app.getfierro.com/signup
- Page flow visual rhythm: Hero (dark) -> Value props (off-white) -> Feature rows (off-white) -> How It Works (dark) -> Closing CTA (dark)
- Scroll animations: Subtle fade + slide up (~20px). CSS @keyframes with small IntersectionObserver script. Duration ~600ms ease-out, children stagger ~100ms. No heavy animation libraries
- Social proof SKIPPED: No logo bar, testimonials, customer stats, or persona callouts in v1

### Claude's Discretion
- Exact value prop card copy and icon choices
- Feature row copy (headlines, bullet points, benefit claims)
- Abstract SVG illustration designs for hero and feature placeholders
- How It Works step copy and icons
- Closing CTA headline copy
- Exact spacing, padding, and section heights
- IntersectionObserver threshold and animation timing details
- Whether "See How It Works" scrolls to features section or How It Works section

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| LAND-01 | Dark premium hero section with Gunmetal background, outcome-focused headline, and product dashboard screenshot | Hero component with bg-gunmetal, inline SVG placeholder, established brand tokens. CONTEXT modifies: abstract SVG illustration instead of product screenshot |
| LAND-02 | Primary CTA ("Start Free") and secondary CTA ("See How It Works") above the fold | Two CTA buttons with Tailwind styling: filled Molten Orange + ghost outline. Smooth scroll via CSS `scroll-behavior: smooth` + anchor href |
| LAND-03 | Client/partner trust bar below hero | CONTEXT decision: SKIPPED for v1. No logo bar. Implement as empty/omitted section. Requirement satisfied by explicit user decision to defer |
| LAND-04 | 3-4 value proposition cards with quantified benefits | Card grid component on off-white section. Tailwind grid/flex layout. Copy is Claude's discretion |
| LAND-05 | Feature showcase with alternating left/right layout | Alternating row component with CSS flex-row/flex-row-reverse pattern. 5 features with mixed desktop/phone SVG illustrations |
| LAND-06 | "How It Works" 3-step walkthrough | Horizontal 3-column layout on dark Gunmetal background. Numbered steps with icons |
| LAND-07 | Role-based persona callouts (GC, Sub, Owner) | CONTEXT decision: SKIPPED for v1. Need validated messaging first. Requirement satisfied by explicit user decision to defer |
| LAND-08 | Closing CTA section with "Start Free" button | Dark section with headline + single CTA button linking to app.getfierro.com/signup |
| LAND-09 | Scroll-triggered CSS animations for section reveals | IntersectionObserver + CSS @keyframes approach (not pure CSS animation-timeline due to Firefox gap). Fade + slide-up with stagger |
</phase_requirements>

## Standard Stack

### Core (already installed -- no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | 5.18.0 | Static site framework | Already installed. Stable SVG component imports (since 5.7). Component-based architecture |
| Tailwind CSS | 4.x | Utility-first CSS | Already installed via @tailwindcss/vite. CSS-first config with @theme directive |
| DM Sans Variable | 5.x | Typography | Already installed via @fontsource-variable/dm-sans |

### Supporting (no installation needed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Playwright | 1.58.2 | E2E testing | Already installed. Test section visibility, anchor links, animation classes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| IntersectionObserver + CSS | CSS `animation-timeline: view()` | Pure CSS but only ~82% browser support (Firefox disabled by default). IO approach has 98%+ support |
| Inline SVG components | Astro Image component | SVGs are placeholder illustrations, not raster images. Inline SVG allows currentColor styling and zero HTTP requests |
| Custom scroll script | AOS / GSAP ScrollTrigger | Overkill for simple fade+slide. Adds JS bundle weight. Violates "no heavy animation libraries" constraint |

**Installation:**
```bash
# No new dependencies needed -- everything is already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  pages/
    index.astro                    # Full landing page (replaces stub)
  components/
    Nav.astro                      # Existing (unchanged)
    MobileMenu.astro               # Existing (unchanged)
    Footer.astro                   # Existing (unchanged)
    landing/
      Hero.astro                   # Hero section
      ValueProps.astro             # Value proposition cards
      FeatureShowcase.astro        # Alternating feature rows
      FeatureRow.astro             # Single feature row (used by FeatureShowcase)
      HowItWorks.astro             # 3-step walkthrough
      ClosingCta.astro             # Final CTA banner
  assets/
    logo.svg                       # Existing
    illustrations/
      hero-dashboard.svg           # Abstract hero illustration
      feature-budget.svg           # Budget tracking illustration
      feature-expenses.svg         # Expense management illustration
      feature-team.svg             # Team management illustration
      feature-vendor.svg           # Vendor management illustration
      feature-analytics.svg        # Analytics illustration
  styles/
    global.css                     # Extended with animation @keyframes
```

### Pattern 1: Section Component with Data-Animate Attribute
**What:** Each landing page section is a self-contained Astro component. Elements that should animate on scroll receive a `data-animate` attribute.
**When to use:** Every section component.
**Example:**
```astro
---
// Hero.astro -- no frontmatter imports needed for simple sections
---
<section id="hero" class="relative bg-gunmetal py-20 lg:py-32">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-16">
      <div class="max-w-xl text-center lg:text-left" data-animate>
        <h1 class="text-4xl font-bold tracking-tight text-off-white sm:text-5xl lg:text-6xl">
          Every dollar. Every pour. Accounted for.
        </h1>
        <p class="mt-6 text-lg text-concrete-gray">
          Construction cost control that keeps your projects profitable.
        </p>
        <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
          <a href="https://app.getfierro.com/signup"
             class="rounded-md bg-molten-orange px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-molten-orange/90">
            Start Free
          </a>
          <a href="#how-it-works"
             class="rounded-md border border-off-white/30 px-6 py-3 text-center font-semibold text-off-white transition-colors hover:border-off-white/60">
            See How It Works
          </a>
        </div>
      </div>
      <div class="w-full max-w-lg" data-animate>
        <!-- Inline SVG illustration here -->
      </div>
    </div>
  </div>
</section>
```

### Pattern 2: Alternating Feature Rows
**What:** Reusable component that flips layout direction on even/odd rows using CSS flex-direction.
**When to use:** Feature showcase section with 5 features.
**Example:**
```astro
---
// FeatureRow.astro
interface Props {
  title: string;
  description: string;
  bullets: string[];
  reverse?: boolean;
}
const { title, description, bullets, reverse = false } = Astro.props;
---
<div class={`flex flex-col gap-8 lg:items-center lg:gap-16 ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
     data-animate>
  <div class="flex-1">
    <h3 class="text-2xl font-bold text-gunmetal">{title}</h3>
    <p class="mt-3 text-lg text-concrete-gray">{description}</p>
    <ul class="mt-4 space-y-2">
      {bullets.map(b => (
        <li class="flex items-start gap-2 text-concrete-gray">
          <span class="mt-1 text-molten-orange">&#x2713;</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  </div>
  <div class="flex-1">
    <slot />  <!-- SVG illustration slot -->
  </div>
</div>
```

### Pattern 3: IntersectionObserver Scroll Animation Script
**What:** A single inline `<script>` on the landing page that observes all `[data-animate]` elements and adds a `.visible` class when they enter the viewport. Combined with CSS transitions for the actual animation.
**When to use:** Once, on the index.astro page.
**Example:**
```astro
<script>
  document.addEventListener('astro:page-load', () => {
    const elements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // one-time reveal
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
  });
</script>
```

### Pattern 4: Tailwind v4 Animation Definitions in @theme
**What:** Define custom animation keyframes and variables in global.css using `@theme`.
**When to use:** For the fade+slide animation used across all sections.
**Example:**
```css
/* In global.css, extend the existing @theme block */
@theme {
  /* existing color tokens... */
  --animate-fade-up: fade-up 600ms ease-out forwards;

  @keyframes fade-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
```

### Pattern 5: CSS Transition Approach (Alternative to @theme keyframes)
**What:** Use CSS transitions triggered by a class toggle instead of named animations. This is simpler for one-shot scroll reveals.
**When to use:** When the animation is always the same (fade+slide-up) and only needs to play once.
**Example:**
```css
/* Outside @theme -- always-present styles */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
}

[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger children */
[data-animate]:nth-child(2) { transition-delay: 100ms; }
[data-animate]:nth-child(3) { transition-delay: 200ms; }
[data-animate]:nth-child(4) { transition-delay: 300ms; }

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  [data-animate] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Pattern 6: Smooth Scroll for Anchor Links
**What:** CSS-only smooth scrolling for the "See How It Works" CTA.
**When to use:** Applied globally in the html element.
**Example:**
```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

### Pattern 7: SVG Component Imports (Astro 5.7+ Stable)
**What:** Import .svg files directly as Astro components for inline rendering.
**When to use:** For all placeholder illustrations (hero, features).
**Example:**
```astro
---
import HeroDashboard from '../../assets/illustrations/hero-dashboard.svg';
---
<HeroDashboard width={480} height={320} class="w-full h-auto" />
```
The SVG contents are inlined into the HTML at build time -- no extra HTTP requests.

### Anti-Patterns to Avoid
- **Importing SVGs as `<img src>`:** Prevents currentColor styling and adds HTTP requests. Use Astro's native SVG component imports instead.
- **Using `animation-timeline: view()` without fallback:** Firefox doesn't support it without a flag (~18% of global traffic missed). Stick with IntersectionObserver + CSS transitions.
- **Putting scroll observer in each component:** Creates multiple observer instances. Use ONE observer script on the page that targets `[data-animate]`.
- **Using JavaScript for the actual animation:** The JS should only toggle a class. The visual animation MUST be CSS transitions/keyframes for GPU acceleration.
- **Animating layout properties (width, height, top, left):** Use only `opacity` and `transform` for 60fps animation. These are compositor-only properties.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll reveal animations | Custom scroll event listener with offset calculations | IntersectionObserver API | Scroll events fire at 60fps and cause jank. IO is async, batched, and purpose-built for visibility detection |
| SVG icon system | Manual copy-paste of SVG markup | Astro SVG component imports (`import Icon from './icon.svg'`) | Stable since Astro 5.7. Auto-inlines at build, supports props, tree-shakes unused SVGs |
| Responsive image containers | Custom aspect-ratio divs with padding-bottom hack | CSS `aspect-ratio` property | 96%+ browser support. One line vs. complex padding wrapper |
| Staggered animation delays | JavaScript setTimeout chains | CSS `transition-delay` with nth-child selectors | Pure CSS, declarative, no JS execution needed |
| Smooth scrolling | Custom JS `window.scrollTo` with requestAnimationFrame | CSS `scroll-behavior: smooth` | Native browser implementation, respects user preferences |

**Key insight:** This phase is content-heavy, not logic-heavy. The only JavaScript needed is a ~15-line IntersectionObserver script. Everything else -- layout, animation, responsiveness -- is pure CSS via Tailwind utilities plus a few custom CSS rules.

## Common Pitfalls

### Pitfall 1: Invisible Content Without JavaScript
**What goes wrong:** Elements with `data-animate` start with `opacity: 0`. If JavaScript fails to load or execute, content is permanently hidden.
**Why it happens:** The CSS sets initial state to invisible, but JS is needed to add the `.visible` class.
**How to avoid:** Use `<noscript>` styles to show all content, OR set `[data-animate] { opacity: 1; }` in a `<noscript><style>` block. Alternatively, set the initial opacity via the script itself rather than CSS.
**Warning signs:** Content missing when JS is disabled in browser devtools.

### Pitfall 2: Hero Height Not Accounting for Fixed Nav
**What goes wrong:** Hero content is hidden behind the fixed navigation bar.
**Why it happens:** The nav is `fixed top-0` with `z-50`, so content starts at the top of the viewport.
**How to avoid:** The hero section needs `pt-20` or similar padding-top to push content below the nav. The stub index.astro already uses `pt-20`. But for a dark full-bleed hero, the background should still start at `top-0` -- only the content needs padding.
**Warning signs:** Headline partially obscured on page load.

### Pitfall 3: Anchor Scroll Position Off By Nav Height
**What goes wrong:** Clicking "See How It Works" scrolls to the section but the heading is hidden behind the fixed nav.
**Why it happens:** Browser scrolls the element to top of viewport, but nav covers the top 64-80px.
**How to avoid:** Add `scroll-margin-top: 5rem` (or similar) to target section elements, or use a CSS rule like `[id] { scroll-margin-top: 5rem; }`.
**Warning signs:** Section heading not visible after anchor scroll.

### Pitfall 4: SVG Illustrations Not Responsive
**What goes wrong:** SVGs render at fixed pixel dimensions, breaking layout on mobile.
**Why it happens:** SVG has hardcoded `width`/`height` attributes without responsive CSS.
**How to avoid:** Always add `class="w-full h-auto"` to SVG components and ensure the source SVG has a `viewBox` attribute.
**Warning signs:** Horizontal scroll on mobile, SVG overflows container.

### Pitfall 5: Dark Section Text Contrast
**What goes wrong:** Text on dark Gunmetal sections is unreadable due to insufficient contrast.
**Why it happens:** Using `text-concrete-gray` on `bg-gunmetal` may not meet WCAG AA contrast ratio (4.5:1 for normal text).
**How to avoid:** Use `text-off-white` for headings and primary text on dark backgrounds. Use `text-concrete-gray` sparingly (only for secondary text that meets 3:1 ratio minimum for large text). Verify with a contrast checker.
**Warning signs:** Squinting to read subtitle text on the hero section.

### Pitfall 6: Mobile Layout Breaks in Feature Rows
**What goes wrong:** Alternating left/right rows don't stack properly on mobile.
**Why it happens:** Using `lg:flex-row-reverse` for alternating direction but forgetting that mobile should always stack text-first, visual-second.
**How to avoid:** Default `flex-col` stacking order should always be text then visual, regardless of desktop direction. The `reverse` prop only affects `lg:` breakpoint.
**Warning signs:** Visual appears above text on mobile for reversed rows.

### Pitfall 7: IntersectionObserver Fires Before Page Load
**What goes wrong:** Elements near the top of the page (hero) don't animate because they were already visible when the observer was created.
**Why it happens:** IntersectionObserver immediately reports elements that are already intersecting when first observed.
**How to avoid:** This is actually fine -- elements already in viewport should be visible immediately. The observer callback fires with `isIntersecting: true` for already-visible elements, which adds `.visible` class instantly. No stagger delay for hero elements.
**Warning signs:** Not a problem in practice, but test by scrolling from the bottom of the page.

## Code Examples

### Complete global.css Extension
```css
/* src/styles/global.css */
@import "tailwindcss";
@import "@fontsource-variable/dm-sans";

@theme {
  --color-gunmetal: oklch(0.235 0.006 265);
  --color-molten-orange: oklch(0.62 0.19 48);
  --color-off-white: oklch(0.97 0.005 90);
  --color-concrete-gray: oklch(0.63 0.006 265);
  --color-rebar-green: oklch(0.53 0.12 160);
  --color-overrun-red: oklch(0.55 0.22 25);

  --font-sans: 'DM Sans Variable', system-ui, sans-serif;
}

/* Smooth scroll for anchor links */
html {
  scroll-behavior: smooth;
}

/* Scroll animation base styles */
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 600ms ease-out, transform 600ms ease-out;
}

[data-animate].visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays for child groups */
[data-animate-stagger] > [data-animate]:nth-child(1) { transition-delay: 0ms; }
[data-animate-stagger] > [data-animate]:nth-child(2) { transition-delay: 100ms; }
[data-animate-stagger] > [data-animate]:nth-child(3) { transition-delay: 200ms; }
[data-animate-stagger] > [data-animate]:nth-child(4) { transition-delay: 300ms; }

/* Scroll offset for fixed nav */
[id] {
  scroll-margin-top: 5rem;
}

/* Accessibility: disable animations for reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  [data-animate] {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### Complete IntersectionObserver Script
```astro
<!-- Place once in index.astro, after all section components -->
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

### index.astro Page Composition
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/landing/Hero.astro';
import ValueProps from '../components/landing/ValueProps.astro';
import FeatureShowcase from '../components/landing/FeatureShowcase.astro';
import HowItWorks from '../components/landing/HowItWorks.astro';
import ClosingCta from '../components/landing/ClosingCta.astro';
---
<BaseLayout title="Construction Cost Control">
  <Hero />
  <ValueProps />
  <FeatureShowcase />
  <HowItWorks />
  <ClosingCta />
</BaseLayout>

<script>
  // IntersectionObserver for scroll animations
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

### Ghost Button (Secondary CTA) Pattern
```html
<a href="#how-it-works"
   class="rounded-md border border-off-white/30 px-6 py-3 text-center font-semibold text-off-white transition-colors hover:border-off-white/60 hover:bg-off-white/10">
  See How It Works
</a>
```

### Value Prop Card Pattern
```astro
---
interface Props {
  icon: string;   // emoji or SVG component
  title: string;
  description: string;
}
const { icon, title, description } = Astro.props;
---
<div class="rounded-lg border border-concrete-gray/20 bg-white p-6 text-center shadow-sm" data-animate>
  <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-molten-orange/10 text-2xl">
    {icon}
  </div>
  <h3 class="text-lg font-bold text-gunmetal">{title}</h3>
  <p class="mt-2 text-sm text-concrete-gray">{description}</p>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `ViewTransitions` import | `ClientRouter` from `astro:transitions` | Astro 5.0 | Already using correct import in BaseLayout |
| Experimental SVG flag | Stable SVG component imports | Astro 5.7 (Apr 2025) | Can import .svg files directly as components, no config change needed |
| Tailwind config.js | CSS-first @theme in global.css | Tailwind v4 (Jan 2025) | Already using correct approach. Custom keyframes go inside @theme |
| JS scroll libraries (AOS, GSAP) | IntersectionObserver + CSS transitions | 2023+ | Native API, zero dependencies, better performance |
| CSS animation-timeline: view() | Still emerging | 2025-2026 | ~82% support. Not ready for production without fallback. Firefox gap |
| @astrojs/tailwind integration | @tailwindcss/vite plugin | Tailwind v4 | Already using correct approach |

**Deprecated/outdated:**
- `@astrojs/tailwind`: Deprecated for Tailwind v4. Project correctly uses `@tailwindcss/vite`
- `ViewTransitions`: Renamed to `ClientRouter` in Astro 5. Project already uses correct name
- `experimental.svg` flag: Removed in Astro 5.7. SVG imports are stable. No flag needed with Astro 5.18

## Open Questions

1. **SVG illustration design specifics**
   - What we know: Abstract geometric shapes suggesting dashboards/construction, consistent style across hero and features, some features show desktop mockups and others phone mockups
   - What's unclear: Exact SVG designs -- these need to be created. Complexity level of the illustrations
   - Recommendation: Start with simple geometric SVGs (rectangles for screens, circles/lines for data visualizations). Keep them under 5KB each. Use brand colors (Molten Orange accents, Off-White/Concrete Gray shapes on dark backgrounds, Gunmetal shapes on light backgrounds)

2. **"See How It Works" scroll target**
   - What we know: CONTEXT.md lists this as Claude's discretion -- could scroll to features section or How It Works section
   - What's unclear: Which provides better UX
   - Recommendation: Scroll to `#how-it-works` section. The button text says "See How It Works" so it should go to the "How It Works" section, not features. The nav "Features" link already goes to `#features`

3. **Nav "Features" link anchor target**
   - What we know: Nav already has `href="/#features"`. The landing page needs a `#features` element
   - What's unclear: Whether `#features` should anchor to value props or feature showcase
   - Recommendation: Place `id="features"` on the feature showcase section since that's the primary features content. Value props are benefits, not features

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.2 |
| Config file | `playwright.config.ts` |
| Quick run command | `npx playwright test --project=chromium` |
| Full suite command | `npx playwright test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| LAND-01 | Hero section visible with dark background, headline text, SVG illustration | e2e | `npx playwright test tests/landing-hero.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-02 | Two CTAs visible above fold, correct hrefs (signup + anchor scroll) | e2e | `npx playwright test tests/landing-hero.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-03 | Trust bar SKIPPED (verify absence) | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-04 | 3-4 value proposition cards visible with text content | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-05 | Feature showcase with 5 features in alternating layout | e2e | `npx playwright test tests/landing-features.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-06 | How It Works section with 3 numbered steps | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-07 | Persona callouts SKIPPED (verify absence) | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-08 | Closing CTA with "Start Free" button linking to signup | e2e | `npx playwright test tests/landing-sections.spec.ts --project=chromium -x` | No -- Wave 0 |
| LAND-09 | Scroll animations: data-animate elements gain .visible class on scroll | e2e | `npx playwright test tests/landing-animations.spec.ts --project=chromium -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx playwright test --project=chromium -x`
- **Per wave merge:** `npx playwright test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/landing-hero.spec.ts` -- covers LAND-01, LAND-02
- [ ] `tests/landing-sections.spec.ts` -- covers LAND-03 (skipped), LAND-04, LAND-06, LAND-07 (skipped), LAND-08
- [ ] `tests/landing-features.spec.ts` -- covers LAND-05
- [ ] `tests/landing-animations.spec.ts` -- covers LAND-09

## Sources

### Primary (HIGH confidence)
- Astro 5.18 installed locally -- SVG component imports verified stable (unflagged since 5.7)
- Tailwind CSS v4 docs (https://tailwindcss.com/docs/animation) -- @theme animation definition syntax verified
- MDN IntersectionObserver API -- standard web API, 98%+ browser support
- Existing codebase: global.css, BaseLayout.astro, Nav.astro, index.astro -- established patterns

### Secondary (MEDIUM confidence)
- CanIUse (https://caniuse.com/mdn-css_properties_animation-timeline_view) -- animation-timeline: view() at 81.94% support, Firefox unsupported without flag
- Astro blog (https://astro.build/blog/astro-570/) -- SVG component feature unflagged in 5.7
- MDN scroll-behavior (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-behavior) -- CSS smooth scroll for anchors

### Tertiary (LOW confidence)
- None -- all findings verified with primary or secondary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- everything is already installed and verified working from Phase 1
- Architecture: HIGH -- patterns are standard Astro component composition with well-documented CSS techniques
- Pitfalls: HIGH -- based on direct analysis of existing codebase (e.g., fixed nav, dark backgrounds) and established web development patterns
- Animations: HIGH -- IntersectionObserver is a mature API; CSS transitions are universally supported; approach aligns with CONTEXT.md decision

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable -- no fast-moving dependencies)
