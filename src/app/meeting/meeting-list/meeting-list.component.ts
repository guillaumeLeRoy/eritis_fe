import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {Coach} from "../../model/Coach";
import {Coachee} from "../../model/Coachee";
import {HR} from "../../model/HR";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

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

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {
    this.user = new BehaviorSubject(null);
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.getConnectedUser();
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  private getConnectedUser() {
    console.log('onRefreshRequested');

    this.connectedUserSubscription = this.authService.getConnectedUserObservable()
      .subscribe((user?: Coach | Coachee | HR) => {
          this.onUserObtained(user);
          this.cd.detectChanges();
        }
      );
  }

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('toto, onUserObtained, user : ', user);
    this.user.next(user);
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
