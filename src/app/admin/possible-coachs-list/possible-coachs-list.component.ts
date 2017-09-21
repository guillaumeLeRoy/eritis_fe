import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {AdminAPIService} from "../../service/adminAPI.service";
import {PossibleCoach} from "../../model/PossibleCoach";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-possible-coachs-list',
  templateUrl: './possible-coachs-list.component.html',
  styleUrls: ['./possible-coachs-list.component.scss']
})
export class PossibleCoachsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private possibleCoachs: Observable<Array<PossibleCoach>>;
  private getAllPossibleCoachsSub: Subscription;

  loading = true;

  constructor(private apiService: AdminAPIService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
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

  updateList() {
    this.fetchData();
  }

  private fetchData() {
    this.getAllPossibleCoachsSub = this.apiService.getPossibleCoachs().subscribe(
      (coachs: Array<PossibleCoach>) => {
        console.log('getAllPossibleCoachsSub subscribe, coachs : ', coachs);

        this.possibleCoachs = Observable.of(coachs);
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

}
