import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoachCoacheeService} from "../service/CoachCoacheeService";
import {MeetingReview} from "../model/MeetingReview";
import {Meeting} from "../model/meeting";

@Component({
  selector: 'rb-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.css']
})
export class PreMeetingComponent implements OnInit {

  @Input()
  meeting: Meeting

  private form: FormGroup;
  private rate: number;

  private displayErrorPostingReview = false;

  @Output()
  reviewPosted = new EventEmitter<Meeting>();

  constructor(private formBuilder: FormBuilder, private coachService: CoachCoacheeService) {
  }

  ngOnInit() {
    this.rate = 3;
    // this.form = this.formBuilder.group({
    //   context: ['', [Validators.required]],
    //   mood: ['', [Validators.required]]
    // });

    this.form = this.formBuilder.group({
      context: ['', [Validators.required]]
    });
  }

  submitMeetingContextForm() {
    console.log("submitMeetingContextForm form : ", this.form.value)

    //TODO fix mood value
    // this.coachService.addAMeetingReview(this.meeting.id, this.form.value.context, this.form.value.mood).subscribe(
    //   (review: MeetingReview) => {
    //     console.log("submitMeetingContextForm, get review : ", review);
    //
    //   }
    // );

    this.coachService.addAMeetingReview(this.meeting.id, this.form.value.context, "3").subscribe(
      (review: MeetingReview) => {
        console.log("submitMeetingContextForm, get review : ", review);
        //emit event
        this.reviewPosted.emit(this.meeting);
      },
      (error) => {
        console.log('submitMeetingContextForm error', error);
        this.displayErrorPostingReview = true;
      }
    );

  }

}
