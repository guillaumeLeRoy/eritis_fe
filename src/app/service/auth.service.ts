import {User} from "../user/user";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {Headers, Http, RequestOptionsArgs, Response, URLSearchParams} from "@angular/http";
import {ApiUser} from "../model/ApiUser";
import {environment} from "../../environments/environment";
import {FirebaseService} from "./firebase.service";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/Coachee";
import {LoginResponse} from "../model/LoginResponse";
import {HR} from "../model/HR";
import {PotentialCoachee} from "../model/PotentialCoachee";
import {PotentialRh} from "../model/PotentialRh";
import {CookieService} from "ngx-cookie";

@Injectable()
export class AuthService {

  /* contract plan*/
  public static GET_CONTRACT_PLANS = "/v1/plans/";

  public static POST_POTENTIAL_COACHEE = "/v1/potentials/coachees";
  public static POST_POTENTIAL_COACH = "/v1/potentials/coachs";
  public static POST_POTENTIAL_RH = "/v1/potentials/rhs";

  public static LOGIN = "/login/:firebaseId";
  public static GET_POTENTIAL_COACHEE_FOR_TOKEN = "/v1/potentials/coachees/:token";
  public static GET_POTENTIAL_COACH_FOR_TOKEN = "/v1/potentials/coachs/:token";
  public static GET_POTENTIAL_RH_FOR_TOKEN = "/v1/potentials/rhs/:token";

  /* Possible coach */
  public static UPDATE_POSSIBLE_COACH = "/v1/possible_coachs";
  public static UPDATE_POSSIBLE_COACH_PICTURE = "/v1/possible_coachs/profile_picture";
  public static UPDATE_POSSIBLE_COACH_INSURANCE_DOC = "/v1/possible_coachs/insurance";

  /* coachee */
  public static UPDATE_COACHEE = "/v1/coachees/:id";
  public static POST_SIGN_UP_COACHEE = "/v1/coachees";
  public static GET_COACHEES = "/v1/coachees";
  public static GET_COACHEE_FOR_ID = "/v1/coachees/:id";
  public static GET_COACHEE_NOTIFICATIONS = "/v1/coachees/:id/notifications";
  public static PUT_COACHEE_NOTIFICATIONS_READ = "/v1/coachees/:id/notifications/read";
  public static PUT_COACHEE_PROFILE_PICT = "/v1/coachees/:id/profile_picture";

  /* coach */
  public static UPDATE_COACH = "/v1/coachs/:id";
  public static POST_SIGN_UP_COACH = "/v1/coachs";
  public static GET_COACHS = "/v1/coachs";
  public static GET_COACH_FOR_ID = "/v1/coachs/:id";
  public static GET_COACH_NOTIFICATIONS = "/v1/coachs/:id/notifications";
  public static PUT_COACH_NOTIFICATIONS_READ = "/v1/coachs/:id/notifications/read";
  public static PUT_COACH_PROFILE_PICT = "/v1/coachs/:id/profile_picture";

  /* HR */
  public static UPDATE_RH = "/v1/rhs/:id";
  public static POST_SIGN_UP_RH = "/v1/rhs";
  public static GET_COACHEES_FOR_RH = "/v1/rhs/:uid/coachees";
  public static GET_POTENTIAL_COACHEES_FOR_RH = "/v1/rhs/:uid/potentials";
  public static GET_RH_FOR_ID = "/v1/rhs/:id";
  public static GET_USAGE_RATE_FOR_RH = "/v1/rhs/:id/usage";
  public static GET_RH_NOTIFICATIONS = "/v1/rhs/:id/notifications";
  public static PUT_RH_NOTIFICATIONS_READ = "/v1/rhs/:id/notifications/read";
  public static POST_COACHEE_OBJECTIVE = "/v1/rhs/:uidRH/coachees/:uidCoachee/objective";//create new objective for this coachee
  public static PUT_RH_PROFILE_PICT = "/v1/rhs/:id/profile_picture";


