import { test, expect } from '@playwright/test';

test('page loads with hero and nav', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/PossessionPro/);
  await expect(page.getByText('Reclaim your', { exact: false })).toBeVisible();
  await expect(page.locator('header.nav')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Calculate my penalty →' })).toBeVisible();
});

test('calculator updates interest live when amount changes', async ({ page }) => {
  await page.goto('/');
  page.on('dialog', (d) => d.accept());
  const trancheAmount = page.locator('.tranche-row input[type="number"]').first();
  await trancheAmount.fill('1000000');
  const interest = page.locator('.result-hero .big');
  await expect(interest).not.toHaveText('₹0');
});

test('strategy and mode toggles update the result', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[type="date"]').nth(1).fill('2024-06-30');

  const simple = '₹9,76,500';
  await expect(page.locator('.result-hero .big')).toHaveText(simple);

  await page.getByRole('button', { name: 'Monthly compounding' }).click();
  await expect(page.locator('.result-hero .big')).not.toHaveText(simple);

  await page.getByRole('button', { name: /Exit · Full refund/ }).click();
  await expect(page.getByText('Total refund + interest')).toBeVisible();
});

test('MCLR ledger loads a rate into the calculator and scrolls', async ({ page }) => {
  await page.goto('/');
  const row = page.locator('#mclr tbody tr', { hasText: '7.25%' }).first();
  await row.click();
  const mclrInput = page.locator('input[type="number"]').nth(1);
  await expect(mclrInput).toHaveValue('7.25');
});

test('theme toggle switches data-theme on <html>', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByTitle('Toggle theme').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('adds and removes payment milestones', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tranche-row')).toHaveCount(1);
  await page.getByRole('button', { name: /Add payment milestone/ }).click();
  await expect(page.locator('.tranche-row')).toHaveCount(2);
  await page.getByTitle('Remove').nth(1).click();
  await expect(page.locator('.tranche-row')).toHaveCount(1);
});

test('generates a Form M PDF download', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('e.g. Ramesh Kumar Sharma').fill('Test User');
  await page.getByPlaceholder('Flat / house, city, PIN').fill('Test Address');
  await page.getByPlaceholder('e.g. ABC Developers Pvt. Ltd.').fill('Test Builders');
  await page.getByPlaceholder('e.g. Green Meadows, PRM/KA/RERA/...').fill('Test Project');
  await page.getByPlaceholder('e.g. Tower B, Flat 1204').fill('Flat 1204');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Generate Form 'M' PDF/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/Form-M-RERA-Complaint\.pdf$/);
});