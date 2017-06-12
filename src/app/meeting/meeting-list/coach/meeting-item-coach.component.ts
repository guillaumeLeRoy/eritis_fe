import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Meeting} from "../../../model/Meeting";
import {Observable} from "rxjs";
import {MeetingReview} from "../../../model/MeetingReview";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Coachee} from "../../../model/Coachee";
import {MeetingDate} from "../../../model/MeetingDate";
import {MeetingsService} from "../../../service/meetings.service";
import {Coach} from "../../../model/Coach";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-item-coach',
  templateUrl: 'meeting-item-coach.component.html',
  styleUrls: ['meeting-item-coach.component.css']
})
export class MeetingItemCoachComponent implements OnInit, AfterViewInit {

  @Input()
  meeting: Meeting;

  @Output()
  dateAgreed = new EventEmitter();

  // @Output()
  // dateRemoved = new EventEmitter();

  @Output()
  cancelMeetingTimeEvent = new EventEmitter<Meeting>();

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private coachee: Coachee;
  private user: Observable<Coach>;

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

  private potentialDays: Observable<number[]>;
  private potentialHours: Observable<number[]>;

  private closeMeetingForm: FormGroup;

  private connectedUserSubscription: Subscription;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private meetingService: MeetingsService, private cd: ChangeDetectorRef) {
    $('select').material_select();
  }

  ngOnInit() {
    console.log("ngOnInit, meeting : ", this.meeting);

    this.onRefreshRequested();

    this.closeMeetingForm = this.formBuilder.group({
      recap: ["", Validators.required],
      score: ["", Validators.required]
    });

    this.coachee = this.meeting.coachee;

    $('select').material_select();

  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.getGoal();
    this.getContext();
    this.getReviewValue();
    this.getReviewNextStep();
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
    this.meetingService.getMeetingPotentialTimes(this.meeting.id).subscribe(
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

  confirmPotentialDate() {

    let minDate = new Date(this.selectedDate);
    minDate.setHours(this.selectedHour);
    let maxDate = new Date(this.selectedDate);
    maxDate.setHours(this.selectedHour + 1);

    let timestampMin: number = +minDate.getTime().toFixed(0) / 1000;
    let timestampMax: number = +maxDate.getTime().toFixed(0) / 1000;

    // create new date
    this.meetingService.addPotentialDateToMeeting(this.meeting.id, timestampMin, timestampMax).subscribe(
      (meetingDate: MeetingDate) => {
        console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);

        // validate date
        this.meetingService.setFinalDateToMeeting(this.meeting.id, meetingDate.id).subscribe(
          (meeting: Meeting) => {
            console.log("confirmPotentialDate, response", meeting);
            this.dateAgreed.emit();
            Materialize.toast('Meeting validé !', 3000, 'rounded')
          }, (error) => {
            console.log('get potentials dates error', error);
            Materialize.toast('Erreur lors de la validation du meeting', 3000, 'rounded')
          }
        );
      },
      (error) => {
        console.log('addPotentialDateToMeeting error', error);
      }
    );
  }

  submitCloseMeetingForm() {
    console.log("submitCloseMeetingForm form : ", this.closeMeetingForm.value)

    //TODO use score value
    this.meetingService.closeMeeting(this.meeting.id, this.closeMeetingForm.value.recap, "5").subscribe(
      (meeting: Meeting) => {
        console.log("submitCloseMeetingForm, got meeting : ", meeting);
        //refresh list of meetings
        this.meeting = meeting;
        this.cd.detectChanges();
      }, (error) => {
        console.log('closeMeeting error', error);
        //TODO display error
      }
    );
  }

  private getGoal() {
    this.loading = true;

    this.meetingService.getMeetingGoal(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goal = Observable.of(reviews[0].comment);
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

    this.meetingService.getMeetingContext(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingContext, got context : ", reviews);
        if (reviews != null)
          this.context = Observable.of(reviews[0].comment);
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

    this.meetingService.getMeetingValue(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingValue, got goal : ", reviews);
        if (reviews != null)
          this.reviewValue = reviews[0].comment;
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

    this.meetingService.getMeetingNextStep(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingNextStep, got goal : ", reviews);
        if (reviews != null)
          this.reviewNextStep = reviews[0].comment;
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


  private loadPotentialDays() {
    console.log("loadPotentialDays");
    let days = [];

    if (this.potentialDatesArray != null) {
      for (let date of this.potentialDatesArray) {
        let d = new Date(date.start_date);
        d.setHours(0);
        d.setMinutes(0);
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
      if (this.getDate(date.start_date) === this.getDate(selected)) {
        for (let _i = this.getHours(date.start_date); _i < this.getHours(date.end_date); _i++) {
          hours.push(_i);
        }
      }
    }

    this.potentialHours = Observable.of(hours);
    this.cd.detectChanges();
    console.log("potentialHours", hours);
  }

  printTimeNumber(hour: number) {
    return hour + ':00'
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

  getDate(date: string): string {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
  }

  toggleShowDetails() {
    this.showDetails = this.showDetails ? false : true;
  }

  openModal() {
    console.log('openModal, agreed date : ', this.meeting.agreed_date);
    console.log('openModal, meeting : ', this.meeting);
    // $('#deleteModal').openModal();

    this.cancelMeetingTimeEvent.emit(this.meeting);//TODO to improve
  }

  onSubmitValidateMeeting(meeting: Meeting) {
    this.user.take(1).subscribe(
      (user: Coach) => {
        this.meetingService.associateCoachToMeeting(this.meeting.id, user.id).subscribe(
          (meeting: Meeting) => {
            console.log('on meeting associated : ', meeting);
            //navigate to dashboard
            this.confirmPotentialDate();
            this.cd.detectChanges();
          }
        );
      }
    );
  }

  coachValidateModalVisibility(isVisible: boolean) {
    if (isVisible) {
      $('#coach_cancel_meeting').openModal();
    } else {
      $('#coach_cancel_meeting').closeModal();
    }
  }

  openCoachValidateMeetingModal(meeting: Meeting) {
    this.coachValidateModalVisibility(true);
  }

  cancelCoachValidateMeeting() {
    this.coachValidateModalVisibility(false);
  }

}
