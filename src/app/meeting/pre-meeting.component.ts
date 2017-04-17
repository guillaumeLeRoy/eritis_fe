import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoachCoacheeService} from "../service/CoachCoacheeService";
import {
  MEETING_REVIEW_TYPE_SESSION_CONTEXT, MEETING_REVIEW_TYPE_SESSION_GOAL,
  MeetingReview
} from "../model/MeetingReview";

@Component({
  selector: 'er-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.css']
})
export class PreMeetingComponent implements OnInit {

  @Input()
  meetingId: string

  @Output()
  uiMeetingObjectif: string
  @Output()
  uiMeetingContext: string

  constructor(private coachService: CoachCoacheeService) {
  }

  ngOnInit() {
    console.log("PreMeetingComponent onInit");

    this.getAllMeetingReviews();
  }

  getAllMeetingReviews() {
    console.log("getAllMeetingReviews, meetingId : ", this.meetingId);

    this.coachService.getMeetingContext(this.meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getAllMeetingReviews, got reviews : ", reviews);

        if(reviews !=null){
          //search for correct type
          for (let review of reviews) {
            if (review.type == MEETING_REVIEW_TYPE_SESSION_GOAL) {
              this.uiMeetingObjectif = review.comment;
            } else if (review.type == MEETING_REVIEW_TYPE_SESSION_CONTEXT) {
              this.uiMeetingContext = review.comment;
            }
          }
        }

      },
      (error) => {
        console.log('getAllMeetingReviews error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  // submitMeetingContextForm() {
  //   console.log("submitMeetingContextForm form : ", this.form.value)
  //
  //   this.coachService.addAContextForMeeting(this.meetingId, this.form.value.context).subscribe(
  //     (review: MeetingReview) => {
  //       console.log("submitMeetingContextForm, get review : ", review);
  //       //emit event
  //       this.reviewPosted.emit(review);
  //     },
  //     (error) => {
  //       console.log('submitMeetingContextForm error', error);
  //       this.displayErrorPostingReview = true;
  //     }
  //   );
  // }


  // removeMeetingContext(reviewId) {
  //   console.log("removeMeetingContext reviewId : ", reviewId)
  //
  //   this.coachService.removeReview(reviewId).subscribe(
  //     (res) => {
  //       console.log("removeMeetingContext, done : ", res);
  //       //emit event
  //       //this.reviewPosted.emit(review);
  //     },
  //     (error) => {
  //       console.log('removeMeetingContext error', error);
  //       //this.displayErrorPostingReview = true;
  //     }
  //   );
  //
  // }

}
