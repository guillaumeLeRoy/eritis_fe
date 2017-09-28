import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {ApiUser} from "../../../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";
import {AuthService} from "../../../../service/auth.service";
import {HR} from "../../../../model/HR";
import {HRUsageRate} from "../../../../model/HRUsageRate";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {ContractPlan} from "../../../../model/ContractPlan";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Utils} from "../../../../utils/Utils";
import {CoacheeObjective} from "../../../../model/CoacheeObjective";
import {PotentialCoachee} from "../../../../model/PotentialCoachee";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-rh-dashboard',
  templateUrl: './rh-dashboard.component.html',
  styleUrls: ['./rh-dashboard.component.scss']
})
export class RhDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private userObs: BehaviorSubject<HR>;

  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  private HrUsageRate: Observable<HRUsageRate>;

  /**
   * Used in Objective modal.
   * Describe new objective
   */
  private coacheeNewObjective: string;

  /**
   * Used in Objective modal.
   * Coachee id
   */
  private addNewObjectiveCoacheeId: string;

  private selectedPlan = new ContractPlan(-1);

  private signInForm: FormGroup;

  constructor(private authService: AuthService, private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef, private formBuilder: FormBuilder) {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(Utils.EMAIL_REGEX)]],
      first_name: [''],
      last_name: [''],
    });

    this.userObs = new BehaviorSubject(null);
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  onRefreshRequested() {
    this.connectedUserSubscription = this.authService.refreshConnectedUser().subscribe(
      (user: ApiUser) => {
        console.log('onRefreshRequested, getConnectedUser');
        this.onUserObtained(user);
      }
    );
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof HR) {
        // rh
        console.log('get a rh');
        this.getUsageRate(user.id);
        // this.user = Observable.of(user);
        this.userObs.next(user);
        this.cd.detectChanges();
      }
    }
  }

  private getUsageRate(rhId: string) {
    this.coachCoacheeService.getUsageRate(rhId).subscribe(
      (rate: HRUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.HrUsageRate = Observable.of(rate);
      }
    );
  }


  /*************************************
   ----------- Modal control for new coachee's objective ------------
   *************************************/

  private updateCoacheeObjectivePanelVisibility(visible: boolean) {
    if (visible) {
      $('#add_new_objective_modal').openModal();
    } else {
      $('#add_new_objective_modal').closeModal();
    }
  }


  private makeAPICallToAddNewObjective(user: ApiUser) {
    this.updateCoacheeObjectivePanelVisibility(false);
    //call API
    this.coachCoacheeService.addObjectiveToCoachee(user.id, this.addNewObjectiveCoacheeId, this.coacheeNewObjective).subscribe(
      (obj: CoacheeObjective) => {
        console.log('addObjectiveToCoachee, SUCCESS', obj);
        // close modal
        this.updateCoacheeObjectivePanelVisibility(false);
        this.onRefreshRequested();
        Materialize.toast("L'objectif a été modifié !", 3000, 'rounded')
        this.coacheeNewObjective = null;
      }, (error) => {
        console.log('addObjectiveToCoachee, error', error);
        Materialize.toast("Imposible de modifier l'objectif", 3000, 'rounded')
      }
    );
  }

  startAddNewObjectiveFlow(coacheeId: string) {
    console.log('startAddNewObjectiveFlow, coacheeId : ', coacheeId);

    this.updateCoacheeObjectivePanelVisibility(true);
    this.addNewObjectiveCoacheeId = coacheeId;
  }

  cancelAddNewObjectiveModal() {
    this.updateCoacheeObjectivePanelVisibility(false);
  }

  validateAddNewObjectiveModal() {
    console.log('validateAddNewObjectiveModal');

    this.userObs.asObservable().take(1).subscribe(
      (user: ApiUser) => {
        console.log('validateAddNewObjectiveModal, got connected user');
        if (user instanceof HR) {
          this.makeAPICallToAddNewObjective(user);
        }
      }
    );
    return;
  }


  /*************************************
   ----------- Modal control for Potential Coachee ------------
   *************************************/

  addPotentialCoacheeModalVisibility(isVisible: boolean) {
    if (isVisible) {
      $('#add_potential_coachee_modal').openModal();
    } else {
      $('#add_potential_coachee_modal').closeModal();
    }
  }

  cancelAddPotentialCoachee() {
    // this.potentialCoacheeEmail = null;
    this.addPotentialCoacheeModalVisibility(false);
  }

  validateAddPotentialCoachee() {
    // console.log('validateAddPotentialCoachee, potentialCoacheeEmail : ', this.potentialCoacheeEmail);

    this.addPotentialCoacheeModalVisibility(false);

    this.userObs.asObservable().take(1).subscribe(
      (user: ApiUser) => {

        // let body = {
        //   "email": this.potentialCoacheeEmail,
        //   "plan_id": this.selectedPlan.plan_id,
        //   "rh_id": user.id,
        //   "first_name": this.potentialCoacheeFirstName,
        //   "last_name": this.potentialCoacheeLastName,
        // };

        // force Plan
        this.selectedPlan.plan_id = 1;

        let body = {
          "email": this.signInForm.value.email,
          "plan_id": this.selectedPlan.plan_id,
          "rh_id": user.id,
          "first_name": this.signInForm.value.first_name,
          "last_name": this.signInForm.value.last_name,
        };

        console.log('postPotentialCoachee, body', body);

        this.coachCoacheeService.postPotentialCoachee(body).subscribe(
          (res: PotentialCoachee) => {
            console.log('postPotentialCoachee, res', res);
            Materialize.toast('Manager ajouté !', 3000, 'rounded');
            this.onRefreshRequested();
          }, (errorRes: Response) => {
            let json: any = errorRes.json();
            console.log('postPotentialCoachee, error', json);
            if (json.error == "EMAIL_ALREADY_USED") {
              Materialize.toast("Impossible d'ajouter le manager, cet email est déjà utilisé", 3000, 'rounded');
            } else {
              Materialize.toast("Impossible d'ajouter le manager", 3000, 'rounded');
            }
          }
        );
      }
    );

  }

}
