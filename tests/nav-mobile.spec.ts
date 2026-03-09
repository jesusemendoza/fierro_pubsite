import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation (NAV-02)', () => {
  test.use({ viewport: { width: 375, height: 812 } }); // iPhone viewport

  test('hamburger button is visible on mobile', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#menu-toggle');
    await expect(toggle).toBeVisible();
  });

  test('hamburger opens mobile menu overlay', async ({ page }) => {
    await page.goto('/');
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeHidden();

    await page.locator('#menu-toggle').click();
    await expect(mobileMenu).toBeVisible();
  });

  test('mobile menu has all navigation links', async ({ page }) => {
    await page.goto('/');
    await page.locator('#menu-toggle').click();
    const menu = page.locator('#mobile-menu');

    await expect(menu.locator('a[href="/pricing"]')).toBeVisible();
    await expect(menu.locator('a[href="/why-fierro"]')).toBeVisible();
    await expect(menu.locator('a[href="https://app.getfierro.com/login"]')).toBeVisible();
    await expect(menu.locator('a[href="https://app.getfierro.com/signup"]')).toBeVisible();
  });

  test('mobile menu touch targets are at least 44px', async ({ page }) => {
    await page.goto('/');
    await page.locator('#menu-toggle').click();

    const links = page.locator('#mobile-menu a');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });

  test('mobile menu close button works', async ({ page }) => {
    await page.goto('/');
    await page.locator('#menu-toggle').click();
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toBeVisible();

    await page.locator('#menu-close').click();
    await expect(mobileMenu).toBeHidden();
  });
});
