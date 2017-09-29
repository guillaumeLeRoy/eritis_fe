import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Coachee} from "../../../../model/Coachee";
import {ApiUser} from "../../../../model/ApiUser";
import {HR} from "../../../../model/HR";
import {Coach} from "../../../../model/Coach";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coachee-dashboard',
  templateUrl: './coachee-dashboard.component.html',
  styleUrls: ['./coachee-dashboard.component.scss']
})
export class CoacheeDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: BehaviorSubject<ApiUser>;

  private connectedUserSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
    this.user = new BehaviorSubject(null);
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    // force to GET connected user from the API so the count of available sessions is always correct
    this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  // fetch current user from API
  onRefreshRequested() {
    this.connectedUserSubscription = this.authService.refreshConnectedUser()
      .subscribe((user?: Coach | Coachee | HR) => {
          this.onUserObtained(user);
        }
      );
  }

  private onUserObtained(user?: ApiUser) {
    console.log('onUserObtained, user : ', user);

    if (user) {

      if (user instanceof Coachee) {
        // coachee
        console.log('get a coachee');
      }

      this.user.next(user);
    }
  }

  goToDate() {
    console.log('goToDate');

    if (this.user != null) {
      this.user.take(1).subscribe(
        (user: ApiUser) => {
          if (user == null) {
            console.log('no connected user')
            return;
          }
          this.router.navigate(['/date']);
        });
    }
  }
}
