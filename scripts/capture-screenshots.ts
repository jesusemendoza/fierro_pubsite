/**
 * Playwright script to capture desktop marketing screenshots for Fierro.
 *
 * Usage:
 *   npx playwright test scripts/capture-screenshots.ts --project=chromium
 *
 * Or run directly:
 *   npx playwright test scripts/capture-screenshots.ts
 */
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import path from 'path';

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

  // Fill email & password
  const emailInput = page.getByLabel(/email/i).or(page.locator('input[type="email"]')).first();
  await emailInput.fill(email);

  const passwordInput = page.getByLabel(/password/i).or(page.locator('input[type="password"]')).first();
  await passwordInput.fill(PASSWORD);

  // Submit
  const submitBtn = page.getByRole('button', { name: /sign in|log in|submit/i }).first();
  await submitBtn.click();

  // Wait for navigation away from /login
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
  await page.waitForLoadState('networkidle');
}

/** Navigate to a project page and wait for data to load. */
async function goToProjectPage(page: Page, orgId: number, projectId: number, subpath: string) {
  await page.goto(`${APP_URL}/org/${orgId}/project/${projectId}/${subpath}`);
  await page.waitForLoadState('networkidle');
  // Give charts/animations a moment to render
  await page.waitForTimeout(1500);
}

/** Navigate to org-level page. */
async function goToOrgPage(page: Page, orgId: number) {
  await page.goto(`${APP_URL}/org/${orgId}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);
}

/** Take a screenshot with the exact 1440×900 viewport (no full page). */
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

/** Force light mode if the app supports it (prefers-color-scheme). */
async function forceLightMode(context: BrowserContext) {
  // Playwright's colorScheme is set at context level — already handled in test.use below
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

    // Click the first expense row to open its detail
    const expenseRow = page
      .getByRole('row')
      .or(page.locator('table tbody tr'))
      .or(page.locator('[data-testid="expense-row"]'))
      .or(page.locator('a[href*="/expenses/"]'))
      .first();

    // Try clicking a link inside the expenses list
    const expenseLink = page.locator('a[href*="/expenses/"]').first();
    const hasLink = await expenseLink.isVisible().catch(() => false);

    if (hasLink) {
      await expenseLink.click();
    } else {
      // Fallback: click first table row
      await page.locator('table tbody tr').first().click();
    }

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await screenshotViewport(page, 'homeowner-expense-detail.png');
  });

  test('4. homeowner-approvals', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'expenses');

    // Look for an approvals tab/filter, or pending filter
    const approvalsTab = page.getByRole('tab', { name: /approv|pending/i })
      .or(page.getByRole('button', { name: /approv|pending/i }))
      .or(page.getByText(/pending approval/i))
      .first();

    const hasTab = await approvalsTab.isVisible().catch(() => false);
    if (hasTab) {
      await approvalsTab.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
    }
    // If no explicit tab, the expenses page with pending items is the shot
    await screenshotFullPage(page, 'homeowner-approvals.png');
  });

  test('5. homeowner-audit', async ({ page }) => {
    // Try analytics page first (might contain audit log)
    await goToProjectPage(page, orgId, projectId, 'analytics');

    // Check if there's an audit/activity section; if not, the analytics page itself is the shot
    const auditSection = page.getByText(/audit|activity|timeline/i).first();
    const hasAudit = await auditSection.isVisible().catch(() => false);

    if (!hasAudit) {
      // Try going back to dashboard and looking for activity feed
      await goToProjectPage(page, orgId, projectId, 'dashboard');
    }

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
    // Org-level view shows multi-project portfolio
    await goToOrgPage(page, orgId);
    await screenshotViewport(page, 'flipper-portfolio.png');
  });

  test('8. flipper-project-detail', async ({ page }) => {
    // Elm St project — mid-renovation
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
    await goToProjectPage(page, orgId, projectId, 'dashboard');
    await screenshotViewport(page, 'contractor-dashboard.png');
  });

  test('10. contractor-add-expense', async ({ page }) => {
    await goToProjectPage(page, orgId, projectId, 'expenses');

    // Click "Add Expense" button
    const addBtn = page.getByRole('button', { name: /add expense|new expense|create/i })
      .or(page.getByRole('link', { name: /add expense|new expense/i }))
      .first();
    await addBtn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Fill a couple of fields but don't submit — capture form mid-entry
    const titleInput = page.getByLabel(/title|description|name/i)
      .or(page.locator('input[name="title"]'))
      .or(page.locator('input[placeholder*="title" i]'))
      .or(page.locator('input[placeholder*="description" i]'))
      .first();
    const hasTitleInput = await titleInput.isVisible().catch(() => false);
    if (hasTitleInput) {
      await titleInput.fill('Bathroom vanity – Kohler Brockway');
    }

    const amountInput = page.getByLabel(/amount/i)
      .or(page.locator('input[name="amount"]'))
      .or(page.locator('input[type="number"]'))
      .first();
    const hasAmountInput = await amountInput.isVisible().catch(() => false);
    if (hasAmountInput) {
      await amountInput.fill('485.00');
    }

    await page.waitForTimeout(500);
    await screenshotViewport(page, 'contractor-add-expense.png');
  });
});
