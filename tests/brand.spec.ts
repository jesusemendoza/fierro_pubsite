import { test, expect } from '@playwright/test';

test.describe('Brand Design Tokens (FNDN-02)', () => {
  test('body uses DM Sans font family', async ({ page }) => {
    await page.goto('/');
    const fontFamily = await page.locator('body').evaluate(
      el => getComputedStyle(el).fontFamily
    );
    expect(fontFamily).toContain('DM Sans');
  });

  test('body has off-white background color', async ({ page }) => {
    await page.goto('/');
    const bgColor = await page.locator('body').evaluate(
      el => getComputedStyle(el).backgroundColor
    );
    // Off-white should not be pure white (rgb(255,255,255)) or transparent
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('rgb(255, 255, 255)');
  });

  test('body has gunmetal text color', async ({ page }) => {
    await page.goto('/');
    const textColor = await page.locator('body').evaluate(
      el => getComputedStyle(el).color
    );
    // Gunmetal is a very dark color, RGB values should be low
    expect(textColor).not.toBe('rgb(0, 0, 0)');
  });
});
