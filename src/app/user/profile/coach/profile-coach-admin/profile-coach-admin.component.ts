import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminAPIService} from "../../../../service/adminAPI.service";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Coach} from "../../../../model/Coach";
import {CoachCoacheeService} from "app/service/coach_coachee.service";

declare var Materialize: any;

@Component({
  selector: 'er-profile-coach-admin',
  templateUrl: './profile-coach-admin.component.html',
  styleUrls: ['./profile-coach-admin.component.scss']
})
export class ProfileCoachAdminComponent implements OnInit, AfterViewInit, OnDestroy {

  private coach: Observable<Coach>;
  private subscriptionGetCoach: Subscription;

  constructor(private apiService: AdminAPIService, private router: Router, private cd: ChangeDetectorRef, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getCoach();
  }

  private getCoach() {
    this.subscriptionGetCoach = this.route.params.subscribe(
      (params: any) => {
        let coachId = params['id'];

        this.apiService.getCoach(coachId).subscribe(
          (coach: Coach) => {
            console.log("gotCoach", coach);
            this.coach = Observable.of(coach);
            this.cd.detectChanges();
          }
        );
      }
    )
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
    // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
  }

  sendInvite(email: string) {
    console.log('sendInvite, email', email);

    this.apiService.createPotentialCoach(email).subscribe(
      (res: any) => {
        console.log('createPotentialCoach, res', res);
        this.getCoach();
        Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
      }, (error) => {
        console.log('createPotentialCoach, error', error);
        Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
      }
    );
  }

  goToCoachsAdmin() {
    this.router.navigate(['admin/coachs-list']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetCoach) {
      console.log("Unsubscribe coach");
      this.subscriptionGetCoach.unsubscribe();
    }
  }
}
