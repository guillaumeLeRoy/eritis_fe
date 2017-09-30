import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {MeetingsService} from "../../../../service/meetings.service";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../../model/Meeting";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../../../model/Coach";
import {HRUsageRate} from "../../../../model/HRUsageRate";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-meeting-list-coach',
  templateUrl: './meeting-list-coach.component.html',
  styleUrls: ['./meeting-list-coach.component.scss']
})
export class MeetingListCoachComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = true;

  @Input()
  isAdmin: boolean = false;

  @Input()
  user: Observable<Coach>;

  private meetings: Observable<Array<Meeting>>;
  private meetingsOpened: Observable<Meeting[]>;
  private meetingsClosed: Observable<Meeting[]>;
  private meetingsUnbooked: Observable<Meeting[]>;
  private meetingsArray: Array<Meeting>;

  private hasOpenedMeeting = false;
  private hasClosedMeeting = false;
  private hasUnbookedMeeting = false;

  private userSubscription: Subscription;
  private getAllMeetingsForCoachIdSubscription: Subscription;

  private meetingToCancel: Meeting;

  private rhUsageRate: Observable<HRUsageRate>;

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
  constructor(private coachCoacheeService: CoachCoacheeService, private meetingsService: MeetingsService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loading = true;

    this.userSubscription = this.user.subscribe((user: Coach) => {
      this.onUserObtained(user);
    });
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    // this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');

    if (this.getAllMeetingsForCoachIdSubscription) {
      this.getAllMeetingsForCoachIdSubscription.unsubscribe();
    }

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onRefreshRequested() {
    console.log('onRefreshRequested');
    this.user.first().subscribe((user: Coach) => {
      this.onUserObtained(user);
    });
  }

  private onUserObtained(user: Coach) {
    console.log('onUserObtained, user : ', user);
    this.getAllMeetingsForCoach(user.id);
    // this.cd.detectChanges();
  }

  private getAllMeetingsForCoach(coachId: string) {
    this.getAllMeetingsForCoachIdSubscription = this.meetingsService.getAllMeetingsForCoachId(coachId, this.isAdmin)
      .subscribe(
        (meetings: Meeting[]) => {
          console.log('got meetings for coach', meetings);
          this.onMeetingsObtained(meetings);
        }, (error) => {
          console.log('got meetings for coach ERROR', error);
          this.loading = false;
        }
      );
  }

  private onMeetingsObtained(meetings: Array<Meeting>) {
    console.log('got meetings for coach', meetings);

    this.meetingsArray = meetings;
    this.meetings = Observable.of(meetings);
    this.getBookedMeetings();
    this.getUnbookedMeetings();
    this.getClosedMeetings();
    this.loading = false;

    console.log('got meetings, loading', this.loading);

    this.cd.detectChanges();
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
    console.log('getBookedMeetings');
    if (this.meetingsArray != null) {
      let opened: Meeting[] = [];
      for (let meeting of this.meetingsArray) {
        console.log('getBookedMeetings, meeting : ', meeting);

        if (meeting != null && meeting.isOpen && meeting.agreed_date != undefined) {
          opened.push(meeting);
          this.hasOpenedMeeting = true;
          console.log('getBookedMeetings, add meeting');
        }
      }
      this.meetingsOpened = Observable.of(opened);
    }
  }

  private getUnbookedMeetings() {
    console.log('getUnbookedMeetings');
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
      (rate: HRUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.rhUsageRate = Observable.of(rate);
      }
    );
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
