import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'rb-register-coach',
  templateUrl: './register-coach.component.html',
  styleUrls: ['./register-coach.component.scss']
})

export class RegisterCoachComponent implements OnInit {

  private conditionsChecked = false;

  constructor(private router: Router) {
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
}
