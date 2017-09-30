import {ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit} from "@angular/core";
import {NgbDatepickerI18n, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {ApiUser} from "../../model/ApiUser";
import {AuthService} from "../../service/auth.service";
import {Observable, Subscription} from "rxjs";
import {MeetingDate} from "../../model/MeetingDate";
import {ActivatedRoute, Router} from "@angular/router";
import {MeetingsService} from "../../service/meetings.service";
import {Utils} from "../../utils/Utils";
import {Meeting} from "../../model/Meeting";

declare var Materialize: any;

const I18N_VALUES = {
  'fr': {
    weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
    months: Utils.months
  }
  // other languages you would support
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'fr';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }

  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }
}

@Component({
  selector: 'er-meeting-date',
  templateUrl: './meeting-date.component.html',
  styleUrls: ['./meeting-date.component.scss'],
  providers: [I18n, {provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n}] // define custom NgbDatepickerI18n provider
})
export class MeetingDateComponent implements OnInit, OnDestroy {

  /**
   * Meeting Id for which we want to setup potential dates
   */
  private meetingId?: string;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  now = new Date();
  dateModel: NgbDateStruct = null;
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
  private mEditingPotentialTime: MeetingDate;

  constructor(private router: Router, private route: ActivatedRoute, private meetingService: MeetingsService, private authService: AuthService, private cd: ChangeDetectorRef) {
    this.potentialDatesArray = new Array<MeetingDate>();
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    console.log("MeetingDateComponent onInit");

    // meetingId should be in the router
    this.route.params.subscribe(
      (params: any) => {
        this.meetingId = params['meetingId'];
        console.log("route param, meetingId : " + this.meetingId);

        if (this.meetingId != undefined) {
          this.loadMeetingPotentialTimes(this.meetingId);
        }
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

    let minDate: Date = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[0], 0);
    let maxDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[1], 0);

    if (this.isEditingPotentialDate) {

      this.mEditingPotentialTime.start_date = minDate.valueOf();
      this.mEditingPotentialTime.end_date = maxDate.valueOf();

      this.potentialDates = Observable.of(this.potentialDatesArray);
      this.cd.detectChanges();

      //reset progress bar values
      this.resetValues();
      Materialize.toast('Plage modifiée !', 3000, 'rounded')
    } else {
      let dateToSave = new MeetingDate();

      dateToSave.start_date = minDate.valueOf();
      dateToSave.end_date = maxDate.valueOf();

      this.addPotentialDate(dateToSave);
    }
  }

  unbookAdate(meetingDate: MeetingDate) {
    this.potentialDatesArray.splice(this.potentialDatesArray.indexOf(meetingDate), 1)
    this.potentialDates = Observable.of(this.potentialDatesArray);
    this.cd.detectChanges();

  }

  modifyPotentialDate(meetingDate: MeetingDate) {
    console.log('modifyPotentialDate, meetingDate', meetingDate);
    //switch to edit mode
    this.isEditingPotentialDate = true;
    this.mEditingPotentialTime = meetingDate;
    // position time selector
    let startTime = Utils.getHoursFromTimestamp(meetingDate.start_date);
    let endTime = Utils.getHoursFromTimestamp(meetingDate.end_date);
    this.updateTimeSelector(startTime, endTime);
    // correctly position the date on the calendar
    this.dateModel = Utils.timestampToNgbDate(meetingDate.start_date);
  }

  private updateTimeSelector(minHour: number, maxHour: number) {
    this.timeRange = [minHour, maxHour];
  }

  resetValues() {
    this.mEditingPotentialTime = null;
    this.isEditingPotentialDate = false;
    this.updateTimeSelector(10, 18);
  }

  getHoursAndMinutesFromTimestamp(timestamp: number): string {
    return Utils.getHoursAndMinutesFromTimestamp(timestamp);
  }

  timeIntToString(hour: number) {
    return Utils.timeIntToString(hour);
  }

  timestampToString(timestamp: number): string {
    return Utils.timestampToString(timestamp);
  }

  ngbDateToString(date: NgbDateStruct): string {
    return Utils.ngbDateToString(date);
  }

  timestampToNgbDateStruct(timestamp: number): NgbDateStruct {
    return Utils.timestampToNgbDate(timestamp);
  }

  compareDates(date1: NgbDateStruct, date2: NgbDateStruct) {
    return (date1.year === date2.year) && (date1.month === date2.month) && (date1.day === date2.day);
  }

  hasPotentialDate(date: NgbDateStruct) {
    for (let i in this.potentialDatesArray) {
      if (this.compareDates(this.timestampToNgbDateStruct(this.potentialDatesArray[i].start_date), date)) {
        return true;
      }
    }
    return false;
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    let now = new Date();
    let newDate = new Date(date.year, date.month - 1, date.day);
    // TODO add this to block next month days
    // TODO date.month !== current.month ||
    return (newDate.getDay() === 6
    || newDate.getDay() === 0
    || date.year < now.getFullYear()
    || (date.month < now.getMonth() + 1 && date.year <= now.getFullYear())
    || (date.year <= now.getFullYear() && date.month === now.getMonth() + 1 && date.day < now.getDate())
    || (date.year === now.getFullYear() && date.month === now.getMonth() + 1 && date.day < now.getDate() + 3));
  }

  /**
   * Fetch from API potential times for the given meeting id.
   * @param meetingId
   */
  private loadMeetingPotentialTimes(meetingId: string) {
    this.meetingService.getMeetingPotentialTimes(meetingId).subscribe(
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

  private addPotentialDate(date: MeetingDate) {
    //add received dates
    this.potentialDatesArray.push(date);
    this.potentialDates = Observable.of(this.potentialDatesArray);
    this.cd.detectChanges();
    Materialize.toast('Plage ajoutée !', 3000, 'rounded');
  }

  /* Call this method to check if all required params are correctly set. */
  canFinish(): boolean {
    let canFinish =
      this.meetingGoal != null
      && this.meetingContext != null
      && this.potentialDatesArray.length > 2;
    return canFinish;
  }

  /* Save the different dates and set goal and context.
   * Navigate to the list of meetings */
  finish() {
    console.log('finish, meetingGoal : ', this.meetingGoal);
    console.log('finish, meetingContext : ', this.meetingContext);

    // create or update meeting
    // save GOAL and CONTEXT
    // save meeting dates
    this.connectedUser
      .take(1)
      .flatMap(
        (user: ApiUser) => {
          if (this.meetingId != null) {
            return this.meetingService
              .updateMeeting(user.id, this.meetingId, this.meetingContext, this.meetingGoal, this.potentialDatesArray);
          } else {
            return this.meetingService
              .createMeeting(user.id, this.meetingContext, this.meetingGoal, this.potentialDatesArray);
          }
        })
      .subscribe(
        (meeting: Meeting) => {
          this.router.navigate(['/meetings']);
          Materialize.toast('Vos disponibilités on été enregitrées !', 3000, 'rounded');
        }, (error) => {
          console.log('getOrCreateMeeting error', error);
          Materialize.toast("Impossible d'enregistrer vos disponibilités", 3000, 'rounded')
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
