import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../../services/UserServices/user.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.userService.getUserRole();

    // no role
    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    // array roles
    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(userRole)) {
        return true;
      }
    } else {
      // single role
      if (userRole === expectedRole) {
        return true;
      }
    }

    // unauthorized
    this.router.navigate(['/login']);
    return false;
  }
}