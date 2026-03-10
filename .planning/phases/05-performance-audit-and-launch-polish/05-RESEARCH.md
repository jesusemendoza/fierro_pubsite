# Phase 5: Performance Audit and Launch Polish - Research

**Researched:** 2026-03-09
**Domain:** Lighthouse performance auditing, WCAG 2.1 AA accessibility, cache optimization, responsive testing
**Confidence:** HIGH

## Summary

This phase is an audit-and-fix phase for a static Astro 5 site deployed to Cloudflare Workers Static Assets. The site already ships near-zero JS (one 16KB ClientRouter module + small inline scripts for nav scroll, mobile menu, IntersectionObserver, and pricing toggle custom element). The CSS bundle is 28KB. Fonts are already self-hosted via Fontsource with `font-display: swap` baked in. The architecture is fundamentally performance-friendly -- this phase validates that reality with automated Lighthouse CI, fixes whatever the audit surfaces, adds full WCAG 2.1 AA accessibility (skip link, focus trapping, landmark regions), cache headers for hashed assets, and responsive verification at three breakpoints.

The primary risk is NOT the performance score itself (the architecture is sound) but ensuring the automated CI gate is properly configured so regressions are caught forever. The secondary risk is accessibility gaps -- the site has good foundations (44px touch targets, prefers-reduced-motion, aria-labels on toggle) but lacks skip-to-content, focus trap on mobile menu, and landmark `aria-label` attributes.

**Primary recommendation:** Use `@lhci/cli` with `staticDistDir=./dist` to audit all 5 pages against the built output, assert 0.95 minScore on Performance/Accessibility/Best Practices, and integrate as an npm script alongside existing Playwright tests.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Strict 95+ on Lighthouse Performance, Accessibility, and Best Practices for every page -- no exceptions
- Keep scroll animations (CSS transitions + IntersectionObserver) -- only cut if proven bottleneck after measurement
- Leave inline scripts as-is (Nav scroll, IntersectionObserver x3, PricingToggle custom element, MobileMenu) -- they're small and page-specific, don't consolidate
- Image optimization is Lighthouse-driven only -- fix what Lighthouse flags, don't proactively scan beyond that
- Add `font-display: swap` to DM Sans Variable (ALREADY PRESENT in Fontsource default -- no action needed)
- Subset to Latin characters only (Fontsource unicode-range already handles this -- browser only downloads 40KB latin file)
- No preload hint -- let browser discover font naturally via CSS
- Keep full variable weight range (100-900)
- Full WCAG 2.1 AA audit -- keyboard navigation, focus management, screen reader compatibility, aria labels, form labels, semantic HTML
- Add skip-to-content link -- visually hidden, appears on focus, jumps past sticky nav to main content
- Verify and fix mobile menu focus trapping -- Tab cycles within open menu, Escape closes it
- SVG illustrations marked as decorative -- `role="presentation"` or `aria-hidden="true"`
- Automated Lighthouse CI via @lhci/cli integrated with Playwright test suite
- 3 responsive breakpoints: Mobile (375px), Tablet (768px), Desktop (1280px)
- Add cache headers to `_headers` file -- long-lived cache for hashed assets, shorter cache for HTML
- Green CI = done

### Claude's Discretion
- Exact cache-control header values and path patterns
- Which Lighthouse categories to assert (Performance, Accessibility, Best Practices -- likely all three)
- Lighthouse CI configuration details (number of runs, median vs average, throttling settings)
- How to implement font subsetting with Fontsource (CSS import path or build config)
- Skip-to-content link styling and animation
- Focus trap implementation approach for mobile menu
- Whether to add `aria-label` to nav, footer, and landmark regions
- Specific responsive test assertions per breakpoint

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PERF-01 | Lighthouse Performance score 95+ on mobile | @lhci/cli with staticDistDir=./dist, minScore 0.95, 3 runs per page for median stability |
| PERF-02 | Time to First Render < 1s and TTI < 1.5s on simulated 3G | Lighthouse throttling (default mobile preset simulates slow 4G); assert `first-contentful-paint` maxNumericValue and `interactive` maxNumericValue |
| PERF-03 | Zero or near-zero client-side JS | Already achieved -- only ClientRouter (16KB gzip 5.3KB) + inline scripts. Validate via Lighthouse `total-byte-weight` and `unused-javascript` audits |
| PERF-08 | Responsive design -- mobile-first, works across all screen sizes, WCAG AA contrast ratios | Playwright viewport tests at 375/768/1280px; WCAG AA via Lighthouse accessibility category assertions; skip-to-content link, focus trap, landmark labels |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @lhci/cli | 0.15.x | Automated Lighthouse CI runner | Google-maintained, 2M+ monthly npm downloads, built-in static site server, assertion framework |
| @playwright/test | 1.58.x | Responsive viewport testing, accessibility DOM checks | Already in project, extends existing test suite |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lighthouse | (bundled with @lhci/cli) | Core audit engine | Invoked by lhci, not directly |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @lhci/cli standalone | playwright-lighthouse | playwright-lighthouse v4.0.0 is 2 years stale, compatibility issues with Playwright 1.57+. @lhci/cli is actively maintained and works independently |
| @lhci/cli | unlighthouse | Heavier, more suited to large multi-page sites. @lhci/cli is simpler for 5 pages |

