import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {AuthService} from "../../../../service/auth.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {ContractPlan} from "../../../../model/ContractPlan";
import {Coachee} from "../../../../model/Coachee";
import {Coach} from "../../../../model/Coach";
import {RhUsageRate} from "../../../../model/UsageRate";
import {HR} from "../../../../model/HR";
import {PotentialCoachee} from "../../../../model/PotentialCoachee";
import {ApiUser} from "../../../../model/ApiUser";
import {CoacheeObjective} from "../../../../model/CoacheeObjective";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-list-rh',
  templateUrl: './meeting-list-rh.component.html',
  styleUrls: ['./meeting-list-rh.component.css']
})
export class MeetingListRhComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<Coach | Coachee | HR>;

  private coachees: Observable<Coachee[]>;
  private potentialCoachees: Observable<PotentialCoachee[]>;

  private hasCollaborators = false;
  private hasPotentialCollaborators = false;

  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  private plans: Observable<ContractPlan[]>;
  selectedPlan = new ContractPlan('-1');

  potentialCoacheeEmail?;

  private rhUsageRate: Observable<RhUsageRate>;

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


  constructor(private coachCoacheeService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    this.onRefreshRequested();
  }

  onRefreshRequested() {
    let user = this.authService.getConnectedUser();
    console.log('onRefreshRequested, user : ', user);
    if (user == null) {
      this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        (user: Coach | Coachee) => {
          console.log('onRefreshRequested, getConnectedUser');
          this.onUserObtained(user);
        }
      );
    } else {
      this.onUserObtained(user);
    }
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof HR) {
        // rh
        console.log('get a rh');
        this.getAllCoacheesForRh(user.id);
        this.getAllPotentialCoacheesForRh(user.id);
        this.getAllContractPlans();
        this.getUsageRate(user.id)
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  private getAllCoacheesForRh(rhId: string) {
    this.subscription = this.coachCoacheeService.getAllCoacheesForRh(rhId).subscribe(
      (coachees: Coachee[]) => {
        console.log('got coachees for rh', coachees);

        this.coachees = Observable.of(coachees);
        if (coachees !== null && coachees.length > 0) this.hasCollaborators = true;
        this.cd.detectChanges();
      }
    );
  }

  private getAllPotentialCoacheesForRh(rhId: string) {
    this.subscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId).subscribe(
      (coachees: PotentialCoachee[]) => {
        console.log('got potentialCoachees for rh', coachees);

        this.potentialCoachees = Observable.of(coachees);
        if (coachees !== null && coachees.length > 0) this.hasPotentialCollaborators = true;
        this.cd.detectChanges();
      }
    );
  }

  private getAllContractPlans() {
    this.authService.getNotAuth(AuthService.GET_CONTRACT_PLANS, null).subscribe(
      (response) => {
        let json: ContractPlan[] = response.json();
        console.log("getListOfContractPlans, response json : ", json);
        this.plans = Observable.of(json);
        // this.cd.detectChanges();
      }
    );
  }

  private getUsageRate(rhId: string) {
    this.coachCoacheeService.getUsageRate(rhId).subscribe(
      (rate: RhUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.rhUsageRate = Observable.of(rate);
      }
    );
  }

  refreshDashboard() {
    location.reload();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
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
    this.potentialCoacheeEmail = null;
    this.addPotentialCoacheeModalVisibility(false);
  }

  validateAddPotentialCoachee() {
    console.log('validateAddPotentialCoachee, potentialCoacheeEmail : ', this.potentialCoacheeEmail);

    this.addPotentialCoacheeModalVisibility(false);

    this.user.take(1).subscribe(
      (user: ApiUser) => {

        let body = {
          "email": this.potentialCoacheeEmail,
          "plan_id": this.selectedPlan.plan_id,
          "rh_id": user.id
        };

        this.coachCoacheeService.postPotentialCoachee(body).subscribe(
          (res: PotentialCoachee) => {
            console.log('postPotentialCoachee, res', res);
            this.onRefreshRequested();
            Materialize.toast('Collaborateur ajouté !', 3000, 'rounded');
          }, (error) => {
            console.log('postPotentialCoachee, error', error);
            Materialize.toast("Impossible d'ajouter le collaborateur", 3000, 'rounded');
          }
        );
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
        // TODO stop loader
        // clean
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

    // TODO start loader
    let user = this.authService.getConnectedUser();
    if (user == null) {
      let userObs = this.authService.getConnectedUserObservable();
      userObs.take(1).subscribe(
        (user: ApiUser) => {
          console.log('validateAddNewObjectiveModal, got connected user');
          if (user instanceof HR) {
            this.makeAPICallToAddNewObjective(user);
          }
        }
      );
      return;
    }

    if (user instanceof HR) {
      this.makeAPICallToAddNewObjective(user);
    }

  }


}
