///<reference path="../../model/MeetingDate.ts"/>
import {ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit} from "@angular/core";
import {NgbDatepickerI18n, NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {ApiUser} from "../../model/ApiUser";
import {AuthService} from "../../service/auth.service";
import {Observable, Subscription} from "rxjs";
import {MeetingDate} from "../../model/MeetingDate";
import {ActivatedRoute, Router} from "@angular/router";
import {MeetingReview} from "../../model/MeetingReview";
import {MeetingsService} from "../../service/meetings.service";
import {Utils} from "../../utils/Utils";
import {Meeting} from "../../model/meeting";

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
  selector: 'rb-meeting-date',
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
  dateModel: NgbDateStruct = {year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate()};
  timeRange: number[] = [10, 18];

  /* Meeting potential dates */
  private potentialDatesArray: Array<MeetingDate>;
  private potentialDates: Observable<MeetingDate[]>;

  private hasPotentialDates = false;

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

  private getOrCreateMeeting(): Observable<string> {

    if (this.meetingId != null) {
      return Observable.of(this.meetingId);
    }

    return this.connectedUser
      .take(1)
      .flatMap(
        (user: ApiUser) => {
          return this.meetingService
            .createMeeting(user.id)
            .map(
              (meeting: Meeting) => {
                console.log('meeting created');
                return meeting.id;
              }
            );
        }
      );
  }

  private onConnectedUserReceived(user: ApiUser) {
    this.connectedUser = Observable.of(user);
    this.cd.detectChanges();
  }

  bookOrUpdateADate() {
    console.log('bookADate, dateModel : ', this.dateModel);
    // console.log('bookADate, timeModel : ', this.timeModel);

    let minDate: Date = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[0], 0);
    let maxDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[1], 0);
    let timestampMin: number = +minDate.getTime().toFixed(0) / 1000;
    let timestampMax: number = +maxDate.getTime().toFixed(0) / 1000;

    if (this.isEditingPotentialDate) {

      this.mEditingPotentialTime.start_date = minDate.valueOf().toString();//TODO verify getTime et valueOf return the same value
      this.mEditingPotentialTime.end_date = maxDate.valueOf().toString();

      this.potentialDates = Observable.of(this.potentialDatesArray);
      this.cd.detectChanges();

      //   // just update potential date
      //   this.meetingService.updatePotentialTime(this.mEditingPotentialTimeId, timestampMin, timestampMax).subscribe(
      //     (meetingDate: MeetingDate) => {
      //       console.log('updatePotentialTime, meetingDate : ', meetingDate);
      //       // Reload potential times
      //       this.loadMeetingPotentialTimes(this.meetingId);
      //       //reset progress bar values
      //       this.resetValues();
      //       Materialize.toast('Plage modifiée !', 3000, 'rounded')
      //     },
      //     (error) => {
      //       console.log('updatePotentialTime error', error);
      //       this.displayErrorBookingDate = true;
      //       Materialize.toast('Erreur lors de la modification', 3000, 'rounded')
      //     }
      //   );
      //
    } else {

      let dateToSave = new MeetingDate("");//no id for now
      dateToSave.start_date = minDate.valueOf().toString();//TODO verify getTime et valueOf return the same value
      dateToSave.end_date = maxDate.valueOf().toString();

      console.log('bookOrUpdateADate, timestampMin : ', timestampMin);
      console.log('bookOrUpdateADate,  dateToSave.start_date : ', dateToSave.start_date);

      this.addPotentialDate(dateToSave);


      //   // create new date
      //   this.meetingService.addPotentialDateToMeeting(this.meetingId, timestampMin, timestampMax).subscribe(
      //     (meetingDate: MeetingDate) => {
      //       console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
      //       this.potentialDatesArray.push(meetingDate);
      //       // Reload potential times
      //       console.log('reload potential times');
      //       // Reload potential times
      //       this.loadMeetingPotentialTimes(this.meetingId);
      //       //reset progress bar values
      //       this.resetValues();
      //       Materialize.toast('Plage ajoutée !', 3000, 'rounded')
      //     },
      //     (error) => {
      //       console.log('addPotentialDateToMeeting error', error);
      //       this.displayErrorBookingDate = true;
      //       Materialize.toast("Erreur lors de l'ajout", 3000, 'rounded')
      //     }
      //   );
    }


  }

  unbookAdate(meetingDate: MeetingDate) {
    // console.log('unbookAdate');
    // this.meetingService.removePotentialTime(potentialDateId).subscribe(
    //   (response) => {
    //     console.log('unbookAdate, response', response);
    //     //reset progress bar values
    //     this.resetValues();
    //     // Reload potential times
    //     this.loadMeetingPotentialTimes(this.meetingId);
    //   }, (error) => {
    //     console.log('unbookAdate, error', error);
    //   }
    // );

    this.potentialDatesArray.splice(this.potentialDatesArray.indexOf(meetingDate), 1)
    this.potentialDates = Observable.of(this.potentialDatesArray);
    this.cd.detectChanges();

  }

  modifyPotentialDate(meetingDate: MeetingDate) {
    console.log('modifyPotentialDate, meetingDate', meetingDate);

    //find the potentialDate we want to modify
    for (let potential of this.potentialDatesArray) {
      if (potential === meetingDate) {
        let startTime = Utils.getHours(potential.start_date);
        let endTime = Utils.getHours(potential.end_date);
        //switch to edit mode
        this.isEditingPotentialDate = true;
        this.mEditingPotentialTime = meetingDate;
        this.timeRange = [startTime, endTime];
        break;
      }
    }
  }

  resetValues() {
    this.mEditingPotentialTime = null;
    this.isEditingPotentialDate = false;
    this.timeRange = [10, 18];
  }

  timeToString(date: string): string {
    return Utils.timeToString(date);
  }

  timeIntToString(hour: number) {
    return Utils.timeIntToString(hour);
  }

  dateToString(date: string): string {
    return Utils.dateToString(date);
  }

  ngbDateToString(date: NgbDateStruct): string {
    return Utils.ngbDateToString(date);
  }

  stringToDate(date: string): NgbDateStruct {
    return Utils.stringToNgbDate(date);
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
    let now = new Date();
    let newDate = new Date(date.year, date.month - 1, date.day);
    // TODO add this to block next month days
    // TODO date.month !== current.month ||
    return (newDate.getDay() === 6 || newDate.getDay() === 0 || date.year < now.getFullYear() || (date.month < now.getMonth() + 1 && date.year <= now.getFullYear()) || (date.year <= now.getFullYear() && date.month == now.getMonth() + 1 && date.day < now.getDate()));
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
          if (dates.length > 0) this.hasPotentialDates = true;
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
    this.potentialDatesArray = new Array<MeetingDate>();
    //add received dates
    this.potentialDatesArray.push(date);
    this.potentialDates = Observable.of(this.potentialDatesArray);
    this.cd.detectChanges();
  }

  /* Call this method to check if all required params are correctly set. */
  canFinish(): boolean {
    let canFinish = this.meetingGoal != null && this.meetingContext != null && this.dateModel != null && this.hasPotentialDates;
    // console.log('canFinish : ', canFinish);
    return canFinish;
  }

  /* Save the different dates and set goal and context.
   * Navigate to the list of meetings */
  finish() {
    console.log('finish, meetingGoal : ', this.meetingGoal);
    console.log('finish, meetingContext : ', this.meetingContext);

    //save GOAL and CONTEXT
    this.getOrCreateMeeting()
      .flatMap(
        (meetingId: string) => {
          return this.meetingService.addAContextForMeeting(meetingId, this.meetingContext)
            .flatMap(
              (meetingReview: MeetingReview) => {
                return this.meetingService.addAGoalToMeeting(meetingId, this.meetingContext);
              }
            )
            .flatMap(
              (meetingReview: MeetingReview) => {
                return this.addMeetingDateToMeeting(meetingId, this.mEditingPotentialTime);
              }
            );
        }
      ).subscribe(
      (res: any) => {
        window.scrollTo(0, 0)
        this.router.navigate(['/meetings']);
        Materialize.toast('Vos disponibilités on été enregitrées !', 3000, 'rounded')
      }, (error) => {
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

  private addMeetingDateToMeeting(meetingId: string, meetingDate: MeetingDate): Observable<MeetingDate> {
    return this.meetingService.addPotentialDateToMeeting(meetingId, meetingDate.start_date, meetingDate.end_date);

    // .subscribe(
    //   (meetingDate: MeetingDate) => {
    //     console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
    //     this.potentialDatesArray.push(meetingDate);
    //     // Reload potential times
    //     console.log('reload potential times');
    //     // Reload potential times
    //     this.loadMeetingPotentialTimes(this.meetingId);
    //     //reset progress bar values
    //     this.resetValues();
    //     Materialize.toast('Plage ajoutée !', 3000, 'rounded')
    //   },
    //   (error) => {
    //     console.log('addPotentialDateToMeeting error', error);
    //     this.displayErrorBookingDate = true;
    //     Materialize.toast("Erreur lors de l'ajout", 3000, 'rounded')
    //   }
    // );
  }
}
