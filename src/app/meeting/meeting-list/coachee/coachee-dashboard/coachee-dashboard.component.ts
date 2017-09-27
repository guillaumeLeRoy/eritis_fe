import {AfterViewInit, ChangeDetectorRef, Component} from "@angular/core";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
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
export class CoacheeDashboardComponent implements AfterViewInit {

  private user: Observable<ApiUser>;

  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    // force to GET connected user from the API so the count of available sessions is always correct
    this.onRefreshRequested();
  }

  // fetch current user from API
  onRefreshRequested() {
    this.authService.refreshConnectedUser()
      .subscribe((user?: Coach | Coachee | HR) => {
          this.onUserObtained(user);
        }
      );
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

  private onUserObtained(user?: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {
      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

}
