import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";
import {Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../../../../../environments/environment";
import {CookieService} from "ngx-cookie";

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

  private hasSavedValues = false;

  private avatarUrl: File;
  private insuranceUrl: File;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private cookieService: CookieService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    if (!this.hasAcceptedConditions()) {
      this.router.navigate(['register_coach/step1']);
    }

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      avatar: [''],
      linkedin: [''],
      description: ['', Validators.required],
      invoice_entity: ['', Validators.required],
      invoice_address: ['', Validators.required],
      invoice_postcode: ['', Validators.required],
      invoice_city: ['', Validators.required],
      formation: ['', Validators.required],
      degree: ['', Validators.required],
      otherActivities: ['', Validators.required],
      lang1: ['', Validators.required],
      lang2: [''],
      lang3: [''],
      experienceTime: ['', Validators.required],
      experienceVisio: ['', Validators.required],
      experienceShortSession: ['', Validators.required],
      coachingSpecifics: ['', Validators.required],
      therapyElements: ['', Validators.required],
      coachingHours: ['', Validators.required],
      supervision: ['', Validators.required],
      preferedCoaching: ['', Validators.required],
      status: ['', Validators.required],
      ca1: ['', Validators.required],
      ca2: ['', Validators.required],
      ca3: ['', Validators.required],
      insurance: ['']
    });

    this.getSavedFormValues();
  }

  hasAcceptedConditions() {
    let cookie = this.cookieService.get('COACH_REGISTER_CONDITIONS_ACCEPTED');
    console.log('Coach register conditions accepted, ', cookie);
    if (cookie !== null && cookie !== undefined) {
      return true;
    }
  }


  // private hasSavedFormValues() {
  //   let cookie = this.cookieService.get('COACH_REGISTER_FORM_VALUES');
  //   console.log('hasSavedFormValues, ', cookie);
  //   if (cookie !== null && cookie !== undefined) {
  //     this.hasSavedValues = true;
  //   }
  // }

  private getSavedFormValues() {
    let cookie = this.cookieService.getObject('COACH_REGISTER_FORM_VALUES');
    console.log("getSavedFormValues", cookie);
    if (cookie !== null && cookie !== undefined) {
      this.registerForm = this.formBuilder.group({
        email: [cookie['email'], [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
        firstname: [cookie['firstname'], Validators.required],
        lastname: [cookie['lastname'], Validators.required],
        avatar: [cookie['avatar']],
        linkedin: [cookie['linkedin']],
        description: [cookie['description'], Validators.required],
        invoice_entity: [cookie['invoice_entity'], Validators.required],
        invoice_address: [cookie['invoice_address'], Validators.required],
        invoice_postcode: [cookie['invoice_postcode'], Validators.required],
        invoice_city: [cookie['invoice_city'], Validators.required],
        formation: [cookie['formation'], Validators.required],
        degree: [cookie['degree'], Validators.required],
        otherActivities: [cookie['otherActivities'], Validators.required],
        lang1: [cookie['lang1'], Validators.required],
        lang2: [cookie['lang2']],
        lang3: [cookie['lang3']],
        experienceTime: [cookie['experienceTime'], Validators.required],
        experienceVisio: [cookie['experienceVisio'], Validators.required],
        experienceShortSession: [cookie['experienceShortSession'], Validators.required],
        coachingSpecifics: [cookie['coachingSpecifics'], Validators.required],
        therapyElements: [cookie['therapyElements'], Validators.required],
        coachingHours: [cookie['coachingHours'], Validators.required],
        supervision: [cookie['supervision'], Validators.required],
        preferedCoaching: [cookie['preferedCoaching'], Validators.required],
        status: [cookie['status'], Validators.required],
        ca1: [cookie['ca1'], Validators.required],
        ca2: [cookie['ca2'], Validators.required],
        ca3: [cookie['ca3'], Validators.required],
        insurance: [cookie['insurance']]
      });
    }
  }

  saveFormValues() {
    let date = (new Date());
    date.setFullYear(2030);
    this.cookieService.putObject('COACH_REGISTER_FORM_VALUES', this.registerForm.value, {expires: date.toDateString()});
  }

  filePreview(event: any, type: string) {
    console.log('filePreview', event.target.files[0]);

    if (type === 'avatar') {
      this.avatarUrl = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e: any) {
          // $('#avatar-preview').attr('src', e.target.result);
          $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
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
        console.log("onRegister upadateinsurance");
        return this.updatePossibleCoachinsuranceDoc();
      }
    ).subscribe(
      (res: Response) => {
        console.log("onRegister success", res);
        Materialize.toast('Votre candidature a été envoyée !', 3000, 'rounded');
        this.onRegisterLoading = false;
        this.cookieService.put('COACH_REGISTER_FORM_SENT', 'true');
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
    this.getSavedFormValues();
  }

  private updatePossibleCoach(): Observable<Response> {
    console.log('updatePossibleCoach');

    let body = {
      'email': this.registerForm.value.email,
      'first_name': this.registerForm.value.firstname,
      'last_name': this.registerForm.value.lastname,
      'linkedin_url': this.registerForm.value.linkedin,
      'description': this.registerForm.value.description,
      'training': this.registerForm.value.formation,
      'degree': this.registerForm.value.degree,
      'extraActivities': this.registerForm.value.otherActivities,
      'coachForYears': this.registerForm.value.experienceTime,
      'coachingExperience': this.registerForm.value.experienceVisio,
      'experienceShortSession': this.registerForm.value.experienceShortSession,
      'coachingSpecifics': this.registerForm.value.coachingSpecifics,
      'therapyElements': this.registerForm.value.therapyElements,
      'coachingHours': this.registerForm.value.coachingHours,
      'supervisor': this.registerForm.value.supervision,
      'favoriteCoachingSituation': this.registerForm.value.preferedCoaching,
      'status': this.registerForm.value.status,
      'revenues': this.registerForm.value.ca1 + "_" + this.registerForm.value.ca2 + "_" + this.registerForm.value.ca2,
      'invoice_entity': this.registerForm.value.invoice_entity,
      'invoice_address': this.registerForm.value.invoice_address,
      'invoice_city': this.registerForm.value.invoice_city,
      'invoice_postcode': this.registerForm.value.invoice_postcode,
      'languages': this.registerForm.value.lang1 + "_" + this.registerForm.value.lang2 + "_" + this.registerForm.value.lang3,
    };

    let params = [];
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

  private updatePossibleCoachinsuranceDoc(): Observable<Response> {
    console.log('updatePossibleCoachinsuranceDoc');

    if (this.insuranceUrl !== undefined) {
      let formData: FormData = new FormData();
      formData.append('uploadFile', this.insuranceUrl, this.insuranceUrl.name);
      formData.append('email', this.registerForm.value.email);

      let headers = new Headers();
      headers.append('Accept', 'application/json');

      let params = [];
      return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_INSURANCE_DOC, params, formData, {headers: headers}).map(
        response => {
          let res = response.json();
          console.log('updatePossibleCoachinsuranceDoc success', res);
          return res;
        }, error => {
          console.log('updatePossibleCoachinsuranceDoc error', error);
        }
      );
    } else {
      return Observable.of(null);
    }
  }
}
