import {Component, OnInit, Input} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {CoachCoacheeService} from "../user/CoachCoacheeService";
import {MeetingReview} from "../model/MeetingReview";
import {Meeting} from "./meeting";

@Component({
  selector: 'rb-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.css']
})
export class PreMeetingComponent implements OnInit {

  @Input()
  private meeting: Meeting

  private form: FormGroup;
  private rate: number;

  constructor(private formBuilder: FormBuilder, private coachService: CoachCoacheeService) {
  }

  ngOnInit() {
    this.rate = 3;
    this.form = this.formBuilder.group({
      context: ['', [Validators.required]],
      mood: ['', [Validators.required]]
    })
  }

  submitMeetingContextForm() {
    console.log("submitMeetingContextForm form : ", this.form.value)

    this.coachService.addAMeetingReview(this.meeting.id, this.form.value.context, this.form.value.mood).subscribe(
      (review: MeetingReview) => {
        console.log("submitMeetingContextForm, get review : ", review);

      }
    );

  }

}
