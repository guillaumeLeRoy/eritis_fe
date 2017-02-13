import {User} from "../user/user";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject} from "rxjs";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {Headers, Http} from "@angular/http";


declare var firebase: any;
const BACKEND_BASE_URL = "http://localhost:8080/api";
const BACKEND_LOGIN_URL = "/login/";

@Injectable()
export class AuthService {

  // private user: User
  private isUserAuth = new BehaviorSubject<boolean>(false);//auth by default
  private user = new BehaviorSubject<User>(null);//auth by default

  /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
  private isSignInOrUp = false;

  constructor(private router: Router, private httpService: Http) {

    firebase.auth().onAuthStateChanged(function (user) {
      this.updateAuthStatus(user);
    }.bind(this));

    console.log("ctr done");
  }

  getConnectedUser(): Observable<User> {
    return this.user;
  }

  signUp(user: User): Observable<User> {
    console.log("1. user signUp : ", user);
    this.isSignInOrUp = true;
    //create user with email and pwd
    let firebasePromise = firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(function (fbUser) {
        console.log("2. authService, user sign up, success : ", fbUser);
        //user successfully sign up in Firebase
        console.log("3. fb user, start getToken");
        return fbUser.getToken()
      });

    let firebaseObs = PromiseObservable.create(firebasePromise);

    return firebaseObs.flatMap(
      (token: string) => {
        //now sign up in AppEngine
        let fbUser = firebase.auth().currentUser;

        //add authorization header
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        let status = user.status == true ? 1 : 2;//coach 1, coachee 2

        let body = {
          email: fbUser.email,
          uid: fbUser.uid,
          status: status
        };

        // start sign up request
        return this.httpService.post(BACKEND_BASE_URL + BACKEND_LOGIN_URL, body, {headers: headers})
          .map(
            (response) => {

              let APIuser = response.json();
              console.log("signUp, APIuser : ", APIuser);
              //
              // return json;
              this.isSignInOrUp = false;

              return this.onAPIuserObtained(APIuser);
            }
            // ,
            // error => {
            //   console.log("signUp, error detected : ", error);
            //
            //   //user shouldn't be signup
            //   firebase.auth().signOut().then(function () {
            //     console.log("user signup after error detected");
            //
            //     subject.error("Impossible to sign you up.")
            //   })
            // }
          );
      }

      // ,
      // (error) => {
      //   // Handle Errors here.
      //   let errorCode = error.code;
      //   let errorMessage = error.message;
      //
      //   console.log("authService, user sign up, error msg : ", errorMessage);
      //   console.log("authService, user sign up, error code: ", errorCode);
      //
      //   subject.error(errorMessage)
      // }
    );
  }

  signIn(user: User): Observable<User> {
    console.log("1. user signIn : ", user);
    this.isSignInOrUp = true;

    //fb sign in with email and pwd
    let firebasePromise = firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(function (fbUser) {
        return fbUser.getToken()
      });

    let firebaseObs = PromiseObservable.create(firebasePromise);

    return firebaseObs.flatMap(
      (token: string) => {
        //now sign up in AppEngine
        let fbUser = firebase.auth().currentUser;
        this.isSignInOrUp = false;
        return this.getUserForFirebaseId(fbUser.uid, token);
      }
      // ,
      // (error) => {
      //   // Handle Errors here.
      //   let errorCode = error.code;
      //   let errorMessage = error.message;
      //
      //   console.log("authService, user sign in, error msg : ", errorMessage);
      //   console.log("authService, user sign in, error code: ", errorCode);
      //
      //   subject.error(errorMessage)
      // }
    );

    // return subject

  }

  loginOut() {
    console.log("user loginOut");
    firebase.auth().signOut();
    this.updateAuthStatus(null)
    this.router.navigate(['/welcome'])
  }


  isAuthenticated(): Observable<boolean> {
    return this.isUserAuth;
  }

  private updateAuthStatus(fbUser) {
    console.log("updateAuthStatus isSignInOrUp : ", this.isSignInOrUp);

    if (this.isSignInOrUp) {
      return
    }

    console.log("updateAuthStatus user : ", fbUser);

    if (fbUser) {
        console.log("updateAuthStatus, get user");

        //get from API
        var promise = fbUser.getToken();
        let firebaseObs = PromiseObservable.create(promise);
        firebaseObs.flatMap(
          (token: string) => {
            let fbUser = firebase.auth().currentUser;
            return this.getUserForFirebaseId(fbUser.uid, token);
          }
        ).subscribe();
    } else {
      this.user.next(null);
      this.isUserAuth.next(false);
    }
  }


  /* when we obtained a User from the API ( coach or coachee */
  private onAPIuserObtained(user: User): User {
    console.log("onAPIuserObtained, user : ", user);
    if (user) {
      this.user.next(user);
      this.isUserAuth.next(true)
    } else {
      this.user.next(null);
      this.isUserAuth.next(false)
    }
    return user;
  }

  private getUserForFirebaseId(firebaseId: string, firebaseToken: string): Observable<User> {
    console.log("getUserForFirebaseId, firebaseToken : ", firebaseToken);

    //add authorization header
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + firebaseToken);

    //get user info request
    return this.httpService.get(BACKEND_BASE_URL + BACKEND_LOGIN_URL + firebaseId, {headers: headers})
      .map(
        response => {
          let json = response.json();
          console.log("getUserForFirebaseId, json : ", json);
          return this.onAPIuserObtained(json);
        }
        // ,
        // error => {
        //   console.log("signin, error detected : ", error);
        //
        //   //user shouldn't be signin
        //   firebase.auth().signOut().then(function () {
        //     console.log("user signin after error detected");
        //
        //     subject.error("Impossible to sign you in.")
        //   })
        // }
      );
  }
}
