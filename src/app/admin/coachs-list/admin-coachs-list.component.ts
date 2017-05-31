import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Coach} from "../../model/Coach";
import {Subscription} from "rxjs/Subscription";
import {AdminAPIService} from "../../service/adminAPI.service";

declare var Materialize: any;


@Component({
  selector: 'er-admin-coachs-list',
  templateUrl: './admin-coachs-list.component.html',
  styleUrls: ['./admin-coachs-list.component.css']
})
export class AdminCoachsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private coachs: Observable<Array<Coach>>;
  private getAllCoachsSub: Subscription;

  constructor(private apiService: AdminAPIService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
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
    this.getAllCoachsSub = this.apiService.getCoachs().subscribe(
      (coachs: Array<Coach>) => {
        console.log('getAllCoachs subscribe, coachs : ', coachs);

        this.coachs = Observable.of(coachs);
        this.cd.detectChanges();
      }
    );
  }

}
