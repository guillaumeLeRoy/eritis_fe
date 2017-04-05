import {Component, OnInit, ViewChild, AfterViewInit, AfterContentInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'rb-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  private loginActivated = false

  private contactForm: FormGroup
  private error = false
  private errorMessage: ''

  constructor() {
  }

  ngOnInit() {
  }

  activateLogin(){
    this.loginActivated = true;
  }

  onContactSubmit(){

  }
}
