import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ContractPlan} from "../../model/ContractPlan";
import {Response} from "@angular/http";

@Component({
  selector: 'rb-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

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
    console.log("ngOnInit")

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

      status: ['']
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


    if (this.signUpForm.value.status) {
      console.log("onSignUp, coach");

      this.authService.signUpCoach(this.signUpForm.value).subscribe(
        data => {
          console.log("onSignUp, data obtained", data)
          this.router.navigate(['/profile_coach'])
        },
        error => {
          console.log("onSignUp, error obtained", error)
          this.error = true;
          this.errorMessage = error
        })
    } else {
      console.log("onSignUp, coachee");

      //contract Plan is mandatory
      if (this.mSelectedPlan == null) {
        this.error = true;
        this.errorMessage = "Selectionnez un contract";
        return;
      }

      this.authService.signUpCoachee(this.signUpForm.value, this.mSelectedPlan).subscribe(
        data => {
          console.log("onSignUp, data obtained", data)
          this.router.navigate(['/coachs'])
        },
        error => {
          console.log("onSignUp, error obtained", error)
          this.error = true;
          this.errorMessage = error
        })
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

  isEmail(control: FormControl): {[s: string]: boolean;} {
    if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
      console.log("email NOT ok")
      // this.test = false
      return {noEmail: true}
    }
    // this.test = true
    console.log("email ok")
  }

  isEqualPassword(control: FormControl): {[s: string]: boolean;} {
    if (!this.signUpForm) {
      return {passwordNoMatch: true}
    }

    if (control.value !== this.signUpForm.controls["password"].value) {
      console.log("isEqualPassword, NO")

      return {passwordNoMatch: true}
    }
  }

}
