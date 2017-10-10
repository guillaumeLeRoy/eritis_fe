import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Coach} from "../../model/Coach";
import {Subscription} from "rxjs/Subscription";
import {CoachCoacheeService} from "../../service/coach_coachee.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var Materialize: any;

@Component({
  selector: 'er-admin-coachs-list',
  templateUrl: './admin-coachs-list.component.html',
  styleUrls: ['./admin-coachs-list.component.scss'],
})
export class AdminCoachsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private coachs: BehaviorSubject<Array<Coach>>;
  private getAllCoachsSub: Subscription;

  loading = true;

  constructor(private apiService: CoachCoacheeService) {
    this.coachs = new BehaviorSubject(null);
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

        this.loading = false;
        this.coachs.next(coachs);
      }
    );
  }

}
