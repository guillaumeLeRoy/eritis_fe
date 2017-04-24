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

        this.coachees = Observable.of(coachees);
        this.cd.detectChanges();
      }
    );
  }

}
