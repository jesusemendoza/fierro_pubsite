import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: 'Home' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/why-fierro', name: 'Why Fierro' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/terms', name: 'Terms' },
];

test.describe('SEO Meta Tags (PERF-04, PERF-05)', () => {
  for (const pg of pages) {
    test.describe(`${pg.name} (${pg.path})`, () => {
      test(`has unique title containing | Fierro`, async ({ page }) => {
        await page.goto(pg.path);
        await expect(page).toHaveTitle(/\| Fierro/);
      });

      test(`has meta description with non-empty content`, async ({ page }) => {
        await page.goto(pg.path);
        const desc = page.locator('meta[name="description"]');
        const content = await desc.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content!.length).toBeGreaterThan(10);
      });

      test(`has og:title matching page title`, async ({ page }) => {
        await page.goto(pg.path);
        const ogTitle = page.locator('meta[property="og:title"]');
        const ogContent = await ogTitle.getAttribute('content');
        expect(ogContent).toContain('Fierro');
      });

      test(`has og:description with non-empty content`, async ({ page }) => {
        await page.goto(pg.path);
        const ogDesc = page.locator('meta[property="og:description"]');
        const content = await ogDesc.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content!.length).toBeGreaterThan(10);
      });

      test(`has og:image with absolute URL starting with https://getfierro.com/og/`, async ({ page }) => {
        await page.goto(pg.path);
        const ogImage = page.locator('meta[property="og:image"]');
        const content = await ogImage.getAttribute('content');
        expect(content).toMatch(/^https:\/\/getfierro\.com\/og\//);
      });

      test(`has og:url with absolute URL`, async ({ page }) => {
        await page.goto(pg.path);
        const ogUrl = page.locator('meta[property="og:url"]');
        const content = await ogUrl.getAttribute('content');
        expect(content).toMatch(/^https:\/\/getfierro\.com/);
      });

      test(`has twitter:card set to summary_large_image`, async ({ page }) => {
        await page.goto(pg.path);
        const twitterCard = page.locator('meta[name="twitter:card"]');
        await expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
      });

      test(`has twitter:image with absolute URL`, async ({ page }) => {
        await page.goto(pg.path);
        const twitterImage = page.locator('meta[name="twitter:image"]');
        const content = await twitterImage.getAttribute('content');
        expect(content).toMatch(/^https:\/\/getfierro\.com/);
      });

      test(`has canonical link with absolute URL`, async ({ page }) => {
        await page.goto(pg.path);
        const canonical = page.locator('link[rel="canonical"]');
        const href = await canonical.getAttribute('href');
        expect(href).toMatch(/^https:\/\/getfierro\.com/);
      });
    });
  }

  test('all 5 pages have different titles', async ({ page }) => {
    const titles: string[] = [];
    for (const pg of pages) {
      await page.goto(pg.path);
      titles.push(await page.title());
    }
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(5);
  });

  test('all 5 pages have different meta descriptions', async ({ page }) => {
    const descriptions: string[] = [];
    for (const pg of pages) {
      await page.goto(pg.path);
      const desc = page.locator('meta[name="description"]');
      const content = await desc.getAttribute('content');
      descriptions.push(content || '');
    }
    const uniqueDescs = new Set(descriptions);
    expect(uniqueDescs.size).toBe(5);
  });
});
