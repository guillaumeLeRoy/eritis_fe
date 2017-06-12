import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {AuthService} from "../service/auth.service";
import {Observable, Subscription} from "rxjs";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/Coachee";
import {Rh} from "../model/Rh";
import {ApiUser} from "../model/apiUser";
import {Notif} from "../model/Notif";
import {CoachCoacheeService} from "../service/CoachCoacheeService";
import {Response} from "@angular/http";


declare var $: any;

@Component({
  selector: 'rb-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']

})
export class HeaderComponent implements OnInit, OnDestroy {
  private loginActivated = false;

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private isAuthenticated: Observable<boolean>;
  private subscription: Subscription;

  private mUser: Coach | Coachee | Rh;
  private user: Observable<Coach | Coachee | Rh>;

  private notifications: Observable<Notif[]>;

  constructor(private router: Router, private authService: AuthService, private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
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
      (user: Coach | Coachee | Rh) => {
        console.log('getConnectedUser : ' + user);
        this.onUserObtained(user);
      }
    );
  }

  private onUserObtained(user: Coach | Coachee | Rh) {
    console.log('onUserObtained : ' + user);

    if (user == null) {
      this.mUser = user;
      this.isAuthenticated = Observable.of(false);
    } else {
      this.mUser = user;
      this.isAuthenticated = Observable.of(true);
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
    this.authService.loginOut();
  }

  onLogIn() {
    window.scrollTo(0, 0);
    this.router.navigate(['/signin']);
  }

  onSignUp() {
    window.scrollTo(0, 0);
    this.router.navigate(['/signup']);
  }

  goToMeetings() {
    let user = this.authService.getConnectedUser();
    if (user != null) {
      window.scrollTo(0, 0);
      this.router.navigate(['/meetings']);
    }
  }

  goToAvailableSessions() {
    let user = this.authService.getConnectedUser();
    if (user != null) {
      window.scrollTo(0, 0);
      this.router.navigate(['/available_meetings']);
    }
  }

  goToProfile() {
    if (this.mUser instanceof Coach) {
      window.scrollTo(0, 0);
      this.router.navigate(['/profile_coach']);
    } else if (this.mUser instanceof Coachee) {
      window.scrollTo(0, 0);
      this.router.navigate(['/profile_coachee']);
    } else if (this.mUser instanceof Rh) {
      window.scrollTo(0, 0);
      this.router.navigate(['/profile_rh']);
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
    return this.mUser instanceof Rh
  }

  goToCoachs() {
    window.scrollTo(0, 0);
    this.router.navigate(['/coachs']);
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

    if (user instanceof Coachee) {
      let param = user.id
      this.coachCoacheeService.getAllNotifications(param).subscribe(
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
    this.coachCoacheeService.readAllNotificationsForCoachee(this.mUser.id).subscribe(
      (response: Response) => {
        console.log("getAllNotifications OK", response);
        this.fetchNotificationsForUser(this.mUser);
        this.cd.detectChanges();
      }
    );
  }
}
