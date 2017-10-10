import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../model/Coach";
import {Observable} from "rxjs/Observable";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss']
})
export class CoachDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  user: Observable<Coach>;

  private userSubscription: Subscription;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.userSubscription = this.user.subscribe((coach: Coach) => {
        // maybe do sth one day
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
