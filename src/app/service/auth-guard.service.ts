import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {SessionService} from "./Session.service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private sessionService: SessionService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    //if (this.authService.isAuthenticated() && cookie) { return true; }
    if (this.sessionService.isSessionActive()) {
      this.sessionService.saveSessionTTL();
      return true;
    }

    // Pas de session active, on redirige vers welcome
    this.authService.loginOut();
    return false;
  }
}
