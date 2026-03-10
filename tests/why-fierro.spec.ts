import { test, expect } from '@playwright/test';

test.describe('Why Fierro - WHY-01: Pain-first narrative structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/why-fierro');
  });

  test('page loads at /why-fierro with 200 status', async ({ page }) => {
    const response = await page.goto('/why-fierro');
    expect(response?.status()).toBe(200);
  });

  test('page has a hero section with "Why Fierro" heading', async ({ page }) => {
    const hero = page.getByTestId('why-hero');
    await expect(hero).toBeVisible();
    await expect(hero.locator('h1')).toContainText('Why Fierro');
  });

  test('at least 4 pain-point sections are visible', async ({ page }) => {
    for (let i = 0; i < 4; i++) {
      await expect(page.getByTestId(`pain-section-${i}`)).toBeVisible();
    }
    // Verify the 4 pain-point problem headings specifically
    await expect(page.getByText('Your contractor sent you a bill')).toBeVisible();
    await expect(page.getByText('You set a budget but you have no idea')).toBeVisible();
    await expect(page.getByText('You didn\'t realize the flip was over budget')).toBeVisible();
    await expect(page.getByText('Your partner asked for a project update')).toBeVisible();
  });

  test('pain section content includes "contractor" text', async ({ page }) => {
    await expect(page.getByTestId('pain-section-0')).toContainText('contractor');
  });

  test('pain section content includes "budget" text', async ({ page }) => {
    await expect(page.getByTestId('pain-section-1')).toContainText('budget');
  });

  test('pain section content includes "flip" or "overruns" text', async ({ page }) => {
    const text = await page.getByTestId('pain-section-2').textContent();
    const hasFlipContent = text?.includes('flip') || text?.includes('overruns');
    expect(hasFlipContent).toBe(true);
  });

  test('AI integration section is visible with "AI" in heading text', async ({ page }) => {
    const aiSection = page.getByTestId('ai-section');
    await expect(aiSection).toBeVisible();
    await expect(aiSection.getByRole('heading', { name: 'Your AI Tools, Your Data' })).toBeVisible();
  });
});

test.describe('Why Fierro - WHY-02: Builder voice', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/why-fierro');
  });

  test('page does NOT contain marketing jargon', async ({ page }) => {
    const body = await page.locator('body').textContent();
    const jargonWords = ['synergy', 'leverage', 'paradigm', 'ecosystem'];
    for (const word of jargonWords) {
      expect(body?.toLowerCase()).not.toContain(word);
    }
  });

  test('page contains second-person language', async ({ page }) => {
    const body = await page.locator('body').textContent();
    const hasSecondPerson = body?.includes('your') || body?.includes('you');
    expect(hasSecondPerson).toBe(true);
  });
});

test.describe('Why Fierro - WHY-03: Quantified ROI claims', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/why-fierro');
  });

  test('page contains "overruns" text', async ({ page }) => {
    await expect(page.locator('body')).toContainText('overruns');
  });

  test('page contains "real time" text', async ({ page }) => {
    await expect(page.locator('body')).toContainText('real time');
  });
});

test.describe('Why Fierro - WHY-04: Closing CTA', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/why-fierro');
  });

  test('page has a CTA link pointing to signup', async ({ page }) => {
    const cta = page.getByTestId('closing-cta');
    await expect(cta.locator('a[href="https://app.getfierro.com/signup"]')).toBeVisible();
  });

  test('CTA section contains "Start Free" text', async ({ page }) => {
    const cta = page.getByTestId('closing-cta');
    await expect(cta.locator('a', { hasText: 'Start Free' })).toBeVisible();
  });
});
