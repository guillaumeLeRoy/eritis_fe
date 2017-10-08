import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {Observable, Subscription} from "rxjs";
import {Coach} from "../../model/Coach";
import {Coachee} from "../../model/Coachee";
import {HR} from "../../model/HR";
import {ApiUser} from "../../model/ApiUser";
import {Notif} from "../../model/Notif";
import {CoachCoacheeService} from "../../service/coach_coachee.service";
import {Response} from "@angular/http";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {FirebaseService} from "../../service/firebase.service";
import {MeetingsService} from "../../service/meetings.service";
import {Meeting} from "../../model/Meeting";
import {Utils} from "../../utils/Utils";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CookieService} from "ngx-cookie";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss']
})
export class AuthHeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  private isAuthenticated: Observable<boolean>;

  private mUser: Coach | Coachee | HR
  private user: BehaviorSubject<ApiUser>;

  private connectedUserSubscription: Subscription;
  private routerEventSubscription: Subscription;
  private readAllNotifSubscription: Subscription;
  private getAvailableMeetingsSubscription: Subscription;
  private getAllNotifSubscription: Subscription;

  private notifications: Observable<Notif[]>;

  private hasAvailableMeetings = false;


  constructor(private router: Router, private meetingService: MeetingsService, private authService: AuthService, private coachCoacheeService: CoachCoacheeService,
              private cd: ChangeDetectorRef) {
    this.user = new BehaviorSubject(null);
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.getConnectedUser();

    this.router.events.subscribe((evt) => {
      // if (!(evt instanceof NavigationEnd)) {
      //   this.onRefreshRequested();
      //   // console.log("headerNav USER", this.mUser);
      //   // console.log("headerNav COOKIE", this.cookieService.get('ACTIVE_SESSION'));
      //   if (this.mUser !== null && this.cookieService.get('ACTIVE_SESSION') === undefined) {
      //     this.onLogout();
      //     this.router.navigate(['/']);
      //   }
      // }
      window.scrollTo(0, 0)
    });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');

    if (this.connectedUserSubscription)
      this.connectedUserSubscription.unsubscribe();

    if (this.routerEventSubscription)
      this.routerEventSubscription.unsubscribe();

    if (this.getAvailableMeetingsSubscription)
      this.getAvailableMeetingsSubscription.unsubscribe();

    if (this.getAllNotifSubscription)
      this.getAllNotifSubscription.unsubscribe();

    if (this.readAllNotifSubscription)
      this.readAllNotifSubscription.unsubscribe();
  }

  getConnectedUser() {
    this.connectedUserSubscription = this.authService.getConnectedUserObservable()
      .subscribe((user?: Coach | Coachee | HR) => {
          console.log("getConnectedUser : " + user);
          this.onUserObtained(user);
          this.cd.detectChanges();
        }
      );
  }

  onRefreshRequested() {
    this.connectedUserSubscription = this.authService.refreshConnectedUser()
      .subscribe((user?: Coach | Coachee | HR) => {
          console.log("onRefreshRequested : " + user);
          this.onUserObtained(user);
          this.cd.detectChanges();
        }
      );
  }

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('onUserObtained : ' + user);

    this.mUser = user;

    // Un utilisateur non connecté est redirigé sur la page d'accueil
    if (this.isAdmin()) {
      this.mUser = null;
      this.isAuthenticated = Observable.of(false);
    }

    if (user) {
      this.isAuthenticated = Observable.of(true);
      this.fetchNotificationsForUser(user);

      if (this.isUserACoach())
        this.getAvailableMeetings();

      this.user.next(user);
    }
    else {
      this.isAuthenticated = Observable.of(false);
    }
  }

  onLogout() {
    console.log("login out")
    $('.button-collapse').sideNav('hide');
    this.authService.loginOut();
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  goToHome() {
    console.log('goToHome');
    if (this.isAuthenticated) {
      console.log('goToHomeUser');
      this.goToMeetings();
    }
    else if (this.isAdmin()) {
      console.log('goToHomeAdmin');
      this.navigateAdminHome();
    }
  }

  goToWelcomePage() {
    $('.button-collapse').sideNav('hide');
    this.router.navigate(['welcome']);
  }

  goToMeetings() {
    let user = this.authService.getConnectedUser();
    if (user != null) {
      this.router.navigate(['dashboard/meetings']);
    }
  }

  goToAvailableSessions() {
    let user = this.authService.getConnectedUser();
    if (user != null) {
      this.router.navigate(['dashboard/available_meetings']);
    }
  }

  goToProfile() {
    if (this.mUser instanceof Coach) {
      this.router.navigate(['dashboard/profile_coach', this.mUser.id]);
    } else if (this.mUser instanceof Coachee) {
      this.router.navigate(['dashboard/profile_coachee', this.mUser.id]);
    } else if (this.mUser instanceof HR) {
      this.router.navigate(['dashboard/profile_rh', this.mUser.id]);
    }
  }

  // call API to inform that notifications have been read
  updateNotificationRead() {
    let user = this.authService.getConnectedUser();
    let obs: Observable<Response>;
    if (user != null) {
      if (user instanceof Coach) {
        let params = [user.id];
        obs = this.authService.put(AuthService.PUT_COACH_NOTIFICATIONS_READ, params, null);
      } else if (user instanceof Coachee) {
        let params = [user.id];
        obs = this.authService.put(AuthService.PUT_COACHEE_NOTIFICATIONS_READ, params, null);
      }

      if (obs != null) {
        obs.subscribe((response: Response) => {
          console.log('updateNotificationRead response : ' + response);
        }).unsubscribe();
      }

    }
  }

  isUserACoach(): boolean {
    return this.mUser instanceof Coach
  }

  isUserACoachee(): boolean {
    return this.mUser instanceof Coachee
  }

  isUserARh(): boolean {
    return this.mUser instanceof HR
  }

  isAdmin(): boolean {
    let admin = new RegExp('/admin');
    return admin.test(this.router.url);
  }
  //
  // isHomePage(): boolean {
  //   let home = new RegExp('/welcome');
  //   return home.test(this.router.url);
  // }

  isEditingProfile(): boolean {
    let profileCoach = new RegExp('/profile_coach');
    let profileCoachee = new RegExp('/profile_coachee');
    let profileRh = new RegExp('/profile_rh');
    return profileCoach.test(this.router.url) || profileCoachee.test(this.router.url) || profileRh.test(this.router.url);
  }

  // isSigningUp(): boolean {
  //   let signupCoach = new RegExp('/signup_coach');
  //   let signupCoachee = new RegExp('/signup_coachee');
  //   let signupRh = new RegExp('/signup_rh');
  //   let registerCoach = new RegExp('/register_coach');
  //   return signupCoach.test(this.router.url)
  //     || signupCoachee.test(this.router.url)
  //     || signupRh.test(this.router.url)
  //     || registerCoach.test(this.router.url);
  // }

  canDisplayListOfCoach(): boolean {
    if (this.mUser == null)
      return false;

    if (this.mUser instanceof Coach)
      return false;
    else
      return true;
  }


  private getAvailableMeetings() {
    this.getAvailableMeetingsSubscription = this.meetingService.getAvailableMeetings().subscribe(
      (meetings: Meeting[]) => {
        console.log('got getAvailableMeetings', meetings);
        if (meetings != null && meetings.length > 0) this.hasAvailableMeetings = true;
        this.cd.detectChanges();
      }
    );
  }

  private fetchNotificationsForUser(user: ApiUser) {

    let param = user
    this.getAllNotifSubscription = this.coachCoacheeService.getAllNotificationsForUser(param).subscribe(
      (notifs: Notif[]) => {
        console.log('fetchNotificationsForUser : ' + notifs);

        //Sort notifs by date
        if (notifs != null) {
          notifs.sort(function (a, b) {
            let d1 = new Date(a.date);
            let d2 = new Date(b.date);
            let res = d1.getUTCFullYear() - d2.getUTCFullYear();
            if (res === 0)
              res = d1.getUTCMonth() - d2.getUTCMonth();
            if (res === 0)
              res = d1.getUTCDate() - d2.getUTCDate();
            if (res === 0)
              res = d1.getUTCHours() - d2.getUTCHours();
            return res;
          });
        }

        this.notifications = Observable.of(notifs);
        this.cd.detectChanges();
      }
    );
  }

  printDateString(date: string) {
    return Utils.dateToString(date) + ' - ' + Utils.getHoursAndMinutesFromDate(date);
  }

  readAllNotifications() {
    this.readAllNotifSubscription = this.coachCoacheeService.readAllNotificationsForUser(this.mUser).subscribe(
      (response: Response) => {
        console.log("getAllNotifications OK", response);
        this.fetchNotificationsForUser(this.mUser);
        this.cd.detectChanges();
      }
    );
  }


  /******* Admin page *****/
  navigateAdminHome() {
    console.log("navigateAdminHome");
    this.router.navigate(['/admin']);
  }

  navigateToSignup() {
    console.log("navigateToSignup");
    this.router.navigate(['admin/signup']);
  }

  navigateToCoachsList() {
    console.log("navigateToCoachsList");
    this.router.navigate(['admin/coachs-list']);
  }

  navigateToCoacheesList() {
    console.log("navigateToCoacheesList");
    this.router.navigate(['admin/coachees-list']);
  }

  navigateToRhsList() {
    console.log("navigateToRhsList");
    this.router.navigate(['admin/rhs-list']);
  }

  navigateToPossibleCoachsList() {
    console.log("navigateToPossibleCoachsList")
    this.router.navigate(['admin/possible_coachs-list']);
  }
}
