import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { user } from '@angular/fire/auth';

export const AuthGuardService: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    map(currentUser => {
      if (currentUser) {
        // If the user is authenticated, allow access
        return true;
      } else {
        // If not authenticated, capture the return URL and navigate to /login
        const returnUrl = state.url;
        router.navigate(['/login'], {
          queryParams: { returnUrl }
        });
        return false;
      }
    })
  );
};
