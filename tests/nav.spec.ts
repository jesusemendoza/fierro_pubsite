import { test, expect } from '@playwright/test';

test.describe('Navigation (NAV-01, NAV-04)', () => {
  test('nav is visible with all expected links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('#main-nav');
    await expect(nav).toBeVisible();

    // Desktop nav links
    await expect(page.locator('nav a[href="/pricing"]')).toBeVisible();
    await expect(page.locator('nav a[href="/why-fierro"]')).toBeVisible();
  });

  test('Login link points to app.getfierro.com/login', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.locator('nav a[href="https://app.getfierro.com/login"]');
    await expect(loginLink).toBeVisible();
  });

  test('Start Free CTA points to app.getfierro.com/signup', async ({ page }) => {
    await page.goto('/');
    const ctaLink = page.locator('nav a[href="https://app.getfierro.com/signup"]');
    await expect(ctaLink).toBeVisible();
  });

  test('nav is sticky (fixed positioning)', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('#main-nav');
    const position = await nav.evaluate(el => getComputedStyle(el).position);
    expect(position).toBe('fixed');
  });

  test('nav links are present on all pages', async ({ page }) => {
    const pages = ['/', '/pricing', '/why-fierro', '/privacy', '/terms'];
    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('#main-nav')).toBeVisible();
    }
  });
});
