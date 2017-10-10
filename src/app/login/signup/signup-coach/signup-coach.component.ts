import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {ActivatedRoute, Router} from "@angular/router";
import {PotentialCoach} from "../../../model/PotentialCoach";
import {User} from "../../../user/user";

@Component({
  selector: 'er-signup-coach',
  templateUrl: './signup-coach.component.html',
  styleUrls: ['./signup-coach.component.scss']
})
export class SignupCoachComponent implements OnInit {

  potentialCoachObs: Observable<PotentialCoach>;
  potentialCoach: PotentialCoach;

  private signUpForm: FormGroup;
  private error = false;
  private errorMessage = "";

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private coachCoacheeService: CoachCoacheeService, private router: Router, private route: ActivatedRoute) {
    console.log("constructor")
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    console.log("ngOnInit");

    // meetingId should be in the router
    this.route.queryParams.subscribe(
      (params: any) => {
        let token = params['token'];

        console.log("ngOnInit, param token", token);

        this.coachCoacheeService.getPotentialCoach(token).subscribe(
          (coach: PotentialCoach) => {
            console.log("getPotentialCoach, data obtained", coach);
            this.potentialCoachObs = Observable.of(coach);
            this.potentialCoach = coach;
          },
          error => {
            console.log("getPotentialCoach, error obtained", error)

          }
        );
      }
    );

    this.signUpForm = this.formBuilder.group({
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6)]
      )
      ],
      confirmPassword: ['',
        [Validators.required,
          this.isEqualPassword.bind(this)]
      ],
    });
  }

  onSignUpSubmitted() {
    console.log("onSignUp")

    //reset errors
    this.error = false;
    this.errorMessage = '';

    console.log("onSignUp, coachee");

    let user: User = this.signUpForm.value;
    user.email = this.potentialCoach.email;

    this.authService.signUpCoach(user).subscribe(
      data => {
        console.log("onSignUp, data obtained", data)
        /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
        this.router.navigate(['/dashboard']);
      },
      error => {
        console.log("onSignUp, error obtained", error)
        this.error = true;
        this.errorMessage = error
      })
  }

  isEqualPassword(control: FormControl): { [s: string]: boolean; } {
    if (!this.signUpForm) {
      return {passwordNoMatch: true}
    }

    if (control.value !== this.signUpForm.controls["password"].value) {
      console.log("isEqualPassword, NO")
      return {passwordNoMatch: true}
    }
  }
}
