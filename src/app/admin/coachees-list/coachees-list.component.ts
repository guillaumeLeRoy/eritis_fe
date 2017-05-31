import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Coachee} from "../../model/coachee";
import {Subscription} from "rxjs/Subscription";
import {AdminAPIService} from "../../service/adminAPI.service";

@Component({
  selector: 'er-coachees-list',
  templateUrl: './coachees-list.component.html',
  styleUrls: ['./coachees-list.component.css']
})
export class CoacheesListComponent implements OnInit, AfterViewInit, OnDestroy {

  private coachees: Observable<Array<Coachee>>;
  private getAllCoacheesSub: Subscription;

  constructor(private apiService: AdminAPIService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.getAllCoacheesSub != null) {
      this.getAllCoacheesSub.unsubscribe();
    }
  }

  private fetchData() {
    this.getAllCoacheesSub = this.apiService.getCoachees().subscribe(
      (coachees: Array<Coachee>) => {
        console.log('getAllCoachees subscribe, coachees : ', coachees);
        //filter coachee with NO selected coachs
        let notAssociatedCoachees: Coachee[] = new Array<Coachee>();
        for (let coachee of coachees) {
          if (coachee.selectedCoach == null) {
            notAssociatedCoachees.push(coachee);
          }
        }
        this.coachees = Observable.of(notAssociatedCoachees);
        this.cd.detectChanges();
      }
    );
  }

}
