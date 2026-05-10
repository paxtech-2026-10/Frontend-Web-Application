import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { UTimeWorld } from '../support/world';

const ORIGIN = 'http://localhost:4200';

Given(
  'la geolocalización del navegador apunta a {string}',
  async function (this: UTimeWorld, coordinates: string) {
    const [latitude, longitude] = coordinates.split(',').map(value => Number(value.trim()));
    await this.context.grantPermissions(['geolocation'], { origin: ORIGIN });
    await this.context.setGeolocation({ latitude, longitude });
  }
);

Given(
  'la dirección {string} se resuelve a coordenadas conocidas',
  async function (this: UTimeWorld, address: string) {
    // Stub Nominatim so the registration flow is independent of the public OSM endpoint.
    await this.page.route('https://nominatim.openstreetmap.org/search?**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ lat: '-12.121100', lon: '-77.030600' }])
      });
    });
    this.expectedProviderLocation = `${address}|-12.121100,-77.030600`;
  }
);

When(
  'completa el registro como proveedor con la empresa {string} y la dirección anterior',
  async function (this: UTimeWorld, companyName: string) {
    if (!this.expectedProviderLocation) {
      throw new Error('La dirección esperada debe configurarse antes de registrar al proveedor');
    }
    const address = this.expectedProviderLocation.split('|')[0];
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    this.pendingProviderRegistration = {
      companyName: `${companyName} ${suffix}`,
      address,
      email: `provider.bdd.${suffix}@utime.test`,
      password: 'Password123!'
    };

    await this.page.locator('mat-button-toggle').filter({ hasText: 'Provider' }).click();

    const updateProviderProfileResponse = this.page.waitForResponse(response =>
      response.url().includes('/api/v1/provider-profiles/')
      && response.request().method() === 'PUT'
    );

    await this.page.getByLabel('register provider company input').fill(this.pendingProviderRegistration.companyName);
    await this.page.getByLabel('register provider address input').fill(this.pendingProviderRegistration.address);
    await this.page.getByLabel('register provider email input').fill(this.pendingProviderRegistration.email);
    await this.page.getByLabel('register provider password input').fill(this.pendingProviderRegistration.password);
    await this.page.getByLabel('register provider create button').click();

    const profileResponse = await updateProviderProfileResponse;
    this.providerProfileUpdateStatus = profileResponse.status();
    const body = (await profileResponse.json()) as { location: string };
    this.providerProfileUpdateLocation = body.location;
  }
);

Then('el backend confirma la actualización del perfil con HTTP 200', function (this: UTimeWorld) {
  expect(this.providerProfileUpdateStatus).toBe(200);
});

Then(
  'la ubicación persistida del perfil contiene la dirección y las coordenadas registradas',
  function (this: UTimeWorld) {
    expect(this.providerProfileUpdateLocation).toBe(this.expectedProviderLocation);
  }
);
