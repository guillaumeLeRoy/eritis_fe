import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'rb-register-coach-message',
  templateUrl: './register-coach-message.component.html',
  styleUrls: ['./register-coach-message.component.scss']
})
export class RegisterCoachMessageComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  goToWelcomePage() {
    this.router.navigate(['/welcome']);
  }
}
