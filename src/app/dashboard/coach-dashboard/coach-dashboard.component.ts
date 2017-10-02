import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../model/Coach";
import {HR} from "../../model/HR";
import {Coachee} from "../../model/Coachee";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss']
})
export class CoachDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: BehaviorSubject<ApiUser>;

  private connectedUserSubscription: Subscription;

  constructor(private authService: AuthService) {
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
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  onRefreshRequested() {
    this.connectedUserSubscription = this.authService.refreshConnectedUser()
      .subscribe((user?: Coach | Coachee | HR) => {
          this.onUserObtained(user);
        }
      );
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof Coach) {
        // coachee
        console.log('get a coach');
      }

      this.user.next(user);
    }
  }

}
