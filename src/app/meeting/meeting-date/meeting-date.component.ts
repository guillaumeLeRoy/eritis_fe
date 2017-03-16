import {Component, OnInit, Input, ChangeDetectorRef, OnDestroy, Output, EventEmitter} from '@angular/core';
import {NgbDateStruct, NgbTimeStruct} from "@ng-bootstrap/ng-bootstrap";
import {ApiUser} from "../../model/apiUser";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {Observable, Subscription} from "rxjs";
import {Meeting} from "../../model/meeting";
import {MeetingDate} from "../../model/MeetingDate";

@Component({
  selector: 'rb-meeting-date',
  templateUrl: './meeting-date.component.html',
  styleUrls: ['./meeting-date.component.css']
})
export class MeetingDateComponent implements OnInit, OnDestroy {

  @Output()
  potentialDatePosted = new EventEmitter<MeetingDate>();

  @Input()
  meeting: Meeting;

  dateModel: NgbDateStruct;
  // timeModel: NgbTimeStruct;

  timeRange: number[] = [0, 24];

  private displayErrorBookingDate = false;

  private connectedUser: Observable<ApiUser>;
  private subscriptionConnectUser: Subscription;

  constructor(private coachService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
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
    // console.log('bookADate, timeModel : ', this.timeModel);

    this.connectedUser.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return;
        }

        var minDate = new Date(this.dateModel.year, this.dateModel.month, this.dateModel.day, this.timeRange[0], 0);
        var maxDate = new Date(this.dateModel.year, this.dateModel.month, this.dateModel.day, this.timeRange[1], 0);
        var timestampMin: number = +minDate.getTime().toFixed(0) / 1000;
        var timestampMax: number = +maxDate.getTime().toFixed(0) / 1000;

        this.coachService.addPotentialDateToMeeting(this.meeting.id, timestampMin, timestampMax).subscribe(
          (meetingDate: MeetingDate) => {
            console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            //redirect to meetings page
            // this.router.navigate(['/meetings']);
            this.potentialDatePosted.emit(meetingDate);
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
