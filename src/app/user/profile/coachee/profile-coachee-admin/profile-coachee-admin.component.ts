import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Coachee} from "../../../../model/Coachee";
import {ActivatedRoute, Router} from "@angular/router";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";

@Component({
  selector: 'er-profile-coachee-admin',
  templateUrl: './profile-coachee-admin.component.html',
  styleUrls: ['./profile-coachee-admin.component.scss']
})
export class ProfileCoacheeAdminComponent implements OnInit, AfterViewInit, OnDestroy {

  private coachee: Observable<Coachee>;
  private rhId: string;
  private subscriptionGetCoachee: Subscription;

  loading: boolean = true;

  constructor(private router: Router, private cd: ChangeDetectorRef, private apiService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.getCoachee();
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetCoachee) {
      console.log("Unsubscribe coach");
      this.subscriptionGetCoachee.unsubscribe();
    }
  }

  private getCoachee() {
    this.subscriptionGetCoachee = this.route.params.subscribe(
      (params: any) => {
        let coacheeId = params['id'];

        this.apiService.getCoacheeForId(coacheeId, true).subscribe(
          (coachee: Coachee) => {
            console.log("gotCoachee", coachee);
            this.coachee = Observable.of(coachee);
            this.rhId = coachee.associatedRh.id;
            this.cd.detectChanges();
            this.loading = false;
          }
        );
      }
    )
  }

  goToCoacheesAdmin() {
    window.scrollTo(0, 0);
    this.router.navigate(['admin/coachees-list']);
  }

  goToRhProfile() {
    this.router.navigate(['admin/profile/rh', this.rhId])
  }

}
