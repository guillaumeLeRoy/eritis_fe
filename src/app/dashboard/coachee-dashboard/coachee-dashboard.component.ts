import {AfterViewInit, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Coachee} from "../../model/Coachee";
import {ApiUser} from "../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coachee-dashboard',
  templateUrl: './coachee-dashboard.component.html',
  styleUrls: ['./coachee-dashboard.component.scss']
})
export class CoacheeDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  user: Observable<Coachee>;

  private connectedUserSubscription: Subscription;

  constructor(private router: Router) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  navigateToCreateSession() {
    console.log('navigateToCreateSession');

    if (this.user != null) {
      this.user.take(1).subscribe(
        (user: ApiUser) => {
          if (user == null) {
            console.log('no connected user')
            return;
          }
          this.router.navigate(['dashboard/date']);
        });
    }
  }
}
