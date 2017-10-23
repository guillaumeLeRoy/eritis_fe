import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {Meeting} from "../../../../model/Meeting";
import {Observable} from "rxjs";
import {Coach} from "../../../../model/Coach";
import {MeetingReview} from "../../../../model/MeetingReview";
import {MeetingDate} from "../../../../model/MeetingDate";
import {Router} from "@angular/router";
import {MeetingsService} from "../../../../service/meetings.service";
import {Utils} from "../../../../utils/Utils";
import {Subscription} from "rxjs/Subscription";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-meeting-item-coachee',
  templateUrl: './meeting-item-coachee.component.html',
  styleUrls: ['./meeting-item-coachee.component.scss'],
})
export class MeetingItemCoacheeComponent implements OnInit, OnDestroy {

  @Input()
  meeting: Meeting;

  @Input()
  isAdmin: boolean;

  // @Output()
  // onMeetingCancelled = new EventEmitter<any>();

  @Output()
  cancelMeetingTimeEvent = new EventEmitter<Meeting>();

  @Output()
  onRateSessionBtnClickedEmitter = new EventEmitter<any>();

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private coach: Coach;

  /**
   * Session objective and context given by the coachee
   */
  private goal: Observable<string>;
  private context: Observable<string>;
  private hasGoal: boolean;
  private hasContext: boolean;

  /**
   * Session review given by the coach
   */
  private sessionResult: string;
  private hasSessionResult: boolean;

  /**
   * Session review given by the coach
   */
  private sessionUtility: string;
  private hasSessionUtility: boolean;

  /**
   * Coach rate given by coachee
   */
  private sessionRate: string;
  private hasRate: boolean;

  private loading: boolean;

  /* Meeting potential dates */
  private potentialDates: Observable<MeetingDate[]>;

  private mSessionReviewUtilitySubscription: Subscription;
  private mSessionReviewResultSubscription: Subscription;
  private mSessionReviewRateSubscription: Subscription;
  private mSessionContextSubscription: Subscription;
  private mSessionGoalSubscription: Subscription;
  private mSessionPotentialTimesSubscription: Subscription;

  constructor(private router: Router, private meetingService: MeetingsService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.coach = this.meeting.coach;

    console.log("ngOnInit, coach : ", this.coach);

    this.loadMeetingPotentialTimes();
    this.getGoal();
    this.getContext();
    this.getSessionCoachReview();
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");

    if (this.mSessionReviewUtilitySubscription != null) {
      this.mSessionReviewUtilitySubscription.unsubscribe();
    }

    if (this.mSessionReviewResultSubscription != null) {
      this.mSessionReviewResultSubscription.unsubscribe();
    }

    if (this.mSessionReviewRateSubscription != null) {
      this.mSessionReviewRateSubscription.unsubscribe();
    }

    if (this.mSessionContextSubscription != null) {
      this.mSessionContextSubscription.unsubscribe();
    }

    if (this.mSessionGoalSubscription != null) {
      this.mSessionGoalSubscription.unsubscribe();
    }

    if (this.mSessionPotentialTimesSubscription != null) {
      this.mSessionPotentialTimesSubscription.unsubscribe();
    }

  }


  timestampToString(timestamp: number): string {
    return Utils.timestampToString(timestamp);
  }

  hoursAndMinutesFromTimestamp(timestamp: number) {
    return Utils.getHoursAndMinutesFromTimestamp(timestamp);
  }

  getDate(date: string) {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
  }

  private getSessionCoachReview() {
    this.getSessionReviewTypeResult();
    this.getSessionReviewTypeUtility();
    this.getSessionReviewTypeRate();
  }

  private loadMeetingPotentialTimes() {
    this.loading = true;

    this.mSessionPotentialTimesSubscription = this.meetingService.getMeetingPotentialTimes(this.meeting.id, this.isAdmin).subscribe(
      (dates: Array<MeetingDate>) => {
        console.log("potential dates obtained, ", dates);
        this.potentialDates = Observable.of(dates);
        this.cd.detectChanges();
        this.loading = false;
      }, (error) => {
        console.log('get potentials dates error', error);
      }
    );
  }

  private getGoal() {
    this.loading = true;

    this.mSessionGoalSubscription = this.meetingService.getMeetingGoal(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null) {
          this.hasGoal = true;
          this.goal = Observable.of(reviews[0].value);
        } else {
          this.hasGoal = false;
          this.goal = null;
        }

        this.cd.detectChanges();
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getContext() {
    this.loading = true;

    this.mSessionContextSubscription = this.meetingService.getMeetingContext(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingContext, got context : ", reviews);
        if (reviews != null) {
          this.hasContext = true;
          this.context = Observable.of(reviews[0].value);
        } else {
          this.hasContext = false;
          this.context = null;
        }

        this.loading = false;
        this.cd.detectChanges();
      },
      (error) => {
        console.log('getMeetingContext error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getSessionReviewTypeResult() {
    this.loading = true;

    this.mSessionReviewResultSubscription = this.meetingService.getSessionReviewResult(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeResult, got result : ", reviews);
        if (reviews != null) {
          this.sessionResult = reviews[0].value;
        } else {
          this.sessionResult = null;
        }

        this.cd.detectChanges();
        this.hasSessionResult = (this.sessionResult != null);
        this.loading = false;
      },
      (error) => {
        console.log('getReviewResult error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getSessionReviewTypeUtility() {
    this.loading = true;

    this.mSessionReviewUtilitySubscription = this.meetingService.getSessionReviewUtility(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeUtility, got goal : ", reviews);
        if (reviews != null) {
          this.sessionUtility = reviews[0].value;
        } else {
          this.sessionUtility = null;
        }

        this.cd.detectChanges();
        this.hasSessionUtility = (this.sessionUtility != null);
        this.loading = false;
      },
      (error) => {
        console.log('getSessionReviewTypeUtility error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getSessionReviewTypeRate() {
    this.loading = true;

    this.mSessionReviewRateSubscription = this.meetingService.getSessionReviewRate(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeRate, got rate : ", reviews);
        if (reviews != null) {
          this.sessionRate = reviews[0].value;
        } else {
          this.sessionRate = null;
        }

        this.cd.detectChanges();
        this.hasRate = (this.sessionRate != null);
        this.loading = false;
      },
      (error) => {
        console.log('getSessionReviewTypeRate error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  goToModifyDate(meetingId: number) {
    window.scrollTo(0, 0);
    this.router.navigate(['dashboard/date', meetingId]);
  }

  openModal() {
    this.cancelMeetingTimeEvent.emit(this.meeting);//TODO to improve
    // $('#deleteModal').openModal();
  }

  goToChatRoom() {
    console.log('goToChatRoom');
    window.open(this.meeting.coach.chat_room_url, "_blank");
  }

  goToCoachProfile(coachId: string) {
    window.scrollTo(0, 0);
    if (this.isAdmin)
      this.router.navigate(['admin/profile/coach', coachId]);
    else
      this.router.navigate(['dashboard/profile_coach', coachId]);
  }

  rateSession() {
    console.log('rateSession');
    this.onRateSessionBtnClickedEmitter.emit(this.meeting.id);
  }

  // Return true if the session starts in less than 10 minutes
  canLaunch() {
    if (this.meeting) {
      let limitTime = new Date(this.meeting.agreed_date.start_date);
      limitTime.setHours(limitTime.getHours() - 1);
      limitTime.setMinutes(50);
      return (new Date()) >= limitTime;
    }

    return false;
  }

}
