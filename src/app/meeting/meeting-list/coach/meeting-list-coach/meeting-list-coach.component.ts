import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {MeetingsService} from "../../../../service/meetings.service";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {AuthService} from "../../../../service/auth.service";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../../model/Meeting";
import {Subscription} from "rxjs/Subscription";
import {Coachee} from "../../../../model/Coachee";
import {Coach} from "../../../../model/Coach";
import {RhUsageRate} from "../../../../model/UsageRate";
import {HR} from "../../../../model/HR";
import {ApiUser} from "../../../../model/ApiUser";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-list-coach',
  templateUrl: './meeting-list-coach.component.html',
  styleUrls: ['./meeting-list-coach.component.scss']
})
export class MeetingListCoachComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = true;

  private user: Observable<ApiUser>;

  private meetings: Observable<Meeting[]>;
  private meetingsOpened: Observable<Meeting[]>;
  private meetingsClosed: Observable<Meeting[]>;
  private meetingsUnbooked: Observable<Meeting[]>;
  private meetingsArray: Meeting[];

  private hasOpenedMeeting = false;
  private hasClosedMeeting = false;
  private hasUnbookedMeeting = false;

  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  private meetingToCancel: Meeting;

  private rhUsageRate: Observable<RhUsageRate>;

  /**
   * Used in the modal to close a session.
   * This is the report written by the coach to close a session.
   */
  private sessionResult: string;
  /**
   * Used in the modal to close a session.
   * This is the report written by the coach to close a session.
   */
  private sessionUtility: string;

  /**
   * Used in the modal to close a session.
   * This is the id of the meeting to close.
   */
  private meetingToReportId: string;

  /**
   *
   * @param meetingsService
   * @param coachCoacheeService
   * @param authService
   * @param cd
   */
  constructor(private meetingsService: MeetingsService, private coachCoacheeService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loading = true;
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');

    this.onRefreshRequested();
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

      if (user instanceof Coach) {
        // coach
        console.log('get a coach');
        this.getAllMeetingsForCoach(user.id);
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  private getAllMeetingsForCoach(coachId: string) {
    this.subscription = this.meetingsService.getAllMeetingsForCoachId(coachId).subscribe(
      (meetings: Meeting[]) => {
        console.log('got meetings for coach', meetings);

        this.meetingsArray = meetings;
        this.meetings = Observable.of(meetings);
        this.getBookedMeetings();
        this.getClosedMeetings();
        this.getUnbookedMeetings();
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

  private getOpenedMeetings() {
    console.log('getOpenedMeetings');
    if (this.meetingsArray != null) {
      let opened: Meeting[] = [];
      for (let meeting of this.meetingsArray) {
        if (meeting != null && meeting.isOpen) {
          opened.push(meeting);
          this.hasOpenedMeeting = true;
        }
      }
      this.meetingsOpened = Observable.of(opened);
    }
  }

  private getClosedMeetings() {
    console.log('getClosedMeetings');
    if (this.meetingsArray != null) {
      let closed: Meeting[] = [];
      for (let meeting of this.meetingsArray) {
        if (meeting != null && !meeting.isOpen) {
          closed.push(meeting);
          this.hasClosedMeeting = true;
        }
      }
      this.meetingsClosed = Observable.of(closed);
    }
  }

  private getBookedMeetings() {
    console.log('getOpenedMeetings');
    if (this.meetingsArray != null) {
      let opened: Meeting[] = [];
      for (let meeting of this.meetingsArray) {
        if (meeting != null && meeting.isOpen && meeting.agreed_date) {
          opened.push(meeting);
          this.hasOpenedMeeting = true;
        }
      }
      this.meetingsOpened = Observable.of(opened);
    }
  }

  private getUnbookedMeetings() {
    console.log('getAskedMeetings');
    if (this.meetingsArray != null) {
      let unbooked: Meeting[] = [];
      for (let meeting of this.meetingsArray) {
        if (meeting != null && meeting.isOpen && !meeting.agreed_date) {
          unbooked.push(meeting);
          this.hasUnbookedMeeting = true;
        }
      }
      this.meetingsUnbooked = Observable.of(unbooked);
    }
  }

  private getUsageRate(rhId: string) {
    this.coachCoacheeService.getUsageRate(rhId).subscribe(
      (rate: RhUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.rhUsageRate = Observable.of(rate);
      }
    );
  }

  onCoachStartRoomClicked() {
    console.log('onCoachStartRoomClicked');

    this.user.take(1).subscribe(
      (usr: ApiUser) => {
        console.log('onCoachStartRoomClicked, get user');
        let coach: Coach = usr as Coach;
        let win = window.open(coach.chat_room_url, "_blank");
      }
    );
  }

  refreshDashboard() {
    location.reload();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }


  /*************************************
   ----------- Modal control ------------
   *************************************/

  coachCancelModalVisibility(isVisible: boolean) {
    if (isVisible) {
      $('#coach_cancel_meeting').openModal();
    } else {
      $('#coach_cancel_meeting').closeModal();
    }
  }

  openCoachCancelMeetingModal(meeting: Meeting) {
    this.meetingToCancel = meeting;
    this.coachCancelModalVisibility(true);
  }

  //
  // cancelCoachCancelMeeting() {
  //   this.coachCancelModalVisibility(false);
  //   this.meetingToCancel = null;
  // }
  //
  // // remove MeetingTime
  // validateCoachCancelMeeting() {
  //   console.log('validateCancelMeeting, agreed date : ', this.meetingToCancel.agreed_date);
  //   let meetingTimeId = this.meetingToCancel.agreed_date.id;
  //   console.log('validateCancelMeeting, id : ', meetingTimeId);
  //
  //   // hide modal
  //   this.coachCancelModalVisibility(false);
  //   this.meetingToCancel = null;
  //   // perform request
  //   this.meetingsService.removePotentialTime(meetingTimeId).subscribe(
  //     (response: Response) => {
  //       console.log('validateCancelMeeting, res ', response);
  //       console.log('emit');
  //       // this.dateRemoved.emit(null);
  //       this.onRefreshRequested();
  //       Materialize.toast('Meeting annulé !', 3000, 'rounded');
  //     }, (error) => {
  //       console.log('unbookAdate, error', error);
  //       Materialize.toast('Impossible d\'annuler le meeting', 3000, 'rounded');
  //     }
  //   );
  // }


  /*************************************
   ----------- Modal control to close a sessions ------------
   *************************************/

  private updateCloseSessionModalVisibility(visible: boolean) {
    if (visible) {
      $('#complete_session_modal').openModal();
    } else {
      $('#complete_session_modal').closeModal();
    }
  }

  starCloseSessionFlow(meetingId: string) {
    console.log('startAddNewObjectiveFlow, coacheeId : ', meetingId);

    this.updateCloseSessionModalVisibility(true);
    this.meetingToReportId = meetingId;
  }

  cancelCloseSessionModal() {
    this.updateCloseSessionModalVisibility(false);
  }

  validateCloseSessionModal() {
    console.log('validateCloseSessionModal');

    //TODO start loader
    this.meetingsService.closeMeeting(this.meetingToReportId, this.sessionResult, this.sessionUtility).subscribe(
      (meeting: Meeting) => {
        console.log("submitCloseMeetingForm, got meeting : ", meeting);
        // TODO stop loader

        //hide modal
        this.updateCloseSessionModalVisibility(false);

        //refresh list of meetings
        this.onRefreshRequested();
        Materialize.toast('Le compte-rendu a été envoyé !', 3000, 'rounded');
      }, (error) => {
        console.log('closeMeeting error', error);
        //TODO display error
        Materialize.toast('Impossible de clore la séance', 3000, 'rounded');
      }
    );
  }
}
