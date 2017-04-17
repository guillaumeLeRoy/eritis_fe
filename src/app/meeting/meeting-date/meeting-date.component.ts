import {Component, OnInit, ChangeDetectorRef, OnDestroy, Output, EventEmitter} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ApiUser} from '../../model/apiUser';
import {CoachCoacheeService} from '../../service/CoachCoacheeService';
import {AuthService} from '../../service/auth.service';
import {Observable, Subscription} from 'rxjs';
import {MeetingDate} from '../../model/MeetingDate';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'rb-meeting-date',
  templateUrl: './meeting-date.component.html',
  styleUrls: ['./meeting-date.component.css']
})
export class MeetingDateComponent implements OnInit, OnDestroy {

  // @Output()
  // potentialDatePosted = new EventEmitter<MeetingDate>();

  /**
   * Meeting Id for which we want to setup potential dates
   */
  private meetingId: string;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

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

  private meetingObjectif: string
  private meetingContext: string

  constructor(private router: Router, private route: ActivatedRoute, private coachService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log("MeetingDateComponent onInit");

    // meetingId should be in the router
    this.route.params.subscribe(
      (params: any) => {
        this.meetingId = params['meetingId'];
        this.loadMeetingPotentialTimes(this.meetingId);
      }
    );

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
  }


  private isEdititingPotentialDate: boolean;
  private mEditingPotentialTimeId: string;

  private onConnectedUserReceived(user: ApiUser) {
    this.connectedUser = Observable.of(user);
    this.cd.detectChanges();
  }

  bookOrUpdateADate() {
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

        if (this.isEdititingPotentialDate) {

          //just update potential date
          this.coachService.updatePotentialTime(this.mEditingPotentialTimeId, timestampMin, timestampMax).subscribe(
            (meetingDate: MeetingDate) => {
              console.log('updatePotentialTime, meetingDate : ', meetingDate);
              // redirect to meetings page
              // this.router.navigate(['/meetings']);
              //this.potentialDatePosted.emit(meetingDate);

              //TODO find a replace potential
            },
            (error) => {
              console.log('updatePotentialTime error', error);
              this.displayErrorBookingDate = true;
            }
          );

          //reset
          this.mEditingPotentialTimeId = null;
          this.isEdititingPotentialDate = false;

        } else {
          //create new date
          this.coachService.addPotentialDateToMeeting(this.meetingId, timestampMin, timestampMax).subscribe(
            (meetingDate: MeetingDate) => {
              console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
              // redirect to meetings page
              // this.router.navigate(['/meetings']);
              //this.potentialDatePosted.emit(meetingDate);
              this.potentialDatesArray.push(meetingDate);

            },
            (error) => {
              console.log('addPotentialDateToMeeting error', error);
              this.displayErrorBookingDate = true;
            }
          );
        }
      }
    );
    // Mise à jour du calendrier
  }

  unbookAdate(potentialDateId: string) {
    console.log('unbookAdate');
    this.coachService.removePotentialTime(potentialDateId).subscribe(
      (response) => {
        console.log("unbookAdate, response", response);

        //TODO reload potential dates
        this.cd.detectChanges();
      }, (error) => {
        console.log('unbookAdate, error', error);
      }
    );
  }

  modifyPotentialDate(potentialDateId: string) {
    console.log('modifyPotentialDate, potentialDateId', potentialDateId);

    //update time range

    this.timeRange[0] = 9;
    this.timeRange[1] = 10;

    this.isEdititingPotentialDate = true;
    this.mEditingPotentialTimeId = potentialDateId;
  }

  dateToString(date: NgbDateStruct) {
    let newDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day);
    return this.days[newDate.getDay()] + ' ' + date.day + ' ' + this.months[newDate.getMonth()];
  }

  stringToDate(date: string) {
    let d = new Date(date);
    return {day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear()};
  }

  compareDates(date1: NgbDateStruct, date2: NgbDateStruct) {
    return (date1.year === date2.year) && (date1.month === date2.month) && (date1.day === date2.day);
  }

  hasPotentialDate(date: NgbDateStruct) {
    for (let i in this.potentialDatesArray) {
      if (this.compareDates(this.stringToDate(this.potentialDatesArray[i].start_date), date)) {
        return true;
      }
    }
    return false;
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }

  onPotentialDatePosted(date: MeetingDate) {
    console.log('onPotentialDatePosted');
    // this.potentialDatePosted.emit(date);
    this.potentialDatesArray.push(date);
  }

  private loadMeetingPotentialTimes(meetingId: string) {
    this.coachService.getMeetingPotentialTimes(meetingId).subscribe(
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

  finish() {
    // console.log('finish, context :', this.uiMeetingContext);
    // console.log('finish, objectif :', this.uiMeetingObjectif);

    let user = this.authService.getConnectedUser();
    if (user != null) {
      this.router.navigate(['/meetings']);
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptionConnectUser) {
      this.subscriptionConnectUser.unsubscribe();
    }
  }
}
