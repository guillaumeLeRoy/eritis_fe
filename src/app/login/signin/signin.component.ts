import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {Coachee} from "../../model/Coachee";
import {Coach} from "../../model/Coach";
import {FirebaseService} from "../../service/firebase.service";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  private signInForm: FormGroup;

  private error = false;
  private errorMessage: '';

  private loginLoading = false;

  private forgotEmail?: string;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private firebase: FirebaseService) {
    authService.isAuthenticated().subscribe((isAuth) => console.log('onSignIn, isAuth', isAuth));
  }

  ngOnInit() {
    console.log('ngOnInit');

    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
      password: ['', Validators.required],
    });
  }

  onSignIn() {

    // Activate spinner loader
    this.loginLoading = true;

    // reset errors
    this.error = false;
    this.errorMessage = '';

    this.authService.signIn(this.signInForm.value).subscribe(
      (user: Coach | Coachee) => {
        console.log('onSignIn, user obtained', user);

        /*if (user instanceof Coach) {
         this.router.navigate(['/meetings']);
         } else {
         this.router.navigate(['/coachs'])
         }*/

        /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
        this.router.navigate(['/meetings']);
        Materialize.toast('Bonjour ' + user.first_name + ' !', 3000, 'rounded');
        this.loginLoading = false;
      },
      error => {
        console.log('onSignIn, error obtained', error);
        Materialize.toast("Le mot de passe ou l'adresse mail est inccorect", 3000, 'rounded');
        this.loginLoading = false;
        //this.error = true;
        //this.errorMessage = error;
      }
    );
  }


  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  onForgotPasswordClicked() {
    console.log('onForgotPasswordClicked');
    this.startForgotPasswordFlow();
  }

  /*************************************
   ----------- Modal control for forgot password ------------
   *************************************/

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

    this.firebase.sendPasswordResetEmail(this.forgotEmail)
      .then(function () {
        console.log("sendPasswordResetEmail ");
        Materialize.toast("Email envoyé", 3000, 'rounded');

        this.cancelForgotPasswordModal();
      }).catch(function (reason) {

      /**
       * {code: "auth/invalid-email", message: "The email address is badly formatted."}code: "auth/invalid-email"message: "The email address is badly formatted."__proto__: Error
       *
       * O {code: "auth/user-not-found", message: "There is no user record corresponding to this identifier. The user may have been deleted."}code: "auth/user-not-found"message: "There is no user record corresponding to this identifier. The user may have been deleted."__proto__: Error
       */

      console.log("sendPasswordResetEmail fail reason", reason);

      if (reason != undefined) {
        if (reason.code == "auth/invalid-email") {
          Materialize.toast("L'email n'est pas correctement formatté", 3000, 'rounded');
          return
        } else if (reason.code == "auth/user-not-found") {
          Materialize.toast("L'email ne correspond à aucun de nos utilisateurs", 3000, 'rounded');
          return
        }
      }
      Materialize.toast("Une erreur est survenue", 3000, 'rounded');
    });
  }

}
