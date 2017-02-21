import {Component, OnDestroy, ChangeDetectorRef, OnInit} from '@angular/core';
import {RecipeService} from "../recipes/recipe.service";
import {Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {Subscription, Observable} from "rxjs";
import {User} from "../user/user";
import {ApiUser} from "../model/apiUser";

@Component({
  selector: 'rb-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']

})
export class HeaderComponent implements OnInit,OnDestroy {


  private isAuthenticated: Observable<boolean>;
  private connectedUser: Observable<ApiUser>;
  private subscription: Subscription;

  constructor(private recipeService: RecipeService, private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
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

        this.cd.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onStore() {
    this.recipeService.storeData()
    // this.recipeService.storeData().subscribe(
    //   data => console.log(data),
    //   error => console.log(error)
    // )
  }

  onFetch() {
    this.recipeService.fetchData()
  }

  onLogout() {
    this.authService.loginOut()
  }

  onLogIn() {
    this.router.navigate(['/signin'])
  }

  // isAuth() {
  //   return this.isAuthenticated
  // }
}
