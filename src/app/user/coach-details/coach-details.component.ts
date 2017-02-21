import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Coach} from "../../model/Coach";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/apiUser";

@Component({
  selector: 'rb-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css']
})
export class CoachDetailsComponent implements OnInit,AfterViewInit,OnDestroy {

  model: NgbDateStruct;

  private coachId: string;

  private coach: Observable<Coach>;
  private subscriptionGetCoach: Subscription;

  private connectedUser: Observable<ApiUser>;
  private subscriptionConnectUser: Subscription;

  constructor(private route: ActivatedRoute, private coachService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    let user = this.authService.getConnectedUser();
    if (user) {
      this.onConnectedUserReceived(user);
    } else {
      this.subscriptionConnectUser = this.authService.getConnectedUserObservable().subscribe(
        (user: ApiUser) => {
          console.log("ngOnInit, sub received user", user);
          this.onConnectedUserReceived(user);
        }
      );
    }
  }


  private onConnectedUserReceived(user: ApiUser) {
    this.connectedUser = Observable.of(user);
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        this.coachId = params['id']
        this.subscriptionGetCoach = this.coachService.getCoachForId(this.coachId).subscribe(
          (coach: Coach) => {
            console.log("ngAfterViewInit, post sub coach", coach);

            this.coach = Observable.of(coach);
            this.cd.detectChanges();
          }
        );
      }
    )
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetCoach) {
      this.subscriptionGetCoach.unsubscribe();
    }

    if (this.subscriptionConnectUser) {
      this.subscriptionConnectUser.unsubscribe();
    }
  }

  bookADate() {
    console.log('bookADate')

    this.connectedUser.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return
        }

        var date = new Date(this.model.year, this.model.month, this.model.day)
        var timestampSc: number = +date.getTime().toFixed(0) / 1000;
        this.coachService.bookAMeetingWithCoach(timestampSc, this.coachId, user.id).subscribe(
          (success) => {
            console.log('bookAMeetingWithCoach success', success)
          },
          (error) => {
            console.log('bookAMeetingWithCoach error', error)
          }
        );
      }
    );
  }
}
