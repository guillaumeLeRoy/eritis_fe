import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {MeetingsService} from "../../../../service/meetings.service";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../../model/Meeting";
import {Subscription} from "rxjs/Subscription";
import {Coachee} from "../../../../model/Coachee";
import {Coach} from "../../../../model/Coach";
import {HRUsageRate} from "../../../../model/HRUsageRate";
import {ApiUser} from "../../../../model/ApiUser";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb' +
  '-coachee-dashboard',
  templateUrl: './coachee-dashboard.component.html',
  styleUrls: ['./coachee-dashboard.component.scss']
})
export class CoacheeDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<ApiUser>;

  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  private rhUsageRate: Observable<HRUsageRate>;

  constructor(private router: Router, private meetingsService: MeetingsService, private coachCoacheeService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
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
        (user: Coachee) => {
          console.log('onRefreshRequested, getConnectedUser');
          this.onUserObtained(user);
        }
      );
    } else {
      this.onUserObtained(user);
    }
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof Coachee) {
        // coachee
        console.log('get a coachee');
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  private getUsageRate(rhId: string) {
    this.coachCoacheeService.getUsageRate(rhId).subscribe(
      (rate: HRUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.rhUsageRate = Observable.of(rate);
      }
    );
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
