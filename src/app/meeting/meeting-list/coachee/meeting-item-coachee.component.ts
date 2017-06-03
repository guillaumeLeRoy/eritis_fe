import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Meeting} from "../../../model/Meeting";
import {Observable} from "rxjs";
import {Coach} from "../../../model/Coach";
import {MeetingReview} from "../../../model/MeetingReview";
import {MeetingDate} from "../../../model/MeetingDate";
import {Router} from "@angular/router";
import {MeetingsService} from "../../../service/meetings.service";
import {ApiUser} from "app/model/apiUser";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-item-coachee',
  templateUrl: 'meeting-item-coachee.component.html',
  styleUrls: ['meeting-item-coachee.component.css'],
})
export class MeetingItemCoacheeComponent implements OnInit {

  @Input()
  meeting: Meeting;

  // @Output()
  // onMeetingCancelled = new EventEmitter<any>();

  @Output()
  cancelMeetingTimeEvent = new EventEmitter<Meeting>();

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private coach: Coach;

  private goal: string;
  private reviewValue: string;
  private reviewNextStep: string;

  private hasValue: boolean;
  private hasNextStep: boolean;
  private hasGoal: boolean;

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
    this.getReview();
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

  printTimeString(date: string) {
    return this.getHours(date) + ':' + this.getMinutes(date);
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

  getDate(date: string) {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
  }

  private getGoal() {
    this.loading = true;

    this.meetingService.getMeetingGoal(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goal = reviews[0].comment;
        else
          this.goal = null;

        this.cd.detectChanges();
        this.hasGoal = (this.goal != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReviewValue() {
    this.loading = true;

    this.meetingService.getMeetingValue(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingValue, got goal : ", reviews);
        if (reviews != null)
          this.reviewValue = reviews[0].comment;
        else
          this.reviewValue = null;

        this.cd.detectChanges();
        this.hasValue = (this.reviewValue != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingValue error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReviewNextStep() {
    this.loading = true;

    this.meetingService.getMeetingNextStep(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingNextStep, got goal : ", reviews);
        if (reviews != null)
          this.reviewNextStep = reviews[0].comment;
        else
          this.reviewNextStep = null;

        this.cd.detectChanges();
        this.hasNextStep = (this.reviewNextStep != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingNextStep error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReview() {
    this.getReviewValue();
    this.getReviewNextStep();
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
