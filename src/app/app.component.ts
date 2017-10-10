import {Component, OnInit} from '@angular/core';
import {environment} from "../environments/environment";
import {FirebaseService} from "./service/firebase.service";
import {CookieService} from "ngx-cookie";

declare var $: any;

@Component({
  selector: 'er-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  private showCookiesMessage = false;

  constructor(private  firebaseService: FirebaseService, private cookieService: CookieService) {
    console.log("AppComponent ctr, env : ", environment);

    firebaseService.init();

  }

  ngOnInit() {
    // Cookie Headband
    this.showCookiesMessage = this.cookieService.get('ACCEPTS_COOKIES') === undefined;
  }

  hideCookieHeadband() {
    $('#cookie_headband').fadeOut();
    this.cookieService.put('ACCEPTS_COOKIES', 'true');
  }
}
