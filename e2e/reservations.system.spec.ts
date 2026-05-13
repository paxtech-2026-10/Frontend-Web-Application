import { expect, Page, test } from '@playwright/test';
import {
  createClientAccount,
  createProviderAccount,
  createProviderProfile,
  createServiceForProvider,
  createWorkerForProvider
} from './support/api';
import { authenticateClientInBrowser } from './support/auth';

test('SYS-04 client creates a reservation and reaches Stripe payment step', async ({ page, request }) => {
  // Arrange
  const provider = await createProviderAccount(request);
  const client = await createClientAccount(request);
  const salon = await createProviderProfile(request, provider);
  const service = await createServiceForProvider(request, provider, {
    name: `Booking E2E ${Date.now()}`,
    duration: 30,
    price: 65
  });
  const worker = await createWorkerForProvider(request, provider, {
    name: `Booking Worker ${Date.now()}`,
    specialization: 'Stylist'
  });

  await authenticateClientInBrowser(page, client);

  const stripePaymentUrl = 'https://checkout.stripe.com/test-payment-link';
  let paymentLinkRequest: { paymentId: number; amount: number; currency: string } | undefined;

  await page.route('**/api/v1/payments/create-payment-link', async route => {
    paymentLinkRequest = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ paymentLinkUrl: stripePaymentUrl })
    });
  });

  // Act
  await page.goto(`/client/homeClient/salon/${salon.id}`);
  const serviceCard = page.getByLabel('Service card').filter({ hasText: service.name });
  await expect(serviceCard).toBeVisible();
  await serviceCard.getByRole('button', { name: 'Reservar ahora' }).click();

  await expect(page).toHaveURL(new RegExp(`/client/appointment-maker/${salon.id}`));
  const workerOption = page.getByRole('option').filter({ hasText: worker.name });
  await expect(workerOption).toBeVisible();
  await workerOption.click();

  const reservationResponsePromise = page.waitForResponse(response =>
    new URL(response.url()).pathname === '/api/v1/reservationsDetails'
    && response.request().method() === 'POST'
  );
  const paymentResponsePromise = page.waitForResponse(response =>
    new URL(response.url()).pathname === '/api/v1/payments'
    && response.request().method() === 'POST'
  );

  page.once('dialog', dialog => dialog.accept());
  await selectCalendarSlot(page);

  // Assert
  const reservationResponse = await reservationResponsePromise;
  expect(reservationResponse.status()).toBe(201);
  const reservation = await reservationResponse.json() as {
    id: number;
    clientId: number;
    providerId: number;
    serviceId: number;
    workerId: number;
  };
  expect(reservation).toMatchObject({
    clientId: client.clientId,
    providerId: provider.providerId,
    serviceId: service.id,
    workerId: worker.id
  });

  const paymentResponse = await paymentResponsePromise;
  expect(paymentResponse.status()).toBe(201);
  const payment = await paymentResponse.json() as {
    id: number;
    amount: number;
    currency: string;
    paymentStatus: string;
    reservationId: number;
    clientId: number;
  };
  expect(payment).toMatchObject({
    amount: service.price,
    currency: 'PEN',
    paymentStatus: 'PENDING',
    reservationId: reservation.id,
    clientId: client.clientId
  });

  await expect(page).toHaveURL(/\/client\/payment-processing\/\d+\/\d+\?paymentLinkUrl=/);
  expect(paymentLinkRequest).toMatchObject({
    paymentId: payment.id,
    amount: service.price,
    currency: 'PEN'
  });
  await expect(page.getByRole('link', { name: 'Open Stripe payment' })).toHaveAttribute('href', stripePaymentUrl);
});

async function selectCalendarSlot(page: Page): Promise<void> {
  await expect(page.locator('.fc')).toBeVisible();
  await page.locator('.fc').scrollIntoViewIfNeeded();

  const target = await page.evaluate(() => {
    const today = new Date().toISOString().slice(0, 10);
    const columns = Array.from(document.querySelectorAll<HTMLElement>('.fc-timegrid-col[data-date]'));
    const column = columns.find(element => (element.dataset['date'] ?? '') >= today) ?? columns[0];
    const row = document.querySelector<HTMLElement>('.fc-timegrid-slot-lane[data-time="10:00:00"]')
      ?? document.querySelector<HTMLElement>('.fc-timegrid-slot-lane[data-time]');

    if (!column || !row) {
      throw new Error('No selectable FullCalendar slot was found');
    }

    const columnBox = column.getBoundingClientRect();
    const rowBox = row.getBoundingClientRect();

    return {
      x: columnBox.left + columnBox.width / 2,
      startY: rowBox.top + rowBox.height / 2,
      endY: rowBox.top + rowBox.height * 1.5
    };
  });

  await page.mouse.move(target.x, target.startY);
  await page.mouse.down();
  await page.mouse.move(target.x, target.endY);
  await page.mouse.up();
}
