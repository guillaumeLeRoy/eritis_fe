import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../service/auth.service';
import {Subscription, Observable} from 'rxjs';
import {ApiUser} from '../model/apiUser';
import {Coach} from '../model/Coach';
import {Coachee} from '../model/coachee';

@Component({
  selector: 'rb-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']

})
export class HeaderComponent implements OnInit, OnDestroy {

  private isAuthenticated: Observable<boolean>;
  private subscription: Subscription;

  private mUser: Coach | Coachee;
  private user: Observable<Coach | Coachee>;

  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {

    this.mUser = this.authService.getConnectedUser();
    this.onUserObtained(this.mUser);
    // this.isAuthenticated = this.authService.isAuthenticated();
    // this.authService.isAuthenticated().subscribe(
    //   (isAuth: boolean) => {
    //     console.log("isAuthenticated : " + isAuth);
    //     this.isAuthenticated = Observable.of(isAuth);
    //     this.cd.detectChanges();
    //   }
    // );
    if (this.user == null) {
      // Un utilisateur non connecté est redirigé sur la page d'accueil
      this.router.navigate(['/']);
    }

    // this.connectedUser = this.authService.getConnectedUserObservable();
    this.subscription = this.authService.getConnectedUserObservable().subscribe(
      (user: Coach | Coachee) => {
        console.log('getConnectedUser : ' + user);
        this.onUserObtained(user);
      }
    );
  }

  private onUserObtained(user: Coach | Coachee) {
    console.log('onUserObtained : ' + user);

    if (user == null) {
      this.mUser = user;
      this.isAuthenticated = Observable.of(false);
    } else {
      this.mUser = user;
      this.isAuthenticated = Observable.of(true);
    }
    this.user = Observable.of(user);
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogout() {
    this.authService.loginOut();
  }

  onLogIn() {
    this.router.navigate(['/signin']);
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  goToMeetings() {
    let user = this.authService.getConnectedUser();
    if (user != null) {
      this.router.navigate(['/meetings']);
    }
  }

  goToProfile() {
    if (this.mUser instanceof Coach) {
      this.router.navigate(['/profile_coach']);
    } else if (this.mUser instanceof Coachee) {
      this.router.navigate(['/profile_coachee']);
    }
  }

  goToCoachs() {
    this.router.navigate(['/coachs']);
  }

  canDisplayListOfCoach(): boolean {
    if (this.mUser == null) {
      return false;
    }

    if (this.mUser instanceof Coach) {
      return false;
    } else {
      return true;
    }

  }
}
