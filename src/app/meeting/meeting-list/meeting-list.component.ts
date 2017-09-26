import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {Coach} from "../../model/Coach";
import {Coachee} from "../../model/Coachee";
import {HR} from "../../model/HR";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<Coach | Coachee | HR>;
  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    window.scrollTo(0, 0);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    this.onRefreshRequested();
  }

  onRefreshRequested() {
    let user = this.authService.getConnectedUser();
    console.log('onRefreshRequested, user : ', user);
    if (user == null) {
      this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        (user: Coach | Coachee) => {
          console.log('onRefreshRequested, getConnectedUser');
          this.onUserObtained(user);
        }
      );
    } else {
      this.onUserObtained(user);
    }
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

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('onUserObtained, user : ', user);
    if (user) {
      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

}
