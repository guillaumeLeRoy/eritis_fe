import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie";

@Component({
  selector: 'rb-register-coach',
  templateUrl: './register-coach.component.html',
  styleUrls: ['./register-coach.component.scss']
})

export class RegisterCoachComponent implements OnInit {

  constructor(private router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  goToDeontologie() {
    this.router.navigate(['/register_coach/code_deontologie'])
  }

  goToForm() {
    this.router.navigate(['/register_coach/step2'])
  }

  hasAcceptedConditions() {
    let cookie = this.cookieService.get('COACH_REGISTER_CONDITIONS_ACCEPTED');
    console.log('Coach register conditions accepted, ', cookie);
    if (cookie !== null && cookie !== undefined) {
      return true;
    }
  }

  setAcceptedConditions() {
    console.log('Coach register accept conditions');
    if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
      this.cookieService.put('COACH_REGISTER_CONDITIONS_ACCEPTED', 'true');
  }

  deleteAcceptedConditions() {
    console.log('Coach register refuse conditions');
    this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
  }

  toggleAcceptedConditions() {
    if (this.hasAcceptedConditions())
      this.deleteAcceptedConditions();
    else
      this.setAcceptedConditions();
  }
}
