import { test, expect } from '@playwright/test';

test.describe('Footer (NAV-03)', () => {
  test('footer is visible on the page', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('footer has page links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');

    await expect(footer.locator('a[href="/pricing"]')).toBeVisible();
    await expect(footer.locator('a[href="/why-fierro"]')).toBeVisible();
    await expect(footer.locator('a[href="/privacy"]')).toBeVisible();
    await expect(footer.locator('a[href="/terms"]')).toBeVisible();
    await expect(footer.locator('a[href="/support"]')).toBeVisible();
  });

  test('footer has signup CTA linking to app.getfierro.com/signup', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    const signupLink = footer.locator('a[href="https://app.getfierro.com/signup"]');
    await expect(signupLink).toBeVisible();
  });

  test('footer has copyright notice', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toContainText('Fierro');
    await expect(footer).toContainText(new Date().getFullYear().toString());
  });

  test('footer renders on all pages', async ({ page }) => {
    const pages = ['/', '/pricing', '/why-fierro', '/privacy', '/terms', '/support'];
    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('footer')).toBeVisible();
    }
  });
});