**Installation:**
```bash
npm install -D @lhci/cli
```

## Architecture Patterns

### Recommended Approach: Separate Lighthouse CI + Playwright Tests

Do NOT try to run Lighthouse inside Playwright tests. Instead:

1. **@lhci/cli runs standalone** against `dist/` (built output) using its own static server
2. **Playwright tests** handle responsive viewport assertions and DOM-level accessibility checks
3. **npm scripts** orchestrate both: `npm run test:lighthouse` and `npm run test` (Playwright)

This separation is clean because:
- Lighthouse needs a fresh Chrome instance with specific throttling -- Playwright's browser context doesn't support Lighthouse's trace-based analysis
- Lighthouse CI has its own assertion framework that's purpose-built for score thresholds
- Playwright tests are better for interactive testing (focus trap, keyboard nav, skip link)

### lighthouserc.js Configuration

```javascript
// lighthouserc.js (project root)
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
      url: [
        'http://localhost/index.html',
        'http://localhost/pricing/index.html',
        'http://localhost/why-fierro/index.html',
        'http://localhost/privacy/index.html',
        'http://localhost/terms/index.html',
      ],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
```

**Key decisions:**
- `numberOfRuns: 3` -- takes median, reduces flakiness without slowing CI
- `staticDistDir: './dist'` -- lhci spins up its own server, no need for Astro dev server
- Explicit URL list because lhci auto-detection only finds root-level HTML files (known limitation -- nested dirs like `pricing/index.html` would be missed)
- `upload.target: 'filesystem'` -- stores reports locally, no external LHCI server needed
- Add `.lighthouseci/` to `.gitignore`

### _headers Cache Configuration

```
# Hashed assets -- immutable, cache 1 year
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

# HTML pages -- revalidate every time
/*.html
  Cache-Control: public, max-age=0, must-revalidate

/*/index.html
  Cache-Control: public, max-age=0, must-revalidate

# OG images -- cache 1 week (rarely change but not hashed)
/og/*
  Cache-Control: public, max-age=604800

# Favicon -- cache 1 month
/favicon.ico
  Cache-Control: public, max-age=2592000

# Security headers (existing)
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

**Rationale:**
- All files in `/_astro/` have content hashes in filenames (e.g., `index.BBX8z79Z.css`) -- safe for immutable caching
- HTML must always revalidate so deploys take effect immediately
- OG images are in `public/og/` without hashes -- moderate cache is appropriate
- Cloudflare Workers Static Assets respects `_headers` file for static assets

### Skip-to-Content Link

Add as first child of `<body>` in BaseLayout.astro:

```html
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-molten-orange focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:outline-none"
>
  Skip to main content
</a>
```

And add `id="main-content"` to the `<main>` element:
```html
<main id="main-content" tabindex="-1">
```

The `tabindex="-1"` allows the element to receive focus programmatically when the skip link is activated, which is the standard WCAG pattern.

### Mobile Menu Focus Trap

The current mobile menu (`MobileMenu.astro` + Nav.astro script) opens/closes but doesn't trap focus. Required additions:

1. **Escape key closes menu** -- add `keydown` listener for Escape
2. **Focus trap** -- when menu is open, Tab/Shift+Tab cycles only within menu elements
3. **Focus management** -- when menu opens, focus moves to close button; when menu closes, focus returns to hamburger button
4. **`aria-expanded`** on hamburger button -- tracks menu state

Implementation pattern:
```javascript
// Inside the astro:page-load listener
const openMenu = () => {
  mobileMenu?.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  toggle?.setAttribute('aria-expanded', 'true');
  menuClose?.focus(); // Move focus into menu
};

const closeMenu = () => {
  mobileMenu?.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.focus(); // Return focus to trigger
};

// Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !mobileMenu?.classList.contains('hidden')) {
    closeMenu();
  }
});

