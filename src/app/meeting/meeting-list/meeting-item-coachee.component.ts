import {Component, OnInit, Input} from '@angular/core';
import {Meeting} from "../meeting";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Observable} from "rxjs";
import {Coach} from "../../model/Coach";
import {MeetingReview} from "../../model/MeetingReview";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {Coachee} from "../../model/coachee";

@Component({
  selector: 'rb-meeting-item-coachee',
  templateUrl: 'meeting-item-coachee.component.html',
  styleUrls: ['meeting-item-coachee.component.css'],
})
export class MeetingItemCoacheeComponent implements OnInit {

  @Input()
  private meeting: Meeting;

  private coach: Observable<Coach>;

  private reviews: Observable<MeetingReview[]>;

  private hasSomeReviews: Observable<boolean>;

  private closeMeetingForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private coachCoacheeService: CoachCoacheeService) {
  }

  ngOnInit() {

    this.closeMeetingForm = this.formBuilder.group({
      recap: ['', [Validators.required]],
    });

    this.coach = this.coachCoacheeService.getCoachForId(this.meeting.coach_id);
    this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {

        this.hasSomeReviews = Observable.of(reviews != null)
        this.reviews = Observable.of(reviews);
      }
    );
  }


}
