import { test, expect } from '@playwright/test';
import {
  createClientAccount,
  createProviderAccount,
  createProviderProfile,
  updateProviderProfileLocation
} from './support/api';
import { authenticateClientInBrowser } from './support/auth';

test('SYS-09 provider registers with address and client sees salons ordered by distance', async ({ page, request, context }) => {
  // Arrange
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const nearCompanyName = `E2E Near Salon ${suffix}`;
  const farCompanyName = `E2E Far Salon ${suffix}`;
  const password = 'Password123!';
  const nearEmail = `provider.e2e.near.${suffix}@utime.test`;
  const nearAddress = 'Av. Larco 123, Miraflores, Lima';
  const nearLocation = `${nearAddress}|-12.121100,-77.030600`;
  const farLocation = 'Cusco Centro|-13.531950,-71.967463';

  await context.grantPermissions(['geolocation'], { origin: 'http://localhost:4200' });
  await context.setGeolocation({ latitude: -12.121100, longitude: -77.030600 });

  // Act: register a provider from the web UI and persist the address in the profile.
  await page.route('https://nominatim.openstreetmap.org/search?**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{ lat: '-12.121100', lon: '-77.030600' }])
    });
  });

  await page.goto('/iam/register');
  await page.locator('mat-button-toggle').filter({ hasText: 'Provider' }).click();

  const updateProviderProfileResponse = page.waitForResponse(response =>
    response.url().includes('/api/v1/provider-profiles/')
    && response.request().method() === 'PUT'
  );

  await page.getByLabel('register provider company input').fill(nearCompanyName);
  await page.getByLabel('register provider address input').fill(nearAddress);
  await page.getByLabel('register provider email input').fill(nearEmail);
  await page.getByLabel('register provider password input').fill(password);
  await page.getByLabel('register provider create button').click();

  const profileResponse = await updateProviderProfileResponse;
  expect(profileResponse.status()).toBe(200);
  const registeredProfile = await profileResponse.json() as { location: string };
  expect(registeredProfile.location).toBe(nearLocation);

  await expect(page.getByText('Account created successfully!')).toBeVisible();
  await expect(page).toHaveURL(/\/iam\/login/, { timeout: 5000 });

  // Arrange another controlled salon far away, then browse as a client.
  const farProvider = await createProviderAccount(request);
  const farProfile = await createProviderProfile(request, farProvider);
  await updateProviderProfileLocation(request, {
    ...farProfile,
    companyName: farCompanyName
  }, farLocation);

  const client = await createClientAccount(request);
  await authenticateClientInBrowser(page, client);

  // Assert: the client salon list uses browser geolocation to place the nearby salon first.
  await page.goto('/client/homeClient');

  const nearCard = page.locator('[aria-label="salon-card"]').filter({ hasText: nearCompanyName });
  const farCard = page.locator('[aria-label="salon-card"]').filter({ hasText: farCompanyName });

  await expect(nearCard).toBeVisible({ timeout: 10000 });
  await expect(farCard).toBeVisible({ timeout: 10000 });
  await expect(nearCard.locator('[aria-label="salon-location"]')).toContainText(nearAddress);
  await expect(nearCard.locator('[aria-label="salon-distance"]')).toContainText('< 100 m');
  await expect(farCard.locator('[aria-label="salon-distance"]')).toContainText(/km/);

  const indexes = await page.locator('[aria-label="salon-card"]').evaluateAll((cards, names) => {
    const [nearName, farName] = names as string[];
    return {
      near: cards.findIndex(card => card.textContent?.includes(nearName)),
      far: cards.findIndex(card => card.textContent?.includes(farName))
    };
  }, [nearCompanyName, farCompanyName]);

  expect(indexes.near).toBeGreaterThanOrEqual(0);
  expect(indexes.far).toBeGreaterThanOrEqual(0);
  expect(indexes.near).toBeLessThan(indexes.far);
});
