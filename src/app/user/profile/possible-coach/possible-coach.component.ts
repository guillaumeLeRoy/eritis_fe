import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminAPIService} from "../../../service/adminAPI.service";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {PossibleCoach} from "../../../model/PossibleCoach";

declare var Materialize: any;

@Component({
  selector: 'er-possible-coach',
  templateUrl: './possible-coach.component.html',
  styleUrls: ['./possible-coach.component.css']
})
export class PossibleCoachComponent implements OnInit, AfterViewInit, OnDestroy {

  private coach: Observable<PossibleCoach>;
  private subscriptionGetCoach: Subscription;

  constructor(private apiService: AdminAPIService, private router: Router, private cd: ChangeDetectorRef, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getCoach();
  }

  private getCoach() {
    console.log("getCoach");

    this.subscriptionGetCoach = this.route.params.subscribe(
      (params: any) => {
        let coachId = params['id'];

        this.apiService.getPossibleCoach(coachId).subscribe(
          (coach: PossibleCoach) => {
            console.log("getPossibleCoach", coach);

            this.coach = Observable.of(coach);
            this.cd.detectChanges();

          }, (error) => {
            console.log('getCoach, error', error);
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
