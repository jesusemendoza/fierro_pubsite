import { test, expect } from '@playwright/test';

test.describe('Landing Page - Sections', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // LAND-03: Trust bar SKIPPED -- verify it's not present
  test('no trust/logo bar section exists (deferred)', async ({ page }) => {
    const trustBar = page.locator('[data-testid="trust-bar"], .trust-bar, .logo-bar');
    await expect(trustBar).toHaveCount(0);
  });

  // LAND-04: Value proposition cards
  test('value proposition cards are visible with headings', async ({ page }) => {
    // ValueProps section renders 4 cards, each with an h3
    const cards = page.locator('[data-animate-stagger] [data-animate]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    // Verify each card has an h3 heading
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('h3')).toBeVisible();
    }
  });

  // LAND-06: How It Works section
  test('How It Works section has 3 steps', async ({ page }) => {
    const section = page.locator('#how-it-works');
    await expect(section).toBeVisible();
    const steps = section.locator('h3');
    await expect(steps).toHaveCount(3);
  });

  // LAND-07: Persona callouts SKIPPED -- verify not present
  test('no persona callout section exists (deferred)', async ({ page }) => {
    const personas = page.locator('[data-testid="personas"], .persona-callouts');
    await expect(personas).toHaveCount(0);
    await expect(page.locator('text=For General Contractors')).toHaveCount(0);
    await expect(page.locator('text=For Subcontractors')).toHaveCount(0);
    await expect(page.locator('text=For Project Owners')).toHaveCount(0);
  });

  // LAND-08: Closing CTA
  test('closing CTA has Start Free button linking to signup', async ({ page }) => {
    // The ClosingCta section is the last <section> on the page
    const closingCta = page.locator('section').last().locator('a[href="https://app.getfierro.com/signup"]');
    await expect(closingCta).toBeVisible();
    await expect(closingCta).toContainText('Start Free');
  });
});
