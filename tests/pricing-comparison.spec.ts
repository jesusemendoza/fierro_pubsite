import { test, expect } from '@playwright/test';

test.describe('Pricing - Comparison Table (PRIC-04)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('comparison table is visible on page', async ({ page }) => {
    await expect(page.locator('table')).toBeVisible();
  });

  test('table has columns for Free, Home, Plus, Builder', async ({ page }) => {
    const header = page.locator('thead');
    await expect(header.locator('th', { hasText: 'Free' })).toBeVisible();
    await expect(header.locator('th', { hasText: 'Home' })).toBeVisible();
    await expect(header.locator('th', { hasText: 'Plus' })).toBeVisible();
    await expect(header.locator('th', { hasText: 'Builder' })).toBeVisible();
  });

  test('table shows actual limits in Projects row', async ({ page }) => {
    const projectsRow = page.locator('tbody tr').filter({
      has: page.locator('td:first-child', { hasText: 'Projects' }),
    }).first();
    await expect(projectsRow.locator('td').nth(1)).toContainText('1');
    await expect(projectsRow.locator('td').nth(2)).toContainText('2');
    await expect(projectsRow.locator('td').nth(3)).toContainText('8');
    await expect(projectsRow.locator('td').nth(4)).toContainText('Unlimited');
  });

  test('ChatGPT integration row shows "Read-only" for Free and "Configurable per project" for Plus', async ({ page }) => {
    const aiRow = page.locator('tr', { hasText: 'ChatGPT integration' });
    await expect(aiRow.locator('td').nth(1)).toContainText('Read-only');
    await expect(aiRow.locator('td').nth(3)).toContainText('Configurable per project');
  });

  test('table has at least 8 rows of feature data', async ({ page }) => {
    const dataRows = page.locator('tbody tr');
    await expect(dataRows).toHaveCount(15);
  });
});
