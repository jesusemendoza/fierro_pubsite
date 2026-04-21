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
    await expect(page.locator('h1')).toContainText('Know exactly where your money goes');
  });

  test('hero contains screenshot image', async ({ page }) => {
    const heroImg = page.locator('section').first().locator('img');
    await expect(heroImg.first()).toBeVisible();
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

  test('App Store badge links to Apple listing', async ({ page }) => {
    const appStore = page.locator('section').first().locator('a[aria-label="Download Fierro on the App Store"]');
    await expect(appStore).toBeVisible();
    await expect(appStore).toHaveAttribute('href', 'https://apps.apple.com/us/app/fierro/id6759904709');
    await expect(appStore).toHaveAttribute('target', '_blank');
    await expect(appStore).toHaveAttribute('rel', /noopener/);
  });

  test('Google Play badge links to Play Store listing', async ({ page }) => {
    const googlePlay = page.locator('section').first().locator('a[aria-label="Get Fierro on Google Play"]');
    await expect(googlePlay).toBeVisible();
    await expect(googlePlay).toHaveAttribute(
      'href',
      'https://play.google.com/store/apps/details?id=com.sundownspecial.fierro'
    );
    await expect(googlePlay).toHaveAttribute('target', '_blank');
    await expect(googlePlay).toHaveAttribute('rel', /noopener/);
  });
});
