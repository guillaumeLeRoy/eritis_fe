import {Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import {Meeting} from "../../../model/meeting";
import {Observable} from "rxjs";
import {MeetingReview} from "../../../model/MeetingReview";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CoachCoacheeService} from "../../../service/CoachCoacheeService";
import {Coachee} from "../../../model/coachee";

@Component({
  selector: 'rb-meeting-item-coach',
  templateUrl: 'meeting-item-coach.component.html',
  styleUrls: ['meeting-item-coach.component.css']
})
export class MeetingItemCoachComponent implements OnInit,AfterViewInit {

  @Input()
  meeting: Meeting;

  @Output()
  meetingUpdated = new EventEmitter();

  private coachee: Coachee;

  private reviews: Observable<MeetingReview[]>;

  private hasSomeReviews: Observable<boolean>;

  private closeMeetingForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log("ngOnInit, meeting : ", this.meeting);

    this.closeMeetingForm = this.formBuilder.group({
      recap: ["", Validators.required],
      score: ["", Validators.required]
    });

    this.coachee = this.meeting.coachee;
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.loadReviews();
  }

  loadReviews() {
    this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("reviews obtained, ", reviews);

        this.hasSomeReviews = Observable.of(reviews != null)
        this.reviews = Observable.of(reviews);

        this.cd.detectChanges();
      }, (error) => {
        console.log('get reviews error', error);
      }
    );
  }

  submitCloseMeetingForm() {
    console.log("submitCloseMeetingForm form : ", this.closeMeetingForm.value)

    //TODO use score value
    this.coachCoacheeService.closeMeeting(this.meeting.id, this.closeMeetingForm.value.recap, "5").subscribe(
      (review: MeetingReview) => {
        console.log("submitCloseMeetingForm, get review : ", review);
        //refresh list of meetings
        this.meetingUpdated.emit(null);
      }, (error) => {
        console.log('closeMeeting error', error);
        //TODO display error
      }
    );

  }

}
