import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {PotentialCoachee} from "../../../model/PotentialCoachee";
import {User} from "../../../user/user";

declare var $: any;
declare var Materialize: any;


@Component({
  selector: 'er-signup-coachee',
  templateUrl: './signup-coachee.component.html',
  styleUrls: ['./signup-coachee.component.scss']
})
export class SignupCoacheeComponent implements OnInit {

  potentialCoacheeObs: Observable<PotentialCoachee>;
  potentialCoachee: PotentialCoachee;

  private signUpForm: FormGroup;
  private error = false;
  private errorMessage = "";

  /* ----- END Contract Plan ----*/


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

        this.coachCoacheeService.getPotentialCoachee(token).subscribe(
          (coachee: PotentialCoachee) => {
            //TODO use this potential coachee
            console.log("getPotentialCoachee, data obtained", coachee);
            this.potentialCoacheeObs = Observable.of(coachee);
            this.potentialCoachee = coachee;
          },
          error => {
            console.log("getPotentialCoachee, error obtained", error)

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
    user.email = this.potentialCoachee.email;
    user.contractPlanId = this.potentialCoachee.plan.plan_id;

    this.authService.signUpCoachee(user).subscribe(
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
