import { test, expect } from '@playwright/test';
import { createProviderAccount } from './support/api';

test('SYS-01 provider signs in through the login page', async ({ page, request }) => {
  // Arrange
  const account = await createProviderAccount(request);

  // Act
  await page.goto('/iam/login');
  await page.getByLabel('email input field').fill(account.email);
  await page.getByLabel('password input field').fill(account.password);
  await page.getByLabel('login button').click();

  // Assert
  await expect(page).toHaveURL(/\/provider\/homeProvider/);
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('providerId')))
    .toBe(String(account.providerId));
});
