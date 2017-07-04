import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {Response} from "@angular/http";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {HR} from "../model/HR";
import {Coachee} from "app/model/Coachee";
import {Coach} from "../model/Coach";
import {Router} from "@angular/router";

declare var Materialize: any;
declare var $: any;

@Component({
  selector: 'rb-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  private loginActivated = false;

  private contactForm: FormGroup;
  private error = false;
  private errorMessage: '';

  constructor(private router: Router, private authService: AuthService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.contactForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mail: ['', Validators.compose([Validators.required])],
      message: ['', [Validators.required]],
    });

    // this.connectedUser = this.authService.getConnectedUserObservable();
    this.authService.getConnectedUserObservable().subscribe(
      (user: Coach | Coachee | HR) => {
        console.log('getConnectedUser : ' + user);
        this.onUserObtained(user);
      }
    );
  }

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('onUserObtained : ' + user);
    if (user != null)
      this.router.navigate(['/meetings']);
  }

  activateLogin() {
    this.loginActivated = true;
  }

  /**
   * Start API request to contact Eritis
   */
  onContactSubmit() {
    let body = {
      name: this.contactForm.value.name,
      email: this.contactForm.value.mail,
      message: this.contactForm.value.message
    };
    console.log("onContactSubmit, values : ", this.contactForm);
    console.log("onContactSubmit, values : ", this.contactForm.value);

    this.authService.postNotAuth("v1/contact", null, body).subscribe(
      (res: Response) => {
        console.log("contact, response json : ", res);

        Materialize.toast('Votre demande de contact a bien été envoyée', 4000)

        this.contactForm.value.name = "";
        this.contactForm.value.mail = "";
        this.contactForm.value.message = "";
      },

      (error: Error) => {
        Materialize.toast('Une erreur est survenue', 4000)

      });


  }

  goToCoachRegister() {
    this.router.navigate(['/register_coach/step1']);
  }
}
