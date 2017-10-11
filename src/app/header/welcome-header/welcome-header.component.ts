import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {FirebaseService} from "../../service/firebase.service";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-welcome-header',
  templateUrl: './welcome-header.component.html',
  styleUrls: ['./welcome-header.component.scss']
})
export class WelcomeHeaderComponent implements OnInit {

  private forgotEmail?: string;

  constructor(private router: Router, private cd: ChangeDetectorRef, private firebase: FirebaseService) { }

  ngOnInit() {
  }

  toggleLoginStatus() {
    $('#signin').slideToggle('slow');
  }

  goToRegisterCoach() {
    this.router.navigate(['register_coach/step1'])
  }

  /*************************************
   ----------- Modal control for forgot password ------------
   *************************************/

  onForgotPasswordClicked() {
    console.log('onForgotPasswordClicked');
    this.startForgotPasswordFlow();
  }

  updateForgotPasswordModalVisibility(isVisible: boolean) {
    if (isVisible) {
      $('#forgot_password_modal').openModal();
    } else {
      $('#forgot_password_modal').closeModal();
    }
  }

  startForgotPasswordFlow() {
    console.log('startForgotPasswordFlow');
    this.updateForgotPasswordModalVisibility(true);
  }

  cancelForgotPasswordModal() {
    this.updateForgotPasswordModalVisibility(false);
    this.forgotEmail = null;
  }

  validateForgotPasswordModal() {
    console.log('validateForgotPasswordModal');

    // make sure forgotEmail has a value
    let firebaseObs = PromiseObservable.create(this.firebase.sendPasswordResetEmail(this.forgotEmail));

    firebaseObs.subscribe(
      () => {
        console.log("sendPasswordResetEmail ");
        Materialize.toast("Email envoyé", 3000, 'rounded');
        this.cancelForgotPasswordModal();
        this.cd.detectChanges();
      },
      error => {
        /**
         * {code: "auth/invalid-email", message: "The email address is badly formatted."}code: "auth/invalid-email"message: "The email address is badly formatted."__proto__: Error
         *
         * O {code: "auth/user-not-found", message: "There is no user record corresponding to this identifier. The user may have been deleted."}code: "auth/user-not-found"message: "There is no user record corresponding to this identifier. The user may have been deleted."__proto__: Error
         */

        console.log("sendPasswordResetEmail fail reason", error);

        if (error != undefined) {
          if (error.code == "auth/invalid-email") {
            Materialize.toast("L'email n'est pas correctement formatté", 3000, 'rounded');
            return
          } else if (error.code == "auth/user-not-found") {
            Materialize.toast("L'email ne correspond à aucun de nos utilisateurs", 3000, 'rounded');
            return
          }
        }
        Materialize.toast("Une erreur est survenue", 3000, 'rounded');
      }
    ).unsubscribe();
  }
}
