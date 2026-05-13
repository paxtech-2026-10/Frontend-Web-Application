import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { createProviderAccount, createServiceForProvider } from '../../e2e/support/api';
import { authenticateProviderInBrowser } from '../../e2e/support/auth';
import { UTimeWorld } from '../support/world';

Given('que el administrador proveedor está autenticado', async function (this: UTimeWorld) {
  this.providerAccount = await createProviderAccount(this.apiRequest);
  await authenticateProviderInBrowser(this.page, this.providerAccount);
});

Given('se encuentra en la página de servicios', async function (this: UTimeWorld) {
  await this.page.goto(`${this.baseUrl}/provider/services`);
  await expect(this.page.getByRole('heading', { name: 'Services' })).toBeVisible();
});

When(
  'completa los datos necesarios para registrar un servicio llamado {string} con duración {int} y precio {int}',
  async function (this: UTimeWorld, serviceName: string, duration: number, price: number) {
    this.registeredServiceName = `${serviceName} ${Date.now()}`;

    await this.page.getByLabel(/Create first service|Add new service/i).click();

    const dialog = this.page.getByRole('dialog', { name: 'New Service' });
    await expect(dialog).toBeVisible();

    const createServiceResponse = this.page.waitForResponse(response =>
      new URL(response.url()).pathname === '/api/v1/services'
      && response.request().method() === 'POST'
    );

    await dialog.getByRole('textbox', { name: 'Service name' }).fill(this.registeredServiceName);
    await dialog.getByRole('spinbutton', { name: 'Duration in minutes' }).fill(String(duration));
    await dialog.getByRole('spinbutton', { name: 'Price' }).fill(String(price));
    await dialog.getByRole('button', { name: 'Create service' }).click();

    this.serviceCreationStatus = (await createServiceResponse).status();
  }
);

Then('el sistema guarda el nuevo servicio', async function (this: UTimeWorld) {
  expect(this.serviceCreationStatus).toBe(201);
});

Then('el servicio registrado aparece en el catálogo de servicios', async function (this: UTimeWorld) {
  await expect(this.page.getByText(this.registeredServiceName!)).toBeVisible();
});

Given(
  'tiene un servicio registrado llamado {string} en el catálogo',
  async function (this: UTimeWorld, serviceName: string) {
    if (!this.providerAccount) {
      throw new Error('Provider account must exist before creating a service');
    }

    this.registeredServiceName = `${serviceName} ${Date.now()}`;
    await createServiceForProvider(this.apiRequest, this.providerAccount, {
      name: this.registeredServiceName,
      duration: 45,
      price: 80
    });
  }
);

When('elimina el servicio registrado del catálogo', async function (this: UTimeWorld) {
  await expect(this.page.getByText(this.registeredServiceName!)).toBeVisible();
  await this.page.evaluate(() => { window.confirm = () => true; });
  this.page.on('dialog', dialog => dialog.accept());

  const serviceRow = this.page.getByRole('row').filter({ hasText: this.registeredServiceName });
  const deleteResponsePromise = this.page.waitForResponse(response =>
    response.url().includes('/api/v1/services/')
    && response.request().method() === 'DELETE'
  );

  await serviceRow.getByRole('button').nth(1).click();
  this.serviceDeletionStatus = (await deleteResponsePromise).status();
});

Then('el sistema retira el servicio del catálogo', async function (this: UTimeWorld) {
  expect(this.serviceDeletionStatus).toBe(200);
});

Then('el servicio eliminado ya no aparece en la página de servicios', async function (this: UTimeWorld) {
  await this.page.reload();
  await this.page.waitForLoadState('networkidle');
  await expect(this.page.getByText(this.registeredServiceName!)).not.toBeVisible();
});
