import { test, expect } from '@playwright/test';

test.describe('Landing Page - Scroll Animations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // LAND-09: Scroll-triggered CSS animations
  test('data-animate elements exist on the page', async ({ page }) => {
    const animated = page.locator('[data-animate]');
    const count = await animated.count();
    expect(count).toBeGreaterThan(0);
  });

  test('elements near top of page receive visible class on load', async ({ page }) => {
    // Hero elements should be immediately visible (already in viewport)
    await page.waitForTimeout(1000);
    const heroAnimated = page.locator('section').first().locator('[data-animate].visible');
    const count = await heroAnimated.count();
    expect(count).toBeGreaterThan(0);
  });

  test('scrolling reveals elements with visible class', async ({ page }) => {
    // Scroll to bottom of page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    // After scrolling to bottom, all data-animate elements should have .visible
    const allAnimated = page.locator('[data-animate]');
    const allVisible = page.locator('[data-animate].visible');
    const totalCount = await allAnimated.count();
    const visibleCount = await allVisible.count();
    expect(visibleCount).toBe(totalCount);
  });

  test('prefers-reduced-motion is respected in CSS', async ({ page }) => {
    const styles = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules);
          for (const rule of rules) {
            if (rule instanceof CSSMediaRule && rule.conditionText?.includes('prefers-reduced-motion')) {
              return true;
            }
          }
        } catch { /* cross-origin sheets */ }
      }
      return false;
    });
    expect(styles).toBe(true);
  });
});
