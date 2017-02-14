import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from "@angular/forms";

@Component({
  selector: 'rb-pre-meeting',
  templateUrl: './pre-meeting.component.html',
  styleUrls: ['./pre-meeting.component.css']
})
export class PreMeetingComponent implements OnInit {

  private form: FormGroup;
  private rate: number;

  constructor(private formBuilder: FormBuilder) {
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
  }

}
