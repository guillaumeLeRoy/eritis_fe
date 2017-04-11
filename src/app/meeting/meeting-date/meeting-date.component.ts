import {Component, OnInit, Input, ChangeDetectorRef, OnDestroy, Output, EventEmitter} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ApiUser} from '../../model/apiUser';
import {CoachCoacheeService} from '../../service/CoachCoacheeService';
import {AuthService} from '../../service/auth.service';
import {Observable, Subscription} from 'rxjs';
import {Meeting} from '../../model/meeting';
import {MeetingDate} from '../../model/MeetingDate';

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

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  now = new Date();
  dateModel: NgbDateStruct = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
  // timeModel: NgbTimeStruct;
  timeRange: number[] = [7, 21];

  /* Meeting potential dates */
  private potentialDatesArray: MeetingDate[];
  private potentialDates: Observable<MeetingDate[]>;

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
          console.log('ngOnInit, sub received user', user);
          this.onConnectedUserReceived(user);
        }
      );
    }

    this.loadMeetingPotentialTimes();
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
          console.log('no connected user');
          return;
        }

        let minDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[0], 0);
        let maxDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[1], 0);
        let timestampMin: number = +minDate.getTime().toFixed(0) / 1000;
        let timestampMax: number = +maxDate.getTime().toFixed(0) / 1000;

        this.coachService.addPotentialDateToMeeting(this.meeting.id, timestampMin, timestampMax).subscribe(
          (meetingDate: MeetingDate) => {
            console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            // redirect to meetings page
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

  dateToString(date: NgbDateStruct) {
    let newDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day);
    return this.days[newDate.getDay() - 1] + ' ' + date.day + ' ' + this.months[newDate.getMonth()];
  }

  stringToDate(date: string) {
    let d = new Date(date);
    return {day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
  }

  compareDates(date1: NgbDateStruct, date2: NgbDateStruct) {
    return (date1.year == date2.year) && (date1.month == date2.month) && (date1.day == date2.day);
  }

  hasPotentialDate(date: NgbDateStruct) {
    for (let i in this.potentialDatesArray) {
      if (this.compareDates(this.stringToDate(this.potentialDatesArray[i].start_date), date)) {
        return true;
      }
    }
    return false;
  }

  isDisabled(date: NgbDateStruct, current: {month: number}) {
    return date.month !== current.month;
  }

  onPotentialDatePosted(date: MeetingDate) {
    console.log('onPotentialDatePosted');
    this.potentialDatePosted.emit(date);
  }

  private loadMeetingPotentialTimes() {
    this.coachService.getMeetingPotentialTimes(this.meeting.id).subscribe(
      (dates: MeetingDate[]) => {
        console.log('potential dates obtained, ', dates);
        this.potentialDatesArray = dates;
        this.potentialDates = Observable.of(dates);
        this.cd.detectChanges();
      }, (error) => {
        console.log('get potentials dates error', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptionConnectUser) {
      this.subscriptionConnectUser.unsubscribe();
    }
  }
}
