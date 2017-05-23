import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {ContractPlan} from "../../model/ContractPlan";
import {AuthService} from "../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Response} from "@angular/http";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {PotentialCoachee} from "../../model/PotentialCoachee";
import {User} from "../../user/user";

declare var $: any;
declare var Materialize: any;

enum SignUpType {
  COACH, COACHEE, RH
}

@Component({
  selector: 'er-signup-coachee',
  templateUrl: './signup-coachee.component.html',
  styleUrls: ['./signup-coachee.component.css']
})
export class SignupCoacheeComponent implements OnInit {

  potentialCoacheeObs: Observable<PotentialCoachee>;
  potentialCoachee: PotentialCoachee;

  private signUpSelectedType = SignUpType.COACHEE;
  private signUpTypes: SignUpType[];

  private signUpForm: FormGroup;
  private error = false;
  private errorMessage = "";

  /* ----- END Contract Plan ----*/


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private coachCoacheeService: CoachCoacheeService, private router: Router, private route: ActivatedRoute) {
    console.log("constructor")
  }

  ngOnInit() {
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

    this.signUpTypes = [SignUpType.COACHEE];

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

    if (this.signUpSelectedType == SignUpType.COACHEE) {
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
    } else {
      Materialize.toast('Vous devez sélectionner un type', 3000, 'rounded')
    }
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

  getSignUpTypeName(type: SignUpType): string {
    switch (type) {
      case SignUpType.COACH:
        return "Coach";
      case SignUpType.COACHEE:
        return "Coaché";
      case SignUpType.RH:
        return "RH";
    }
  }

}
