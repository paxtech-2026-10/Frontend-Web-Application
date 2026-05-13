import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { createProviderAccount } from '../../e2e/support/api';
import { UTimeWorld } from '../support/world';

Given('que un visitante navega al formulario de registro de uTime', async function (this: UTimeWorld) {
  await this.page.goto(`${this.baseUrl}/iam/register`);
});

When(
  'completa el registro como cliente con nombre {string}, apellido {string}, correo y contraseña válidos',
  async function (this: UTimeWorld, firstName: string, lastName: string) {
    const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    this.pendingClient = {
      firstName,
      lastName,
      email: `client.bdd.${suffix}@utime.test`,
      password: 'Password123!'
    };

    // The toggle defaults to Client (isProvider = false), so the client form is shown immediately.
    await this.page.getByLabel('register name input').fill(this.pendingClient.firstName);
    await this.page.getByLabel('register lastname input').fill(this.pendingClient.lastName);
    await this.page.getByLabel('register email input').fill(this.pendingClient.email);
    await this.page.getByLabel('register password input').fill(this.pendingClient.password);
    await this.page.getByLabel('register create button').click();
  }
);

Then('el sistema confirma la creación de la cuenta con un snackbar de éxito', async function (this: UTimeWorld) {
  await expect(this.page.getByText('Account created successfully!')).toBeVisible();
});

Then('la aplicación lo redirige a la página de inicio de sesión', async function (this: UTimeWorld) {
  await expect(this.page).toHaveURL(/\/iam\/login/, { timeout: 5000 });
});

Given('que existe un proveedor previamente registrado en el sistema', async function (this: UTimeWorld) {
  this.providerAccount = await createProviderAccount(this.apiRequest);
});

Given('el proveedor navega a la página de inicio de sesión', async function (this: UTimeWorld) {
  await this.page.goto(`${this.baseUrl}/iam/login`);
});

When('ingresa su correo y contraseña y envía el formulario', async function (this: UTimeWorld) {
  if (!this.providerAccount) {
    throw new Error('Provider account must exist before signing in');
  }
  await this.page.getByLabel('email input field').fill(this.providerAccount.email);
  await this.page.getByLabel('password input field').fill(this.providerAccount.password);
  await this.page.getByLabel('login button').click();
});

Then('el sistema lo redirige al dashboard del proveedor', async function (this: UTimeWorld) {
  await expect(this.page).toHaveURL(/\/provider\/homeProvider/, { timeout: 10000 });
});

Then('persiste el identificador del proveedor en el almacenamiento local', async function (this: UTimeWorld) {
  if (!this.providerAccount) {
    throw new Error('Provider account is required to verify localStorage');
  }
  await expect
    .poll(() => this.page.evaluate(() => window.localStorage.getItem('providerId')))
    .toBe(String(this.providerAccount.providerId));
  this.signedInProviderId = await this.page.evaluate(() =>
    window.localStorage.getItem('providerId')
  );
});
