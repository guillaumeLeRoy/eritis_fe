import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {ContractPlan} from "../../model/ContractPlan";
import {Response} from "@angular/http";
import {AdminAPIService} from "../../service/adminAPI.service";


declare var $: any;
declare var Materialize: any;

enum SignUpType {
  COACH, COACHEE, RH, NULL
}

@Component({
  selector: 'rb-signup',
  templateUrl: './signup-admin.component.html',
  styleUrls: ['./signup-admin.component.css']
})
export class SignupAdminComponent implements OnInit {

  private signUpSelectedType = SignUpType.NULL;
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


  constructor(private formBuilder: FormBuilder, private authService: AuthService, private adminAPIService: AdminAPIService, private router: Router) {
    console.log("constructor")
  }

  ngOnInit() {
    console.log("ngOnInit");

    // this.signUpTypes = [SignUpType.COACH, SignUpType.COACHEE, SignUpType.RH];
    this.signUpTypes = [SignUpType.COACH, SignUpType.RH];

    this.signUpForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        this.isEmail
      ])]
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


    if (this.signUpSelectedType == SignUpType.COACH) {
      console.log("onSignUp, coach");
      this.createPotentialCoach(this.signUpForm.value.email);
    } else if (this.signUpSelectedType == SignUpType.RH) {
      this.createPotentialRh(this.signUpForm.value.email);
    } else {
      Materialize.toast('Vous devez sélectionner un type', 3000, 'rounded')
    }
  }

  createPotentialRh(email: string) {
    console.log('createPotentialRh');

    let body = {
      "email": email,
    };

    this.adminAPIService.createPotentialRh(body).subscribe(
      (res: any) => {
        console.log('createPotentialRh, res', res);
        Materialize.toast('Collaborateur RH ajouté !', 3000, 'rounded');
      }, (error) => {
        console.log('createPotentialRh, error', error);
        Materialize.toast("Impossible d'ajouter le RH", 3000, 'rounded');
      }
    );
  }

  createPotentialCoach(email: string) {
    console.log('createPotentialCoach');
    let body = {
      "email": email,
    };

    this.adminAPIService.createPotentialCoach(body).subscribe(
      (res: any) => {
        console.log('createPotentialCoach, res', res);
        Materialize.toast('Collaborateur Coach ajouté !', 3000, 'rounded');
      }, (error) => {
        console.log('createPotentialCoach, error', error);
        Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
      }
    );
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
