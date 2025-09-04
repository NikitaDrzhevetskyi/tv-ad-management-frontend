import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        const allowedRoles = route.data['roles'] as string[];
        
        if (!allowedRoles || allowedRoles.length === 0) {
          return true;
        }

        if (allowedRoles.includes(user.role)) {
          return true;
        } else {
          this.redirectToUserHomePage(user.role);
          return false;
        }
      })
    );
  }

  private redirectToUserHomePage(role: string): void {
    switch (role) {
      case 'admin':
        this.router.navigate(['/dashboard']);
        break;
      case 'user':
        this.router.navigate(['/order-advertising']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}