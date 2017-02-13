import {Component, OnDestroy} from '@angular/core';
import {RecipeService} from "../recipes/recipe.service";
import {Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {Subscription, Observable} from "rxjs";
import {User} from "../user/user";

@Component({
  selector: 'rb-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']

})
export class HeaderComponent implements OnDestroy {

  private isAuthenticated: Observable<boolean>;
  private connectedUser: Observable<User>;
  private subscription: Subscription

  constructor(private recipeService: RecipeService, private router: Router, private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.connectedUser = this.authService.getConnectedUser();
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
