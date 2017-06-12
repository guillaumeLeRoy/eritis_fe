import {User} from "../user/user";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {Headers, Http, Response, URLSearchParams} from "@angular/http";
import {ApiUser} from "../model/ApiUser";
import {environment} from "../../environments/environment";
import {FirebaseService} from "./firebase.service";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/Coachee";
import {LoginResponse} from "../model/LoginResponse";
import {Rh} from "../model/Rh";
import {PotentialCoachee} from "../model/PotentialCoachee";

@Injectable()
export class AuthService {

  /* contract plan*/
  public static GET_CONTRACT_PLANS = "v1/plans/";

  public static POST_POTENTIAL_COACHEE = "/v1/potentials/coachees";
  public static POST_POTENTIAL_COACH = "/v1/potentials/coachs";
  public static POST_POTENTIAL_RH = "/v1/potentials/rhs";

  public static LOGIN = "/login/:firebaseId";
  public static GET_POTENTIAL_COACHEE_FOR_TOKEN = "/v1/potentials/coachees/:token";
  public static GET_POTENTIAL_COACH_FOR_TOKEN = "/v1/potentials/coachs/:token";
  public static GET_POTENTIAL_RH_FOR_TOKEN = "/v1/potentials/rhs/:token";

  /* coachee */
  public static UPDATE_COACHEE = "/coachees/:id";
  public static POST_SIGN_UP_COACHEE = "/v1/coachees";
  public static GET_COACHEES = "v1/coachees";
  public static GET_COACHEE_FOR_ID = "v1/coachees/:id";
  public static GET_COACHEE_NOTIFICATIONS = "v1/coachees/:id/notifications";
  public static PUT_COACHEE_NOTIFICATIONS_READ = "v1/coachees/:id/notifications/read";

  /* coach */
  public static UPDATE_COACH = "/coachs/:id";
  public static POST_SIGN_UP_COACH = "/v1/coachs";
  public static GET_COACHS = "/coachs";
  public static GET_COACH_FOR_ID = "/coachs/:id";
  public static GET_COACH_NOTIFICATIONS = "v1/coachs/:id/notifications";
  public static PUT_COACH_NOTIFICATIONS_READ = "v1/coachs/:id/notifications/read";

  /* rh */
  public static POST_SIGN_UP_RH = "/v1/rhs";
  public static GET_COACHEES_FOR_RH = "/v1/rhs/:uid/coachees";
  public static GET_POTENTIAL_COACHEES_FOR_RH = "/v1/rhs/:uid/potentials";
  public static GET_RH_FOR_ID = "/rh/:id";
  public static GET_USAGE_RATE_FOR_RH = "/v1/rhs/:id/usage";
  public static GET_RH_NOTIFICATIONS = "v1/rhs/:id/notifications";
  public static PUT_RH_NOTIFICATIONS_READ = "v1/rhs/:id/notifications/read";

  /* admin */
  public static GET_ADMIN = "/v1/admins/user";
  public static ADMIN_GET_COACHS = "v1/admins/coachs";
  public static ADMIN_GET_COACHEES = "v1/admins/coachees";
  public static ADMIN_GET_RHS = "v1/admins/rhs";

  /*Meeting*/
  public static POST_MEETING = "/meeting";
  public static DELETE_MEETING = "/meeting/:meetingId";
  public static GET_MEETING_REVIEWS = "/meeting/:meetingId/reviews";
  public static POST_MEETING_REVIEW = "/meeting/:meetingId/review";
  public static PUT_MEETING_REVIEW = "/meeting/reviews/:reviewId";//update review
  public static DELETE_MEETING_REVIEW = "/meeting/reviews/:reviewId";//delete review
  public static CLOSE_MEETING = "/meeting/:meetingId/close";
  public static GET_MEETINGS_FOR_COACHEE_ID = "/meetings/coachee/:coacheeId";
  public static GET_MEETINGS_FOR_COACH_ID = "/meetings/coach/:coachId";
  public static POST_MEETING_POTENTIAL_DATE = "/meeting/:meetingId/potential";
  public static GET_MEETING_POTENTIAL_DATES = "/meeting/:meetingId/potentials";
  public static PUT_POTENTIAL_DATE_TO_MEETING = "/meeting/potential/:potentialId";//update potential date
  public static DELETE_POTENTIAL_DATE = "/meeting/potentials/:potentialId";//delete potential date
  public static PUT_FINAL_DATE_TO_MEETING = "/meeting/:meetingId/date/:potentialId";//set the potential date as the meeting selected date
  public static GET_AVAILABLE_MEETINGS = "v1/meetings";//get available meetings ( meetings with NO coach associated )
  public static PUT_COACH_TO_MEETING = "v1/meeting/:meetingId/coach/:coachId";//associate coach with meeting

  /* HR */
  public static POST_COACHEE_OBJECTIVE = "/v1/rhs/:uidRH/coachees/:uidCoachee/objective";//create new objective for this coachee


