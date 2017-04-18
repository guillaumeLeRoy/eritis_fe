import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
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
  meetingId: string;

  @Output()
  meetingGoal = new EventEmitter<string>();
  private uiMeetingGoal: string;

  @Output()
  meetingContext = new EventEmitter<string>();
  private uiMeetingContext: string;

  constructor(private coachService: CoachCoacheeService) {
  }

  ngOnInit() {
<<<<<<< HEAD
    this.form = this.formBuilder.group({
      context: ['', [Validators.required]],
      objectif: ['', []]
    });
=======
    console.log("PreMeetingComponent onInit");
    this.getAllMeetingReviews();
>>>>>>> origin/feature/dashboard_coachee

  }

  /* Get form API all reviews for the given meeting */
  getAllMeetingReviews() {
    console.log("getAllMeetingReviews, meetingId : ", this.meetingId);

<<<<<<< HEAD
  getAllMeetingReviewContexts() {
    console.log("getAllMeetingReviewContexts, meetingId : ", this.meetingId);

    this.coachService.getMeetingContext(this.meetingId).subscribe(
=======
    this.coachService.getMeetingReviews(this.meetingId).subscribe(
>>>>>>> origin/feature/dashboard_coachee
      (reviews: MeetingReview[]) => {
        console.log("getAllMeetingReviews, got reviews : ", reviews);

        if (reviews != null) {
          //search for correct type
          for (let review of reviews) {
            if (review.type == MEETING_REVIEW_TYPE_SESSION_GOAL) {
              this.updateGoalValue(review.comment);
            } else if (review.type == MEETING_REVIEW_TYPE_SESSION_CONTEXT) {
              this.updateContextValue(review.comment);
            }
          }
        }
      },
      (error) => {
        console.log('getAllMeetingReviews error', error);
        //this.displayErrorPostingReview = true;
      });
  }

<<<<<<< HEAD
  submitMeetingContextForm() {
    console.log("submitMeetingContextForm form : ", this.form.value);
=======
  onGoalValueChanged(event) {
    let goal = event.target.value;
    console.log('onGoalValueChanged res', goal);
>>>>>>> origin/feature/dashboard_coachee

    this.updateGoalValue(goal);
  }

  onContextValueChanged(event) {
    let context = event.target.value;
    console.log('onContextValueChanged res', context);

<<<<<<< HEAD
  removeMeetingContext(reviewId) {
    console.log("removeMeetingContext reviewId : ", reviewId);
=======
    this.updateContextValue(context);
  }
>>>>>>> origin/feature/dashboard_coachee

  private updateGoalValue(goal: string) {
    this.uiMeetingGoal = goal;
    this.meetingGoal.emit(this.uiMeetingGoal);
  }

  private updateContextValue(context: string) {
    this.uiMeetingContext = context;
    this.meetingContext.emit(this.uiMeetingContext);
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
