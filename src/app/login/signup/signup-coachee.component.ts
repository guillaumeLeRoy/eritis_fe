import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {ContractPlan} from "../../model/ContractPlan";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Response} from "@angular/http";

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

  private signUpSelectedType: SignUpType;
  private signUpTypes: SignUpType[];

  private signUpForm: FormGroup;
  private error = false;
  private errorMessage = "";

  /* ----- Contract Plan ----*/

  /**
   * All available Plans
   */
  private plans: Observable<ContractPlan[]>;

  /**
   * Selected Plan.
   * Mandatory for a Coachee
   */
  private mSelectedPlan: ContractPlan;

  /* ----- END Contract Plan ----*/


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    console.log("constructor")
  }

  ngOnInit() {
    console.log("ngOnInit");

    this.signUpTypes = [SignUpType.COACHEE];

    this.signUpForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        this.isEmail
      ])],
      password: ['', Validators.compose([Validators.required,
        Validators.minLength(6)]
      )
      ],
      confirmPassword: ['',
        [Validators.required, this.isEqualPassword.bind(this)]
      ],

      // type: ['',
      //   [Validators.required]
      // ],
      //
      // coacheeTYpe: ['',
      //   [Validators.required]
      // ]
    });

    this.getListOfContractPlans();
  }


  onSelectPlan(plan: ContractPlan) {
    console.log("onSelectPlan, plan ", plan)

    this.mSelectedPlan = plan;
  }

  onSignUpSubmitted() {
    console.log("onSignUp")

    //reset errors
    this.error = false;
    this.errorMessage = '';

    if (this.signUpSelectedType == SignUpType.COACHEE) {
      console.log("onSignUp, coachee");

      //contract Plan is mandatory
      if (this.mSelectedPlan == null) {
        this.error = true;
        this.errorMessage = "Selectionnez un contract";
        return;
      }

      this.authService.signUpCoachee(this.signUpForm.value).subscribe(
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


  getListOfContractPlans() {
    this.authService.getNotAuth(AuthService.GET_CONTRACT_PLANS, null).subscribe(
      (response: Response) => {
        let json: ContractPlan[] = response.json();
        console.log("getListOfContractPlans, response json : ", json);
        this.plans = Observable.of(json);
        // this.cd.detectChanges();
      }
    );
  }

  isEmail(control: FormControl): { [s: string]: boolean; } {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
      console.log("email NOT ok")
      // this.test = false
      return {noEmail: true}
    }
    // this.test = true
    console.log("email ok")
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
