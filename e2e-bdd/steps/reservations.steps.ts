import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import {
  createClientAccount,
  createProviderAccount,
  createProviderProfile,
  createReservation,
  createServiceForProvider,
  createTimeSlot,
  createWorkerForProvider
} from '../../e2e/support/api';
import { authenticateClientInBrowser } from '../../e2e/support/auth';
import { UTimeWorld } from '../support/world';

const STRIPE_PAYMENT_LINK_URL = 'https://checkout.stripe.com/test-payment-link';

Given('que existe un salón con un servicio, un trabajador y un slot disponible', async function (this: UTimeWorld) {
  this.providerAccount = await createProviderAccount(this.apiRequest);
  this.reservationSalon = await createProviderProfile(this.apiRequest, this.providerAccount);
  this.reservationService = await createServiceForProvider(this.apiRequest, this.providerAccount, {
    name: `Booking BDD ${Date.now()}`,
    duration: 30,
    price: 65
  });
  this.reservationWorker = await createWorkerForProvider(this.apiRequest, this.providerAccount, {
    name: `Booking Worker BDD ${Date.now()}`,
    specialization: 'Stylist'
  });
});

Given('que existe un salón con un servicio y un trabajador', async function (this: UTimeWorld) {
  this.providerAccount = await createProviderAccount(this.apiRequest);
  this.reservationSalon = await createProviderProfile(this.apiRequest, this.providerAccount);
  this.reservationService = await createServiceForProvider(this.apiRequest, this.providerAccount, {
    name: `Booking BDD ${Date.now()}`,
    duration: 30,
    price: 65
  });
  this.reservationWorker = await createWorkerForProvider(this.apiRequest, this.providerAccount, {
    name: `Booking Worker BDD ${Date.now()}`,
    specialization: 'Stylist'
  });
});

Given('un cliente autenticado navega al detalle del salón', async function (this: UTimeWorld) {
  this.reservationClient = await createClientAccount(this.apiRequest);
  await authenticateClientInBrowser(this.page, this.reservationClient);

  await this.page.route('**/api/v1/payments/create-payment-link', async route => {
    this.reservationPaymentLinkRequest = route.request().postDataJSON() as {
      paymentId: number;
      amount: number;
      currency: string;
    };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentLinkUrl: STRIPE_PAYMENT_LINK_URL })
    });
  });

  await this.page.goto(`${this.baseUrl}/client/homeClient/salon/${this.reservationSalon!.id}`);
});

Given('el único slot del trabajador ya está reservado por otro cliente', async function (this: UTimeWorld) {
  const otherClient = await createClientAccount(this.apiRequest);
  const bookedSlot = await createTimeSlot(this.apiRequest, this.providerAccount!);
  await createReservation(
    this.apiRequest,
    otherClient,
    this.providerAccount!,
    this.reservationService!,
    this.reservationWorker!,
    bookedSlot
  );
});

