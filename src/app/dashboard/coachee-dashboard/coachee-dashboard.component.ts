import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
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

  constructor(private router: Router, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    // this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  onRefreshRequested() {
    //todo call parent
    this.connectedUserSubscription = this.user.first().subscribe(
      (user: Coachee) => {
        // this.onUserObtained(user);
        this.cd.detectChanges();
      });
  }

  // private onUserObtained(user?: ApiUser) {
  //   console.log('onUserObtained, user : ', user);
  //
  //   if (user) {
  //
  //     if (user instanceof Coachee) {
  //       // coachee
  //       console.log('get a coachee');
  //     }
  //   }
  // }

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
