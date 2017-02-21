import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'rb-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  private signInForm: FormGroup

  private error = false
  private errorMessage: ''

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    authService.isAuthenticated().subscribe((isAuth) => console.log("onSignIn, isAuth", isAuth));
  }

  ngOnInit() {
    this.signInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      password: ['', Validators.required],
    })
  }

  onSignIn() {

    //reset errors
    this.error = false;
    this.errorMessage = ''

    this.authService.signIn(this.signInForm.value).subscribe(
      data => {
        console.log("onSignIn, data obtained", data)
        this.router.navigate(['/coachs'])

        this.authService.isAuthenticated().first().subscribe((isAuth) => console.log("onSignIn, isAuth", isAuth));

      },
      error => {
        console.log("onSignIn, error obtained", error)
        this.error = true;
        this.errorMessage = error
      }
    )
  }


  goToSignUp(){
    this.router.navigate(['/signup']);
  }

}
