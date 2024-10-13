import { AuthService } from './services/auth.service';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const isAuthenticated = authService.isAuthenticated();
  const isAuthRoute = route.routeConfig?.path === 'signin' || route.routeConfig?.path === 'signup';

  if (!isAuthenticated) {
    if (!isAuthRoute) {
      router.navigate(['/signin']);
      return false;
    }
  } else {
    if (isAuthRoute) {
      router.navigate(['/']);
      return false;
    }
  }

  return true;
};
