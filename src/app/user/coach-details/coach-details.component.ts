import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, Input} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../model/Coach";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/ApiUser";
import {MeetingsService} from "../../service/meetings.service";
import {CoachCoacheeService} from "../../service/coach_coachee.service";

@Component({
  selector: 'rb-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css']
})
export class CoachDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  iCoach: Coach;

  private coach: Observable<Coach>;
  // private subscriptionGetCoach: Subscription;

  constructor(private router: Router, private cd: ChangeDetectorRef, private coachService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        let coachId = params['id'];
        this.coachService.getCoachForId(coachId).subscribe(
          (coach: Coach) => {
            console.log("ngAfterViewInit, post sub coach", coach);

            this.coach = Observable.of(coach);
            this.cd.detectChanges();
          }
        );
      }
    )
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
  }

  ngOnDestroy(): void {
    // if (this.subscriptionGetCoach) {
    //   this.subscriptionGetCoach.unsubscribe();
    // }

    // if (this.subscriptionConnectUser) {
    //   this.subscriptionConnectUser.unsubscribe();
    // }
  }

}
