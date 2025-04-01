import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(LoginService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }
  if (typeof localStorage !== 'undefined' && !!localStorage.getItem('token')) {
    return authService.checkAuthStatus().pipe(
      map(user => {
        if (user) {
          return true;
        }
        router.navigate(['/master-login'], { 
          queryParams: { returnUrl: state.url } 
        });
        return false;
      })
    );
  }
  router.navigate(['/master-login'], { 
    queryParams: { returnUrl: state.url } 
  });
  return false;
};