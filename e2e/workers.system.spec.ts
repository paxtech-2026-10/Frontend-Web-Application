import { test, expect } from '@playwright/test';
import { createProviderAccount } from './support/api';
import { authenticateProviderInBrowser } from './support/auth';

test('SYS-03 provider creates a staff member from the dashboard', async ({ page, request }) => {
  // Arrange
  const account = await createProviderAccount(request);
  await authenticateProviderInBrowser(page, account);
  const workerName = `Worker E2E ${Date.now()}`;
  const specialization = 'Colorist';

  // Act
  await page.goto('/provider/homeProvider');
  await page.getByLabel('Add staff member').click();

  const dialog = page.getByRole('dialog', { name: 'New Staff Member' });
  await dialog.getByRole('textbox', { name: 'Worker name' }).fill(workerName);
  await dialog.getByRole('textbox', { name: 'Worker specialization' }).fill(specialization);
  await dialog.getByRole('textbox', { name: 'Worker photo URL' }).fill('https://placehold.co/120x120?text=E2E');
  await dialog.getByRole('button', { name: 'Create staff member' }).click();

  // Assert
  await expect(page.getByText(workerName)).toBeVisible();
  await expect(page.getByText(specialization)).toBeVisible();
});
