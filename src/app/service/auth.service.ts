import {User} from "../user/user";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {Response, Http, Headers} from "@angular/http";
import {ApiUser} from "../model/apiUser";

declare var firebase: any;

const BACKEND_BASE_URL = "http://localhost:8080/api";

@Injectable()
export class AuthService {

  public static UPDATE_COACH = "/coachs/:id";
  public static UPDATE_COACHEE = "/coachees/:id";
  public static LOGIN = "/login/:firebaseId";
  public static GET_COACHS = "/coachs";
  public static GET_COACH_FOR_ID = "/coachs/:id";
  public static POST_MEETING = "/meeting";
  public static GET_MEETING_REVIEWS = "/meeting/:meetingId/reviews";
  public static POST_MEETING_REVIEW = "/meeting/:meetingId/review";
  public static GET_MEETINGS_FOR_COACH_ID = "/meetings/coachee/:coacheeId";

  private onAuthStateChangedCalled = false;
  // private user: User
  private isUserAuth = new BehaviorSubject<boolean>(false);//NOT auth by default
  // private ApiUserSubject = new BehaviorSubject<ApiUser>(null);//NOT auth by default
  private ApiUserSubject = new Subject<ApiUser>();//NOT auth by default
  /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
  private isSignInOrUp = false;

  private ApiUser: ApiUser = null;

