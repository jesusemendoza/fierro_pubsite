import { test, expect } from '@playwright/test';

test.describe('Pricing - Toggle & CTAs (PRIC-03, PRIC-07)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('toggle switch is visible with Monthly/Annual labels', async ({ page }) => {
    await expect(page.locator('button[role="switch"]')).toBeVisible();
    await expect(page.locator('[data-label="monthly"]')).toBeVisible();
    await expect(page.locator('[data-label="annual"]')).toBeVisible();
  });

  test('clicking toggle changes Plus price from "$49" to "$39"', async ({ page }) => {
    const plusPrice = page.locator('[data-price-monthly="$49"]');
    await expect(plusPrice).toContainText('$49');

    await page.locator('button[role="switch"]').click();
    await expect(plusPrice).toContainText('$39');
  });

  test('clicking toggle shows "Save $118/year" callout', async ({ page }) => {
    const savings = page.locator('[data-savings]');
    await expect(savings).toBeHidden();

    await page.locator('button[role="switch"]').click();
    await expect(savings).toBeVisible();
    await expect(savings).toContainText('Save $118/year');
  });

  test('clicking toggle again reverts to monthly prices', async ({ page }) => {
    const plusPrice = page.locator('[data-price-monthly="$49"]');
    const toggle = page.locator('button[role="switch"]');

    await toggle.click();
    await expect(plusPrice).toContainText('$39');

    await toggle.click();
    await expect(plusPrice).toContainText('$49');
  });

  test('Free tier "Start Free" CTA links to app.getfierro.com/signup', async ({ page }) => {
    const cta = page.locator('a[data-billing-link]', { hasText: 'Start Free' });
    await expect(cta).toHaveAttribute('href', 'https://app.getfierro.com/signup');
  });

  test('Plus CTA default href contains "plan=plus&billing=monthly"', async ({ page }) => {
    const cta = page.locator('a', { hasText: 'Start Plus' });
    await expect(cta).toHaveAttribute('href', /plan=plus&billing=monthly/);
  });

  test('after toggle to annual, Plus CTA href contains "billing=annual"', async ({ page }) => {
    await page.locator('button[role="switch"]').click();
    const cta = page.locator('a', { hasText: 'Start Plus' });
    await expect(cta).toHaveAttribute('href', /billing=annual/);
  });

  test('Builder CTA links to "#contact-sales"', async ({ page }) => {
    const cta = page.locator('a', { hasText: 'Contact Sales' });
    await expect(cta).toHaveAttribute('href', '#contact-sales');
  });
});
