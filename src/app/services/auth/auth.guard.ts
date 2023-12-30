import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const currentUserString = localStorage.getItem('currentUser');

    if (currentUserString !== null) {
      const currentUser = JSON.parse(currentUserString);

      if (currentUser && currentUser.access_token) {
        // User is authenticated and token is valid
        return true;
      }
    }

    // User is not authenticated or token is expired, redirect to login page
    this.router.navigate(['/auth']);
    return false;
  }

}
