import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Coach} from "../../model/Coach";
import {Coachee} from "../../model/coachee";
import {Subscription} from "rxjs/Subscription";
import {AdminAPIService} from "../../service/adminAPI.service";

@Component({
  selector: 'er-coach-selector',
  templateUrl: './coach-selector.component.html',
  styleUrls: ['./coach-selector.component.css']
})
export class CoachSelectorComponent implements OnInit, AfterViewInit, OnDestroy {

  private selectedCoach: Coach;
  private selectedCoachee: Coachee;

  private coachs: Observable<Array<Coach>>;
  private getAllCoachsSub: Subscription;

  private coachees: Observable<Array<Coachee>>;
  private getAllCoacheesSub: Subscription;

  constructor(private apiService: AdminAPIService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    this.getAllCoachsSub = this.apiService.getCoachs().subscribe(
      (coachs: Array<Coach>) => {
        console.log('getAllCoachs subscribe, coachs : ', coachs);

        this.coachs = Observable.of(coachs);
        this.cd.detectChanges();
      }
    );


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

  ngOnDestroy(): void {
    if (this.getAllCoachsSub != null) {
      this.getAllCoachsSub.unsubscribe();
    }

    if (this.getAllCoacheesSub != null) {
      this.getAllCoacheesSub.unsubscribe();
    }
  }

  onCoachSelected(coach: Coach): void {
    this.selectedCoach = coach;
  }

  onCoacheeSelected(coachee: Coachee): void {
    this.selectedCoachee = coachee;
  }

  /**
   * Associate selectedCoach with selectedCoachee
   */
  associate(): void {
    // save in backend
    this.apiService.updateCoacheeSelectedCoach(this.selectedCoachee.id, this.selectedCoach.id).subscribe(
      (coachee: Coachee) => {
        console.log('coach selected saved');
      }
    );
  }

}
