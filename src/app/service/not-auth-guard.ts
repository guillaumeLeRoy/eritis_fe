import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {SessionService} from "./Session.service";

@Injectable()
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private sessionService: SessionService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    // if (this.authService.isAuthenticated()) { return true; }
    if (!this.sessionService.isSessionActive()) {
      return true;
    }
    // Une session est active, on redirige vers le dashboard
    this.router.navigate(['dashboard']);
    return false;
  }
}
