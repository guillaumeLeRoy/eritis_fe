import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/Coachee";
import {HR} from "../model/HR";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";
import {AuthService} from "../service/auth.service";

@Component({
  selector: 'er-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: BehaviorSubject<Coach | Coachee | HR>;

  private connectedUserSubscription: Subscription;

  constructor(private authService: AuthService) {
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
    this.connectedUserSubscription = this.authService.getConnectedUserObservable()
      .subscribe((user?: Coach | Coachee | HR) => {
          console.log('getConnectedUser, user', user);
          this.onUserObtained(user);
        }
      );
  }

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('onUserObtained, user : ', user);
    // if (user) {
      this.user.next(user);
    // }
  }
}
