import { test, expect } from '@playwright/test';

test.describe('Landing Page - Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // LAND-01: Dark premium hero section
  test('hero section has dark gunmetal background', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
    await expect(hero).toHaveClass(/bg-gunmetal/);
  });

  test('hero displays headline text', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Every dollar. Every pour. Accounted for.');
  });

  test('hero contains SVG illustration', async ({ page }) => {
    const heroSvg = page.locator('section').first().locator('svg');
    await expect(heroSvg.first()).toBeVisible();
  });

  // LAND-02: Two CTAs above the fold
  test('Start Free CTA links to signup', async ({ page }) => {
    const startFree = page.locator('section').first().locator('a', { hasText: 'Start Free' });
    await expect(startFree).toBeVisible();
    await expect(startFree).toHaveAttribute('href', 'https://app.getfierro.com/signup');
  });

  test('See How It Works CTA links to anchor', async ({ page }) => {
    const howItWorks = page.locator('section').first().locator('a', { hasText: 'See How It Works' });
    await expect(howItWorks).toBeVisible();
    await expect(howItWorks).toHaveAttribute('href', '#how-it-works');
  });
});
