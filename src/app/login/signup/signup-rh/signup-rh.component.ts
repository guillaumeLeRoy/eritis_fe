import {Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../user/user";
import {PotentialRh} from "../../../model/PotentialRh";

@Component({
  selector: 'er-signup-rh',
  templateUrl: './signup-rh.component.html',
  styleUrls: ['./signup-rh.component.scss']
})
export class SignupRhComponent implements OnInit {

  potentialRhObs: Observable<PotentialRh>;
  potentialRh: PotentialRh;

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

        this.coachCoacheeService.getPotentialRh(token).subscribe(
          (coach: PotentialRh) => {
            console.log("getPotentialRh, data obtained", coach);
            this.potentialRhObs = Observable.of(coach);
            this.potentialRh = coach;
          },
          error => {
            console.log("getPotentialRh, error obtained", error)

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

    console.log("onSignUp, rh");

    let user: User = this.signUpForm.value;
    user.email = this.potentialRh.email;

    this.authService.signUpRh(user).subscribe(
      data => {
        console.log("onSignUp, data obtained", data)
        /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
        this.router.navigate(['/meetings']);
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
