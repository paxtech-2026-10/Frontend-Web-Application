import { After, Before, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { APIRequestContext, Browser, BrowserContext, Page, chromium, request } from '@playwright/test';
import {
  ClientAccount,
  ProviderAccount,
  ProviderProfileFixture,
  ServiceFixture,
  WorkerFixture
} from '../../e2e/support/api';

setDefaultTimeout(60_000);

export class UTimeWorld extends World {
  apiRequest!: APIRequestContext;
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  providerAccount?: ProviderAccount;
  serviceCreationStatus?: number;
  serviceDeletionStatus?: number;
  registeredServiceName?: string;
  // IAM (US01 / US03)
  pendingClient?: { firstName: string; lastName: string; email: string; password: string };
  signedInProviderId?: string | null;
  // Profiles (US06)
  pendingProviderRegistration?: { companyName: string; address: string; email: string; password: string };
  expectedProviderLocation?: string;
  providerProfileUpdateStatus?: number;
  providerProfileUpdateLocation?: string;
  // Reservations (US18)
  reservationClient?: ClientAccount;
  reservationSalon?: ProviderProfileFixture;
  reservationService?: ServiceFixture;
  reservationWorker?: WorkerFixture;
  reservationResponse?: {
    id: number;
    clientId: number;
    providerId: number;
    serviceId: number;
    workerId: number;
  };
  paymentResponse?: {
    id: number;
    amount: number;
    currency: string;
    paymentStatus: string;
    reservationId: number;
    clientId: number;
  };
  reservationPaymentLinkRequest?: { paymentId: number; amount: number; currency: string };
  readonly baseUrl = process.env['E2E_WEB_BASE_URL'] ?? 'http://localhost:4200';
}

setWorldConstructor(UTimeWorld);

Before(async function (this: UTimeWorld) {
  this.apiRequest = await request.newContext();
  this.browser = await chromium.launch({
    headless: process.env['E2E_HEADLESS'] !== 'false'
  });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: UTimeWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
  await this.apiRequest?.dispose();
});
