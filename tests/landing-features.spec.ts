import { test, expect } from '@playwright/test';

test.describe('Landing Page - Feature Showcase', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // LAND-05: Feature showcase with 5 features
  test('features section exists with correct anchor', async ({ page }) => {
    const section = page.locator('#features');
    await expect(section).toBeVisible();
  });

  test('features section displays 5 feature headings', async ({ page }) => {
    const section = page.locator('#features');
    const featureHeadings = section.locator('h3');
    await expect(featureHeadings).toHaveCount(5);
  });

  test('feature headings include expected capabilities', async ({ page }) => {
    const section = page.locator('#features');
    await expect(section.locator('h3', { hasText: /budget/i })).toBeVisible();
    await expect(section.locator('h3', { hasText: /expense/i })).toBeVisible();
    await expect(section.locator('h3', { hasText: /team/i })).toBeVisible();
    await expect(section.locator('h3', { hasText: /vendor/i })).toBeVisible();
    await expect(section.locator('h3', { hasText: /analytics|reporting/i })).toBeVisible();
  });

  test('each feature has an SVG illustration', async ({ page }) => {
    const section = page.locator('#features');
    const svgs = section.locator('svg');
    const count = await svgs.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('nav Features link scrolls to features section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.click('a[href="/#features"]');
    const features = page.locator('#features');
    await expect(features).toBeInViewport({ ratio: 0.1 });
  });
});
