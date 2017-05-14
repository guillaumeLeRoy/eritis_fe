import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Meeting} from "../../model/meeting";
import {MeetingReview} from "../../model/MeetingReview";
import {MeetingsService} from "../../service/meetings.service";

@Component({
  selector: 'er-post-meeting',
  templateUrl: './post-meeting.component.html',
  styleUrls: ['./post-meeting.component.css']
})
export class PostMeetingComponent implements OnInit {

  @Input()
  meeting: Meeting

  private form: FormGroup;

  private displayErrorReview = false;

  @Output()
  reviewPosted = new EventEmitter<Meeting>();

  constructor(private formBuilder: FormBuilder, private meetingService: MeetingsService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      session_value: ['', [Validators.required]],
      next_step: ['', [Validators.required]]
    });
  }

  submitMeetingReview() {
    console.log("submitMeetingReview form : ", this.form.value)

    this.submitMeetingValue(this.form.value.session_value);
    this.submitMeetingNextStep(this.form.value.next_step);
  }

  private submitMeetingValue(comment: string) {
    console.log("submitMeetingValue comment : ", comment)

    this.meetingService.addAMeetingReviewForValue(this.meeting.id, comment).subscribe(
      (review: MeetingReview) => {
        console.log("submitMeetingValue, get review : ", review);
        //emit event
        this.reviewPosted.emit(this.meeting);
      },
      (error) => {
        console.log('submitMeetingValue error', error);
        this.displayErrorReview = true;
      }
    );
  }

  private submitMeetingNextStep(comment: string) {
    console.log("submitMeetingNextStep comment : ", comment)

    this.meetingService.addAMeetingReviewForNextStep(this.meeting.id, comment).subscribe(
      (review: MeetingReview) => {
        console.log("submitMeetingNextStep, get review : ", review);
        //emit event
        this.reviewPosted.emit(this.meeting);
      },
      (error) => {
        console.log('submitMeetingNextStep error', error);
        this.displayErrorReview = true;
      }
    );
  }


}
