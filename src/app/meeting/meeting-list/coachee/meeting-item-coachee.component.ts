import {Component, OnInit, Input, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {Meeting} from "../../../model/meeting";
import {CoachCoacheeService} from "../../../service/CoachCoacheeService";
import {Observable} from "rxjs";
import {Coach} from "../../../model/Coach";
import {MeetingReview} from "../../../model/MeetingReview";
import {$} from "protractor";

@Component({
  selector: 'rb-meeting-item-coachee',
  templateUrl: 'meeting-item-coachee.component.html',
  styleUrls: ['meeting-item-coachee.component.css'],
})
export class MeetingItemCoacheeComponent implements OnInit,AfterViewInit {
  ngAfterViewInit(): void {
  }

  val: number;

  @Input()
  private meeting: Meeting;

  private coach: Coach;

  private reviews: Observable<MeetingReview[]>;

  private hasSomeReviews: Observable<boolean>;

  constructor(private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.coach = this.meeting.coach;

    console.log("ngOnInit, coach : ", this.coach);

    this.loadReview();
  }

  onPreMeetingReviewPosted(meeting: Meeting) {
    console.log("onPreMeetingReviewPosted");
    this.loadReview();
  }


  private loadReview() {
    console.log("loadReview");

    this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {

        console.log("loadReview, reviews obtained");

        this.hasSomeReviews = Observable.of(reviews != null)
        this.reviews = Observable.of(reviews);

        this.cd.detectChanges();
      }, (error) => {
        console.log('loadReview error', error);
      }
    );
  }


}
