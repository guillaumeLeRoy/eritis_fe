import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {Meeting} from "../meeting";
import {Observable} from "rxjs";
import {MeetingReview} from "../../model/MeetingReview";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Coachee} from "../../model/coachee";

@Component({
  selector: 'rb-meeting-item-coach',
  templateUrl: './meeting-item-coach.component.html',
  styleUrls: ['./meeting-item-coach.component.css']
})
export class MeetingItemCoachComponent implements OnInit,AfterViewInit {

  @Input()
  private meeting: Meeting;

  private coachee: Observable<Coachee>;

  private reviews: Observable<MeetingReview[]>;

  private hasSomeReviews: Observable<boolean>;

  private closeMeetingForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private coachCoacheeService: CoachCoacheeService) {
  }

  ngOnInit() {
    console.log("ngOnInit form");

    this.closeMeetingForm = this.formBuilder.group({
      recap: ["", Validators.required],
      toto: ["", Validators.required]
    });
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");

    this.coachee = this.coachCoacheeService.getCoacheeForId(this.meeting.coachee_id);
    this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("reviews obtained");

        this.hasSomeReviews = Observable.of(reviews != null)
        this.reviews = Observable.of(reviews);
      }
    );

  }

  submitCloseMeetingForm() {
    console.log("submitCloseMeetingForm form : ", this.closeMeetingForm.value)

    this.coachCoacheeService.closeMeeting(this.meeting.id, this.closeMeetingForm.value.recap).subscribe(
      (review: MeetingReview) => {
        console.log("closeMeeting, get review : ", review);
      }
    );

  }

}
