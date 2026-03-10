import { test, expect } from '@playwright/test';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const distDir = resolve(import.meta.dirname, '..', 'dist');

test.describe('Sitemap and Robots (PERF-07)', () => {
  test('robots.txt is accessible and contains Sitemap directive', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
    const text = await page.locator('body').textContent();
    expect(text).toContain('Sitemap:');
    expect(text).toContain('sitemap-index.xml');
  });

  test('sitemap-index.xml exists in build output', async () => {
    const sitemapIndex = resolve(distDir, 'sitemap-index.xml');
    expect(existsSync(sitemapIndex)).toBe(true);
    const content = readFileSync(sitemapIndex, 'utf-8');
    expect(content).toContain('sitemap-0.xml');
  });

  test('sitemap-0.xml contains all page URLs', async () => {
    const sitemap = resolve(distDir, 'sitemap-0.xml');
    expect(existsSync(sitemap)).toBe(true);
    const content = readFileSync(sitemap, 'utf-8');
    expect(content).toContain('https://getfierro.com/');
    expect(content).toContain('https://getfierro.com/pricing');
    expect(content).toContain('https://getfierro.com/why-fierro');
    expect(content).toContain('https://getfierro.com/privacy');
    expect(content).toContain('https://getfierro.com/terms');
  });
});