  constructor(private router: Router, private httpService: Http) {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("onAuthStateChanged, user : " + user);
      this.onAuthStateChangedCalled = true;
      this.updateAuthStatus(user);
    }.bind(this));

    console.log("ctr done");
  }

  getConnectedUser(): ApiUser {
    return this.ApiUser;
  }

  getConnectedUserObservable(): Observable<ApiUser> {
    return this.ApiUserSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isUserAuth.asObservable();
  }

  post(path: string, params: string[], body: any): Observable<Response> {
    let method = this.getConnectedApiUser().flatMap(
      (firebaseUser: ApiUser) => {
        return this.getHeader(firebaseUser).flatMap(
          (headers: Headers) => {
            return this.httpService.post(this.generatePath(path, params), body, {headers: headers})
          }
        );
      }
    );
    return this.handleApiAuth(path, method);
  }

  put(path: string, params: string[], body: any): Observable<Response> {
    let method = this.getConnectedApiUser().flatMap(
      (firebaseUser: ApiUser) => {
        return this.getHeader(firebaseUser).flatMap(
          (headers: Headers) => {
            return this.httpService.put(this.generatePath(path, params), body, {headers: headers})
          }
        );
      }
    );
    return this.handleApiAuth(path, method);
  }

  get(path: string, params: string[]): Observable<Response> {
    console.log("1. get");

    let method = this.getConnectedApiUser().flatMap(
      (firebaseUser: ApiUser) => {
        return this.getHeader(firebaseUser).flatMap(
          (headers: Headers) => {
            console.log("4. start request");
            return this.httpService.get(this.generatePath(path, params), {headers: headers})
          }
        );
      }
    );
    return this.handleApiAuth(path, method);
  }


  private handleApiAuth(path: string, method: Observable<Response>): Observable<Response> {
    // console.log("handleApiAuth, path : ", path);
    return method;
  }

  private getConnectedApiUser(): Observable<ApiUser> {
    console.log("2. getConnectedApiUser");
    if (this.ApiUser) {
      console.log("getConnectedApiUser, user OK");
      return Observable.of(this.ApiUser);
    } else {
      console.log("getConnectedApiUser, NO user");

      //check if onAuthStateChanged was called
      if (this.onAuthStateChangedCalled) {
        console.log("getConnectedApiUser, user state changed already call");
        //now we know we really don't have a user
        return Observable.throw('No current user');
      } else {
        console.log("getConnectedApiUser, wait for change state");

        return this.ApiUserSubject.map(
          (apiUser: ApiUser) => {
            if (apiUser) {
              console.log("getConnectedApiUser, got event, with user");
              return apiUser;
            } else {
              console.log("getConnectedApiUser, got event, no user after state change");
              return Observable.throw('No user after state changed');
            }
          }
        );
      }
    }
  }

  // private getFirebaseUser(): Observable<any> {
  //   console.log("getFirebaseUser");
  //
  //   let currentUser = firebase.auth().currentUser;
  //   if (currentUser) {
  //     console.log("getFirebaseUser, user OK");
  //
  //     return Observable.of(currentUser);
  //   } else {
  //     console.log("getFirebaseUser, user NOT OK");
  //
  //     //check if onAuthStateChanged was called
  //     if (this.onAuthStateChangedCalled) {
  //       console.log("getFirebaseUser, user state changed already call");
  //
  //       //now we know we really don't have a user
  //       return Observable.throw('No current user');
  //     } else {
  //       return this.isUserAuth.map(
  //         (isAuth: boolean) => {
  //           console.log("getFirebaseUser, got event, isAuth : " + isAuth);
  //
  //           if (isAuth) {
  //             return firebase.auth().currentUser;
  //           } else {
  //             return Observable.throw('No user after state changed');
  //           }
  //         }
  //       );
  //     }
  //   }
  // }

  private getHeader(user: ApiUser): Observable<Headers> {
    console.log("3. getHeader");

    if (user) {
      console.log("getHeader, currentUser : ", user);
      let token = user.firebaseToken;
      if (token) {
        console.log("getHeader, token : ", token);
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
        return Observable.of(headers);
      } else {
        return Observable.throw('No token');
      }
    } else {
      console.log("getHeader, NO user");

      return Observable.throw('No current user');
    }
  }

  private generatePath(path: string, params: string[]): string {
    console.log("generatePath, path : ", path);
    console.log("generatePath, params : ", params);

    var completedPath = "";
    let segs = path.split("/");
    var paramIndex = 0;
    for (let seg of segs) {
      if (seg == "" || seg == null) {
        continue;
      }
      console.log("generatePath, seg : ", seg);
      console.log("generatePath, paramIndex : ", paramIndex);

      completedPath += "/";
      if (seg.charAt(0) == ":") {
        completedPath += params[paramIndex];
        paramIndex++;
      } else {
        completedPath += seg;
      }
    }

    //always add a "/" at the end
    completedPath += "/";

    console.log("generatePath, completedPath : ", completedPath);
    console.log("generatePath, BACKEND_BASE_URL : ", BACKEND_BASE_URL);

    return BACKEND_BASE_URL + completedPath;
  }


  private updateAuthStatus(fbUser: any) {
    console.log("updateAuthStatus isSignInOrUp : ", this.isSignInOrUp);

    if (this.isSignInOrUp) {
      return
    }

    console.log("updateAuthStatus user : ", fbUser);
    if (fbUser) {
      if (this.ApiUser == null) {
        console.log("updateAuthStatus, get A USER");

        let firebaseObs = PromiseObservable.create(fbUser.getToken());

        firebaseObs.subscribe(
          (token: string) => {
            //get user from API
            this.getUserForFirebaseId(fbUser.uid, token).subscribe();
          }
        );

      } else {
        console.log("updateAuthStatus already have a user API");
      }

    } else {
      console.log("updateAuthStatus NO user");
      this.ApiUser = null;
      this.ApiUserSubject.next(null);
      this.isUserAuth.next(false);
    }
  }


  /* when we obtained a User from the API ( coach or coachee */
  public onAPIuserObtained(user: ApiUser): ApiUser {
    console.log("onAPIuserObtained, user : ", user);
    if (user) {
      this.ApiUser = user;
      this.ApiUserSubject.next(user);
      this.isUserAuth.next(true)
    } else {
      this.ApiUserSubject.next(null);
      this.isUserAuth.next(false)
    }
    return user;
  }

  private getUserForFirebaseId(firebaseId: string, token: string): Observable<ApiUser> {
    console.log("getUserForFirebaseId : ", firebaseId);
    let params = [firebaseId];

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.httpService.get(this.generatePath(AuthService.LOGIN, params), {headers: headers}).map(
      response => {
        let apiUser: ApiUser = response.json();
        console.log("getUserForFirebaseId, apiUser : ", apiUser);
        //retain FirebaseToken
        apiUser.firebaseToken = token;
        return this.onAPIuserObtained(apiUser);
      }
    );
  }


  signUp(user: User): Observable<ApiUser> {
    console.log("1. user signUp : ", user);
    this.isSignInOrUp = true;
    //create user with email and pwd
    let firebasePromise = firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(function (fbUser) {
        console.log("2. authService, user sign up, success : ", fbUser);
        //user successfully sign up in Firebase
        console.log("3. fb user, start getToken");
        return fbUser.getToken();
      });
    let firebaseObs = PromiseObservable.create(firebasePromise);

    return firebaseObs.flatMap(
      (token: string) => {

        //user should be ok just after a sign up
        let fbUser = firebase.auth().currentUser;

        //now sign up in AppEngine
        let status = user.status == true ? 1 : 2;//coach 1, coachee 2

        let body = {
          email: fbUser.email,
          uid: fbUser.uid,
          status: status
        };
        let params = [fbUser.uid];

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        // start sign up request
        return this.httpService.post(this.generatePath(AuthService.LOGIN, params), body, {headers: headers})
          .map(
            (response) => {

              let APIuser = response.json();
              console.log("signUp, APIuser : ", APIuser);
              // return json;
              this.isSignInOrUp = false;
              APIuser.token = token;
              return this.onAPIuserObtained(APIuser);
            }
          );
      }
    );
  }

  signIn(user: User): Observable<ApiUser> {
    console.log("1. user signIn : ", user);
    this.isSignInOrUp = true;

    //fb sign in with email and pwd
    let firebasePromise = firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(function (fbUser) {
        console.log("2. authService, user sign up, success : ", fbUser);
        //user successfully sign up in Firebase
        console.log("3. fb user, start getToken");
        return fbUser.getToken();
      });
    let firebaseObs = PromiseObservable.create(firebasePromise);
    return firebaseObs.flatMap(
      (token: string) => {
        //user should be ok just after a sign up
        let fbUser = firebase.auth().currentUser;
        //now sign up in AppEngine
        this.isSignInOrUp = false;
        return this.getUserForFirebaseId(fbUser.uid, token);
      }
    );
  }

  loginOut() {
    console.log("user loginOut");
    firebase.auth().signOut();
    this.updateAuthStatus(null);
    this.router.navigate(['/welcome']);
  }


  updateCoacheeForId(id: string, displayName: string, avatarUrl: string): Observable<ApiUser> {
    console.log("updateCoacheeForId, id", id);

    let body = {
      display_name: displayName,
      avatar_url: avatarUrl,
    };

    let params = [id];
    return this.put(AuthService.UPDATE_COACHEE, params, body).map(
      (response: Response) => {
        let json = response.json();
        let APIuser = json as ApiUser;
        console.log("updateCoacheeForId, response json : ", json);

        //dispatch
        this.onAPIuserObtained(APIuser);

        return APIuser;
      });
  }

  updateCoachForId(id: string, displayName: string, avatarUrl: string): Observable<ApiUser> {
    console.log("updateCoachForId, id", id);

    let body = {
      display_name: displayName,
      avatar_url: avatarUrl,
    };

    let params = [id];
    return this.put(AuthService.UPDATE_COACH, params, body).map(
      (response: Response) => {
        let json = response.json();
        let APIuser = json as ApiUser;

        console.log("updateCoachForId, response json : ", json);

        //dispatch
        this.onAPIuserObtained(APIuser);

        return APIuser;
      });
  }


}
