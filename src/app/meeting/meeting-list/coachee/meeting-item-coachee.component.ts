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

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  private coach: Coach;
  private reviews: Observable<MeetingReview[]>;

  private goal: string;

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

    this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {

        console.log("loadReview, reviews obtained");

        this.hasSomeReviews = Observable.of(reviews != null);
        this.reviews = Observable.of(reviews);

        this.cd.detectChanges();
      }, (error) => {
        console.log('loadReview error', error);
      }
    );
  }

  private loadMeetingPotentialTimes() {
    this.coachCoacheeService.getMeetingPotentialTimes(this.meeting.id).subscribe(
      (dates: MeetingDate[]) => {
        console.log("potential dates obtained, ", dates);
        this.potentialDates = Observable.of(dates);
        this.cd.detectChanges();
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

  getGoal() {
    this.coachCoacheeService.getMeetingGoal(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goal = reviews[0].comment;
        else
          this.goal = null;
      },
      (error) => {
        console.log('getMeetingReviews error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  hasGoal(meetingId: string) {
    /*this.coachCoacheeService.getMeetingReviews(meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getAllMeetingReviews, got reviews : ", reviews);

        if (reviews != null) {
          //search for correct type
          for (let review of reviews) {
            if (review.type == MEETING_REVIEW_TYPE_SESSION_GOAL) {
              return true;
            }
          }
        }
        return false;
      },
      (error) => {
        console.log('getAllMeetingReviews error', error);
        //this.displayErrorPostingReview = true;
      });*/
    return this.goal != null;
  }

  hasReview(meetingId: string) {
    return false;
  }

  goToModifyDate(meetingId: number) {
    this.router.navigate(['/date', meetingId]);
  }
}
