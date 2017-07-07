import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Coach} from "../../model/Coach";
import {Subscription} from "rxjs/Subscription";
import {AdminAPIService} from "../../service/adminAPI.service";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-possible-coachs-list',
  templateUrl: './possible-coachs-list.component.html',
  styleUrls: ['./possible-coachs-list.component.css']
})
export class PossibleCoachsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private possibleCoachs: Observable<Array<Coach>>;
  private getAllPossibleCoachsSub: Subscription;

  constructor(private apiService: AdminAPIService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.getAllPossibleCoachsSub != null) {
      this.getAllPossibleCoachsSub.unsubscribe();
    }
  }

  sendInvite(email: string) {
    console.log('sendInvite, email', email);

    this.apiService.createPotentialCoach(email).subscribe(
      (res: any) => {
        console.log('createPotentialCoach, res', res);
        Materialize.toast('Collaborateur Coach ajouté !', 3000, 'rounded');
      }, (error) => {
        console.log('createPotentialCoach, error', error);
        Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
      }
    );
  }

  private fetchData() {
    this.getAllPossibleCoachsSub = this.apiService.getPossibleCoachs().subscribe(
      (coachs: Array<Coach>) => {
        console.log('getAllPossibleCoachsSub subscribe, coachs : ', coachs);

        this.possibleCoachs = Observable.of(coachs);
        this.cd.detectChanges();
      }
    );
  }

}
