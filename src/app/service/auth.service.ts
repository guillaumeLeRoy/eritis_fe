import {User} from "../user/user";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {Observable, BehaviorSubject, Subject} from "rxjs";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {Response, Http, Headers} from "@angular/http";
import {ApiUser} from "../model/apiUser";
import {environment} from "../../environments/environment";
import {FirebaseService} from "./firebase.service";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/coachee";

@Injectable()
export class AuthService {

  /* contract plan*/
  public static GET_CONTRACT_PLANS = "v1/plans/";

  public static UPDATE_COACH = "/coachs/:id";
  public static UPDATE_COACHEE = "/coachees/:id";
  public static UPDATE_COACHEE_SELECTED_COACH = "/coachees/:coacheeId/coach/:coachId";
  public static POST_SIGN_UP_COACH = "/login/:firebaseId/coach";
  public static POST_SIGN_UP_COACHEE = "/login/:firebaseId/coachee";
  public static LOGIN = "/login/:firebaseId";
  public static GET_COACHS = "/coachs";
  public static GET_COACH_FOR_ID = "/coachs/:id";
  public static GET_COACHEE_FOR_ID = "/coachees/:id";

  /*Meeting*/
  public static POST_MEETING = "/meeting";
  public static GET_MEETING_REVIEWS = "/meeting/:meetingId/reviews";
  public static POST_MEETING_REVIEW = "/meeting/:meetingId/review";
  public static CLOSE_MEETING = "/meeting/:meetingId/close";
  public static GET_MEETINGS_FOR_COACHEE_ID = "/meetings/coachee/:coacheeId";
  public static GET_MEETINGS_FOR_COACH_ID = "/meetings/coach/:coachId";
  public static POST_MEETING_POTENTIAL_DATE = "/meeting/:meetingId/potential";
  public static GET_MEETING_POTENTIAL_DATES = "/meeting/:meetingId/potentials";
  public static PUT_POTENTIAL_DATE_TO_MEETING = "/meeting/:meetingId/potential/:potentialId";//set the potential date as the meeting selected date

  private onAuthStateChangedCalled = false;
  // private user: User
  private isUserAuth = new BehaviorSubject<boolean>(false);//NOT auth by default
  // private ApiUserSubject = new BehaviorSubject<ApiUser>(null);//NOT auth by default
  private ApiUserSubject = new Subject<ApiUser>();//NOT auth by default
  /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
  private isSignInOrUp = false;

  private ApiUser?: Coach | Coachee = null;

