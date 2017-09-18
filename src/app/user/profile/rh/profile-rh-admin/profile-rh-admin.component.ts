import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Coach} from "../../../../model/Coach";
import {Coachee} from "../../../../model/Coachee";
import {HR} from "../../../../model/HR";
import {Subscription} from "rxjs/Subscription";
import {AuthService} from "../../../../service/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {AdminAPIService} from "../../../../service/adminAPI.service";

@Component({
  selector: 'rb-profile-rh-admin',
  templateUrl: './profile-rh-admin.component.html',
  styleUrls: ['./profile-rh-admin.component.scss']
})

export class ProfileRhAdminComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<Coach | Coachee | HR>;
  private rh: Observable<HR>;
  private mrh: HR;
  private subscriptionGetRh: Subscription;

  loading: boolean = true;

  constructor(private cd: ChangeDetectorRef, private route: ActivatedRoute, private apiService: AdminAPIService, private router: Router) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.getRh();
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
    // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
  }

  private getRh() {
    console.log("getRh");

    this.subscriptionGetRh = this.route.params.subscribe(
      (params: any) => {
        let rhId = params['id'];

        this.apiService.getRh(rhId).subscribe(
          (rh: HR) => {
            console.log("gotRh", rh);

            this.mrh = rh;
            this.rh = Observable.of(rh);
            this.cd.detectChanges();
            this.loading = false;
          }, (error) => {
            console.log('getRh, error', error);
            this.loading = false;
          }
        );
      }
    )
  }

  goToRhsAdmin() {
    this.router.navigate(['admin/rhs-list']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetRh) {
      console.log("Unsubscribe rh");
      this.subscriptionGetRh.unsubscribe();
    }
  }

}
