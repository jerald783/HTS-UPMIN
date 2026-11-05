import { Injectable } from '@angular/core';

import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { Observable, of } from 'rxjs';

import { map, catchError } from 'rxjs/operators';

import { UserService } from '../../services/UserServices/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  private checkAuth(stateUrl: string): Observable<boolean> {
    return this.userService.validateSession().pipe(
      map(() => {
        return true;
      }),

      catchError(() => {
        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: stateUrl,
          },
        });

        return of(false);
      }),
    );
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.checkAuth(state.url);
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.checkAuth(state.url);
  }
}
