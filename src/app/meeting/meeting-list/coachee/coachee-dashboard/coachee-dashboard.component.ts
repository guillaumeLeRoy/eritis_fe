import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Coachee} from "../../../../model/Coachee";
import {ApiUser} from "../../../../model/ApiUser";
import {HR} from "../../../../model/HR";
import {Coach} from "../../../../model/Coach";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coachee-dashboard',
  templateUrl: './coachee-dashboard.component.html',
  styleUrls: ['./coachee-dashboard.component.scss']
})
export class CoacheeDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<ApiUser>;

  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
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
    // fetch current user from API
    this.authService.refreshConnectedUser()
      .subscribe((user?: Coach | Coachee | HR) => {
          this.onUserObtained(user);
        }
      );
  }

  goToDate() {
    console.log('goToDate');

    this.user.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return;
        }
        this.router.navigate(['/date']);
      });
  }

  private onUserObtained(user?: ApiUser) {
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

  private getConnectedUser() {
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
  }

}