When('reserva el servicio con el trabajador en el slot disponible', async function (this: UTimeWorld) {
  const serviceCard = this.page.getByLabel('Service card').filter({ hasText: this.reservationService!.name });
  await expect(serviceCard).toBeVisible();
  await serviceCard.getByRole('button', { name: 'Reservar ahora' }).click();

  await expect(this.page).toHaveURL(new RegExp(`/client/appointment-maker/${this.reservationSalon!.id}`));
  const workerOption = this.page.getByRole('option').filter({ hasText: this.reservationWorker!.name });
  await expect(workerOption).toBeVisible();
  await workerOption.click();

  const reservationResponsePromise = this.page.waitForResponse(response =>
    new URL(response.url()).pathname === '/api/v1/reservationsDetails'
    && response.request().method() === 'POST'
  );
  const paymentResponsePromise = this.page.waitForResponse(response =>
    new URL(response.url()).pathname === '/api/v1/payments'
    && response.request().method() === 'POST'
  );

  this.page.once('dialog', dialog => dialog.accept());

  await expect(this.page.locator('.fc')).toBeVisible();
  await this.page.locator('.fc').scrollIntoViewIfNeeded();
  const target = await this.page.evaluate(() => {
    const today = new Date().toISOString().slice(0, 10);
    const columns = Array.from(document.querySelectorAll<HTMLElement>('.fc-timegrid-col[data-date]'));
    const column = columns.find(element => (element.dataset['date'] ?? '') >= today) ?? columns[0];
    const row = document.querySelector<HTMLElement>('.fc-timegrid-slot-lane[data-time="10:00:00"]')
      ?? document.querySelector<HTMLElement>('.fc-timegrid-slot-lane[data-time]');
    if (!column || !row) {
      throw new Error('No selectable FullCalendar slot was found');
    }
    const columnRect = column.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    return {
      x: columnRect.left + columnRect.width / 2,
      y: rowRect.top + rowRect.height / 2
    };
  });
  await this.page.mouse.click(target.x, target.y);

  this.reservationResponse = await (await reservationResponsePromise).json() as {
    id: number;
    clientId: number;
    providerId: number;
    serviceId: number;
    workerId: number;
  };
  this.paymentResponse = await (await paymentResponsePromise).json() as {
    id: number;
    amount: number;
    currency: string;
    paymentStatus: string;
    reservationId: number;
    clientId: number;
  };
});

When('intenta confirmar una reserva sin slots disponibles', async function (this: UTimeWorld) {
  const serviceCard = this.page.getByLabel('Service card').filter({ hasText: this.reservationService!.name });
  await expect(serviceCard).toBeVisible();
  await serviceCard.getByRole('button', { name: 'Reservar ahora' }).click();

  await expect(this.page).toHaveURL(new RegExp(`/client/appointment-maker/${this.reservationSalon!.id}`));
  const workerOption = this.page.getByRole('option').filter({ hasText: this.reservationWorker!.name });
  await expect(workerOption).toBeVisible();
  await workerOption.click();
  await expect(this.page.locator('.fc')).toBeVisible();
});

Then('el sistema persiste la reserva con su cliente, servicio, trabajador y slot', async function (this: UTimeWorld) {
  expect(this.reservationResponse).toMatchObject({
    clientId: this.reservationClient!.clientId,
    providerId: this.providerAccount!.providerId,
    serviceId: this.reservationService!.id,
    workerId: this.reservationWorker!.id
  });
});

Then('el sistema persiste el pago en estado PENDING vinculado a la reserva', async function (this: UTimeWorld) {
  expect(this.paymentResponse).toMatchObject({
    amount: this.reservationService!.price,
    currency: 'PEN',
    paymentStatus: 'PENDING',
    reservationId: this.reservationResponse!.id,
    clientId: this.reservationClient!.clientId
  });
});

Then(
  'la aplicación lo redirige a la pantalla de procesamiento de pago con el enlace de Stripe',
  async function (this: UTimeWorld) {
    await expect(this.page).toHaveURL(/\/client\/payment-processing\/\d+\/\d+\?paymentLinkUrl=/);
    expect(this.reservationPaymentLinkRequest).toMatchObject({
      paymentId: this.paymentResponse!.id,
      amount: this.reservationService!.price,
      currency: 'PEN'
    });
    await expect(this.page.getByRole('link', { name: 'Open Stripe payment' }))
      .toHaveAttribute('href', STRIPE_PAYMENT_LINK_URL);
  }
);

Then('el sistema no persiste ninguna nueva reserva', async function (this: UTimeWorld) {
  expect(this.reservationResponse).toBeUndefined();
});

Then('el calendario no ofrece slots seleccionables para esa fecha', async function (this: UTimeWorld) {
  const selectableSlots = this.page.locator('.fc-timegrid-slot-lane.fc-slot-available');
  await expect(selectableSlots).toHaveCount(0);
});
