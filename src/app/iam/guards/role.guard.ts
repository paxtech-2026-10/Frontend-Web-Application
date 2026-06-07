// role.guard.ts
// Ensures a user can only enter the area matching the role id they actually hold
// in localStorage. Prevents a provider from landing on client-only screens
// (and vice-versa), which previously surfaced another account's name/data.
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as 'provider' | 'client' | undefined;

  // No role requirement declared on the route → nothing to enforce.
  if (!requiredRole) return true;

  const hasProvider = !!localStorage.getItem('providerId');
  const hasClient = !!localStorage.getItem('clientId');

  if (requiredRole === 'provider' && hasProvider) return true;
  if (requiredRole === 'client' && hasClient) return true;

  // Wrong area for this session → send the user to where they belong.
  if (hasProvider) {
    router.navigate(['/provider/homeProvider']);
  } else if (hasClient) {
    router.navigate(['/client/homeClient']);
  } else {
    router.navigate(['/iam/login']);
  }
  return false;
};
