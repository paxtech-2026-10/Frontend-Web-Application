import { test, expect } from '@playwright/test';
import {
  createProviderAccount,
  createProviderProfile,
  createClientAccount
} from './support/api';
import { authenticateClientInBrowser } from './support/auth';

test('SYS-07 client navigates to salon detail from the client dashboard', async ({ page, request }) => {
  // Arrange
  const provider = await createProviderAccount(request);
  const salon = await createProviderProfile(request, provider);
  const client = await createClientAccount(request);
  await authenticateClientInBrowser(page, client);

  // Act
  await page.goto('/client/homeClient');

  // The salon list fetches GET /provider-profiles — wait for our specific card to appear
  const salonCard = page.locator('[aria-label="salon-card"]').filter({ hasText: salon.companyName });
  await expect(salonCard).toBeVisible({ timeout: 10000 });

  // The book button is inside <mat-card-actions aria-label="salon-button">
  await salonCard.locator('[aria-label="salon-button"] button').click();

  // Assert
  await expect(page).toHaveURL(new RegExp(`/client/homeClient/salon/${salon.id}`));
});
