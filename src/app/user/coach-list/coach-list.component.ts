import {Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Coach} from '../../model/Coach';
import {CoachCoacheeService} from '../../service/CoachCoacheeService';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../service/auth.service';
import {Coachee} from '../../model/Coachee';
import {Router} from '@angular/router';

@Component({
  selector: 'rb-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
//TODO to remove ?
export class CoachListComponent implements OnInit, AfterViewInit, OnDestroy {

  private coachs: Observable<Coach[]>;
  private subscription: Subscription;

  private coachee: Observable<Coachee>;

  private potSelectedCoach: Coach;

  constructor(private service: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    let user = this.authService.getConnectedUser();
    if (user) {
      // only a Coachee should see this component
      if (user instanceof Coachee) {
        this.onUserObtained(user);
      }
    } else {
      this.authService.getConnectedUserObservable().subscribe(
        (user: Coach | Coachee) => {
          // only a Coachee should see this component
          if (user instanceof Coachee) {
            this.onUserObtained(user);
          }
        }
      );
    }
  }

  onPotentialCoachSelected(coach: Coach) {
    console.log('potentialCoachSelected');
    this.potSelectedCoach = coach;
  }

  onFinalCoachSelected(selectedCoach: Coach) {
    console.log('onFinalCoachSelected');
    // reset pot coach
    this.potSelectedCoach = null;

    // // save in backend
    // this.coachee.last().flatMap(
    //   (coachee: Coachee) => {
    //     console.log('onFinalCoachSelected, get coachee', coachee);
    //     return this.authService.updateCoacheeSelectedCoach(coachee.id, selectedCoach.id);
    //   }
    // ).subscribe(
    //   (coachee: Coachee) => {
    //     console.log('coach selected saved, redirect to meetings');
    //     // redirect to a meeting page
    //     // this.router.navigate(['/meetings']);
    //     this.onUserObtained(coachee);
    //   }
    // );

  }

  private onUserObtained(coachee: Coachee) {
    console.log('onUserObtained, coachee', coachee);

    this.coachee = Observable.of(coachee);

    if (coachee.selectedCoach) {
      console.log('onUserObtained, we have a selected coach');
      // this.selectedCoach = coachee.selectedCoach;
    } else {
      // if not coach selected, display possible coachs
      this.subscription = this.service.getAllCoachs().subscribe(
        (coachs: Coach[]) => {
          console.log('getAllCoachs subscribe, coachs : ', coachs);

          this.coachs = Observable.of(coachs);
          this.cd.detectChanges();
        }
      );
    }
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
