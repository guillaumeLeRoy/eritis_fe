import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../../service/auth.service";
import {ApiUser} from "../../../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Coach} from "../../../../model/Coach";
import {MeetingListCoachComponent} from "../meeting-list-coach/meeting-list-coach.component";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss']
})
export class CoachDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(MeetingListCoachComponent)
  meetingListComponent;

  private user: Observable<ApiUser>;

  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  onRefreshRequested() {
    let user = this.authService.getConnectedUser();
    console.log('onRefreshRequested, user : ', user);
    if (user == null) {
      this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        (user: ApiUser) => {
          console.log('onRefreshRequested, getConnectedUser');
          this.onUserObtained(user);
        }
      );
    } else {
      this.onUserObtained(user);
    }

    if (this.meetingListComponent)
      this.meetingListComponent.onRefreshRequested();
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof Coach) {
        // coachee
        console.log('get a coach');
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

}
