import {Component, OnInit, ViewChild, AfterViewInit, AfterContentInit} from '@angular/core';

@Component({
  selector: 'rb-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  private loginActivated = false;

  constructor() {
  }

  ngOnInit() {
  }

  activateLogin(){
    this.loginActivated = true;
  }
}
