import {Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Coach} from "../../model/Coach";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'rb-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent implements OnInit,AfterViewInit, OnDestroy {

  private coachs: Observable<Coach[]>;
  private subscription: Subscription;

  constructor(private service: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log("ngOnInit");
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.subscription = this.service.getAllCoachs().subscribe(
      (coachs: Coach[]) => {
        console.log("getAllCoachs subscribe, coachs : ", coachs);

        this.coachs = Observable.of(coachs);
        this.cd.detectChanges();
      }
    );
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
