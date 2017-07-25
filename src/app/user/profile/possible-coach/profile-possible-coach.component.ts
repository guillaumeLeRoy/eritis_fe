import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminAPIService} from "../../../service/adminAPI.service";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {PossibleCoach} from "../../../model/PossibleCoach";

declare var Materialize: any;

@Component({
  selector: 'rb-possible-coach',
  templateUrl: './profile-possible-coach.component.html',
  styleUrls: ['./profile-possible-coach.component.scss']
})
export class ProfilePossibleCoachComponent implements OnInit, AfterViewInit, OnDestroy {

  private possibleCoach: Observable<PossibleCoach>;
  private subscriptionGetCoach: Subscription;

  constructor(private apiService: AdminAPIService, private router: Router, private cd: ChangeDetectorRef, private route: ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.getCoach();
  }

  private getCoach() {
    console.log("getCoach");

    this.subscriptionGetCoach = this.route.params.subscribe(
      (params: any) => {
        let coachId = params['id'];

        this.apiService.getPossibleCoach(coachId).subscribe(
          (possibleCoach: PossibleCoach) => {
            console.log("getPossibleCoach", possibleCoach);

            this.possibleCoach = Observable.of(possibleCoach);
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

  sendInvite() {
    this.possibleCoach.take(1).subscribe(
      (coach: PossibleCoach) => {
        let email = coach.email
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
    );
  }

  goToPossibleCoachsAdmin() {
    this.router.navigate(['admin/possible_coachs-list']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetCoach) {
      console.log("Unsubscribe coach");
      this.subscriptionGetCoach.unsubscribe();
    }
  }

}
