import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRoles = route.data?.['roles'] as string[];
  const userRole = authService.getRole();

  if (expectedRoles && userRole && expectedRoles.includes(userRole)) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const role = authService.getRole();
    if (role === 'PATIENT') {
      router.navigate(['/patient/dashboard']);
    } else if (role === 'DOCTOR') {
      router.navigate(['/doctor/dashboard']);
    } else {
      router.navigate(['/']);
    }
    return false;
  }

  return true;
};
