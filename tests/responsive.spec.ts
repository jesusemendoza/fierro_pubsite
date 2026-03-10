import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'Mobile', width: 375, height: 812 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
] as const;

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Why Fierro', path: '/why-fierro' },
  { name: 'Privacy', path: '/privacy' },
  { name: 'Terms', path: '/terms' },
] as const;

for (const viewport of viewports) {
  test.describe(`Responsive at ${viewport.width}px (${viewport.name})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const pg of pages) {
      test(`${pg.name} renders without horizontal overflow at ${viewport.width}px`, async ({ page }) => {
        await page.goto(pg.path);
        const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
        expect(scrollWidth).toBeLessThanOrEqual(viewport.width);
      });
    }

    if (viewport.name === 'Mobile') {
      test('hamburger menu is visible', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#menu-toggle')).toBeVisible();
      });

      test('desktop nav links are hidden', async ({ page }) => {
        await page.goto('/');
        const desktopNav = page.locator('#main-nav .hidden.md\\:flex').first();
        await expect(desktopNav).not.toBeVisible();
      });
    }

    if (viewport.name === 'Desktop') {
      test('desktop nav links are visible', async ({ page }) => {
        await page.goto('/');
        const featuresLink = page.locator('#main-nav a[href="/#features"]');
        await expect(featuresLink).toBeVisible();
      });

      test('hamburger menu is hidden', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('#menu-toggle')).not.toBeVisible();
      });
    }
  });
}
