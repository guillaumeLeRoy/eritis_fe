import {Component} from '@angular/core';
import {environment} from "../environments/environment";
import {FirebaseService} from "./service/firebase.service";


@Component({
  selector: 'rb-root',
  templateUrl: './app.component.html',

})
export class AppComponent {

  constructor(private  firebaseService: FirebaseService) {
    console.log("AppComponent ctr, env : ", environment);

    firebaseService.init();

  }
}
