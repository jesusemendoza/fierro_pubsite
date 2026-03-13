/**
 * Playwright script to capture desktop marketing screenshots for Fierro.
 *
 * Usage:
 *   npx playwright test tests/capture-screenshots.spec.ts --project=chromium
 */
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_URL = 'https://app.getfierro.com';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/assets/screenshots/desktop');
const PASSWORD = 'DemoFierro2026!';

// Viewport: 1440×900 as specified in SCREENSHOT-HANDOFF.md
const VIEWPORT = { width: 1440, height: 900 };

// Demo account credentials & route info
const ACCOUNTS = {
  homeowner: {
    email: 'demo+homeowner@getfierro.com',
    orgId: 100,
    projectId: 200,
  },
  flipper: {
    email: 'demo+flipper@getfierro.com',
    orgId: 101,
    projects: { elm: 300, oak: 301, pine: 302 },
  },
  contractor: {
    email: 'demo+homeowner+contractor1@getfierro.com',
    orgId: 100,
    projectId: 200,
  },
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Log in via the app's /login page and wait for redirect. */
async function login(page: Page, email: string) {
  await page.goto(`${APP_URL}/login`);
  await page.waitForLoadState('networkidle');

  const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]')).first();
  await emailInput.fill(email);

  const passwordInput = page.getByLabel(/password/i).or(page.locator('input[type="password"]')).first();
  await passwordInput.fill(PASSWORD);

  const submitBtn = page.getByRole('button', { name: /sign in|log in|submit/i }).first();
  await submitBtn.click();

  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
  await page.waitForLoadState('networkidle');
}

/** Navigate to a project page and wait for data to load. */
async function goToProjectPage(page: Page, orgId: number, projectId: number, subpath: string) {
  await page.goto(`${APP_URL}/org/${orgId}/project/${projectId}/${subpath}`);
  await page.waitForLoadState('networkidle');
  // Wait for skeleton loaders to disappear and real content to render
  await page.waitForTimeout(2500);
}

