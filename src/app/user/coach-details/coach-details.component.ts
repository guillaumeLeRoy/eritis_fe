import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../model/Coach";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {NgbDateStruct, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/apiUser";

@Component({
  selector: 'rb-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css']
})
export class CoachDetailsComponent implements OnInit,AfterViewInit,OnDestroy {

  dateModel: NgbDateStruct;
  timeModel: NgbTimeStruct;

  private coachId: string;

  private coach: Observable<Coach>;
  private subscriptionGetCoach: Subscription;

  private connectedUser: Observable<ApiUser>;
  private subscriptionConnectUser: Subscription;

  private displayErrorBookingDate = false;

  constructor(private route: ActivatedRoute, private router: Router, private coachService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
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
    console.log('bookADate, dateModel : ', this.dateModel);
    console.log('bookADate, timeModel : ', this.timeModel);

    this.connectedUser.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return;
        }

        var date = new Date(this.dateModel.year, this.dateModel.month, this.dateModel.day, this.timeModel.hour, this.timeModel.minute)
        var timestampSc: number = +date.getTime().toFixed(0) / 1000;
        this.coachService.bookAMeetingWithCoach(timestampSc, this.coachId, user.id).subscribe(
          (success) => {
            console.log('bookAMeetingWithCoach success', success);
            //redirect to meetings page
            this.router.navigate(['/meetings', user.id]);
          },
          (error) => {
            console.log('bookAMeetingWithCoach error', error);
            this.displayErrorBookingDate = true;
          }
        );
      }
    );
  }
}
