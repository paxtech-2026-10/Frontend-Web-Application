import { Page } from '@playwright/test';
import { ClientAccount, ProviderAccount } from './api';

export async function authenticateProviderInBrowser(
  page: Page,
  providerAccount: ProviderAccount
) {
  await page.addInitScript(({ token, providerId }) => {
    window.localStorage.setItem('jwt_token', token);
    window.localStorage.setItem('providerId', String(providerId));
  }, {
    token: providerAccount.token,
    providerId: providerAccount.providerId
  });
}

export async function authenticateClientInBrowser(
  page: Page,
  clientAccount: ClientAccount
) {
  await page.addInitScript(({ token, clientId }) => {
    window.localStorage.setItem('jwt_token', token);
    window.localStorage.setItem('clientId', String(clientId));
  }, {
    token: clientAccount.token,
    clientId: clientAccount.clientId
  });
}
