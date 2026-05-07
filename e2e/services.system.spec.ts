import { test, expect } from '@playwright/test';
import { createProviderAccount, createServiceForProvider } from './support/api';
import { authenticateProviderInBrowser } from './support/auth';

test('SYS-02 provider creates a service from the services page', async ({ page, request }) => {
  // Arrange
  const account = await createProviderAccount(request);
  await authenticateProviderInBrowser(page, account);
  const serviceName = `Corte E2E ${Date.now()}`;

  // Act
  await page.goto('/provider/services');
  await page.getByLabel(/Create first service|Add new service/i).click();
  const dialog = page.getByRole('dialog', { name: 'New Service' });
  await dialog.getByRole('textbox', { name: 'Service name' }).fill(serviceName);
  await dialog.getByRole('spinbutton', { name: 'Duration in minutes' }).fill('45');
  await dialog.getByRole('spinbutton', { name: 'Price' }).fill('80');
  await dialog.getByRole('button', { name: 'Create service' }).click();

  // Assert
  await expect(page.getByText(serviceName)).toBeVisible();
});

test('SYS-06 provider deletes a service from the services page', async ({ page, request }) => {
  // Arrange
  const provider = await createProviderAccount(request);
  const service = await createServiceForProvider(request, provider, {
    name: `Delete E2E ${Date.now()}`
  });
  await authenticateProviderInBrowser(page, provider);

  // Act
  await page.goto('/provider/services');
  await expect(page.getByText(service.name)).toBeVisible();

  // Stub window.confirm in the live page context so deleteService() returns true
  // without showing a native dialog.  page.evaluate runs after Angular has
  // bootstrapped, so the replacement is guaranteed to be in place before the click.
  await page.evaluate(() => { window.confirm = () => true; });

  const serviceRow = page.getByRole('row').filter({ hasText: service.name });

  // Accept any native dialog that may still fire (defensive fallback).
  // page.on fires synchronously while click() is blocked — no deadlock.
  page.on('dialog', (dialog) => dialog.accept());

  // waitForResponse + click() in Promise.all: both run concurrently so the
  // dialog-acceptance inside click() does not block the response listener.
  const [deleteResponse] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/v1/services/') &&
        resp.request().method() === 'DELETE',
      { timeout: 15000 }
    ),
    serviceRow.getByRole('button').nth(1).click(),
  ]);

  // Assert: DELETE reached the backend and succeeded
  expect(deleteResponse.status()).toBe(200);

  // Reload the page so Angular fetches fresh data from the API (avoids
  // depending on in-memory reactivity after deletion).
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Assert: service is no longer in the table after reload
  await expect(page.getByText(service.name)).not.toBeVisible({ timeout: 10000 });
});
