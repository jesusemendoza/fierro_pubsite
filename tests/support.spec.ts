import { test, expect } from '@playwright/test';

test.describe('Support page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/support');
  });

  test('has correct title containing Support', async ({ page }) => {
    await expect(page).toHaveTitle(/Support/);
  });

  test('has dark header band section', async ({ page }) => {
    const headerBand = page.locator('section.bg-gunmetal');
    await expect(headerBand).toBeVisible();
  });

  test('h1 contains Support', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Support');
  });

  test('prose-legal class is applied to content article', async ({ page }) => {
    const article = page.locator('article.prose-legal');
    await expect(article).toBeVisible();
  });

  test('contact email support@getfierro.com appears on page', async ({ page }) => {
    const content = await page.content();
    expect(content).toContain('support@getfierro.com');
  });

  test('has FAQ section headings', async ({ page }) => {
    const h2Count = await page.locator('article.prose-legal h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(3);
  });

  test('links to privacy and terms pages', async ({ page }) => {
    const article = page.locator('article.prose-legal');
    await expect(article.locator('a[href="/privacy"]').first()).toBeVisible();
    await expect(article.locator('a[href="/terms"]').first()).toBeVisible();
  });

  test('links to pricing page', async ({ page }) => {
    const article = page.locator('article.prose-legal');
    await expect(article.locator('a[href="/pricing"]')).toBeVisible();
  });
});