  private onAuthStateChangedCalled = false;
  // private user: User
  private isUserAuth = new BehaviorSubject<boolean>(false);//NOT auth by default
  // private ApiUserSubject = new BehaviorSubject<ApiUser>(null);//NOT auth by default
  private ApiUserSubject = new Subject<ApiUser>();//NOT auth by default
  /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
  private isSignInOrUp = false;

  private ApiUser?: Coach | Coachee | Rh = null;

  constructor(private firebase: FirebaseService, private router: Router, private httpService: Http) {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("onAuthStateChanged, user : " + user);
      this.onAuthStateChangedCalled = true;
      this.updateAuthStatus(user);
    }.bind(this));

    console.log("ctr done");
  }

  /*
   * Get connected user from backend
   */
  refreshConnectedUser(): Observable<Coach | Coachee | Rh> {
    console.log("refreshConnectedUser");

    if (this.ApiUser != null) {
      if (this.ApiUser instanceof Coach) {
        return this.fetchCoach(this.ApiUser.id);
      } else if (this.ApiUser instanceof Coachee) {
        return this.fetchCoachee(this.ApiUser.id);
      } else if (this.ApiUser instanceof Rh) {
        return this.fetchRh(this.ApiUser.id);
      }
    } else {
      console.log("refreshConnectedUser, no connected user");
    }
    return Observable.from(null);
  }

  private fetchCoach(userId: string): Observable<Coach> {
    let param = [userId];
    let obs = this.get(AuthService.GET_COACH_FOR_ID, param);
    return obs.map(
      (res: Response) => {
        console.log("fetchCoach, obtained from API : ", res);
        let coach = this.parseCoach(res.json());
        this.onAPIuserObtained(coach, this.ApiUser.firebaseToken);
        return coach;
      }
    );
  }

  private fetchCoachee(userId: string): Observable<Coachee> {
    let param = [userId];
    let obs = this.get(AuthService.GET_COACHEE_FOR_ID, param);
    return obs.map(
      (res: Response) => {
        console.log("fetchCoachee, obtained from API : ", res);
        let coachee = this.parseCoachee(res.json());
        this.onAPIuserObtained(coachee, this.ApiUser.firebaseToken);
        return coachee;
      }
    );
  }

  private fetchRh(userId: string): Observable<Rh> {
    let param = [userId];
    let obs = this.get(AuthService.GET_RH_FOR_ID, param);
    return obs.map(
      (res: Response) => {
        console.log("fetchRh, obtained from API : ", res);
        let rh = this.parseRh(res.json());
        this.onAPIuserObtained(rh, this.ApiUser.firebaseToken);
        return rh;
      }
    );
  }

  getConnectedUser(): Coach | Coachee | Rh {
    return this.ApiUser;
  }

  getConnectedUserObservable(): Observable<Coach | Coachee | Rh> {
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
    return this.getWithSearchParams(path, params, null);
  }

  getWithSearchParams(path: string, params: string[], searchParams: URLSearchParams): Observable<Response> {
    console.log("1. get");

    let method = this.getConnectedApiUser().flatMap(
      (firebaseUser: ApiUser) => {
        return this.getHeader(firebaseUser).flatMap(
          (headers: Headers) => {
            console.log("4. start request");
            return this.httpService.get(this.generatePath(path, params), {headers: headers, search: searchParams})
          }
        );
      }
    );
    return method;
  }

  delete(path: string, params: string[]): Observable<Response> {
    let method = this.getConnectedApiUser().flatMap(
      (firebaseUser: ApiUser) => {
        return this.getHeader(firebaseUser).flatMap(
          (headers: Headers) => {
            console.log("4. start request");
            return this.httpService.delete(this.generatePath(path, params), {headers: headers})
          }
        );
      }
    );
    return method;
  }

  getNotAuth(path: string, params: string[]): Observable<Response> {
    return this.httpService.get(this.generatePath(path, params))
  }

  getPotentialCoachee(path: string, params: string[]): Observable<PotentialCoachee> {
    return this.httpService.get(this.generatePath(path, params)).map(
      (res: Response) => {
        return this.parsePotentialCoachee(res.json());
      }
    );
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
    console.log("getHeader");

    if (user) {
      // console.log("getHeader, currentUser : ", user);
      let token = user.firebaseToken;
      if (token) {
        // console.log("getHeader, token : ", token);
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
    // console.log("generatePath, path : ", path);
    // console.log("generatePath, params : ", params);

    let completedPath = "";
    let segs = path.split("/");
    let paramIndex = 0;
    for (let seg of segs) {
      if (seg == "" || seg == null) {
        continue;
      }
      // console.log("generatePath, seg : ", seg);
      // console.log("generatePath, paramIndex : ", paramIndex);

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

    // console.log("generatePath, completedPath : ", completedPath);
    // console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);

    let finalUrl = environment.BACKEND_BASE_URL + completedPath;
    console.log("generatePath, finalUrl : ", finalUrl);

    return finalUrl;
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
  private onAPIuserObtained(user: Coach | Coachee | Rh, firebaseToken: string): Coach | Coachee | Rh {
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

  private getUserForFirebaseId(firebaseId: string, token: string): Observable<Coach | Coachee | Rh> {
    console.log("getUserForFirebaseId : ", firebaseId);
    let params = [firebaseId];

    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + token);

    return this.httpService.get(this.generatePath(AuthService.LOGIN, params), {headers: headers}).map(
      response => {
        let apiUser: LoginResponse = response.json();
        let res = this.parseAPIuser(apiUser);
        console.log("getUserForFirebaseId, apiUser : ", apiUser);
        // console.log("getUserForFirebaseId, token : ", token);
        return this.onAPIuserObtained(res, token);
      }
    );
  }

  signUpCoach(user: User): Observable<ApiUser> {
    return this.signup(user, AuthService.POST_SIGN_UP_COACH);
  }

  signUpCoachee(user: User): Observable<ApiUser> {
    //add plan
    return this.signup(user, AuthService.POST_SIGN_UP_COACHEE);
  }

  signUpRh(user: User): Observable<ApiUser> {
    return this.signup(user, AuthService.POST_SIGN_UP_RH);
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
          plan_id: user.contractPlanId
        };
        let params = [fbUser.uid];

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        // start sign up request
        return this.httpService.post(this.generatePath(path, params), body, {headers: headers})
          .map(
            (response) => {
              let loginResponse: LoginResponse = response.json();
              console.log("signUp, loginResponse : ", loginResponse);
              // return json;
              this.isSignInOrUp = false;
              return this.onAPIuserObtained(this.parseAPIuser(loginResponse), token);
            }
          );
      }
    );
  }

  private parseAPIuser(response: LoginResponse): Coach | Coachee | Rh {
    console.log("parseAPIuser, response :", response);

    if (response.coach) {
      let coach = response.coach;
      //coach
      return this.parseCoach(coach);
    } else if (response.coachee) {
      let coachee = response.coachee;
      //coachee
      return this.parseCoachee(coachee);
    } else if (response.rh) {
      let rh = response.rh;
      return this.parseRh(rh);
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
    coach.chat_room_url = json.chat_room_url;
    return coach;
  }

  private parseCoachee(json: any): Coachee {
    // TODO : don't really need to manually parse the received Json
    let coachee: Coachee = new Coachee(json.id);
    coachee.id = json.id;
    coachee.email = json.email;
    coachee.display_name = json.display_name;
    coachee.avatar_url = json.avatar_url;
    coachee.start_date = json.start_date;
    coachee.selectedCoach = json.selectedCoach;
    coachee.contractPlan = json.plan;
    coachee.availableSessionsCount = json.available_sessions_count;
    coachee.updateAvailableSessionCountDate = json.update_sessions_count_date;
    coachee.associatedRh = json.associatedRh;
    coachee.last_objective = json.last_objective;
    return coachee;
  }

  private parseRh(json: any): Rh {
    let rh: Rh = new Rh(json.id);
    rh.email = json.email;
    rh.display_name = json.display_name;
    rh.start_date = json.start_date;
    rh.avatar_url = json.avatar_url;
    return rh;
  }

  private parsePotentialCoachee(json: any): PotentialCoachee {
    let potentialCoachee: PotentialCoachee = new PotentialCoachee(json.id);
    potentialCoachee.email = json.email;
    potentialCoachee.start_date = json.create_date;
    potentialCoachee.plan = json.plan;
    return potentialCoachee;
  }

  signIn(user: User): Observable<Coach | Coachee | Rh> {
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

  // /**
  //  *
  //  * @param coacheeId
  //  * @param coachId
  //  * @returns {Observable<Coachee>}
  //  */
  // updateCoacheeSelectedCoach(coacheeId: string, coachId: string): Observable<Coachee> {
  //   console.log("updateCoacheeSelectedCoach, coacheeId", coacheeId);
  //   console.log("updateCoacheeSelectedCoach, coachId", coachId);
  //
  //   let params = [coacheeId, coachId];
  //   return this.put(AuthService.UPDATE_COACHEE_SELECTED_COACH, params, null).map(
  //     (response: Response) => {
  //       //convert to coachee
  //       return this.parseCoachee(response.json());
  //     });
  // }

  /**
   *
   * @param response
   * @returns {Coach|Coachee}
   */
  private onUserResponse(response: Response): Coach | Coachee | Rh {
    let json: LoginResponse = response.json();
    console.log("onUserResponse, response json : ", json);
    let res = this.parseAPIuser(json);
    console.log("onUserResponse, parsed user : ", res);
    //dispatch
    return this.onAPIuserObtained(res, this.ApiUser.firebaseToken);
  }

}



