import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {HR} from "../../model/HR";
import {Subscription} from "rxjs/Subscription";
import {AdminAPIService} from "../../service/adminAPI.service";

@Component({
  selector: 'er-rhs-list',
  templateUrl: './rhs-list.component.html',
  styleUrls: ['./rhs-list.component.css']
})
export class RhsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private rhs: Observable<Array<HR>>;
  private getAllrhsSub: Subscription;

  constructor(private apiService: AdminAPIService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
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
    this.getAllrhsSub = this.apiService.getRhs().subscribe(
      (rhs: Array<HR>) => {
        console.log('getAllrhsSub subscribe, rhs : ', rhs);

        this.rhs = Observable.of(rhs);
        this.cd.detectChanges();
      }
    );
  }

}
