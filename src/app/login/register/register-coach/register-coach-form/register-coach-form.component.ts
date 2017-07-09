import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";
import {Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../../../../../environments/environment";

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      avatar: [''],
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
      (res: Response) => {
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

  displayAutoCompleteButton() {
    return !environment.production
  }

  /**
   * Complete the form with fake values
   */
  autoCompleteForm() {
    console.log('autoCompleteForm');

    let random = Math.floor(Math.random() * 100);

    console.log('autoCompleteForm, random : ', random);

    let email = 'coach.1.eritis@gmail.com';
    let name = 'auto_complete_name_' + random;
    let surname = 'auto_complete_surname_' + random;
    let linkedin = 'https://www.linkedin.com/in/guillaume-le-roy-33310949/';
    let description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum';

    this.registerForm = this.formBuilder.group({
      email: [email, [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
      name: [name, Validators.required],
      surname: [surname, Validators.required],
      avatar: [''],
      linkedin: [linkedin, Validators.required],
      description: [description, Validators.required],
      formation: ['auto complete formation', Validators.required],
      diplomas: ['auto complete diplomas', Validators.required],
      otherActivities: ['auto complete other activities', Validators.required],
      experienceTime: ['auto complete  experience time', Validators.required],
      experienceVisio: ['auto complete experience visio conf, Lorem ipsum dolor sit amet, consectetur adipiscing elit, ', Validators.required],
      coachingHours: ['auto complete coaching hours ' + random, Validators.required],
      supervision: ['auto complete supervision', Validators.required],
      preferedCoaching: ['auto complete prefered coaching', Validators.required],
      status: ['auto complete status', Validators.required],
      ca1: ['auto complete ca1', Validators.required],
      ca2: ['auto complete ca2', Validators.required],
      ca3: ['auto complete ca3', Validators.required],
      insurance: ['']
    });

    // this.registerForm.controls['dept'].setValue(selected.id);

  }

  private updatePossibleCoach(): Observable<Response> {
    console.log('updatePossibleCoach');

    let body = {
      'email': this.registerForm.value.email,
      'firstName': this.registerForm.value.name,
      'lastName': this.registerForm.value.surname,
      'linkedin_url': this.registerForm.value.linkedin,
      'assurance_url': this.registerForm.value.insurance,
      'description': this.registerForm.value.description,
      'training': this.registerForm.value.formation,
      'degree': this.registerForm.value.diplomas,
      'extraActivities': this.registerForm.value.otherActivities,
      'coachForYears': this.registerForm.value.experienceTime,
      'coachingExperience': this.registerForm.value.experienceVisio,
      'coachingHours': this.registerForm.value.coachingHours,
      'supervisor': this.registerForm.value.supervision,
      'favoriteCoachingSituation': this.registerForm.value.preferedCoaching,
      'status': this.registerForm.value.status,
      'revenue': this.registerForm.value.ca1 + "_" + this.registerForm.value.ca2 + "_" + this.registerForm.value.ca2,
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
    } else {
      return Observable.of(null);
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
        }, error => {
          console.log('updatePossibleCoachAssuranceDoc error', error);
        }
      );
    } else {
      return Observable.of(null);
    }
  }
}
