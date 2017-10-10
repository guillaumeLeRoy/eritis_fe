import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import {Coachee} from "../../../../model/Coachee";
import {PotentialCoachee} from "../../../../model/PotentialCoachee";
import {Meeting} from "../../../../model/Meeting";
import {Observable} from "rxjs/Observable";
import {MeetingsService} from "../../../../service/meetings.service";
import {MeetingReview} from "../../../../model/MeetingReview";
import {Router} from "@angular/router";
import {Utils} from "../../../../utils/Utils";
import {Subscription} from "rxjs/Subscription";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-meeting-item-rh',
  templateUrl: './meeting-item-rh.component.html',
  styleUrls: ['./meeting-item-rh.component.scss']
})
export class MeetingItemRhComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  coachee: Coachee;

  @Input()
  potentialCoachee: PotentialCoachee;

  @Input()
  isAdmin: boolean = false;

  /**
   * Event emitted when user clicks on the "Objective" btn.
   * @type {EventEmitter<string>} the coacheeId
   */
  @Output()
  onUpdateObjectiveBtnClick = new EventEmitter<string>();

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  private loading: boolean;
  private showDetails = false;

  private meetings: Observable<Meeting[]>;
  private hasBookedMeeting = false;
  private goals = {};
  private sessionRates = {};

  private mSessionReviewRateSubscription: Subscription;
  private mSessionGoalSubscription: Subscription;
  private mGetAllMeetingsSubscription: Subscription;

  constructor(private meetingsService: MeetingsService, private cd: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {
    console.log('ngOnInit, coachee : ', this.coachee);
    if (this.coachee != null) {
      this.getAllMeetingsForCoachee(this.coachee.id);
    }
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit, coachee : ', this.coachee);
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');

    if (this.mGetAllMeetingsSubscription != null) {
      this.mGetAllMeetingsSubscription.unsubscribe();
    }

    if (this.mSessionReviewRateSubscription != null) {
      this.mSessionReviewRateSubscription.unsubscribe();
    }

    if (this.mSessionGoalSubscription != null) {
      this.mSessionGoalSubscription.unsubscribe();
    }

  }

  dateToStringShort(date: string): string {
    return Utils.dateToStringShort(date);
  }

  goToCoacheeProfile(coacheeId: String) {
    if (this.isAdmin)
      this.router.navigate(['admin/profile/coachee', coacheeId]);
    else
      this.router.navigate(['dashboard/profile_coachee', coacheeId]);
  }

  toggleShowDetails() {
    this.showDetails = this.showDetails ? false : true;
  }

  private getAllMeetingsForCoachee(coacheeId: string) {
    this.loading = true;

    this.mGetAllMeetingsSubscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId, this.isAdmin).subscribe(
      (meetings: Meeting[]) => {
        console.log('got meetings for coachee', meetings);
        let bookedMeetings: Meeting[] = [];

        for (let meeting of meetings) {
          if (meeting.agreed_date != null) {
            bookedMeetings.push(meeting);
            this.hasBookedMeeting = true;

            // get goal
            this.getGoal(meeting.id);
            //get rate
            this.getSessionReviewTypeRate(meeting.id);
          }
        }

        this.meetings = Observable.of(bookedMeetings);
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

  private getGoal(meetingId: string) {
    // todo should have an array or list of sub
    this.mSessionGoalSubscription = this.meetingsService.getMeetingGoal(meetingId, this.isAdmin)
      .subscribe(
        (reviews: MeetingReview[]) => {
          console.log("getMeetingGoal, got goal : ", reviews);
          if (reviews != null)
            this.goals[meetingId] = reviews[0].value;
          else
            this.goals[meetingId] = 'Non renseigné';
        },
        (error) => {
          console.log('getMeetingGoal error', error);
          //this.displayErrorPostingReview = true;
        });
  }

  private getSessionReviewTypeRate(meetingId: string) {
    this.mSessionReviewRateSubscription = this.meetingsService.getSessionReviewRate(meetingId, this.isAdmin)
      .subscribe(
        (reviews: MeetingReview[]) => {
          console.log("getSessionReviewTypeRate, got rate : ", reviews);
          if (reviews != null)
            this.sessionRates[meetingId] = reviews[0].value;
          else
            this.sessionRates[meetingId] = "Inconnu";
        },
        (error) => {
          console.log('getSessionReviewTypeRate error', error);
          //this.displayErrorPostingReview = true;
        });
  }

  onClickAddObjectiveBtn() {
    this.onUpdateObjectiveBtnClick.emit(this.coachee.id);
  }

  dayAndMonthFromTimestamp(timestamp: number): string {
    return Utils.getDayAndMonthFromTimestamp(timestamp);
  }
}
