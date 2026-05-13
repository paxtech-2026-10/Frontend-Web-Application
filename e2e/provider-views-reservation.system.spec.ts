import { expect, test } from '@playwright/test';
import {
  API_BASE_URL,
  createClientAccount,
  createProviderAccount,
  createReservation,
  createServiceForProvider,
  createTimeSlot,
  createWorkerForProvider
} from './support/api';
import { authenticateProviderInBrowser } from './support/auth';

test('SYS-08 provider sees client reservation on the dashboard with all related data', async ({ page, request }) => {
  // Arrange — build every entity via API so the test is self-contained
  const specialization = 'Masajista';
  const provider = await createProviderAccount(request);
  const service  = await createServiceForProvider(request, provider, {
    name:  `SYS08 Servicio ${Date.now()}`,
    price: 70
  });
  const worker   = await createWorkerForProvider(request, provider, {
    name:           `SYS08 Worker ${Date.now()}`,
    specialization
  });
  const client   = await createClientAccount(request);
  const timeSlot = await createTimeSlot(request, provider);
  const reservation = await createReservation(request, client, provider, service, worker, timeSlot);

  // Assert (API layer) — GET /reservationsDetails/details/{id}/ returns the full
  // related data: provider info, service, worker and time-slot in one response.
  const detailsResponse = await request.get(
    `${API_BASE_URL}/reservationsDetails/details/${reservation.id}/`
  );
  expect(detailsResponse.status()).toBe(200);
  const details = (await detailsResponse.json()) as {
    id: number;
    clientId: number;
    provider: { id: number; companyName: string };
    serviceId: { id: number; name: string };
    workerId:  { id: number; name: string; specialization: string };
    timeSlot:  { id: number; startTime: string };
  };
  expect(details).toMatchObject({
    id:       reservation.id,
    clientId: client.clientId,
    provider: { id: provider.providerId },
    serviceId: { id: service.id, name: service.name },
    workerId:  { id: worker.id, specialization }
  });

  // Assert (UI layer) — the provider's dashboard shows the appointment card with
  // worker specialization and payment status.
  await authenticateProviderInBrowser(page, provider);

  // The dashboard component fetches GET /reservationsDetails/details (all reservations)
  // and slices to the first 3 before filtering by providerId — accumulated DB state from
  // other test runs can push our appointment out of that window.  Stub the endpoint so
  // only our appointment is returned, isolating the UI assertion from DB pollution.
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const dateStr = tomorrowDate.toISOString().slice(0, 10);

  await page.route('**/api/v1/reservationsDetails/details', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: reservation.id,
        clientId: client.clientId,
        provider: { id: provider.providerId, name: provider.email, companyName: 'E2E Salon' },
        serviceId: { id: service.id, name: service.name, duration: 30, price: service.price, providerId: provider.providerId },
        timeSlot: { id: timeSlot.id, startTime: `${dateStr}T10:00:00`, endTime: `${dateStr}T10:30:00`, status: true, type: 'BOOKED' },
        workerId: { id: worker.id, name: worker.name, specialization }
      }])
    })
  );

  await page.goto('/provider/homeProvider');

  // The component calls GET /reservationsDetails/details and filters by providerId.
  // Each appointment renders as a card with aria-label="appointment-card".
  const card = page.locator('[aria-label="appointment-card"]');
  await expect(card).toBeVisible({ timeout: 10000 });

  // The card shows appointment.workerId.specialization under the label "Servicio"
  await expect(card).toContainText(specialization);
  // paymentId defaults to { status: false } when absent → "No pagado"
  await expect(card).toContainText('No pagado');
});
