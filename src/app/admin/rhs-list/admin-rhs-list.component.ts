import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {HR} from "../../model/HR";
import {Subscription} from "rxjs/Subscription";
import {CoachCoacheeService} from "../../service/coach_coachee.service";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Component({
  selector: 'er-admin-rhs-list',
  templateUrl: './admin-rhs-list.component.html',
  styleUrls: ['./admin-rhs-list.component.scss']
})
export class AdminRhsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private rhs: BehaviorSubject<Array<HR>>;
  private getAllrhsSub: Subscription;

  loading = true;

  constructor(private apiService: CoachCoacheeService) {
    this.rhs = new BehaviorSubject(null);
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
    this.getAllrhsSub = this.apiService.getRhs(true)
      .subscribe(
        (rhs: Array<HR>) => {
          console.log('getAllrhsSub subscribe, rhs : ', rhs);
          this.loading = false;
          this.rhs.next(rhs);
        }
      );
  }

}
