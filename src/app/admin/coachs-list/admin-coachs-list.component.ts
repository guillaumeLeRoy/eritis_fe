import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Coach} from "../../model/Coach";
import {Subscription} from "rxjs/Subscription";
import {CoachCoacheeService} from "../../service/coach_coachee.service";

declare var Materialize: any;

@Component({
  selector: 'er-admin-coachs-list',
  templateUrl: './admin-coachs-list.component.html',
  styleUrls: ['./admin-coachs-list.component.scss'],
})
export class AdminCoachsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private coachs: Observable<Array<Coach>>;
  private getAllCoachsSub: Subscription;

  loading = true;

  constructor(private apiService: CoachCoacheeService, private cd: ChangeDetectorRef) {
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
    if (this.getAllCoachsSub != null) {
      this.getAllCoachsSub.unsubscribe();
    }
  }

  private fetchData() {
    this.getAllCoachsSub = this.apiService.getAllCoachs(true).subscribe(
      (coachs: Array<Coach>) => {
        console.log('getAllCoachs subscribe, coachs : ', coachs);

        this.coachs = Observable.of(coachs);
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

}