// Focus trap
mobileMenu?.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = mobileMenu.querySelectorAll('a, button');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
```

### SVG Decorative Marking

All SVG illustrations (feature mockups in FeatureShowcase, hero dashboard) need `aria-hidden="true"` since surrounding text conveys the meaning. Check all `<img>` tags with SVG sources and inline `<svg>` elements.

### Landmark Regions

Add `aria-label` to distinguish multiple `<nav>` elements:
- Main nav: `<nav id="main-nav" aria-label="Main navigation">`
- Mobile menu nav: `<nav aria-label="Mobile navigation">`
- Footer: `<footer aria-label="Site footer">` (optional but good practice)

### Anti-Patterns to Avoid
- **Running Lighthouse in dev mode:** Always audit the built `dist/` output -- dev server includes HMR scripts that skew scores
- **Preloading fonts on a static site:** The font CSS is bundled and discovered early anyway; preload hints would add an extra request for negligible benefit with self-hosted fonts
- **Using playwright-lighthouse wrapper:** Stale package (2 years without update), compatibility issues with current Playwright versions

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Lighthouse score checking | Custom Chrome DevTools Protocol script | @lhci/cli assertions | Handles multiple runs, median calculation, score extraction, reporting |
| Focus trapping | Custom focus trap from scratch | Standard pattern (query focusable elements, intercept Tab) | The pattern is well-known but still needs manual implementation -- no library needed for a single menu |
| Cache header generation | Build script that hashes and generates headers | Cloudflare _headers file with `/_astro/*` glob | Astro already hashes assets into `_astro/`; just match the path pattern |
| Font subsetting | Manual fonttools subsetting | Fontsource unicode-range | Already handled -- browser only downloads needed subset via unicode-range in @font-face |

**Key insight:** Most of this phase's work is configuration and verification, not building new features. The architecture decisions in Phases 1-3 (static output, inline scripts, custom elements, self-hosted fonts) already did the heavy lifting.

## Common Pitfalls

### Pitfall 1: Lighthouse Score Flakiness
**What goes wrong:** Scores vary by 3-5 points between runs, causing CI to flake.
**Why it happens:** Lighthouse simulates network conditions; small timing variations cause score fluctuation.
**How to avoid:** Use `numberOfRuns: 3` (takes median), set threshold at 0.95 not 1.0, use `staticDistDir` (eliminates network variability by serving locally).
**Warning signs:** CI passes locally but fails in GitHub Actions (different CPU speeds affect throttled simulation).

### Pitfall 2: Forgetting Nested HTML in LHCI
**What goes wrong:** Only `index.html` gets audited; pages like `/pricing/index.html` are skipped.
**Why it happens:** `lhci collect --staticDistDir` auto-detection has limited depth for nested directories.
**How to avoid:** Explicitly list all 5 URLs in the `collect.url` array in `lighthouserc.js`.
**Warning signs:** CI only reports one page's scores.

### Pitfall 3: ClientRouter Counting as JS
**What goes wrong:** Lighthouse flags "unused JavaScript" because `ClientRouter.astro_astro_type_script_index_0_lang.CDGfc0hd.js` (16KB / 5.3KB gzip) is loaded on every page.
**Why it happens:** Astro's ClientRouter is needed for View Transitions and page-load event dispatch.
**How to avoid:** This is expected and acceptable -- 5.3KB gzip is negligible. The score should still hit 95+ easily. Do NOT remove ClientRouter as it would break the scroll animations and mobile menu.
**Warning signs:** If this actually drops performance below 95, investigate what else changed -- the JS itself is not the problem.

### Pitfall 4: _headers Path Matching on Cloudflare Workers
**What goes wrong:** Cache headers don't apply because path patterns don't match.
**Why it happens:** Cloudflare Workers Static Assets path matching differs from Pages. Headers only apply to static assets, not Worker-generated responses.
**How to avoid:** Test headers after deployment with `curl -I https://getfierro.com/_astro/index.BBX8z79Z.css`. The site is fully static (no Worker script processing), so `_headers` should work for all responses.
**Warning signs:** Cache-Control header missing from response.

### Pitfall 5: Skip Link Not Scrolling Past Fixed Nav
**What goes wrong:** Skip link jumps to `#main-content` but content is hidden behind the fixed nav.
**Why it happens:** Fixed nav sits at `z-50` and overlaps the top of main content.
**How to avoid:** The `scroll-margin-top: 5rem` rule in `global.css` already applies to all `[id]` elements, which will handle `#main-content`. Verify visually.
**Warning signs:** After clicking skip link, first line of content is under the nav.

### Pitfall 6: Fontsource Import Already Optimal
**What goes wrong:** Wasting time trying to optimize font loading that's already optimal.
**Why it happens:** Assuming Fontsource needs manual `font-display` or subsetting configuration.
**How to avoid:** The default `@fontsource-variable/dm-sans` import already includes `font-display: swap` and unicode-range subsetting. The browser downloads only the 40KB latin file (not the 20KB latin-ext). No changes needed to the font import.
**Warning signs:** N/A -- just skip font optimization work entirely.

## Code Examples

### npm scripts additions

```json
{
  "scripts": {
    "test:lighthouse": "lhci autorun",
    "test:all": "npm run build && npm run test:lighthouse && npm run test"
  }
}
```

### Playwright responsive test pattern

```typescript
// tests/responsive.spec.ts
import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
];

const pages = [
  { path: '/', name: 'Home' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/why-fierro', name: 'Why Fierro' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/terms', name: 'Terms' },
];

for (const vp of viewports) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const pg of pages) {
      test(`${pg.name} renders without horizontal overflow`, async ({ page }) => {
        await page.goto(pg.path);
        const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(bodyWidth).toBeLessThanOrEqual(vp.width);
      });
    }

    if (vp.name === 'Mobile') {
      test('hamburger menu is visible', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#menu-toggle')).toBeVisible();
      });

      test('desktop nav links are hidden', async ({ page }) => {
        await page.goto('/');
        const desktopNav = page.locator('.hidden.md\\:flex').first();
        await expect(desktopNav).not.toBeVisible();
      });
    }

    if (vp.name === 'Desktop') {
      test('desktop nav links are visible', async ({ page }) => {
        await page.goto('/');
        const featuresLink = page.locator('nav a:has-text("Features")').first();
        await expect(featuresLink).toBeVisible();
      });

      test('hamburger menu is hidden', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#menu-toggle')).not.toBeVisible();
      });
    }
  });
}
```

### Playwright accessibility test pattern

```typescript
// tests/accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility (PERF-08 WCAG AA)', () => {
  test('skip-to-content link is first focusable element', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveAttribute('href', '#main-content');
    await expect(focused).toContainText('Skip to main content');
  });

  test('skip-to-content link becomes visible on focus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible();
  });

  test('mobile menu traps focus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#menu-toggle').click();
    // Focus should be on close button
    await expect(page.locator('#menu-close')).toBeFocused();
    // Tab through all items -- should cycle back
    const focusableCount = await page.locator('#mobile-menu a, #mobile-menu button').count();
    for (let i = 0; i < focusableCount; i++) {
      await page.keyboard.press('Tab');
    }
    // Should wrap back to first focusable (close button)
    await expect(page.locator('#menu-close')).toBeFocused();
  });

  test('Escape closes mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#menu-toggle').click();
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).not.toBeVisible();
    // Focus returns to hamburger
    await expect(page.locator('#menu-toggle')).toBeFocused();
  });

  test('all SVG illustrations have aria-hidden', async ({ page }) => {
    await page.goto('/');
    const svgImages = page.locator('img[src*=".svg"]');
    const count = await svgImages.count();
    for (let i = 0; i < count; i++) {
      const img = svgImages.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaHidden = await img.getAttribute('aria-hidden');
      // Decorative images should have aria-hidden="true" or empty alt
      expect(alt === '' || ariaHidden === 'true').toBeTruthy();
    }
  });

  test('nav landmarks have distinct aria-labels', async ({ page }) => {
    await page.goto('/');
    const navs = page.locator('nav[aria-label]');
    const count = await navs.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      labels.push(await navs.nth(i).getAttribute('aria-label') || '');
    }
    const unique = new Set(labels);
    expect(unique.size).toBe(labels.length);
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual Lighthouse in DevTools | @lhci/cli automated in CI | 2020+ | Catches regressions before deploy |
| Google Fonts CDN | Self-hosted via Fontsource | 2022+ | Eliminates third-party connection, better privacy, faster TTFB |
| `<link rel="preload">` for fonts | Let CSS discovery handle it | Current best practice for self-hosted | Reduces header bloat; font CSS is in critical path anyway |
| playwright-lighthouse wrapper | @lhci/cli standalone + Playwright for DOM tests | 2024+ (wrapper went stale) | Cleaner separation, no compatibility issues |

**Deprecated/outdated:**
- `playwright-lighthouse` v4.0.0: Last published 2+ years ago, incompatible with Playwright 1.57+. Do not use.
- `@astrojs/tailwind`: Replaced by `@tailwindcss/vite` for Tailwind v4. Already handled in Phase 1.

## Open Questions

1. **Lighthouse scores on GitHub Actions runners**
   - What we know: Lighthouse throttling simulates slow networks, but CPU differences between local and CI can cause 2-5 point score variance
   - What's unclear: Whether GitHub Actions runners consistently hit 95+ with the same config
   - Recommendation: Start with 0.95 threshold locally; if CI flakes, consider `--collect.settings.throttling.cpuSlowdownMultiplier` adjustment. This is a tune-after-deployment concern.

2. **OKLch color contrast verification**
   - What we know: Lighthouse checks contrast ratios for WCAG AA (4.5:1 for normal text, 3:1 for large text)
   - What's unclear: Whether Lighthouse correctly evaluates OKLch-specified colors or converts to sRGB first
   - Recommendation: Lighthouse evaluates computed/rendered colors, so OKLch will be converted to sRGB by the browser before Lighthouse checks. This should work correctly. If issues arise, verify specific color pairs manually.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.58.x + @lhci/cli 0.15.x |
| Config file | `playwright.config.ts` (exists) + `lighthouserc.js` (Wave 0) |
| Quick run command | `npx playwright test tests/accessibility.spec.ts tests/responsive.spec.ts --project=chromium` |
| Full suite command | `npm run build && npx lhci autorun && npx playwright test --project=chromium` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PERF-01 | Lighthouse Performance 95+ on all 5 pages | lighthouse-ci | `npm run build && npx lhci autorun` | No -- Wave 0 (lighthouserc.js) |
| PERF-02 | FCP < 1s, TTI < 1.5s on simulated 3G | lighthouse-ci | `npm run build && npx lhci autorun` (assertions in lighthouserc.js) | No -- Wave 0 |
| PERF-03 | Near-zero client JS | lighthouse-ci | `npm run build && npx lhci autorun` (validates via performance score) | No -- Wave 0 |
| PERF-08 | Responsive at 375/768/1280px | playwright | `npx playwright test tests/responsive.spec.ts --project=chromium -x` | No -- Wave 0 |
| PERF-08 | WCAG AA: skip link, focus trap, landmarks, decorative SVGs | playwright | `npx playwright test tests/accessibility.spec.ts --project=chromium -x` | No -- Wave 0 |
| PERF-08 | WCAG AA contrast ratios | lighthouse-ci | Covered by `categories:accessibility` assertion in lighthouserc.js | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx playwright test tests/accessibility.spec.ts tests/responsive.spec.ts --project=chromium`
- **Per wave merge:** `npm run build && npx lhci autorun && npx playwright test --project=chromium`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `lighthouserc.js` -- Lighthouse CI configuration file (collect URLs, assert scores)
- [ ] `tests/accessibility.spec.ts` -- skip link, focus trap, landmarks, decorative SVGs
- [ ] `tests/responsive.spec.ts` -- viewport tests at 375/768/1280px
- [ ] Install `@lhci/cli` as devDependency
- [ ] Add `test:lighthouse` and `test:all` npm scripts
- [ ] Add `.lighthouseci/` to `.gitignore`

## Sources

### Primary (HIGH confidence)
- Fontsource `@fontsource-variable/dm-sans` package -- inspected `index.css`, `wght.css`, and font files directly in `node_modules` (font-display: swap confirmed, unicode-range subsetting confirmed, file sizes: latin 40KB, latin-ext 20KB)
- Astro build output -- inspected `dist/` directory after `npm run build` (5 pages, hashed assets in `_astro/`, 16KB JS + 28KB CSS)
- Existing `_headers` file, `playwright.config.ts`, all page source files -- read directly from project

### Secondary (MEDIUM confidence)
- [@lhci/cli npm](https://www.npmjs.com/package/@lhci/cli) -- v0.15.1, 2M+ monthly downloads
- [Lighthouse CI configuration docs](https://googlechrome.github.io/lighthouse-ci/docs/configuration.html) -- staticDistDir, assertions, collect options
- [Cloudflare Workers Static Assets _headers docs](https://developers.cloudflare.com/workers/static-assets/headers/) -- path matching, Cache-Control patterns, 100 rule limit

### Tertiary (LOW confidence)
- playwright-lighthouse compatibility claims -- based on npm publish dates and community reports, not directly tested

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- @lhci/cli is the de facto standard, directly verified on npm, configuration documented
- Architecture: HIGH -- built output inspected, all assets/pages enumerated, font loading verified at source level
- Pitfalls: HIGH -- derived from known LHCI limitations (nested dir detection) and direct code inspection (missing focus trap, no skip link, no aria-labels on landmarks)
- Accessibility gaps: HIGH -- identified by reading MobileMenu.astro, Nav.astro, BaseLayout.astro source code

**Research date:** 2026-03-09
**Valid until:** 2026-04-09 (stable domain -- Lighthouse CI and WCAG patterns change slowly)
