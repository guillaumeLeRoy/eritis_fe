import {Component, OnInit} from '@angular/core';
import {AuthService} from "../service/auth.service";
import {Http, Response} from "@angular/http";

@Component({
  selector: 'rb-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  private loginActivated = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  activateLogin() {
    this.loginActivated = true;
  }

  /**
   * Start API request to contact Eritis
   */
  contactEritis() {
    let body = {
      name: "my name",
      email: "toto@gmail.com",
      message: "what I want to say is"
    };

    //return this.httpService.postN(this.generatePath(path, params), body, {headers: headers})

    this.authService.postNotAuth("v1/contact", null, body).map((response: Response) => {
      console.log("contact, response json : ", response);
      return response;
    }).subscribe(
      (res: Response) => {
        console.log("contact, response json : ", res);
      });
  }

}