  /* admin */
  public static GET_ADMIN = "/v1/admins/user";
  public static ADMIN_GET_COACHS = "/v1/admins/coachs";
  public static ADMIN_GET_COACH = "/v1/admins/coachs/:id";
  public static ADMIN_GET_COACHEES = "/v1/admins/coachees";
  public static ADMIN_GET_COACHEE = "/v1/admins/coachees/:id";
  public static ADMIN_GET_RHS = "/v1/admins/rhs";
  public static ADMIN_GET_RH = "/v1/admins/rhs/:id";
  public static ADMIN_GET_POSSIBLE_COACHS = "/v1/admins/possible_coachs";
  public static ADMIN_GET_POSSIBLE_COACH = "/v1/admins/possible_coachs/:id";

  /* Meeting */
  public static POST_MEETING = "/v1/meetings";
  public static DELETE_MEETING = "/v1/meetings/:meetingId";
  public static GET_MEETING_REVIEWS = "/v1/meetings/:meetingId/reviews";
  public static PUT_MEETING_REVIEW = "/v1/meetings/:meetingId/reviews";//add or replace meeting review
  public static DELETE_MEETING_REVIEW = "/v1/meetings/reviews/:reviewId";//delete review
  public static CLOSE_MEETING = "/v1/meetings/:meetingId/close";// close meeting
  public static GET_MEETINGS_FOR_COACHEE_ID = "/v1/meetings/coachees/:coacheeId";
  public static GET_MEETINGS_FOR_COACH_ID = "/v1/meetings/coachs/:coachId";
  public static POST_MEETING_POTENTIAL_DATE = "/v1/meetings/:meetingId/potentials";
  public static GET_MEETING_POTENTIAL_DATES = "/v1/meetings/:meetingId/potentials";
  public static PUT_POTENTIAL_DATE_TO_MEETING = "/v1/meetings/potentials/:potentialId";//update potential date
  public static DELETE_POTENTIAL_DATE = "/v1/meetings/potentials/:potentialId";//delete potential date
  public static PUT_FINAL_DATE_TO_MEETING = "/v1/meetings/:meetingId/dates/:potentialId";//set the potential date as the meeting selected date
  public static GET_AVAILABLE_MEETINGS = "/v1/meetings";//get available meetings ( meetings with NO coach associated )
  public static PUT_COACH_TO_MEETING = "/v1/meetings/:meetingId/coachs/:coachId";//associate coach with meeting

  private onAuthStateChangedCalled = false;
  // private user: User
  private isUserAuth = new BehaviorSubject<boolean>(false);//NOT auth by default
  // private ApiUserSubject = new BehaviorSubject<ApiUser>(null);//NOT auth by default
  private ApiUserSubject = new Subject<ApiUser>();//NOT auth by default
  /* flag to know if we are in the sign in or sign up process. Block updateAuthStatus(FBuser) is true */
  private isSignInOrUp = false;

  private ApiUser?: Coach | Coachee | HR = null;

