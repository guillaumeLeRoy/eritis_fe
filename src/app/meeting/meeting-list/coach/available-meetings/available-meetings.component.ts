import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../../model/Meeting";
import {MeetingsService} from "../../../../service/meetings.service";
import {AuthService} from "../../../../service/auth.service";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../../../model/Coach";
import {ApiUser} from "../../../../model/ApiUser";
import {Router} from "@angular/router";
import {MeetingDate} from "../../../../model/MeetingDate";
import {MeetingItemCoachComponent} from "../meeting-item-coach/meeting-item-coach.component";
declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-available-meetings',
  templateUrl: './available-meetings.component.html',
  styleUrls: ['./available-meetings.component.scss']
})
export class AvailableMeetingsComponent implements OnInit, AfterViewInit, OnDestroy {

  private availableMeetings: Observable<Meeting[]>;

  private hasAvailableMeetings = false;

  private connectedUserSubscription: Subscription;
  private getAllMeetingsSubscription: Subscription;
  private user: Observable<ApiUser>;

  private selectedDate: string;
  private selectedHour: number;
  private selectedMeeting: Meeting;

  loading = true;

  constructor(private authService: AuthService, private meetingService: MeetingsService, private cd: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    this.loading = true;
    this.getConnectedUser();
  }

  ngAfterViewInit() {
    this.onRefreshRequested();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    if (this.connectedUserSubscription)
      this.connectedUserSubscription.unsubscribe();

    if (this.getAllMeetingsSubscription)
      this.getAllMeetingsSubscription.unsubscribe();
  }

  getConnectedUser() {
    this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
      (user: Coach) => {
        console.log('onRefreshRequested, getConnectedUser');
        this.onUserObtained(user);
        this.cd.detectChanges();
      }
    );
  }

  onRefreshRequested() {
    this.connectedUserSubscription = this.authService.refreshConnectedUser().subscribe(
      (user: Coach) => {
        console.log('onRefreshRequested, getConnectedUser');
        this.onUserObtained(user);
        this.cd.detectChanges();
      }
    );
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof Coach) {
        // coach
        console.log('get a coach');
        this.getAllMeetings();
      }

      this.user = Observable.of(user);
    }
  }

  private getAllMeetings() {
    this.getAllMeetingsSubscription = this.meetingService.getAvailableMeetings().subscribe(
      (meetings: Meeting[]) => {
        console.log('got getAllMeetings', meetings);
        this.availableMeetings = Observable.of(meetings);
        this.hasAvailableMeetings = (meetings != null && meetings.length > 0);
        this.loading = false;
        this.cd.detectChanges();
      }
    );
  }


  confirmPotentialDate(meetingId: string): Observable<Meeting> {
    console.log('confirmPotentialDate : ', meetingId);

    let minDate = new Date(this.selectedDate);
    minDate.setHours(this.selectedHour);
    let maxDate = new Date(this.selectedDate);
    maxDate.setHours(this.selectedHour + 1);

    let timestampMin: number = +minDate.valueOf();
    let timestampMax: number = +maxDate.valueOf();

    let newDate = new MeetingDate();
    newDate.start_date = timestampMin;
    newDate.end_date = timestampMax;

    // create new date TODO :date could be set directly
    return this.meetingService.addPotentialDateToMeeting(meetingId, newDate)
      .flatMap(
        (meetingDate: MeetingDate) => {
          console.log('test, onSubmitValidateMeeting 3');
          console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
          // validate date
          return this.meetingService.setFinalDateToMeeting(meetingId, meetingDate.id);
        }
      )
      // .map(
      //   (meeting: Meeting) => {
      //     console.log("setFinalDateToMeeting, response", meeting);
      //     console.log('test, onSubmitValidateMeeting 4');
      //
      //     // this.onRefreshRequested();
      //     // Materialize.toast('Meeting validé !', 3000, 'rounded')
      //     // window.location.reload();
      //     return meeting;
      //   }
      // );
  }

  onSubmitValidateMeeting() {
    console.log('onSubmitValidateMeeting');

    this.user
      .take(1)
      .flatMap(
        (user: Coach) => {
          console.log('test, onSubmitValidateMeeting 1');
          return this.meetingService.associateCoachToMeeting(this.selectedMeeting.id, user.id);
        }
      ).flatMap(
      (meeting: Meeting) => {
        console.log('on meeting associated : ', meeting);
        console.log('test, onSubmitValidateMeeting 2');

        return this.confirmPotentialDate(meeting.id);
      }
    ).subscribe(
      (meeting: Meeting) => {
        console.log('on meeting associated : ', meeting);
        console.log('test, onSubmitValidateMeeting 4');

        this.coachValidateModalVisibility(false);
        //navigate to dashboard
        this.router.navigate(['dashboard/meetings']);
        this.cd.detectChanges();
      }, (error) => {
        console.log('get potentials dates error', error);
        Materialize.toast('Erreur lors de la validation du meeting', 3000, 'rounded')
      });
  }

  coachValidateModalVisibility(isVisible: boolean) {
    if (isVisible) {
      $('#coach_cancel_meeting').openModal();
    } else {
      $('#coach_cancel_meeting').closeModal();
    }
  }

  openCoachValidateMeetingModal($event) {
    this.selectedMeeting = $event.meeting;
    this.selectedDate = $event.selectedDate;
    this.selectedHour = $event.selectedHour;
    this.coachValidateModalVisibility(true);
  }

  cancelCoachValidateMeeting() {
    this.coachValidateModalVisibility(false);
  }
}
