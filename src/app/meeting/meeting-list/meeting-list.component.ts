import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {Coach} from "../../model/Coach";
import {Coachee} from "../../model/Coachee";
import {HR} from "../../model/HR";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Router} from "@angular/router";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: BehaviorSubject<Coach | Coachee | HR>;
  private connectedUserSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.user = new BehaviorSubject(null);
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription)
      this.connectedUserSubscription.unsubscribe();
  }

  private onRefreshRequested() {
    console.log('onRefreshRequested');

    this.connectedUserSubscription = this.authService.refreshConnectedUser()
      .subscribe((user?: Coach | Coachee | HR) => {
          this.onUserObtained(user);
        }
      );
  }

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('onUserObtained, user : ', user);
    if (user)
      this.user.next(user);
    // else
    //   this.router.navigate(['/']);
  }

  isUserACoach(user: Coach | Coachee | HR) {
    return user instanceof Coach;
  }

  isUserACoachee(user: Coach | Coachee | HR) {
    return user instanceof Coachee;
  }

  isUserARh(user: Coach | Coachee | HR) {
    return user instanceof HR;
  }

}
