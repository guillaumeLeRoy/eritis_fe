import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs/Subscription";
import {AdminAPIService} from "../../service/adminAPI.service";
import {PossibleCoach} from "../../model/PossibleCoach";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-admin-possible-coachs-list',
  templateUrl: './admin-possible-coachs-list.component.html',
  styleUrls: ['./admin-possible-coachs-list.component.scss']
})
export class AdminPossibleCoachsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private possibleCoachs: BehaviorSubject<Array<PossibleCoach>>;
  private getAllPossibleCoachsSub: Subscription;

  loading = true;

  constructor(private apiService: AdminAPIService) {
    this.possibleCoachs = new BehaviorSubject(null);
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

        this.loading = false;
        this.possibleCoachs.next(coachs);
      }
    );
  }

}
