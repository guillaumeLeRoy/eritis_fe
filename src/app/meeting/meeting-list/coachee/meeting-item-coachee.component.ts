import {Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import {Meeting} from "../../../model/meeting";
import {CoachCoacheeService} from "../../../service/CoachCoacheeService";
import {Observable} from "rxjs";
import {Coach} from "../../../model/Coach";
import {MEETING_REVIEW_TYPE_SESSION_GOAL, MeetingReview} from "../../../model/MeetingReview";
import {MeetingDate} from "../../../model/MeetingDate";
import {Router} from "@angular/router";

@Component({
  selector: 'rb-meeting-item-coachee',
  templateUrl: 'meeting-item-coachee.component.html',
  styleUrls: ['meeting-item-coachee.component.css'],
})
export class MeetingItemCoacheeComponent implements OnInit {

  @Input()
  meeting: Meeting;

  @Output()
  potentialDatePosted = new EventEmitter<MeetingDate>();

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private coach: Coach;
  private reviews: Observable<MeetingReview[]>;

  private goal: string;
  private reviewValue: string;
  private reviewNextStep: string;

  private loading: boolean;

  /* Meeting potential dates */
  private potentialDates: Observable<MeetingDate[]>;

  private hasSomeReviews: Observable<boolean>;

  constructor(private router: Router, private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.coach = this.meeting.coach;

    console.log("ngOnInit, coach : ", this.coach);

    this.loadReview();
    this.loadMeetingPotentialTimes();
    this.getGoal();
    this.getReviewValue();
    this.getReviewNextStep();
  }

  onPreMeetingReviewPosted(meeting: Meeting) {
    console.log("onPreMeetingReviewPosted");
    this.loadReview();
  }

  onPotentialDatePosted(date: MeetingDate) {
    console.log("onPotentialDatePosted");
    this.potentialDatePosted.emit(date);
  }

  private loadReview() {
    console.log("loadReview");

    this.loading = true;

    this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {

        console.log("loadReview, reviews obtained");

        this.hasSomeReviews = Observable.of(reviews != null);
        this.reviews = Observable.of(reviews);

        this.cd.detectChanges();
        this.loading = false;
      }, (error) => {
        console.log('loadReview error', error);
      }
    );
  }

  private loadMeetingPotentialTimes() {
    this.loading = true;

    this.coachCoacheeService.getMeetingPotentialTimes(this.meeting.id).subscribe(
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

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getDate(date: string) {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
  }

  private getGoal() {
    this.loading = true;

    this.coachCoacheeService.getMeetingGoal(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goal = reviews[0].comment;
        else
          this.goal = null;

        this.cd.detectChanges();
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  hasGoal() {
    return this.goal != null;
  }

  private getReviewValue() {
    this.loading = true;

    this.coachCoacheeService.getMeetingValue(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingValue, got goal : ", reviews);
        if (reviews != null)
          this.reviewValue = reviews[0].comment;
        else
          this.reviewValue = null;

        this.cd.detectChanges();
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingValue error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReviewNextStep() {
    this.loading = true;

    this.coachCoacheeService.getMeetingNextStep(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingNextStep, got goal : ", reviews);
        if (reviews != null)
          this.reviewNextStep = reviews[0].comment;
        else
          this.reviewNextStep = null;

        this.cd.detectChanges();
        this.loading = false
      },
      (error) => {
        console.log('getMeetingNextStep error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  hasReview() {
    return (this.reviewValue != null && this.reviewNextStep != null);
  }

  goToModifyDate(meetingId: number) {
    this.router.navigate(['/date', meetingId]);
  }
}
