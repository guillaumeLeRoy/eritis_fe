import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";

import {MeetingReview} from "../../../model/MeetingReview";
import {MeetingsService} from "../../../service/meetings.service";

@Component({
  selector: 'er-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.scss']
})

export class PreMeetingComponent implements OnInit {

  @Input()
  meetingId: string

  @Output()
  meetingGoal = new EventEmitter<string>();
  private uiMeetingGoal: string;

  @Output()
  meetingContext = new EventEmitter<string>();
  private uiMeetingContext: string;

  constructor(private meetingService: MeetingsService) {
  }

  ngOnInit() {
    console.log("PreMeetingComponent onInit");
    //this.getAllMeetingReviews();
    this.getMeetingGoal();
    this.getMeetingContext();
  }

  /* Get from API review goal for the given meeting */
  private getMeetingGoal() {
    this.meetingService.getMeetingGoal(this.meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != undefined && reviews.length > 0) {
          this.updateGoalValue(reviews[0].value);
        }
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  /* Get from API all review context for the given meeting */
  private getMeetingContext() {
    this.meetingService.getMeetingContext(this.meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingContext, got context : ", reviews);
        if (reviews != undefined && reviews.length > 0) {
          this.updateContextValue(reviews[0].value);
        }
      },
      (error) => {
        console.log('getMeetingContext error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  onGoalValueChanged(event) {
    let goal = event.target.value;
    console.log('onGoalValueChanged res', goal);
    this.updateGoalValue(goal);
  }

  onContextValueChanged(event) {
    let context = event.target.value;
    console.log('onContextValueChanged res', context);
    this.updateContextValue(context);
  }

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
