import { test, expect } from '@playwright/test';

test.describe('Pricing - Tier Cards (PRIC-01, PRIC-02, PRIC-06)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('page loads at /pricing with 200 status', async ({ page }) => {
    const response = await page.goto('/pricing');
    expect(response?.status()).toBe(200);
  });

  test('four tier cards visible with names Free, Home, Plus, Builder', async ({ page }) => {
    await expect(page.locator('h3', { hasText: 'Free' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Home' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Plus' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Builder' })).toBeVisible();
  });

  test('Free card shows "$0" price', async ({ page }) => {
    const freePrice = page.locator('[data-price-monthly="$0"]');
    await expect(freePrice).toBeVisible();
    await expect(freePrice).toContainText('$0');
  });

  test('Plus card shows "$49" price (default monthly)', async ({ page }) => {
    const plusPrice = page.locator('[data-price-monthly="$49"]');
    await expect(plusPrice).toBeVisible();
    await expect(plusPrice).toContainText('$49');
  });

  test('Builder card shows "Custom"', async ({ page }) => {
    const builderCard = page.locator('h3', { hasText: 'Builder' }).locator('..');
    await expect(builderCard.locator('p', { hasText: 'Custom' })).toBeVisible();
  });

  test('Home card shows "$20" price', async ({ page }) => {
    const homePrice = page.locator('[data-price-monthly="$20"]');
    await expect(homePrice).toBeVisible();
    await expect(homePrice).toContainText('$20');
  });

  test('competitive messaging text "No sales calls" is visible in subtitle', async ({ page }) => {
    await expect(page.locator('text=No sales calls')).toBeVisible();
  });
});
