import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AuthService} from '../../../../service/auth.service';
import {Router} from '@angular/router';
import {Headers, Response} from '@angular/http';
import {Observable} from "rxjs/Observable";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-register-coach-form',
  templateUrl: './register-coach-form.component.html',
  styleUrls: ['./register-coach-form.component.scss']
})
export class RegisterCoachFormComponent implements OnInit {

  private registerForm: FormGroup;

  private onRegisterLoading = false;

  private avatarUrl: File;
  private insuranceUrl: File;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      avatar: [''],
      linkedin: [''],
      description: [''],
      formation: [''],
      diplomas: [''],
      otherActivities: [''],
      experienceTime: [''],
      experienceVisio: [''],
      coachingHours: [''],
      supervision: [''],
      preferedCoaching: [''],
      status: [''],
      ca1: [''],
      ca2: [''],
      ca3: [''],
      insurance: ['']
    });
  }

  filePreview(event: any, type: string) {
    console.log('filePreview', event.target.files[0]);

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
    console.log('onRegister');

    this.onRegisterLoading = true;

    return this.updatePossibleCoach().flatMap(
      (res: Response)  => {
        console.log("onRegister, userCreated");
        return this.updatePossibleCoachPicture();
      }
    ).flatMap(
      (res: Response) => {
        console.log("onRegister upadateAssurance");
        return this.updatePossibleCoachAssuranceDoc();
      }
    ).subscribe(
      (res: Response) => {
        console.log("onRegister success", res);
        Materialize.toast('Votre candiature a été envoyée !', 3000, 'rounded');
        this.onRegisterLoading = false;
        this.router.navigate(['register_coach/step3']);
      }, (error) => {
        console.log('onRegister error', error);
        Materialize.toast('Impossible de soumettre votre candidature', 3000, 'rounded');
        this.onRegisterLoading = false;
      }
    );
  }

  private updatePossibleCoach(): Observable<Response> {
    console.log('updatePossibleCoach');

    // TODO create body
    let body = {
      'email': this.registerForm.value.email,
      'firstName': this.registerForm.value.name,
      'lastName': this.registerForm.value.surname
    }

    let params = []

    return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH, params, body).map(
      response => {
        let res = response.json();
        console.log('updatePossibleCoach success', res);
        return res;
      }, error => {
        console.log('updatePossibleCoach error', error);
      }
    );
  }

  private updatePossibleCoachPicture(): Observable<Response> {
    console.log('updatePossibleCoachPicture');

    if (this.avatarUrl !== undefined) {
      let formData: FormData = new FormData();
      formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);
      formData.append('email', this.registerForm.value.email);

      let headers = new Headers();
      headers.append('Accept', 'application/json');

      let params = [];

      return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_PICTURE, params, formData, {headers: headers}).map(
        response => {
          let res = response.json();
          console.log('updatePossibleCoachPicture success', res);
          return res;
        }, error => {
          console.log('updatePossibleCoachPicture error', error);
        }
      );
    }
  }

  private updatePossibleCoachAssuranceDoc(): Observable<Response> {
    console.log('updatePossibleCoachAssuranceDoc');

    if (this.insuranceUrl !== undefined) {
      let formData: FormData = new FormData();
      formData.append('uploadFile', this.insuranceUrl, this.insuranceUrl.name);
      formData.append('email', this.registerForm.value.email);

      let headers = new Headers();
      headers.append('Accept', 'application/json');

      let params = [];

      return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_ASSURANCE_DOC, params, formData, {headers: headers}).map(
        response => {
          let res = response.json();
          console.log('updatePossibleCoachAssuranceDoc success', res);
          return res;
        }, error =>{
          console.log('updatePossibleCoachAssuranceDoc error', error);
        }
      );
    }
  }
}
