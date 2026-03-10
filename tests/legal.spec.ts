import { test, expect } from '@playwright/test';

test.describe('Privacy Policy page (LEGL-01)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/privacy');
  });

  test('has correct title containing Privacy Policy', async ({ page }) => {
    await expect(page).toHaveTitle(/Privacy Policy/);
  });

  test('has dark header band section', async ({ page }) => {
    const headerBand = page.locator('section.bg-gunmetal');
    await expect(headerBand).toBeVisible();
  });

  test('h1 contains Privacy Policy', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Privacy Policy');
  });

  test('effective date is present', async ({ page }) => {
    await expect(page.locator('text=March 2, 2026')).toBeVisible();
  });

  test('prose content has at least 10 h2 section headings', async ({ page }) => {
    const h2Count = await page.locator('article.prose-legal h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(10);
  });

  test('prose-legal class is applied to content article', async ({ page }) => {
    const article = page.locator('article.prose-legal');
    await expect(article).toBeVisible();
  });

  test('contact email privacy@getfierro.com appears on page', async ({ page }) => {
    const content = await page.content();
    expect(content).toContain('privacy@getfierro.com');
  });
});

test.describe('Terms of Service page (LEGL-02)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/terms');
  });

  test('has correct title containing Terms of Service', async ({ page }) => {
    await expect(page).toHaveTitle(/Terms of Service/);
  });

  test('has dark header band section', async ({ page }) => {
    const headerBand = page.locator('section.bg-gunmetal');
    await expect(headerBand).toBeVisible();
  });

  test('h1 contains Terms of Service', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toContainText('Terms of Service');
  });

  test('effective date is present', async ({ page }) => {
    await expect(page.locator('text=March 2, 2026')).toBeVisible();
  });

  test('prose content has at least 10 h2 section headings', async ({ page }) => {
    const h2Count = await page.locator('article.prose-legal h2').count();
    expect(h2Count).toBeGreaterThanOrEqual(10);
  });

  test('prose-legal class is applied to content article', async ({ page }) => {
    const article = page.locator('article.prose-legal');
    await expect(article).toBeVisible();
  });

  test('contact email support@getfierro.com appears on page', async ({ page }) => {
    const content = await page.content();
    expect(content).toContain('support@getfierro.com');
  });
});