  constructor(private firebase: FirebaseService, private router: Router, private httpService: Http) {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("onAuthStateChanged, user : " + user);
      this.onAuthStateChangedCalled = true;
      this.updateAuthStatus(user);
    }.bind(this));

    console.log("ctr done");
  }

  getConnectedUser(): Coach | Coachee {
    return this.ApiUser;
  }

  getConnectedUserObservable(): Observable<Coach | Coachee> {
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
    return method;
  }

  postNotAuth(path: string, params: string[], body: any): Observable<Response> {
    return this.httpService.post(this.generatePath(path, params), body)
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
    return method;
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
    return method;
  }

  getNotAuth(path: string, params: string[]): Observable<Response> {
    return this.httpService.get(this.generatePath(path, params))
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
    console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);

    return environment.BACKEND_BASE_URL + completedPath;
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

  /* when we obtained a User from the API ( coach or coachee ) */
  private onAPIuserObtained(user: Coach | Coachee, firebaseToken: string): Coach | Coachee {
    console.log("onAPIuserObtained, user : ", user);
    if (user) {
      //keep current user
      this.ApiUser = user;
      //save token
      this.ApiUser.firebaseToken = firebaseToken;
      //dispatch
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
        let apiUser: any = response.json();
        let res = this.parseAPIuser(apiUser);
        console.log("getUserForFirebaseId, apiUser : ", apiUser);
        // console.log("getUserForFirebaseId, token : ", token);
        return this.onAPIuserObtained(res, token);
      }
    );
  }

  signUpCoachee(user: User, planId: number): Observable<ApiUser> {
    return this.signup(user, AuthService.POST_SIGN_UP_COACHEE);
  }


  signUpCoach(user: User): Observable<ApiUser> {
    return this.signup(user, AuthService.POST_SIGN_UP_COACH);
  }

  private signup(user: User, path: string): Observable<ApiUser> {
    console.log("1. user signUp : ", user);
    this.isSignInOrUp = true;
    //create user with email and pwd
    let firebasePromise = this.firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
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
        let fbUser = this.firebase.auth().currentUser;

        let body = {
          email: fbUser.email,
          uid: fbUser.uid,
        };
        let params = [fbUser.uid];

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        // start sign up request
        return this.httpService.post(this.generatePath(path, params), body, {headers: headers})
          .map(
            (response) => {
              let APIuser = response.json();
              console.log("signUp, APIuser : ", APIuser);
              // return json;
              this.isSignInOrUp = false;
              return this.onAPIuserObtained(this.parseAPIuser(APIuser), token);
            }
          );
      }
    );
  }

  private parseAPIuser(user: any): Coach | Coachee {
    console.log("parseAPIuser, user :", user);

    if (user.coach) {
      user = user.coach;
      //coach
      return this.parseCoach(user);
    } else if (user.coachee) {
      user = user.coachee;
      //coachee
      return this.parseCoachee(user);
    }
    return null;
  }

  private parseCoach(json: any): Coach {
    let coach: Coach = new Coach(json.id);
    coach.email = json.email;
    coach.display_name = json.display_name;
    coach.avatar_url = json.avatar_url;
    coach.start_date = json.start_date;
    coach.description = json.description;
    return coach;
  }

  private parseCoachee(json: any): Coachee {
    let coachee: Coachee = new Coachee(json.id);
    coachee.id = json.id;
    coachee.email = json.email;
    coachee.display_name = json.display_name;
    coachee.avatar_url = json.avatar_url;
    coachee.start_date = json.start_date;
    coachee.selectedCoach = json.selectedCoach;
    return coachee;
  }

  signIn(user: User): Observable<Coach | Coachee> {
    console.log("1. user signIn : ", user);
    this.isSignInOrUp = true;

    //fb sign in with email and pwd
    let firebasePromise = this.firebase.auth().signInWithEmailAndPassword(user.email, user.password)
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
        let fbUser = this.firebase.auth().currentUser;
        //now sign up in AppEngine
        this.isSignInOrUp = false;
        return this.getUserForFirebaseId(fbUser.uid, token);
      }
    );
  }

  loginOut() {
    console.log("user loginOut");
    this.firebase.auth().signOut();
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
        return this.onUserResponse(response);
      });
  }

  updateCoachForId(id: string, displayName: string, description: string, avatarUrl: string): Observable<ApiUser> {
    console.log("updateCoachDisplayNameForId, id", id);

    let body = {
      display_name: displayName,
      description: description,
      avatar_url: avatarUrl,
    };

    let params = [id];
    return this.put(AuthService.UPDATE_COACH, params, body).map(
      (response: Response) => {
        //convert to coach
        return this.onUserResponse(response);
      });
  }

  /**
   *
   * @param coacheeId
   * @param coachId
   * @returns {Observable<R>}
   */
  updateCoacheeSelectedCoach(coacheeId: string, coachId: string): Observable<Coachee> {
    console.log("updateCoacheeSelectedCoach, coacheeId", coacheeId);
    console.log("updateCoacheeSelectedCoach, coachId", coachId);

    let params = [coacheeId, coachId];
    return this.put(AuthService.UPDATE_COACHEE_SELECTED_COACH, params, null).map(
      (response: Response) => {
        //convert to coachee
        return this.parseCoachee(response.json());
      });
  }


  private onUserResponse(response: Response): Coach | Coachee {
    let json = response.json();
    console.log("onUserResponse, response json : ", json);
    let res = this.parseAPIuser(json);
    console.log("onUserResponse, parsed user : ", res);
    //dispatch
    return this.onAPIuserObtained(res, this.ApiUser.firebaseToken);
  }

}



