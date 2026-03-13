/**
 * Standalone Playwright script to capture desktop marketing screenshots.
 *
 * Usage:
 *   npx tsx scripts/capture-screenshots.ts
 *   npm run screenshots
 */
import { chromium, type Page } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APP_URL = 'https://app.getfierro.com';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/assets/screenshots/desktop');
const PASSWORD = 'DemoFierro2026!';
const VIEWPORT = { width: 1440, height: 900 };

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

async function goToProjectPage(page: Page, orgId: number, projectId: number, subpath: string) {
  await page.goto(`${APP_URL}/org/${orgId}/project/${projectId}/${subpath}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
}

async function goToOrgPage(page: Page, orgId: number) {
  await page.goto(`${APP_URL}/org/${orgId}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2500);
}

async function screenshotViewport(page: Page, filename: string) {
  await page.screenshot({ path: path.join(OUTPUT_DIR, filename), type: 'png' });
  console.log(`  ✓ ${filename}`);
}

async function screenshotFullPage(page: Page, filename: string) {
  await page.screenshot({ path: path.join(OUTPUT_DIR, filename), fullPage: true, type: 'png' });
  console.log(`  ✓ ${filename} (full-page)`);
}

// ---------------------------------------------------------------------------
// Screenshot sessions
// ---------------------------------------------------------------------------

async function captureHomeowner(page: Page) {
  const { email, orgId, projectId } = ACCOUNTS.homeowner;
  console.log('\nSession 1 — Sarah Chen (homeowner)');
  await login(page, email);

  // 1. Dashboard
  await goToProjectPage(page, orgId, projectId, 'dashboard');
  await screenshotViewport(page, 'homeowner-dashboard.png');

  // 2. Expenses list
  await goToProjectPage(page, orgId, projectId, 'expenses');
  await screenshotFullPage(page, 'homeowner-expenses.png');

  // 3. Expense detail — try clicking into a row
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
    await page.waitForURL(/\/expenses\/\d+/, { timeout: 10_000 }).catch(() => {});
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  } else {
    console.log('  ⚠ No clickable expense row found — screenshotting list view');
    await page.waitForTimeout(1000);
  }
  await screenshotViewport(page, 'homeowner-expense-detail.png');

  // 4. Approvals — try status filter
  await goToProjectPage(page, orgId, projectId, 'expenses');
  const statusTrigger = page.getByRole('combobox').first();
  const hasCombobox = await statusTrigger.isVisible({ timeout: 3_000 }).catch(() => false);
  if (hasCombobox) {
    await statusTrigger.click();
    await page.waitForTimeout(300);
    const pendingOption = page.getByRole('option', { name: /pending/i });
    if (await pendingOption.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await pendingOption.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
    }
  } else {
    const pendingBtn = page.getByRole('button', { name: /pending/i })
      .or(page.getByRole('tab', { name: /pending/i }))
      .first();
    if (await pendingBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await pendingBtn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1500);
    } else {
      console.log('  ⚠ No status filter found — screenshotting expenses view as-is');
      await page.waitForTimeout(1000);
    }
  }
  await screenshotFullPage(page, 'homeowner-approvals.png');

  // 5. Audit / analytics
  await goToProjectPage(page, orgId, projectId, 'analytics');
  await screenshotFullPage(page, 'homeowner-audit.png');

  // 6. Team
  await goToProjectPage(page, orgId, projectId, 'team');
  await screenshotViewport(page, 'homeowner-team.png');
}

async function captureFlipper(page: Page) {
  const { email, orgId, projects } = ACCOUNTS.flipper;
  console.log('\nSession 2 — Marcus Rivera (flipper)');
  await login(page, email);

  // 7. Portfolio
  await goToOrgPage(page, orgId);
  await screenshotViewport(page, 'flipper-portfolio.png');

  // 8. Project detail
  await goToProjectPage(page, orgId, projects.elm, 'dashboard');
  await screenshotViewport(page, 'flipper-project-detail.png');
}

async function captureContractor(page: Page) {
  const { email, orgId, projectId } = ACCOUNTS.contractor;
  console.log('\nSession 3 — Tony Mendez (contractor)');
  await login(page, email);

  // 9. Contractor dashboard (expenses view)
  await goToProjectPage(page, orgId, projectId, 'expenses');
  await screenshotViewport(page, 'contractor-dashboard.png');

  // 10. Add expense form
  const addBtn = page.getByRole('button', { name: /add expense|new expense/i })
    .or(page.getByRole('link', { name: /add expense|new expense/i }))
    .first();
  await addBtn.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  const titleInput = page.getByLabel('Title');
  if (await titleInput.isVisible().catch(() => false)) {
    await titleInput.fill('Bathroom vanity – Kohler Brockway');
  }
  const descInput = page.getByLabel('Description');
  if (await descInput.isVisible().catch(() => false)) {
    await descInput.fill('36" single-sink vanity for master bath');
  }
  const amountInput = page.getByLabel('Amount');
  if (await amountInput.isVisible().catch(() => false)) {
    await amountInput.fill('485.00');
  }

  await page.waitForTimeout(500);
  await screenshotViewport(page, 'contractor-add-expense.png');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Capturing screenshots to ${OUTPUT_DIR}`);

  const browser = await chromium.launch();

  for (const sessionFn of [captureHomeowner, captureFlipper, captureContractor]) {
    const context = await browser.newContext({
      viewport: VIEWPORT,
      colorScheme: 'light',
    });
    const page = await context.newPage();
    try {
      await sessionFn(page);
    } catch (err) {
      console.error(`  ✗ Session failed:`, err);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
