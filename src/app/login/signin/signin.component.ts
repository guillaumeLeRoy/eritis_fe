import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import {Coachee} from '../../model/Coachee';
import {Coach} from '../../model/Coach';
import {HR} from "../../model/HR";

declare var $: any;
declare var Materialize: any;
declare var ga: any;

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    authService.isAuthenticated().subscribe((isAuth) => console.log('onSignIn, isAuth', isAuth));
  }

  ngOnInit() {
    console.log('ngOnInit');

    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
      password: ['', Validators.required],
    });

    ga('send', 'signin component init');
  }

  onSignIn() {

    ga('send', 'event', {
      eventCategory: 'signin',
      eventLabel: 'start',
      eventAction: 'click',
    });

    // Activate spinner loader
    this.loginLoading = true;

    // reset errors
    this.error = false;
    this.errorMessage = '';

    this.authService.signIn(this.signInForm.value).subscribe(
      (user: Coach | Coachee | HR) => {

        ga('send', 'event', {
          eventCategory: 'signin',
          eventLabel: 'success',
          eventAction: 'api response',
          eventValue: 'userId ' + user.id
        });

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

        ga('send', 'event', {
          eventCategory: 'signin',
          eventLabel: 'error',
          eventAction: 'api response',
          eventValue: error
        });

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

}
