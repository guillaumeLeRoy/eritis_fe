import {Component, OnInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ApiUser} from '../../model/apiUser';
import {CoachCoacheeService} from '../../service/CoachCoacheeService';
import {AuthService} from '../../service/auth.service';
import {Observable, Subscription} from 'rxjs';
import {MeetingDate} from '../../model/MeetingDate';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingReview} from "../../model/MeetingReview";

declare var Materialize: any;

@Component({
  selector: 'rb-meeting-date',
  templateUrl: './meeting-date.component.html',
  styleUrls: ['./meeting-date.component.css']
})
export class MeetingDateComponent implements OnInit, OnDestroy {

  /**
   * Meeting Id for which we want to setup potential dates
   */
  private meetingId: string;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  now = new Date();
  dateModel: NgbDateStruct = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
  timeRange: number[] = [10, 18];

  /* Meeting potential dates */
  private potentialDatesArray: Array<MeetingDate>;
  private potentialDates: Observable<MeetingDate[]>;

  private displayErrorBookingDate = false;
  private connectedUser: Observable<ApiUser>;
  private subscriptionConnectUser: Subscription;

  /* MANDATORY */
  private meetingGoal: string;
  /* MANDATORY */
  private meetingContext: string;

  isEditingPotentialDate = false;
  private mEditingPotentialTimeId: string;

  constructor(private router: Router, private route: ActivatedRoute, private coachService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
    this.potentialDatesArray = new Array<MeetingDate>();
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

        if (this.isEditingPotentialDate) {

          // just update potential date
          this.coachService.updatePotentialTime(this.mEditingPotentialTimeId, timestampMin, timestampMax).subscribe(
            (meetingDate: MeetingDate) => {
              console.log('updatePotentialTime, meetingDate : ', meetingDate);
              // Reload potential times
              this.loadMeetingPotentialTimes(this.meetingId);
              //reset progress bar values
              this.resetValues();
              Materialize.toast('Plage modifiée !', 3000, 'rounded')
            },
            (error) => {
              console.log('updatePotentialTime error', error);
              this.displayErrorBookingDate = true;
              Materialize.toast('Erreur lors de la modification', 3000, 'rounded')
            }
          );

        } else {
          // create new date
          this.coachService.addPotentialDateToMeeting(this.meetingId, timestampMin, timestampMax).subscribe(
            (meetingDate: MeetingDate) => {
              console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
              this.potentialDatesArray.push(meetingDate);
              // Reload potential times
              console.log('reload potential times');
              // Reload potential times
              this.loadMeetingPotentialTimes(this.meetingId);
              //reset progress bar values
              this.resetValues();
              Materialize.toast('Plage ajoutée !', 3000, 'rounded')
            },
            (error) => {
              console.log('addPotentialDateToMeeting error', error);
              this.displayErrorBookingDate = true;
              Materialize.toast("Erreur lors de l'ajout", 3000, 'rounded')
            }
          );
        }
      }
    );
  }

  unbookAdate(potentialDateId: string) {
    console.log('unbookAdate');
    this.coachService.removePotentialTime(potentialDateId).subscribe(
      (response) => {
        console.log('unbookAdate, response', response);
        //reset progress bar values
        this.resetValues();
        // Reload potential times
        this.loadMeetingPotentialTimes(this.meetingId);
        this.loadMeetingPotentialTimes(this.meetingId);
      }, (error) => {
        console.log('unbookAdate, error', error);
      }
    );
  }

  modifyPotentialDate(potentialDateId: string) {
    console.log('modifyPotentialDate, potentialDateId', potentialDateId);

    //find the potentialDate we want to modify
    for (let potential of this.potentialDatesArray) {
      if (potential.id === potentialDateId) {
        let startTime = this.getHours(potential.start_date);
        let endTime = this.getHours(potential.end_date);
        //switch to edit mode
        this.isEditingPotentialDate = true;
        this.mEditingPotentialTimeId = potentialDateId;
        this.timeRange = [startTime, endTime];
        break;
      }
    }
  }

  printTimeNumber(hour: number) {
    if (hour === Math.round(hour))
      return hour + ':00'
    else
      return Math.round(hour) - 1 + ':30'
  }

  printTimeString(date: string) {
    return this.getHours(date) + ':' + this.getMinutes(date);
  }

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getMinutes(date: string) {
    let m = (new Date(date)).getMinutes();
    if (m === 0)
      return '00';
    return m;
  }

  resetValues() {
    this.mEditingPotentialTimeId = null;
    this.isEditingPotentialDate = false;
    this.timeRange = [10, 18];
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
    return (date.month !== current.month);
  }

  /**
   * Fetch from API potential times for the given meeting id.
   * @param meetingId
   */
  private loadMeetingPotentialTimes(meetingId: string) {
    this.coachService.getMeetingPotentialTimes(meetingId).subscribe(
      (dates: MeetingDate[]) => {
        console.log('loadMeetingPotentialTimes : ', dates);
        if (dates != null) {
          //clear array
          this.potentialDatesArray = new Array<MeetingDate>();
          //add received dates
          this.potentialDatesArray.push(...dates);
        }
        this.potentialDates = Observable.of(dates);
        this.cd.detectChanges();
      }, (error) => {
        console.log('get potentials dates error', error);
      }
    );
  }

  /* Call this method to check if all required params are correctly set. */
  canFinish(): boolean {
    let canFinish = this.meetingGoal != null && this.meetingContext != null && this.dateModel != null;
    // console.log('canFinish : ', canFinish);
    return canFinish;
  }

  /* Save the different dates and set goal and context.
   * Navigate to the list of meetings */
  finish() {
    console.log('finish, meetingGoal : ', this.meetingGoal);
    console.log('finish, meetingContext : ', this.meetingContext);

    //save GOAL and CONTEXT
    this.coachService.addAContextForMeeting(this.meetingId, this.meetingContext).flatMap(
      (meetingReview: MeetingReview) => {
        return this.coachService.addAGoalToMeeting(this.meetingId, this.meetingGoal);
      }
    ).subscribe(
      (meetingReview: MeetingReview) => {
        let user = this.authService.getConnectedUser();
        if (user != null) {
          this.router.navigate(['/meetings']);
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptionConnectUser) {
      this.subscriptionConnectUser.unsubscribe();
    }
  }

  //callback when "goal" for this meeting has changed
  onGoalValueUpdated(goal: string) {
    console.log('onGoalUpdated goal', goal);
    this.meetingGoal = goal;
  }

  //callback when "context" for this meeting has changed
  onContextValueUpdated(context: string) {
    console.log('onContextValueUpdated context', context);
    this.meetingContext = context;
  }
}
