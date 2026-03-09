import { test, expect } from '@playwright/test';

test.describe('Base Layout (FNDN-03)', () => {
  test('page has viewport meta tag', async ({ page }) => {
    await page.goto('/');
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('page has favicon link', async ({ page }) => {
    await page.goto('/');
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', /favicon/);
  });

  test('page has lang attribute set to en', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('page title includes Fierro', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fierro/);
  });
});
