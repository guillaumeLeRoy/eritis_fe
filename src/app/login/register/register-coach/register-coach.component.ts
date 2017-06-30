import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-register-coach',
  templateUrl: './register-coach.component.html',
  styleUrls: ['./register-coach.component.scss']
})

export class RegisterCoachComponent implements OnInit {

  private introductionHidden = false;
  private deontologieHidden = true;
  private formHidden = true;

  private conditionsChecked = false;

  private registerForm: FormGroup;

  private avatarUrl: File;
  private insuranceUrl: File;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      avatar: ['', Validators.required],
      linkedin: ['', Validators.required],
      description: ['', Validators.required],
      formation: ['', Validators.required],
      diplomas: ['', Validators.required],
      otherActivities: ['', Validators.required],
      experienceTime: ['', Validators.required],
      experienceVisio: ['', Validators.required],
      coachingHours: ['', Validators.required],
      supervision: ['', Validators.required],
      preferedCoaching: ['', Validators.required],
      status: ['', Validators.required],
      ca1: ['', Validators.required],
      ca2: ['', Validators.required],
      ca3: ['', Validators.required],
      insurance: ['', Validators.required]
    });
  }

  showIntroduction() {
    window.scrollTo(0, 0);
    this.introductionHidden = false;
    this.deontologieHidden = true;
    this.formHidden = true;
  }

  showDeontologie() {
    window.scrollTo(0, 0);
    this.introductionHidden = true;
    this.deontologieHidden = false;
    this.formHidden = true;
  }

  showForm() {
    window.scrollTo(0, 0);
    this.introductionHidden = true;
    this.deontologieHidden = true;
    this.formHidden = false;
  }

  filePreview(event: any, type: string) {
    console.log("filePreview", event.target.files[0]);

    if (type === 'avatar') {
      this.avatarUrl = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e: any) {
          $('#avatar-preview').attr('src', e.target.result);
        }

        reader.readAsDataURL(event.target.files[0]);
      }
    }

    if (type === 'insurance') {
      this.insuranceUrl = event.target.files[0];
    }

  }

  onRegister() {

  }
}
