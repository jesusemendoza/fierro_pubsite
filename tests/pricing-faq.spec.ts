import { test, expect } from '@playwright/test';

test.describe('Pricing - FAQ Section (PRIC-05)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pricing');
  });

  test('5 FAQ items visible on page', async ({ page }) => {
    const faqItems = page.locator('details');
    await expect(faqItems).toHaveCount(5);
  });

  test('FAQ items are collapsed by default', async ({ page }) => {
    const firstAnswer = page.locator('details').first().locator('div.px-6.pb-4');
    await expect(firstAnswer).toBeHidden();
  });

  test('clicking a question expands the answer', async ({ page }) => {
    const firstDetails = page.locator('details').first();
    const firstSummary = firstDetails.locator('summary');
    const firstAnswer = firstDetails.locator('div.px-6.pb-4');

    await firstSummary.click();
    await expect(firstAnswer).toBeVisible();
  });

  test('FAQ contains text about "spreadsheets"', async ({ page }) => {
    await expect(page.locator('text=spreadsheets')).toBeTruthy();
    const spreadsheetQuestion = page.locator('summary', { hasText: 'spreadsheets' });
    await expect(spreadsheetQuestion).toBeVisible();
  });

  test('FAQ contains text about "existing tools"', async ({ page }) => {
    const toolsQuestion = page.locator('summary', { hasText: 'existing tools' });
    await expect(toolsQuestion).toBeVisible();
  });
});
