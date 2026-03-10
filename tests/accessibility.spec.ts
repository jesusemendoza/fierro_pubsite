import { test, expect } from '@playwright/test';

test.describe('Accessibility (WCAG 2.1 AA)', () => {
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
    await page.click('#menu-toggle');

    // After opening, menu-close should be focused
    await expect(page.locator('#menu-close')).toBeFocused();

    // Collect all focusable elements in mobile menu
    const focusableCount = await page.locator('#mobile-menu a, #mobile-menu button').count();

    // Tab through all elements and verify focus wraps
    for (let i = 0; i < focusableCount - 1; i++) {
      await page.keyboard.press('Tab');
    }

    // Now on last element, Tab should wrap to first
    await page.keyboard.press('Tab');
    const firstFocusable = page.locator('#mobile-menu').locator('a, button').first();
    await expect(firstFocusable).toBeFocused();
  });

  test('Escape closes mobile menu and returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.click('#menu-toggle');
    await expect(page.locator('#mobile-menu')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).not.toBeVisible();
    await expect(page.locator('#menu-toggle')).toBeFocused();
  });

  test('hamburger button has aria-expanded', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
    await page.click('#menu-toggle');
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'true');
    await page.click('#menu-close');
    await expect(page.locator('#menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  });

  test('nav landmarks have distinct aria-labels', async ({ page }) => {
    await page.goto('/');
    const navs = page.locator('nav[aria-label]');
    const count = await navs.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const labels: string[] = [];
    for (let i = 0; i < count; i++) {
      const label = await navs.nth(i).getAttribute('aria-label');
      if (label) labels.push(label);
    }
    // All labels should be unique
    const unique = new Set(labels);
    expect(unique.size).toBe(labels.length);
  });

  test('decorative SVGs have aria-hidden', async ({ page }) => {
    await page.goto('/');

    // Check SVGs inside buttons with aria-label (Nav hamburger, MobileMenu close)
    const buttonSvgs = page.locator('button[aria-label] svg');
    const count = await buttonSvgs.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      await expect(buttonSvgs.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
