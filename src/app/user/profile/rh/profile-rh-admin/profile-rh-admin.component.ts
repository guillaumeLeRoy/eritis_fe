import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
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

  private rhObs: BehaviorSubject<HR>;
  private subscriptionGetRh: Subscription;

  loading: boolean = true;

  constructor(private cd: ChangeDetectorRef, private route: ActivatedRoute, private apiService: CoachCoacheeService) {
    this.rhObs = new BehaviorSubject(null);
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
  }

  private getRh() {
    console.log("getRh");

    this.subscriptionGetRh = this.route.params.subscribe(
      (params: any) => {
        let rhId = params['id'];

        this.apiService.getRhForId(rhId, true).subscribe(
          (rh: HR) => {
            console.log("gotRh", rh);
            this.rhObs.next(rh);
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