/** Navigate to org-level page. */
async function goToOrgPage(page: Page, orgId: number) {
  await page.goto(`${APP_URL}/org/${orgId}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
}

/** Take a viewport-sized screenshot (1440×900). */
async function screenshotViewport(page: Page, filename: string) {
  await page.screenshot({
    path: path.join(OUTPUT_DIR, filename),
    type: 'png',
  });
  console.log(`  ✓ ${filename}`);
}

/** Take a full-page screenshot (for list views). */
async function screenshotFullPage(page: Page, filename: string) {
  await page.screenshot({
    path: path.join(OUTPUT_DIR, filename),
    fullPage: true,
    type: 'png',
  });
  console.log(`  ✓ ${filename} (full-page)`);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.use({
  viewport: VIEWPORT,
  colorScheme: 'light',
});

test.describe('Session 1 — Sarah Chen (homeowner)', () => {
  const { email, orgId, projectId } = ACCOUNTS.homeowner;

  test.beforeEach(async ({ page }) => {
    await login(page, email);
  });

  test('1. homeowner-dashboard', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'dashboard');
    await screenshotViewport(page, 'homeowner-dashboard.png');
  });

  test('2. homeowner-expenses', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'expenses');
    await screenshotFullPage(page, 'homeowner-expenses.png');
  });

  test('3. homeowner-expense-detail', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'expenses');

    // Try multiple selectors — the app's table markup may vary
    const rowSelectors = [
      'table tbody tr.cursor-pointer',
      'table tbody tr[data-clickable]',
      'table tbody tr:has(td)',
      '[role="row"][data-clickable]',
    ];

    let clicked = false;
    for (const sel of rowSelectors) {
      const row = page.locator(sel).first();
      if (await row.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await row.click();
        clicked = true;
        break;
      }
    }

    if (clicked) {
      // Wait for navigation to /expenses/{id} detail page
      await page.waitForURL(/\/expenses\/\d+/, { timeout: 10_000 }).catch(() => {});
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
    } else {
      // Fallback: screenshot the expenses list if no clickable row found
      console.log('  ⚠ No clickable expense row found — screenshotting list view');
      await page.waitForTimeout(1000);
    }

    await screenshotViewport(page, 'homeowner-expense-detail.png');
  });

  test('4. homeowner-approvals', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'expenses');

    // Try to find a status filter — could be a combobox, select, or button group
    const statusTrigger = page.getByRole('combobox').first();
    const hasCombobox = await statusTrigger.isVisible({ timeout: 3_000 }).catch(() => false);

    if (hasCombobox) {
      await statusTrigger.click();
      await page.waitForTimeout(300);

      const pendingOption = page.getByRole('option', { name: /pending/i });
      const hasPending = await pendingOption.isVisible({ timeout: 2_000 }).catch(() => false);
      if (hasPending) {
        await pendingOption.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
      }
    } else {
      // Fallback: try clicking a "Pending" tab/button if the filter is a different component
      const pendingBtn = page.getByRole('button', { name: /pending/i })
        .or(page.getByRole('tab', { name: /pending/i }))
        .first();
      const hasPendingBtn = await pendingBtn.isVisible({ timeout: 2_000 }).catch(() => false);
      if (hasPendingBtn) {
        await pendingBtn.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);
      } else {
        console.log('  ⚠ No status filter found — screenshotting expenses view as-is');
        await page.waitForTimeout(1000);
      }
    }

    await screenshotFullPage(page, 'homeowner-approvals.png');
  });

  test('5. homeowner-audit', async ({ page }) => {
    // Go directly to the analytics page — this is the audit/timeline view
    await goToProjectPage(page, orgId, projectId, 'analytics');
    await screenshotFullPage(page, 'homeowner-audit.png');
  });

  test('6. homeowner-team', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'team');
    await screenshotViewport(page, 'homeowner-team.png');
  });
});

test.describe('Session 2 — Marcus Rivera (flipper)', () => {
  const { email, orgId, projects } = ACCOUNTS.flipper;

  test.beforeEach(async ({ page }) => {
    await login(page, email);
  });

  test('7. flipper-portfolio', async ({ page }) => {
    await goToOrgPage(page, orgId);
    await screenshotViewport(page, 'flipper-portfolio.png');
  });

  test('8. flipper-project-detail', async ({ page }) => {
    await goToProjectPage(page, orgId, projects.elm, 'dashboard');
    await screenshotViewport(page, 'flipper-project-detail.png');
  });
});

test.describe('Session 3 — Tony Mendez (contractor)', () => {
  const { email, orgId, projectId } = ACCOUNTS.contractor;

  test.beforeEach(async ({ page }) => {
    await login(page, email);
  });

  test('9. contractor-dashboard', async ({ page }) => {
    // Contractors don't have dashboard access — show their expenses view instead
    // (this IS their scoped view of the project)
    await goToProjectPage(page, orgId, projectId, 'expenses');
    await screenshotViewport(page, 'contractor-dashboard.png');
  });

  test('10. contractor-add-expense', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'expenses');

    // Click "New Expense" button
    const addBtn = page.getByRole('button', { name: /add expense|new expense/i })
      .or(page.getByRole('link', { name: /add expense|new expense/i }))
      .first();
    await addBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Fill specific fields using exact labels from the form
    // Title field
    const titleInput = page.getByLabel('Title');
    const hasTitleInput = await titleInput.isVisible().catch(() => false);
    if (hasTitleInput) {
      await titleInput.fill('Bathroom vanity – Kohler Brockway');
    }

    // Description field
    const descInput = page.getByLabel('Description');
    const hasDescInput = await descInput.isVisible().catch(() => false);
    if (hasDescInput) {
      await descInput.fill('36" single-sink vanity for master bath');
    }

    // Amount field
    const amountInput = page.getByLabel('Amount');
    const hasAmountInput = await amountInput.isVisible().catch(() => false);
    if (hasAmountInput) {
      await amountInput.fill('485.00');
    }

    await page.waitForTimeout(500);
    await screenshotViewport(page, 'contractor-add-expense.png');
  });
});
