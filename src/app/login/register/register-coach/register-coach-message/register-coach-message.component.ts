import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'rb-register-coach-message',
  templateUrl: './register-coach-message.component.html',
  styleUrls: ['./register-coach-message.component.scss']
})
export class RegisterCoachMessageComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    if (!this.isRegistered()) {
      this.router.navigate(['register_coach/step2']);
    }
  }

  goToWelcomePage() {
    // Clean cookies
    this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
    this.cookieService.remove('COACH_REGISTER_FORM_SENT');
    this.router.navigate(['/welcome']);
  }

  isRegistered() {
    let cookie = this.cookieService.get('COACH_REGISTER_FORM_SENT');
    console.log('Coach register form sent, ', cookie);
    if (cookie !== null && cookie !== undefined) {
      return true;
    }
  }
}
