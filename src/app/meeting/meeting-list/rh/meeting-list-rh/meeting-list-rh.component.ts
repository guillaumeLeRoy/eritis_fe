import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Coachee} from "../../../../model/Coachee";
import {HR} from "../../../../model/HR";
import {PotentialCoachee} from "../../../../model/PotentialCoachee";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-meeting-list-rh',
  templateUrl: './meeting-list-rh.component.html',
  styleUrls: ['./meeting-list-rh.component.scss']
})
export class MeetingListRhComponent implements OnInit, OnDestroy {

  loading1 = true;
  loading2 = true;

  @Input()
  user: Observable<HR>;

  @Input()
  isAdmin: boolean = false;

  @Output()
  onStartAddNewObjectiveFlow = new EventEmitter<string>();

  private coachees: Observable<Coachee[]>;
  private potentialCoachees: Observable<PotentialCoachee[]>;

  private hasCollaborators = false;
  private hasPotentialCollaborators = false;

  private userSubscription: Subscription;
  private getAllCoacheesForRhSubscription: Subscription;
  private getAllPotentialCoacheesForRhSubscription: Subscription;

  constructor(private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');

    this.loading1 = true;
    this.loading2 = true;

    this.userSubscription = this.user.subscribe((user: HR) => {
      this.onUserObtained(user);
    });
  }


  ngOnDestroy(): void {
    if (this.getAllCoacheesForRhSubscription)
      this.getAllCoacheesForRhSubscription.unsubscribe();

    if (this.getAllPotentialCoacheesForRhSubscription)
      this.getAllPotentialCoacheesForRhSubscription.unsubscribe();

    if(this.userSubscription)
      this.userSubscription.unsubscribe();
  }

  startAddNewObjectiveFlow(coacheeId: string) {
    this.onStartAddNewObjectiveFlow.emit(coacheeId);
  }

  private onUserObtained(user: HR) {
    console.log('onUserObtained, user : ', user);
    if (user) {
      // rh
      console.log('get a rh');
      this.getAllCoacheesForRh(user.id);
      this.getAllPotentialCoacheesForRh(user.id);
      //this.getAllContractPlans();
      // this.cd.detectChanges();
    }
  }

  private getAllCoacheesForRh(rhId: string) {
    this.getAllCoacheesForRhSubscription = this.coachCoacheeService.getAllCoacheesForRh(rhId, this.isAdmin)
      .subscribe(
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
    this.getAllPotentialCoacheesForRhSubscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId, this.isAdmin)
      .subscribe(
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

}
