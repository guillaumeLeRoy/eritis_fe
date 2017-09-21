import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Meeting} from "../../../../model/Meeting";
import {Observable} from "rxjs";
import {Coach} from "../../../../model/Coach";
import {MeetingReview} from "../../../../model/MeetingReview";
import {MeetingDate} from "../../../../model/MeetingDate";
import {Router} from "@angular/router";
import {MeetingsService} from "../../../../service/meetings.service";
import {Utils} from "../../../../utils/Utils";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-item-coachee',
  templateUrl: './meeting-item-coachee.component.html',
  styleUrls: ['./meeting-item-coachee.component.scss'],
})
export class MeetingItemCoacheeComponent implements OnInit {

  @Input()
  meeting: Meeting;

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

  // onPreMeetingReviewPosted(meeting: Meeting) {
  //   console.log("onPreMeetingReviewPosted");
  //   this.getReview();
  // }
  //
  // onPotentialDatePosted(date: MeetingDate) {
  //   console.log("onPotentialDatePosted");
  //   this.potentialDatePosted.emit(date);
  // }


  private loadMeetingPotentialTimes() {
    this.loading = true;

    this.meetingService.getMeetingPotentialTimes(this.meeting.id).subscribe(
      (dates: MeetingDate[]) => {
        console.log("potential dates obtained, ", dates);
        this.potentialDates = Observable.of(dates);
        this.cd.detectChanges();
        this.loading = false;
      }, (error) => {
        console.log('get potentials dates error', error);
      }
    );
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

  private getGoal() {
    this.loading = true;

    this.meetingService.getMeetingGoal(this.meeting.id).subscribe(
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

    this.meetingService.getMeetingContext(this.meeting.id).subscribe(
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

    this.meetingService.getSessionReviewResult(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeResult, got result : ", reviews);
        if (reviews != null)
          this.sessionResult = reviews[0].value;
        else
          this.sessionResult = null;

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

    this.meetingService.getSessionReviewUtility(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeUtility, got goal : ", reviews);
        if (reviews != null)
          this.sessionUtility = reviews[0].value;
        else
          this.sessionUtility = null;

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

    this.meetingService.getSessionReviewRate(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeRate, got rate : ", reviews);
        if (reviews != null)
          this.sessionRate = reviews[0].value;
        else
          this.sessionRate = null;

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
    this.router.navigate(['/date', meetingId]);
  }

  openModal() {
    this.cancelMeetingTimeEvent.emit(this.meeting);//TODO to improve
    // $('#deleteModal').openModal();
  }

  goToChatRoom() {
    console.log('goToChatRoom');
    let win = window.open(this.meeting.coach.chat_room_url, "_blank");
  }

  goToCoachProfile(coachId: string) {
    window.scrollTo(0, 0);
    this.router.navigate(['/profile_coach', coachId]);
  }

  rateSession() {
    console.log('rateSession');
    this.onRateSessionBtnClickedEmitter.emit(this.meeting.id);
  }

  // cancelCancelMeeting() {
  //   $('#deleteModal').closeModal();
  //
  // }
  //
  // confirmCancelMeeting() {
  //   console.log('confirmCancelMeeting');
  //
  //   $('#deleteModal').closeModal();
  //
  //   this.meetingAPIService.deleteMeeting(this.meeting.id).subscribe(
  //     (response: Response) => {
  //       console.log('confirmCancelMeeting, res', response);
  //       this.onMeetingCancelled.emit();
  //       Materialize.toast('Meeting supprimé !', 3000, 'rounded')
  //     }, (error) => {
  //       console.log('confirmCancelMeeting, error', error);
  //       Materialize.toast('Impossible de supprimer le meeting', 3000, 'rounded')
  //     }
  //   );
  // }

}
