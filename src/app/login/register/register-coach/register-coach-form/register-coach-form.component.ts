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
  selector: 'er-register-coach-form',
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
      avatar_url: [''],
      linkedin_url: [''],
      description: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      lang1: ['', Validators.required],
      lang2: [''],
      lang3: [''],

      career: ['', Validators.required],
      degree: ['', Validators.required],
      extraActivities: ['', Validators.required],

      coachingExperience: ['', Validators.required],
      remoteCoachingExperience: ['', Validators.required],
      experienceShortSession: ['', Validators.required],
      coachingSpecifics: ['', Validators.required],
      supervision: ['', Validators.required],
      therapyElements: ['', Validators.required],

      ca1: ['', Validators.required],
      ca2: ['', Validators.required],
      ca3: ['', Validators.required],
      percentageCoachingInRevenue: ['', Validators.required],
      legalStatus: ['', Validators.required],

      invoice_entity: ['', Validators.required],
      invoice_siret_number: ['', Validators.required],
      invoice_address: ['', Validators.required],
      invoice_postcode: ['', Validators.required],
      invoice_city: ['', Validators.required],

      insurance_document: ['']

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
        linkedin_url: [cookie['linkedin_url']],
        description: [cookie['description'], Validators.required],
        phoneNumber: [cookie['phoneNumber'], Validators.required],
        lang1: [cookie['lang1'], Validators.required],
        lang2: [cookie['lang2']],
        lang3: [cookie['lang3']],

        career: [cookie['career'], Validators.required],
        degree: [cookie['degree'], Validators.required],
        extraActivities: [cookie['extraActivities'], Validators.required],

        coachingExperience: [cookie['coachingExperience'], Validators.required],
        remoteCoachingExperience: [cookie['remoteCoachingExperience'], Validators.required],
        experienceShortSession: [cookie['experienceShortSession'], Validators.required],
        coachingSpecifics: [cookie['coachingSpecifics'], Validators.required],
        supervision: [cookie['supervision'], Validators.required],
        therapyElements: [cookie['therapyElements'], Validators.required],

        ca1: [cookie['ca1'], Validators.required],
        ca2: [cookie['ca2'], Validators.required],
        ca3: [cookie['ca3'], Validators.required],
        percentageCoachingInRevenue: [cookie['percentageCoachingInRevenue']],
        legalStatus: [cookie['legalStatus'], Validators.required],

        invoice_entity: [cookie['invoice_entity'], Validators.required],
        invoice_siret_number: [cookie['invoice_siret_number'], Validators.required],
        invoice_address: [cookie['invoice_address'], Validators.required],
        invoice_postcode: [cookie['invoice_postcode'], Validators.required],
        invoice_city: [cookie['invoice_city'], Validators.required],

        insurance_document: [cookie['insurance_document']]

      });
    }
  }

  saveFormValues() {
    let date = (new Date());
    date.setFullYear(2030);
    if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
      this.cookieService.putObject('COACH_REGISTER_FORM_VALUES', this.registerForm.value, {expires: date.toDateString()});
  }

  filePreview(event: any, type: string) {
    console.log('filePreview', event.target.files[0]);

    if (type === 'avatar') {
      this.avatarUrl = event.target.files[0];

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e: any) {
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
        if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
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
      'description': this.registerForm.value.description,
      'mobile_phone_number': this.registerForm.value.phoneNumber,
      'languages': this.registerForm.value.lang1 + "_" + this.registerForm.value.lang2 + "_" + this.registerForm.value.lang3,
      'linkedin_url': this.registerForm.value.linkedin_url,

      'career': this.registerForm.value.career,
      'extraActivities': this.registerForm.value.extraActivities,
      'degree': this.registerForm.value.degree,

      'experience_coaching': this.registerForm.value.coachingExperience,
      'experience_remote_coaching': this.registerForm.value.remoteCoachingExperience,
      'experienceShortSession': this.registerForm.value.experienceShortSession,
      'coachingSpecifics': this.registerForm.value.coachingSpecifics,
      'supervisor': this.registerForm.value.supervision,
      'therapyElements': this.registerForm.value.therapyElements,
      'legal_status': this.registerForm.value.legalStatus,
      'revenues_last_3_years': this.registerForm.value.ca1 + "_" + this.registerForm.value.ca2 + "_" + this.registerForm.value.ca2,
      'percentage_coaching_in_revenue': this.registerForm.value.percentageCoachingInRevenue,

      'invoice_entity': this.registerForm.value.invoice_entity,
      'invoice_siret_number': this.registerForm.value.invoice_siret_number,
      'invoice_address': this.registerForm.value.invoice_address,
      'invoice_city': this.registerForm.value.invoice_city,
      'invoice_postcode': this.registerForm.value.invoice_postcode,
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
