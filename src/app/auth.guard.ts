import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../app/auth.service"

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    console.log("User not authenticated, redirecting to login");
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  
  return true;
};
