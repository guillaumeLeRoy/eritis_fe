import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Meeting} from "../../../../model/Meeting";
import {Observable} from "rxjs";
import {MeetingReview} from "../../../../model/MeetingReview";
import {Coachee} from "../../../../model/Coachee";
import {MeetingDate} from "../../../../model/MeetingDate";
import {MeetingsService} from "../../../../service/meetings.service";
import {Coach} from "../../../../model/Coach";
import {AuthService} from "../../../../service/auth.service";
import {ApiUser} from "../../../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";
import {Router} from "@angular/router";
import {Utils} from "../../../../utils/Utils";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-item-coach',
  templateUrl: './meeting-item-coach.component.html',
  styleUrls: ['./meeting-item-coach.component.scss']
})
export class MeetingItemCoachComponent implements OnInit, AfterViewInit {

  @Input()
  meeting: Meeting;

  @Input()
  isAdmin: boolean = false;

  @Output()
  onValidateDateBtnClick = new EventEmitter();

  // @Output()
  // dateRemoved = new EventEmitter();

  @Output()
  cancelMeetingTimeEvent = new EventEmitter<Meeting>();

  @Output()
  onCloseMeetingBtnClickEmitter = new EventEmitter();

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private coachee: Coachee;
  private user: Observable<ApiUser>;

  private goal: Observable<string>;
  private context: Observable<string>;
  private reviewValue: string;
  private reviewNextStep: string;

  private hasValue: boolean;
  private hasNextStep: boolean;
  private hasGoal: boolean;

  private loading: boolean;
  private showDetails = false;

  /* Meeting potential dates */
  private potentialDatesArray: MeetingDate[];
  private potentialDates: Observable<MeetingDate[]>;

  private selectedDate = '0';
  private selectedHour = 0;

  private potentialDays: Observable<string[]>;
  private potentialHours: Observable<number[]>;

  private connectedUserSubscription: Subscription;

  /**
   * Coach rate given by coachee
   */
  private sessionRate: string;
  private hasRate: boolean;

  constructor(private authService: AuthService, private meetingService: MeetingsService, private cd: ChangeDetectorRef, private router: Router) {
    $('select').material_select();
  }

  ngOnInit() {
    console.log("ngOnInit, meeting : ", this.meeting);

    this.onRefreshRequested();

    this.coachee = this.meeting.coachee;

    $('select').material_select();

  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.getGoal();
    this.getContext();
    this.getReviewValue();
    this.getReviewNextStep();
    this.getSessionReviewTypeRate();
    this.loadMeetingPotentialTimes();
    this.loadPotentialDays();
    $('select').material_select();
  }

  onRefreshRequested() {
    let user = this.authService.getConnectedUser();
    console.log('onRefreshRequested, user : ', user);
    if (user == null) {
      this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        (user: Coach) => {
          console.log('onRefreshRequested, getConnectedUser');
          this.onUserObtained(user);
        }
      );
    } else {
      this.onUserObtained(user);
    }
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {
      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  loadMeetingPotentialTimes() {
    this.meetingService.getMeetingPotentialTimes(this.meeting.id, this.isAdmin).subscribe(
      (dates: MeetingDate[]) => {
        console.log("potential dates obtained, ", dates);

        if (dates != null) {
          dates.sort(function (a, b) {
            let d1 = new Date(a.start_date);
            let d2 = new Date(b.start_date);
            let res = d1.getUTCFullYear() - d2.getUTCFullYear();
            if (res === 0)
              res = d1.getUTCMonth() - d2.getUTCMonth();
            if (res === 0)
              res = d1.getUTCDate() - d2.getUTCDate();
            if (res === 0)
              res = d1.getUTCHours() - d2.getUTCHours();
            return res;
          });
        }

        this.potentialDatesArray = dates;
        this.potentialDates = Observable.of(dates);
        this.cd.detectChanges();
        this.loadPotentialDays();
      }, (error) => {
        console.log('get potentials dates error', error);
      }
    );
  }

  onCloseMeetingBtnClick() {
    this.onCloseMeetingBtnClickEmitter.emit(this.meeting.id);
  }

  private getGoal() {
    this.loading = true;

    this.meetingService.getMeetingGoal(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goal = Observable.of(reviews[0].value);
        else
          this.goal = null;

        this.cd.detectChanges();
        this.hasGoal = (this.goal != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getContext() {
    this.loading = true;

    this.meetingService.getMeetingContext(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingContext, got context : ", reviews);
        if (reviews != null)
          this.context = Observable.of(reviews[0].value);
        else
          this.context = Observable.of('n/a');

        this.loading = false;
        this.cd.detectChanges();
      },
      (error) => {
        console.log('getMeetingContext error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReviewValue() {
    this.loading = true;

    this.meetingService.getSessionReviewUtility(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingValue, got goal : ", reviews);
        if (reviews != null)
          this.reviewValue = reviews[0].value;
        else
          this.reviewValue = null;

        this.cd.detectChanges();
        this.hasValue = (this.reviewValue != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingValue error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReviewNextStep() {
    this.loading = true;

    this.meetingService.getSessionReviewResult(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingNextStep, : ", reviews);
        if (reviews != null)
          this.reviewNextStep = reviews[0].value;
        else
          this.reviewNextStep = null;

        this.cd.detectChanges();
        this.hasNextStep = (this.reviewNextStep != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingNextStep error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getSessionReviewTypeRate() {
    this.loading = true;

    this.meetingService.getSessionReviewRate(this.meeting.id, this.isAdmin).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeRate, got rate : ", reviews);
        if (reviews != null)
          this.sessionRate = reviews[0].value;
        else
          this.sessionRate = null;

        this.cd.detectChanges();
        this.hasRate = (this.sessionRate != null);
        this.loading = false;
      },
      (error) => {
        console.log('getSessionReviewTypeRate error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private loadPotentialDays() {
    console.log("loadPotentialDays");
    let days = new Array<string>();

    if (this.potentialDatesArray != null) {
      for (let date of this.potentialDatesArray) {
        let d = new Date(date.start_date);
        // remove hours and minute
        d.setHours(0);
        d.setMinutes(0);
        // avoid duplicates
        if (days.indexOf(d.toString()) < 0)
          days.push(d.toString());
      }
    }

    this.potentialDays = Observable.of(days);
    this.cd.detectChanges();
    console.log("potentialDays", days);
  }

  loadPotentialHours(selected) {
    console.log("loadPotentialHours", selected);
    let hours = [];

    for (let date of this.potentialDatesArray) {
      // TODO could be improved
      if (Utils.getDayAndMonthFromTimestamp(date.start_date) === Utils.getDate(selected)) {
        for (let _i = Utils.getHoursFromTimestamp(date.start_date); _i < Utils.getHoursFromTimestamp(date.end_date); _i++) {
          hours.push(_i);
        }
      }
    }

    this.potentialHours = Observable.of(hours);
    this.cd.detectChanges();
    console.log("potentialHours", hours);
  }

  timestampToString(timestamp: number): string {
    return Utils.timestampToString(timestamp);
  }

  hoursAndMinutesFromTimestamp(timestamp: number) {
    return Utils.getHoursAndMinutesFromTimestamp(timestamp);
  }

  timeIntToString(hour: number) {
    return Utils.timeIntToString(hour);
  }

  goToCoacheeProfile(coacheeId: String) {
    this.router.navigate(['/profile_coachee', coacheeId]);
  }

  onValidateDateClick() {
    this.onValidateDateBtnClick.emit({
      selectedDate: this.selectedDate,
      selectedHour: this.selectedHour,
      meeting: this.meeting
    });
  }
}
