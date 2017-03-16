import {Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Coach} from "../../model/Coach";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {Coachee} from "../../model/coachee";

@Component({
  selector: 'rb-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent implements OnInit,AfterViewInit, OnDestroy {

  private coachs: Observable<Coach[]>;
  private subscription: Subscription;

  private coachee: Observable<Coachee>;

  private potSelectedCoach: Coach;

  constructor(private service: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log("ngOnInit");
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");

    let user = this.authService.getConnectedUser();
    if (user) {
      if (user instanceof Coachee) {
        this.onUserObtained(user);
      }
    } else {
      this.authService.getConnectedUserObservable().subscribe(
        (user: Coach | Coachee) => {
          if (user instanceof Coachee) {
            this.onUserObtained(user);
          }
        }
      );
    }
  }

  onPotentialCoachSelected(coach: Coach) {
    console.log("potentialCoachSelected");
    this.potSelectedCoach = coach;
  }

  onFinalCoachSelected(selectedCoach: Coach) {
    console.log("onFinalCoachSelected");

    this.coachee.last().flatMap(
      (coachee: Coachee) => {
        console.log("onFinalCoachSelected, get coachee", coachee);

        return this.authService.updateCoacheeSelectedCoach(coachee.id, selectedCoach.id);
      }
    ).subscribe(
      (coachee: Coach |Coachee) => {
        console.log("coach selected saved");
        //redirect to a different page
      }
    );

  }

  private onUserObtained(coachee: Coachee) {

    this.coachee = Observable.of(coachee);

    if (coachee.selectedCoach) {
      console.log("onUserObtained, we have a selected coach");
      // this.selectedCoach = coachee.selectedCoach;
    } else {
      //if not coach selected, display possible coachs
      this.subscription = this.service.getAllCoachs().subscribe(
        (coachs: Coach[]) => {
          console.log("getAllCoachs subscribe, coachs : ", coachs);

          this.coachs = Observable.of(coachs);
          this.cd.detectChanges();
        }
      );
    }
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
