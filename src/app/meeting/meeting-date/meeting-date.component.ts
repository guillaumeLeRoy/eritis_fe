import {Component, OnInit, Input, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {NgbDateStruct, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {ApiUser} from "../../model/apiUser";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {Observable, Subscription} from "rxjs";
import {Meeting} from "../../model/meeting";

@Component({
  selector: 'rb-meeting-date',
  templateUrl: './meeting-date.component.html',
  styleUrls: ['./meeting-date.component.css']
})
export class MeetingDateComponent implements OnInit, OnDestroy {

  @Input()
  meeting: Meeting;

  dateModel: NgbDateStruct;
  timeModel: NgbTimeStruct;

  private displayErrorBookingDate = false;

  private connectedUser: Observable<ApiUser>;
  private subscriptionConnectUser: Subscription;

  constructor(private router: Router, private coachService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
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
        var timestampSc: number = +date.getTime().toFixed(0) / 1000;//TODO add start and end dates
        this.coachService.addPotentialDateToMeeting(this.meeting.id, timestampSc, timestampSc).subscribe(
          (success) => {
            console.log('addPotentialDateToMeeting success', success);
            //redirect to meetings page
            this.router.navigate(['/meetings', user.id]);
          },
          (error) => {
            console.log('addPotentialDateToMeeting error', error);
            this.displayErrorBookingDate = true;
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptionConnectUser) {
      this.subscriptionConnectUser.unsubscribe();
    }
  }
}
