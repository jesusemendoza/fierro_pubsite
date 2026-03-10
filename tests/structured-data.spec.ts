import { test, expect } from '@playwright/test';

test.describe('JSON-LD Structured Data (PERF-06)', () => {
  test('home page contains application/ld+json script', async ({ page }) => {
    await page.goto('/');
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript).toHaveCount(1);
  });

  test('JSON-LD has valid @context schema.org', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd!);
    expect(data['@context']).toBe('https://schema.org');
  });

  test('JSON-LD contains @graph array', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd!);
    expect(Array.isArray(data['@graph'])).toBe(true);
  });

  test('JSON-LD has Organization type with name Fierro', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd!);
    const org = data['@graph'].find((item: any) => item['@type'] === 'Organization');
    expect(org).toBeTruthy();
    expect(org.name).toBe('Fierro');
    expect(org.url).toBeTruthy();
  });

  test('JSON-LD has SoftwareApplication type with name Fierro', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd!);
    const app = data['@graph'].find((item: any) => item['@type'] === 'SoftwareApplication');
    expect(app).toBeTruthy();
    expect(app.name).toBe('Fierro');
  });

  test('SoftwareApplication has offers with 4 pricing tiers', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd!);
    const app = data['@graph'].find((item: any) => item['@type'] === 'SoftwareApplication');
    expect(app.offers).toBeTruthy();
    expect(app.offers.offers).toHaveLength(4);

    const tierNames = app.offers.offers.map((o: any) => o.name);
    expect(tierNames).toContain('Free');
    expect(tierNames).toContain('Home');
    expect(tierNames).toContain('Plus');
    expect(tierNames).toContain('Builder');
  });

  test('SoftwareApplication has featureList array', async ({ page }) => {
    await page.goto('/');
    const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(jsonLd!);
    const app = data['@graph'].find((item: any) => item['@type'] === 'SoftwareApplication');
    expect(Array.isArray(app.featureList)).toBe(true);
    expect(app.featureList.length).toBeGreaterThanOrEqual(5);
  });
});
