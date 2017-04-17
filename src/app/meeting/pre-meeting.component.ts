import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoachCoacheeService} from "../service/CoachCoacheeService";
import {MeetingReview} from "../model/MeetingReview";

@Component({
  selector: 'er-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.css']
})
export class PreMeetingComponent implements OnInit {

  @Input()
  meetingId: string

  private form: FormGroup;

  private displayErrorPostingReview = false;

  @Output()
  reviewPosted = new EventEmitter<MeetingReview>();

  private meetingReviewContexts: MeetingReview[];

  constructor(private formBuilder: FormBuilder, private coachService: CoachCoacheeService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      context: ['', [Validators.required]]
    });

    this.getAllMeetingReviewContexts();
  }


  getAllMeetingReviewContexts() {
    console.log("getAllMeetingReviewContexts, meetingId : ", this.meetingId)

    this.coachService.getMeetingContext(this.meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getAllMeetingReviewContexts, got reviews : ", reviews);
        //emit event
        //this.reviewPosted.emit(review);
        this.meetingReviewContexts = reviews;
      },
      (error) => {
        console.log('getAllMeetingReviewContexts error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  submitMeetingContextForm() {
    console.log("submitMeetingContextForm form : ", this.form.value)

    this.coachService.addAContextToMeeting(this.meetingId, this.form.value.context).subscribe(
      (review: MeetingReview) => {
        console.log("submitMeetingContextForm, get review : ", review);
        //emit event
        this.reviewPosted.emit(review);
      },
      (error) => {
        console.log('submitMeetingContextForm error', error);
        this.displayErrorPostingReview = true;
      }
    );
  }


  removeMeetingContext(reviewId) {
    console.log("removeMeetingContext reviewId : ", reviewId)

    this.coachService.removeReview(reviewId).subscribe(
      (res) => {
        console.log("removeMeetingContext, done : ", res);
        //emit event
        //this.reviewPosted.emit(review);
      },
      (error) => {
        console.log('removeMeetingContext error', error);
        //this.displayErrorPostingReview = true;
      }
    );

  }

}
