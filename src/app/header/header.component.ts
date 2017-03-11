import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {Subscription, Observable} from "rxjs";
import {ApiUser} from "../model/apiUser";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/coachee";

@Component({
  selector: 'rb-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']

})
export class HeaderComponent implements OnInit,OnDestroy {

  private isAuthenticated: Observable<boolean>;
  private connectedUser: Observable<ApiUser>;
  private subscription: Subscription;

  // private userStatus: number;

  private mUser: ApiUser;

  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.authService.isAuthenticated().subscribe(
      (isAuth: boolean) => {
        console.log("isAuthenticated : " + isAuth);
        this.isAuthenticated = Observable.of(isAuth);
        this.cd.detectChanges();
      }
    );

    this.connectedUser = this.authService.getConnectedUserObservable();
    this.subscription = this.authService.getConnectedUserObservable().subscribe(
      (user: ApiUser) => {
        console.log("getConnectedUser : " + user);
        this.connectedUser = Observable.of(user);
        this.mUser = user;
        this.cd.detectChanges();
      }
    );
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
      this.router.navigate(['/meetings', user.id]);
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

  // isAuth() {
  //   return this.isAuthenticated
  // }

  // onStore() {
  //   this.recipeService.storeData()
  //   // this.recipeService.storeData().subscribe(
  //   //   data => console.log(data),
  //   //   error => console.log(error)
  //   // )
  // }
  //
  // onFetch() {
  //   this.recipeService.fetchData()
  // }
}
