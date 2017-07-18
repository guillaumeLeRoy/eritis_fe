import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {Observable, Subscription} from "rxjs";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/Coachee";
import {HR} from "../model/HR";
import {ApiUser} from "../model/apiUser";
import {Notif} from "../model/Notif";
import {CoachCoacheeService} from "../service/coach_coachee.service";
import {Response} from "@angular/http";
import {CookieService} from "ngx-cookie";
import {parseCookieValue} from "@angular/platform-browser/src/browser/browser_adapter";


declare var $: any;

@Component({
  selector: 'rb-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private loginActivated = false;

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private isAuthenticated: Observable<boolean>;
  private isConnected = false;
  private subscription: Subscription;

  private mUser: Coach | Coachee | HR;
  private user: Observable<Coach | Coachee | HR>;

  private notifications: Observable<Notif[]>;

  constructor(private router: Router, private authService: AuthService, private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef, private cookieService: CookieService) {
  }

  ngOnInit(): void {

    this.mUser = this.authService.getConnectedUser();
    this.onUserObtained(this.mUser);
    // this.isAuthenticated = this.authService.isAuthenticated();
    // this.authService.isAuthenticated().subscribe(
    //   (isAuth: boolean) => {
    //     console.log("isAuthenticated : " + isAuth);
    //     this.isAuthenticated = Observable.of(isAuth);
    //     this.cd.detectChanges();
    //   }
    // );
    if (this.user == null) {
      // Un utilisateur non connecté est redirigé sur la page d'accueil
      window.scrollTo(0, 0);
      this.router.navigate(['/']);
    }

    // this.connectedUser = this.authService.getConnectedUserObservable();
    this.subscription = this.authService.getConnectedUserObservable().subscribe(
      (user: Coach | Coachee | HR) => {
        console.log('getConnectedUser : ' + user);
        this.onUserObtained(user);
      }
    );

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      console.log('Header navigation');
      window.scrollTo(0, 0)
    });
  }

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('onUserObtained : ' + user);

    if (this.isAdmin()) {
      this.user = null;
      this.isAuthenticated = Observable.of(false);
    }

    if (user == null) {
      this.mUser = user;
      this.isAuthenticated = Observable.of(false);
      this.isConnected = false;
    } else {
      this.mUser = user;
      this.isAuthenticated = Observable.of(true);
      this.isConnected = true;
      this.fetchNotificationsForUser(user);
    }

    this.user = Observable.of(user);
    this.cd.detectChanges();
  }

  activateLogin() {
    this.loginActivated = true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogout() {
    window.scrollTo(0, 0);
    this.authService.loginOut();
  }

  onLogIn() {
    window.scrollTo(0, 0);
    this.router.navigate(['/signin']);
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

  goToHome(){
    console.log('goToHome');
    if (this.isAuthenticated) {
      console.log('goToHomeUser');
      this.goToMeetings();
    }
    if (this.isAdmin()) {
      console.log('goToHomeAdmin');
      this.navigateAdminHome();
    }
    if (this.isSigningUp()) {
      console.log('goToWelcomePage');
      this.goToWelcomePage();
    }
  }

  goToWelcomePage() {
    this.router.navigate(['/welcome']);
  }

  goToMeetings() {
    let user = this.authService.getConnectedUser();
    if (user != null) {
      this.router.navigate(['/meetings']);
    }
  }

  goToAvailableSessions() {
    let user = this.authService.getConnectedUser();
    if (user != null) {
      this.router.navigate(['/available_meetings']);
    }
  }

  goToProfile() {
    if (this.mUser instanceof Coach) {
      this.router.navigate(['/profile_coach', this.mUser.id]);
    } else if (this.mUser instanceof Coachee) {
      this.router.navigate(['/profile_coachee', this.mUser.id]);
    } else if (this.mUser instanceof HR) {
      this.router.navigate(['/profile_rh', this.mUser.id]);
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
        });
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

  isHomePage(): boolean {
    let home = new RegExp('/welcome');
    return home.test(this.router.url);
  }

  isEditingProfile(): boolean {
    let profileCoach = new RegExp('/profile_coach');
    let profileCoachee = new RegExp('/profile_coachee');
    let profileRh = new RegExp('/profile_rh');
    return profileCoach.test(this.router.url) || profileCoachee.test(this.router.url) || profileRh.test(this.router.url);
  }

  isSigningUp(): boolean {
    let signupCoach = new RegExp('/signup_coach');
    let signupCoachee = new RegExp('/signup_coachee');
    let signupRh = new RegExp('/signup_rh');
    let registerCoach = new RegExp('/register_coach');
    return signupCoach.test(this.router.url) || signupCoachee.test(this.router.url) || signupRh.test(this.router.url) || registerCoach.test(this.router.url);
  }

  goToRegisterCoach() {
    this.router.navigate(['register_coach/step1'])
  }

  canDisplayListOfCoach(): boolean {
    if (this.mUser == null) {
      return false;
    }

    if (this.mUser instanceof Coach) {
      return false;
    } else {
      return true;
    }

  }

  private fetchNotificationsForUser(user: ApiUser) {

    let param = user
    this.coachCoacheeService.getAllNotificationsForUser(param).subscribe(
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
      }
    );
  }

  printDateString(date: string) {
    return this.getDate(date) + ' - ' + this.getHours(date) + ':' + this.getMinutes(date);
  }

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getMinutes(date: string) {
    let m = (new Date(date)).getMinutes();
    if (m === 0)
      return '00';
    return m;
  }

  getDate(date: string): string {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
  }

  readAllNotifications() {
    this.coachCoacheeService.readAllNotificationsForUser(this.mUser).subscribe(
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
