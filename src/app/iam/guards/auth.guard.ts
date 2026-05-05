// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountApiService } from '../services/accountApi.service';
import { Router } from '@angular/router';

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expiration && expiration > currentTime;
  } catch (e) {
    return false;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountApiService);
  const router = inject(Router);

  const token = accountService.getToken();

  if (token && isTokenValid(token)) {
    return true;
  }

  // Si no hay token o es inválido, redirige al login
  router.navigate(['/iam/login']);
  return false;
};
