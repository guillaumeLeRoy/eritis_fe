import { Injectable } from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild} from '@angular/router';
import { AuthService } from './auth.service';
import {CookieService} from "ngx-cookie";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let cookie = (this.cookieService.get('ACTIVE_SESSION') !== undefined);

    //if (this.authService.isAuthenticated() && cookie) { return true; }
    if (cookie) {
      let date = (new Date());
      date.setHours(date.getHours() + 1);
      console.log('COOKIE', date);
      //Update cookie expiration time
      this.cookieService.put('ACTIVE_SESSION', 'true', {'expires': date});

      return true;
    }

    // Pas de session active, on redirige vers welcome
    this.authService.loginOut();
    return false;
  }
}
