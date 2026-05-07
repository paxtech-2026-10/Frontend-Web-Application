import { test, expect } from '@playwright/test';

test('SYS-05 client registers through the register page', async ({ page }) => {
  // Arrange — unique credentials so this test never conflicts with previous runs
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const email = `client.e2e.reg.${suffix}@utime.test`;
  const password = 'Password123!';

  // Act
  await page.goto('/iam/register');
  // The toggle defaults to Client (isProvider = false), so the client form is shown immediately
  await page.getByLabel('register name input').fill('Test');
  await page.getByLabel('register lastname input').fill('Client');
  await page.getByLabel('register email input').fill(email);
  await page.getByLabel('register password input').fill(password);
  await page.getByLabel('register create button').click();

  // Assert
  // The component shows a snackbar on success then navigates to /iam/login after 1 500 ms
  await expect(page.getByText('Account created successfully!')).toBeVisible();
  await expect(page).toHaveURL(/\/iam\/login/, { timeout: 5000 });
});
