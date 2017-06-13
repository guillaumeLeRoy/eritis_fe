import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {AuthService} from "../../../../service/auth.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {ContractPlan} from "../../../../model/ContractPlan";
import {Coachee} from "../../../../model/Coachee";
import {Coach} from "../../../../model/Coach";
import {RhUsageRate} from "../../../../model/UsageRate";
import {Rh} from "../../../../model/Rh";
import {PotentialCoachee} from "../../../../model/PotentialCoachee";
import {ApiUser} from "../../../../model/ApiUser";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-list-rh',
  templateUrl: './meeting-list-rh.component.html',
  styleUrls: ['./meeting-list-rh.component.css']
})
export class MeetingListRhComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<Coach | Coachee | Rh>;

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

      if (user instanceof Rh) {
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
   ----------- Modal control ------------
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

}
