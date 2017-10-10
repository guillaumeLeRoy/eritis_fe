import {Component, OnDestroy, OnInit} from "@angular/core";
import {HR} from "../../../../model/HR";
import {Subscription} from "rxjs/Subscription";
import {ActivatedRoute} from "@angular/router";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'er-profile-rh-admin',
  templateUrl: './profile-rh-admin.component.html',
  styleUrls: ['./profile-rh-admin.component.scss']
})

export class ProfileRhAdminComponent implements OnInit, OnDestroy {

  private rh: BehaviorSubject<HR>;
  private subscriptionGetRh: Subscription;
  private subscriptionGetRoute: Subscription;

  loading: boolean = true;

  constructor(private route: ActivatedRoute, private apiService: CoachCoacheeService) {
    this.rh = new BehaviorSubject(null);
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.getRh();
  }


  ngOnDestroy(): void {
    if (this.subscriptionGetRh) {
      console.log("Unsubscribe rh");
      this.subscriptionGetRh.unsubscribe();
    }

    if (this.subscriptionGetRoute) {
      console.log("Unsubscribe route");
      this.subscriptionGetRoute.unsubscribe();
    }
  }

  private getRh() {
    console.log("getRh");

    this.subscriptionGetRoute = this.route.params.subscribe(
      (params: any) => {
        let rhId = params['id'];

        this.subscriptionGetRh = this.apiService.getRhForId(rhId, true).subscribe(
          (rh: HR) => {
            console.log("gotRh", rh);
            this.rh.next(rh);
            // this.cd.detectChanges();
            this.loading = false;
          }, (error) => {
            console.log('getRh, error', error);
            this.loading = false;
          }
        );
      }
    )
  }


}
