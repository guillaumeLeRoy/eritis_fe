import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {Headers, Response} from "@angular/http";

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
  }

  ngOnInit() {
    // this.registerForm = this.formBuilder.group({
    //   email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
    //   name: ['', Validators.required],
    //   surname: ['', Validators.required],
    //   avatar: ['', Validators.required],
    //   linkedin: ['', Validators.required],
    //   description: ['', Validators.required],
    //   formation: ['', Validators.required],
    //   diplomas: ['', Validators.required],
    //   otherActivities: ['', Validators.required],
    //   experienceTime: ['', Validators.required],
    //   experienceVisio: ['', Validators.required],
    //   coachingHours: ['', Validators.required],
    //   supervision: ['', Validators.required],
    //   preferedCoaching: ['', Validators.required],
    //   status: ['', Validators.required],
    //   ca1: ['', Validators.required],
    //   ca2: ['', Validators.required],
    //   ca3: ['', Validators.required],
    //   insurance: ['', Validators.required]
    // });

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
    // TODO chain methods ...
    this.updatePossibleCoach();
    this.updatePossibleCoachPicture();
    this.updatePossibleCoachAssuranceDoc();
  }

  private updatePossibleCoach() {

    // TODO create body
    var body = {
      "email": this.registerForm.value.email,
      "firstName": this.registerForm.value.name,
      "lastName": this.registerForm.value.surname
    }
    var params = []
    this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH, params, body).subscribe(
      (response: Response) => {
        response.json()
      }
    );
  }

  private updatePossibleCoachPicture() {

    if (this.avatarUrl != undefined) {
      let formData: FormData = new FormData();
      formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);
      formData.append('email', this.registerForm.value.email);

      let headers = new Headers();
      headers.append('Accept', 'application/json');

      var params = []
      this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_PICTURE, params, formData, {headers: headers}).subscribe(
        (response: Response) => {
          response.json()
        }
      );
    }

  }

  private updatePossibleCoachAssuranceDoc() {

    if (this.insuranceUrl != undefined) {
      let formData: FormData = new FormData();
      formData.append('uploadFile', this.insuranceUrl, this.insuranceUrl.name);
      formData.append('email', this.registerForm.value.email);

      let headers = new Headers();
      headers.append('Accept', 'application/json');

      var params = []
      this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_ASSURANCE_DOC, params, formData, {headers: headers}).subscribe(
        (response: Response) => {
          response.json()
        }
      );
    }


  }
}
