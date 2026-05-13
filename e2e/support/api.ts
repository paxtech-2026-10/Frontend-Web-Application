import {APIRequestContext, expect} from '@playwright/test';

export const API_BASE_URL = process.env['E2E_API_BASE_URL'] || 'http://localhost:8080/api/v1';

export interface ProviderAccount {
  email: string;
  password: string;
  userId: number;
  providerId: number;
  token: string;
}

export interface ClientAccount {
  email: string;
  password: string;
  userId: number;
  clientId: number;
  token: string;
}

export interface ProviderProfileFixture {
  id: number;
  providerId: number;
  companyName: string;
  location?: string;
}

export interface ServiceFixture {
  id: number;
  name: string;
  duration: number;
  price: number;
  providerId: number;
}

export interface WorkerFixture {
  id: number;
  name: string;
  specialization: string;
  photoUrl: string;
  providerId: number;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function createProviderAccount(
  request: APIRequestContext
): Promise<ProviderAccount> {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const email = `provider.e2e.${suffix}@utime.test`;
  const password = 'Password123!';
  const companyName = `E2E Salon ${suffix}`;

  const signUp = await request.post(`${API_BASE_URL}/authentication/sign-up`, {
    data: { email, password }
  });
  expect(signUp.status()).toBe(201);
  const user = (await signUp.json()) as { id: number; email: string };

  const providerResponse = await request.post(`${API_BASE_URL}/providers`, {
    data: { companyName, userId: user.id }
  });
  expect(providerResponse.status()).toBe(201);
  const provider = (await providerResponse.json()) as { id: number };

  const signIn = await request.post(`${API_BASE_URL}/authentication/sign-in`, {
    data: { email, password }
  });
  expect(signIn.ok()).toBeTruthy();
  const auth = (await signIn.json()) as {
    id: number;
    email: string;
    token: string;
  };

  return {
    email,
    password,
    userId: auth.id,
    providerId: provider.id,
    token: auth.token
  };
}

export async function createClientAccount(
  request: APIRequestContext
): Promise<ClientAccount> {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  const email = `client.e2e.${suffix}@utime.test`;
  const password = 'Password123!';

  const signUp = await request.post(`${API_BASE_URL}/authentication/sign-up`, {
    data: { email, password }
  });
  expect(signUp.status()).toBe(201);
  const user = (await signUp.json()) as { id: number; email: string };

  const clientResponse = await request.post(`${API_BASE_URL}/clients`, {
    data: {
      firstName: 'Client',
      lastName: 'E2E',
      userId: user.id
    }
  });
  expect(clientResponse.status()).toBe(201);
  const client = (await clientResponse.json()) as { id: number };

  const signIn = await request.post(`${API_BASE_URL}/authentication/sign-in`, {
    data: { email, password }
  });
  expect(signIn.ok()).toBeTruthy();
  const auth = (await signIn.json()) as {
    id: number;
    email: string;
    token: string;
  };

  return {
    email,
    password,
    userId: auth.id,
    clientId: client.id,
    token: auth.token
  };
}

/**
 * Fetches the provider profile that was auto-created by POST /providers.
 *
 * WHY NOT POST /provider-profiles:
 *   ProvidersController.createProvider() (lines 88-90) automatically calls
 *   providerProfileCommandService to create an empty ProviderProfile
 *   (profileImageUrl="to Choose", coverImageUrl="to Choose") right after
 *   persisting the Provider. This means every Provider already has exactly
 *   one ProviderProfile by the time it reaches this helper.
 *
 *   Calling POST /provider-profiles after that triggers a duplicate-key
 *   violation on the unique constraint provider_profile(provider_id).
 *   The DataIntegrityViolationException is not caught by the controller,
 *   so Spring Boot forwards the request to /error — which is not in
 *   permitAll — and the UnauthorizedRequestHandlerEntryPoint returns 401.
 *   The test then sees 401 instead of the expected 201.
 *
 * CORRECT FLOW:
 *   1. POST /providers          → creates Provider + auto-creates ProviderProfile
 *   2. GET /provider-profiles/provider/{providerId}  → fetch the existing profile
 *   3. Use profile.id as salon.id for navigation in the test
 */
export async function createProviderProfile(
  request: APIRequestContext,
  providerAccount: ProviderAccount
): Promise<ProviderProfileFixture> {
  // The profile already exists — just retrieve it.
  const response = await request.get(
    `${API_BASE_URL}/provider-profiles/provider/${providerAccount.providerId}`
  );
  expect(response.status()).toBe(200);

  return await response.json() as ProviderProfileFixture;
}

export async function updateProviderProfileLocation(
  request: APIRequestContext,
  profile: ProviderProfileFixture,
  location: string
): Promise<ProviderProfileFixture> {
  const response = await request.put(`${API_BASE_URL}/provider-profiles/${profile.id}`, {
    data: {
      companyName: profile.companyName,
      location
    }
  });
  expect(response.status()).toBe(200);

  return await response.json() as ProviderProfileFixture;
}

export async function createServiceForProvider(
  request: APIRequestContext,
  providerAccount: ProviderAccount,
  overrides: Partial<Pick<ServiceFixture, 'name' | 'duration' | 'price'>> = {}
): Promise<ServiceFixture> {
  const response = await request.post(`${API_BASE_URL}/services`, {
    headers: authHeaders(providerAccount.token),
    data: {
      name: overrides.name ?? `Reserva E2E ${Date.now()}`,
      duration: overrides.duration ?? 30,
      price: overrides.price ?? 50,
      status: true,
      providerId: providerAccount.providerId
    }
  });
  expect(response.status()).toBe(201);

  return await response.json() as ServiceFixture;
}

export async function createWorkerForProvider(
  request: APIRequestContext,
  providerAccount: ProviderAccount,
  overrides: Partial<Pick<WorkerFixture, 'name' | 'specialization' | 'photoUrl'>> = {}
): Promise<WorkerFixture> {
  const response = await request.post(`${API_BASE_URL}/workers`, {
    headers: authHeaders(providerAccount.token),
    data: {
      name: overrides.name ?? `Worker Booking E2E ${Date.now()}`,
      specialization: overrides.specialization ?? 'Stylist',
      photoUrl: overrides.photoUrl ?? 'https://placehold.co/120x120?text=Worker',
      providerId: providerAccount.providerId
    }
  });
  expect(response.status()).toBe(201);

  return await response.json() as WorkerFixture;
}

export interface TimeSlotFixture {
  id: number;
  startTime: string;
  endTime: string;
  status: boolean;
  type: string;
}

export interface ReservationFixture {
  id: number;
  clientId: number;
  providerId: number;
  serviceId: number;
  timeSlotId: number;
  workerId: number;
}

/**
 * Creates a future time slot (tomorrow at 10:00-10:30).
 * POST /api/v1/time-slots requires authentication.
 * The date is built using the wall-clock date so it is always at least 24 h
 * in the future, which ensures the dashboard filter (startTime > now) passes.
 */
export async function createTimeSlot(
  request: APIRequestContext,
  providerAccount: ProviderAccount
): Promise<TimeSlotFixture> {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().slice(0, 10); // "YYYY-MM-DD"

  const response = await request.post(`${API_BASE_URL}/time-slots`, {
    headers: authHeaders(providerAccount.token),
    data: {
      startTime: `${dateStr}T10:00:00`,
      endTime:   `${dateStr}T10:30:00`,
      status: true,
      type: 'BOOKED'
    }
  });
  expect(response.status()).toBe(201);

  return await response.json() as TimeSlotFixture;
}

/**
 * Creates a reservation linking client, provider, service, worker and time slot.
 * POST /api/v1/reservationsDetails is in permitAll() but we pass the client
 * token anyway so the request works whether or not auth is enforced.
 */
export async function createReservation(
  request: APIRequestContext,
  client: ClientAccount,
  provider: ProviderAccount,
  service: ServiceFixture,
  worker: WorkerFixture,
  timeSlot: TimeSlotFixture
): Promise<ReservationFixture> {
  const response = await request.post(`${API_BASE_URL}/reservationsDetails`, {
    headers: authHeaders(client.token),
    data: {
      clientId:   client.clientId,
      providerId: provider.providerId,
      serviceId:  service.id,
      timeSlotId: timeSlot.id,
      workerId:   worker.id
    }
  });
  expect(response.status()).toBe(201);

  return await response.json() as ReservationFixture;
}
