import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HR} from "../../model/HR";
import {Subscription} from "rxjs/Subscription";
import {CoachCoacheeService} from "../../service/coach_coachee.service";

@Component({
  selector: 'rb-rhs-list',
  templateUrl: './rhs-list.component.html',
  styleUrls: ['./rhs-list.component.scss']
})
export class RhsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private rhs: Observable<Array<HR>>;
  private getAllrhsSub: Subscription;

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
    if (this.getAllrhsSub != null) {
      this.getAllrhsSub.unsubscribe();
    }
  }

  private fetchData() {
    this.getAllrhsSub = this.apiService.getRhs(true).subscribe(
      (rhs: Array<HR>) => {
        console.log('getAllrhsSub subscribe, rhs : ', rhs);

        this.rhs = Observable.of(rhs);
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

}
