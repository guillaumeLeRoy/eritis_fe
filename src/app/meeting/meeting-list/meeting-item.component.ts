import {Component, OnInit, Input} from '@angular/core';
import {Meeting} from "../meeting";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Observable} from "rxjs";
import {Coach} from "../../model/Coach";
import {MeetingReview} from "../../model/MeetingReview";

@Component({
  selector: 'rb-meeting-item',
  templateUrl: './meeting-item.component.html',
  styleUrls: ['./meeting-item.component.css'],
})
export class MeetingItemComponent implements OnInit {

  @Input()
  private meeting: Meeting;

  private coach: Observable<Coach>;

  private reviews: Observable<MeetingReview[]>;

  private hasSomeReviews: Observable<boolean>;

  constructor(private coachCoacheeService: CoachCoacheeService) {
  }

  ngOnInit() {
    this.coach = this.coachCoacheeService.getCoachForId(this.meeting.coach_id);
    this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {

        this.hasSomeReviews = Observable.of(reviews != null)
        this.reviews = Observable.of(reviews);
      }
    );
  }


}
