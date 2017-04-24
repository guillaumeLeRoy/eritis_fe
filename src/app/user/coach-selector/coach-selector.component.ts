import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Coach} from "../../model/Coach";
import {AuthService} from "../../service/auth.service";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Coachee} from "../../model/coachee";
import {Subscription} from "rxjs/Subscription";

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

  constructor(private service: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    let user = this.authService.getConnectedUser();
    if (user) {
      this.onUserObtained(user);
    } else {
      this.authService.getConnectedUserObservable().subscribe(
        (user: Coach | Coachee) => {
          // only a Coachee should see this component
          this.onUserObtained(user);
        }
      );
    }
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
    this.authService.updateCoacheeSelectedCoach(this.selectedCoachee.id, this.selectedCoach.id).subscribe(
      (coachee: Coachee) => {
        console.log('coach selected saved');
        let user = this.authService.getConnectedUser();
        this.onUserObtained(user);
      }
    );
  }

  //TODO change that to Admin
  private onUserObtained(user: Coach | Coachee) {
    console.log('onUserObtained, user', user);

    //get list of all coachs
    this.getAllCoachsSub = this.service.getAllCoachs().subscribe(
      (coachs: Coach[]) => {
        console.log('getAllCoachs subscribe, coachs : ', coachs);

        this.coachs = Observable.of(coachs);
        this.cd.detectChanges();
      }
    );

    this.getAllCoacheesSub = this.service.getAllCoachees().subscribe(
      (coachees: Coachee[]) => {
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
