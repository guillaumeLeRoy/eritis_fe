import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit,
  Output
} from "@angular/core";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {AuthService} from "../../../../service/auth.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {ContractPlan} from "../../../../model/ContractPlan";
import {Coachee} from "../../../../model/Coachee";
import {Coach} from "../../../../model/Coach";
import {HRUsageRate} from "../../../../model/HRUsageRate";
import {HR} from "../../../../model/HR";
import {PotentialCoachee} from "../../../../model/PotentialCoachee";
import {ApiUser} from "../../../../model/ApiUser";
import {CoacheeObjective} from "../../../../model/CoacheeObjective";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Utils} from "../../../../utils/Utils";
import {Subject} from "rxjs/Subject";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-meeting-list-rh',
  templateUrl: './meeting-list-rh.component.html',
  styleUrls: ['./meeting-list-rh.component.scss']
})
export class MeetingListRhComponent implements OnInit, AfterViewInit, OnDestroy {

  loading1 = true;
  loading2 = true;

  @Input()
  mUser: HR;

  @Input()
  isAdmin: boolean = false;

  @Output()
  onStartAddNewObjectiveFlow = new EventEmitter<string>();

  private user: Observable<ApiUser>;

  private coachees: Observable<Coachee[]>;
  private potentialCoachees: Observable<PotentialCoachee[]>;

  private hasCollaborators = false;
  private hasPotentialCollaborators = false;

  private subscription: Subscription;
  private refreshSubscription: Subscription;

  //private plans: Observable<ContractPlan[]>;

  constructor(private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loading1 = true;
    this.loading2 = true;
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    this.onRefreshRequested();
  }

  onRefreshRequested() {
    console.log('onRefreshRequested, getConnectedUser');
    this.onUserObtained(this.mUser);
  }

  private onUserObtained(user: HR) {
    console.log('onUserObtained, user : ', user);
    if (user) {
      // rh
      console.log('get a rh');
      this.getAllCoacheesForRh(user.id);
      this.getAllPotentialCoacheesForRh(user.id);
      //this.getAllContractPlans();
      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  private getAllCoacheesForRh(rhId: string) {
    this.subscription = this.coachCoacheeService.getAllCoacheesForRh(rhId, this.isAdmin).subscribe(
      (coachees: Coachee[]) => {
        console.log('got coachees for rh', coachees);

        this.coachees = Observable.of(coachees);
        if (coachees !== null && coachees.length > 0) this.hasCollaborators = true;
        this.cd.detectChanges();
        this.loading1 = false;
      }
    );
  }

  private getAllPotentialCoacheesForRh(rhId: string) {
    this.subscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId, this.isAdmin).subscribe(
      (coachees: PotentialCoachee[]) => {
        console.log('got potentialCoachees for rh', coachees);

        this.potentialCoachees = Observable.of(coachees);
        if (coachees !== null && coachees.length > 0) this.hasPotentialCollaborators = true;
        this.cd.detectChanges();
        this.loading2 = false;
      }
    );
  }

  /*private getAllContractPlans() {
    this.authService.getNotAuth(AuthService.GET_CONTRACT_PLANS, null).subscribe(
      (response) => {
        let json: ContractPlan[] = response.json();
        console.log("getListOfContractPlans, response json : ", json);
        this.plans = Observable.of(json);
        // this.cd.detectChanges();
      }
    );
  }*/

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

  private startAddNewObjectiveFlow(coacheeId: string) {
    this.onStartAddNewObjectiveFlow.emit(coacheeId);
  }

}
