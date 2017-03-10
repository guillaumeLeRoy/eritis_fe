import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

declare var firebase: any;

@Injectable()
export class FirebaseService {

  constructor() {
    console.log("FirebaseService ctr");
  }

  init() {
    console.log("AppComponent init");

    // Initialize Firebase
    var config = {
      apiKey: environment.firebase_apiKey,
      authDomain: environment.firebase_authDomain,
      databaseURL: environment.firebase_databaseURL,
    };

    firebase.initializeApp(config);
  }

  getInstance(): any {
    return firebase;
  }

  auth(): any {
    return firebase.auth();
  }
}
