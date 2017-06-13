import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Coachee} from "../../../model/Coachee";
import {PotentialCoachee} from "../../../model/PotentialCoachee";
import {CoachCoacheeService} from "../../../service/CoachCoacheeService";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/apiUser";
import {Rh} from "../../../model/Rh";
import {CoacheeObjective} from "../../../model/CoacheeObjective";
import {Meeting} from "../../../model/meeting";
import {Observable} from "rxjs/Observable";
import {MeetingsService} from "../../../service/meetings.service";
import {RhUsageRate} from "app/model/UsageRate";
import {MeetingReview} from "../../../model/MeetingReview";


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-item-rh',
  templateUrl: './meeting-item-rh.component.html',
  styleUrls: ['./meeting-item-rh.component.css']
})
export class MeetingItemRhComponent implements OnInit, AfterViewInit {

  @Input()
  coachee: Coachee;

  @Input()
  potentialCoachee: PotentialCoachee;

  @Output()
  objectiveChanged = new EventEmitter<string>();

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  private loading: boolean;
  private showDetails = false;

  private meetings: Observable<Meeting[]>;
  private hasBookedMeeting = false;
  private goals = {};

  private coacheeUsageRate: Observable<RhUsageRate>;

  /**
   * Used in Objective modal.
   */
  private coacheeNewObjective: string;

  // private coacheeUsageRate: Observable<RhUsageRate>;

  constructor(private authService: AuthService, private meetingsService: MeetingsService, private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');

    this.getUsageRate(this.coachee.id);
    this.getAllMeetingsForCoachee(this.coachee.id);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    // this.fetchConnectedUser();
  }

  printDateString(date: string) {
    return this.getDate(date);
  }

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getMinutes(date: string) {
    let m = (new Date(date)).getMinutes();
    if (m === 0)
      return '00';
    return m;
  }

  getDate(date: string): string {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
  }

  toggleShowDetails() {
    this.showDetails = this.showDetails ? false : true;
  }

  private getAllMeetingsForCoachee(coacheeId: string) {
    this.loading = true;

    this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(
      (meetings: Meeting[]) => {
        console.log('got meetings for coachee', meetings);
        let bookedMeetings: Meeting[] = [];

        for (let meeting of meetings) {
          if (meeting.agreed_date != null) {
            bookedMeetings.push(meeting);
            this.hasBookedMeeting = true;

            this.getGoal(meeting.id);
          }
        }

        this.meetings = Observable.of(bookedMeetings);
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

  private getGoal(meetingId: string) {
    return this.meetingsService.getMeetingGoal(meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goals[meetingId] = reviews[0].comment;
        else
          this.goals[meetingId] = 'n/a';
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getUsageRate(rhId: string) {
    this.coachCoacheeService.getUsageRate(rhId).subscribe(
      (rate: RhUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.coacheeUsageRate = Observable.of(rate);
      }
    );
  }



  updateCoacheeObjectivePanelVisibility(visible: boolean) {
    if (visible) {
      $('#modify_coachee_objective_modal').openModal();
    } else {
      $('#modify_coachee_objective_modal').closeModal();
    }
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
          if (user instanceof Rh) {
            this.makeAPICallToAddNewObjective(user);
          }
        }
      );
      return;
    }

    if (user instanceof Rh) {
      this.makeAPICallToAddNewObjective(user);
    }

  }

  private makeAPICallToAddNewObjective(user: ApiUser) {
    this.updateCoacheeObjectivePanelVisibility(false);
    //call API
    this.coachCoacheeService.addObjectiveToCoachee(user.id, this.coachee.id, this.coacheeNewObjective).subscribe(
      (obj: CoacheeObjective) => {
        console.log('addObjectiveToCoachee, SUCCESS', obj);
        // close modal
        this.updateCoacheeObjectivePanelVisibility(false);
        this.objectiveChanged.emit(this.coacheeNewObjective);
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

  // private getUsageRate(rhId: string) {
  //   this.coachCoacheeService.getUsageRate(rhId).subscribe(
  //     (rate: RhUsageRate) => {
  //       console.log("getUsageRate, rate : ", rate);
  //       this.coacheeUsageRate = Observable.of(rate);
  //     }
  //   );
  // }

}