  constructor(private firebase: FirebaseService, private router: Router, private httpService: Http, private cookieService: CookieService) {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log("onAuthStateChanged, user : " + user);
      this.onAuthStateChangedCalled = true;
      this.updateAuthStatus(user);
    }.bind(this));

    console.log("ctr done");

    let date = (new Date());
    date.setHours(date.getHours() + 1);
    console.log('COOKIE', date);
    if (this.cookieService.get('ACTIVE_SESSION') === undefined)
      this.cookieService.put('ACTIVE_SESSION', 'true', {expires: date.toDateString()});
  }

  /*
   * Get connected user from backend
   */
  refreshConnectedUser(): Observable<Coach | Coachee | HR> {
    console.log("refreshConnectedUser");

    if (this.ApiUser != null) {
      if (this.ApiUser instanceof Coach) {
        return this.fetchCoach(this.ApiUser.id);
      } else if (this.ApiUser instanceof Coachee) {
        return this.fetchCoachee(this.ApiUser.id);
      } else if (this.ApiUser instanceof HR) {
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

  private fetchRh(userId: string): Observable<HR> {
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

  getConnectedUser(): Coach | Coachee | HR {
    // if (this.ApiUser !== null)
      // if (this.cookieService.get('ACTIVE_SESSION') !== 'true')
        // this.loginOut();
    return this.ApiUser;
  }

  getConnectedUserObservable(): Observable<Coach | Coachee | HR> {
    return this.ApiUserSubject.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isUserAuth.asObservable();
  }

  post(path: string, params: string[], body: any, options?: RequestOptionsArgs): Observable<Response> {
    let method = this.getConnectedApiUser().flatMap(
      (firebaseUser: ApiUser) => {
        return this.getHeader(firebaseUser).flatMap(
          (headers: Headers) => {

            if (options != undefined) {
              for (let headerKey of options.headers.keys()) {
                console.log('post, options headerKey : ', headerKey);
                console.log('post, options value : ', options.headers.get(headerKey));
                headers.append(headerKey, options.headers.get(headerKey));
              }
            }

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

  put(path: string, params: string[], body: any, options?: RequestOptionsArgs): Observable<Response> {
    let method = this.getConnectedApiUser().flatMap(
      (firebaseUser: ApiUser) => {
        return this.getHeader(firebaseUser).flatMap(
          (headers: Headers) => {

            if (options != null)
              for (let headerKey of options.headers.keys()) {
                console.log('put, options headerKey : ', headerKey);
                console.log('put, options value : ', options.headers.get(headerKey));

                headers.append(headerKey, options.headers.get(headerKey));
              }

            return this.httpService.put(this.generatePath(path, params), body, {headers: headers})
          }
        );
      }
    );
    return method;
  }

  putNotAuth(path: string, params: string[], body: any, options?: RequestOptionsArgs): Observable<Response> {
    let headers = new Headers();
    if (options != null)
      for (let headerKey of options.headers.keys()) {
        console.log('put, options headerKey : ', headerKey);
        console.log('put, options value : ', options.headers.get(headerKey));

        headers.append(headerKey, options.headers.get(headerKey));
      }

    return this.httpService.put(this.generatePath(path, params), body, {headers: headers})
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
    console.log("getNotAuth, start request");
    return this.httpService.get(this.generatePath(path, params)).map(
      (res: Response) => {
        console.log("getNotAuth, got user", res);
        return res;
      }, (error) => {
        console.log("getNotAuth, error", error);
      }
    );
  }

  getPotentialCoachee(path: string, params: string[]): Observable<PotentialCoachee> {
    return this.httpService.get(this.generatePath(path, params)).map(
      (res: Response) => {
        return this.parsePotentialCoachee(res.json());
      }
    );
  }

  getPotentialRh(path: string, params: string[]): Observable<PotentialRh> {
    return this.httpService.get(this.generatePath(path, params)).map(
      (res: Response) => {
        return this.parsePotentialRh(res.json());
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
  private onAPIuserObtained(user: Coach | Coachee | HR, firebaseToken: string): Coach | Coachee | HR {
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

  private getUserForFirebaseId(firebaseId: string, token: string): Observable<Coach | Coachee | HR> {
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

              let date = (new Date());
              date.setHours(date.getHours() + 1);
              console.log('COOKIE', date);
              this.cookieService.put('ACTIVE_SESSION', 'true', {'expires': date});

              // return json;
              this.isSignInOrUp = false;
              return this.onAPIuserObtained(this.parseAPIuser(loginResponse), token);
            }
          );
      }
    );
  }

  private parseAPIuser(response: LoginResponse): Coach | Coachee | HR {
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

  parseCoach(json: any): Coach {
    let coach: Coach = new Coach(json.id);
    coach.email = json.email;
    coach.first_name = json.first_name;
    coach.last_name = json.last_name;
    coach.avatar_url = json.avatar_url;
    coach.start_date = json.start_date;
    coach.description = json.description;
    coach.chat_room_url = json.chat_room_url;
    coach.linkedin_url = json.linkedin_url;
    coach.training = json.training;
    coach.degree = json.degree;
    coach.extraActivities = json.extraActivities;
    coach.coachForYears = json.coachForYears;
    coach.coachingExperience = json.coachingExperience;
    coach.coachingHours = json.coachingHours;
    coach.supervisor = json.supervisor;
    coach.favoriteCoachingSituation = json.favoriteCoachingSituation;
    coach.status = json.status;
    coach.revenues = json.revenue;
    coach.insurance_url = json.insurance_url;
    coach.invoice_address = json.invoice_address;
    coach.invoice_city = json.invoice_city;
    coach.invoice_entity = json.invoice_entity;
    coach.invoice_postcode = json.invoice_postcode;
    coach.languages = json.languages;
    coach.experienceShortSession = json.experienceShortSession;
    coach.coachingSpecifics = json.coachingSpecifics;
    coach.therapyElements = json.therapyElements;
    return coach;
  }

  parseCoachee(json: any): Coachee {
    // TODO : don't really need to manually parse the received Json
    let coachee: Coachee = new Coachee(json.id);
    coachee.id = json.id;
    coachee.email = json.email;
    coachee.first_name = json.first_name;
    coachee.last_name = json.last_name;
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

  parseRh(json: any): HR {
    console.log(json);
    let rh: HR = new HR(json.id);
    rh.email = json.email;
    rh.description = json.description;
    rh.first_name = json.first_name;
    rh.last_name = json.last_name;
    rh.start_date = json.start_date;
    rh.avatar_url = json.avatar_url;
    return rh;
  }

  parsePotentialRh(json: any): PotentialRh {
    let potentialRh: PotentialRh = new PotentialRh(json.id);
    potentialRh.email = json.email;
    potentialRh.firstName = json.first_name;
    potentialRh.lastName = json.last_name;
    potentialRh.start_date = json.create_date;
    return potentialRh;
  }

  parsePotentialCoachee(json: any): PotentialCoachee {
    let potentialCoachee: PotentialCoachee = new PotentialCoachee(json.id);
    potentialCoachee.email = json.email;
    potentialCoachee.start_date = json.create_date;
    potentialCoachee.plan = json.plan;
    return potentialCoachee;
  }

  signIn(user: User): Observable<Coach | Coachee | HR> {
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
        let date = (new Date());
        date.setHours(date.getHours() + 1);
        console.log('COOKIE', date);
        this.cookieService.put('ACTIVE_SESSION', 'true', {'expires': date});
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
    this.cookieService.remove('ACTIVE_SESSION');
    this.router.navigate(['/welcome']);
  }


  updateCoacheeForId(id: string, first_name: string, last_name: string, avatarUrl: string): Observable<ApiUser> {
    console.log("updateCoacheeForId, id", id);

    let body = {
      first_name: first_name,
      last_name: last_name,
      avatar_url: avatarUrl,
    };

    let params = [id];
    return this.put(AuthService.UPDATE_COACHEE, params, body).map(
      (response: Response) => {
        //return this.onUserResponse(response);
        return null;
      });
  }

  updateCoachForId(id: string, firstName: string, lastName: string, description: string, avatarUrl: string): Observable<ApiUser> {
    console.log("updateCoachForId, id", id);

    let body = {
      first_name: firstName,
      last_name: lastName,
      description: description,
      avatar_url: avatarUrl,
    };

    let params = [id];
    return this.put(AuthService.UPDATE_COACH, params, body).map(
      (response: Response) => {
        //convert to coach
        // return this.onUserResponse(response);
        return null;
      });
  }

  updateRhForId(id: string, firstName: string, lastName: string, description: string, avatarUrl: string): Observable<ApiUser> {
    console.log("updateRhForId, id", id);

    let body = {
      first_name: firstName,
      last_name: lastName,
      description: description,
      avatar_url: avatarUrl,
    };

    let params = [id];
    return this.put(AuthService.UPDATE_RH, params, body).map(
      (response: Response) => {
        //convert to coach
        // return this.onUserResponse(response);
        return null;
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
  private onUserResponse(response: Response): Coach | Coachee | HR {
    let json: LoginResponse = response.json();
    console.log("onUserResponse, response json : ", json);
    let res = this.parseAPIuser(json);
    console.log("onUserResponse, parsed user : ", res);
    //dispatch
    return this.onAPIuserObtained(res, this.ApiUser.firebaseToken);
  }

}



