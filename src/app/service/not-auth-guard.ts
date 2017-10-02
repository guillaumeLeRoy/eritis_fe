import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import {CookieOptions, CookieService} from "ngx-cookie";

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let cookie = (this.cookieService.get('ACTIVE_SESSION') === undefined);

    // if (this.authService.isAuthenticated()) { return true; }
    if (cookie) { return true; }
    // Une session esta active, on redirige vers le dashboard
    this.router.navigate(['dashboard']);
    return false;
  }
}
