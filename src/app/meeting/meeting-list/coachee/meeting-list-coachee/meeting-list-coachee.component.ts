import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {MeetingsService} from "../../../../service/meetings.service";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../../model/Meeting";
import {Subscription} from "rxjs/Subscription";
import {Coachee} from "../../../../model/Coachee";
import {HR} from "../../../../model/HR";
import {Coach} from "../../../../model/Coach";
import {AdminAPIService} from "../../../../service/adminAPI.service";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-list-coachee',
  templateUrl: './meeting-list-coachee.component.html',
  styleUrls: ['./meeting-list-coachee.component.scss']
})
export class MeetingListCoacheeComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = true;

  @Input()
  mUser: Coachee;

  @Input()
  isAdmin: boolean = false;

  private user: Observable<Coachee>;

  // private user: Observable<ApiUser>;

  private meetings: Observable<Meeting[]>;
  private meetingsOpened: Observable<Meeting[]>;
  private meetingsClosed: Observable<Meeting[]>;
  private meetingsArray: Meeting[];

  private hasOpenedMeeting = false;
  private hasClosedMeeting = false;

  private subscription: Subscription;

  private meetingToCancel: Meeting;

  private rateSessionMeetingId: string
  private sessionRate = '0';
  private sessionPreRate = '0';

  constructor(private meetingsService: MeetingsService, private adminAPIservice: AdminAPIService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.loading = true;
    this.user = Observable.of(this.mUser);
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.onRefreshRequested();
  }

  private onRefreshRequested() {
    this.onUserObtained(this.mUser);
  }

  private onUserObtained(user: Coachee | Coach | HR) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof Coachee) {
        // coachee
        console.log('get a coachee');
        this.getAllMeetingsForCoachee(user.id);
        this.user = Observable.of(user);
        this.cd.detectChanges();
      }else{
        console.log('get a coachee, not instance of coachee');

      }
    }
  }

  private getAllMeetingsForCoachee(coacheeId: string) {

    if (this.isAdmin) {
      this.subscription = this.adminAPIservice.getMeetingsForCoacheeId(coacheeId).subscribe(
        (meetings: Meeting[]) => {
          this.onMeetingsObtained(meetings);
        }, (error) => {
          console.log('got meetings for coachee ERROR', error);
          this.loading = false;
        }
      );
    } else {
      this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(
        (meetings: Meeting[]) => {
          this.onMeetingsObtained(meetings);
        }, (error) => {
          console.log('got meetings for coachee ERROR', error);
          this.loading = false;
        }
      );
    }

  }

  private onMeetingsObtained(meetings: Meeting[]) {
    console.log('got meetings for coachee', meetings);

    this.meetingsArray = meetings;
    this.meetings = Observable.of(meetings);
    this.getOpenedMeetings();
    this.getClosedMeetings();
    this.cd.detectChanges();
    this.loading = false;
  }

  private getOpenedMeetings() {
    console.log('getOpenedMeetings');
    if (this.meetingsArray != null) {
      let opened: Meeting[] = [];
      for (let meeting of this.meetingsArray) {
        if (meeting.isOpen) {
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
        if (!meeting.isOpen) {
          closed.push(meeting);
          this.hasClosedMeeting = true;
        }
      }
      this.meetingsClosed = Observable.of(closed);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /*************************************
   ----------- Modal control ------------
   *************************************/

  coacheeDeleteModalVisibility(isVisible: boolean) {
    if (isVisible) {
      $('#coachee_delete_meeting_modal').openModal();
    } else {
      $('#coachee_delete_meeting_modal').closeModal();
    }
  }

  openCoacheeDeleteMeetingModal(meeting: Meeting) {
    this.meetingToCancel = meeting;
    this.coacheeDeleteModalVisibility(true);
  }

  cancelCoacheeDeleteMeeting() {
    this.coacheeDeleteModalVisibility(false);
    this.meetingToCancel = null;
  }

  validateCoacheeDeleteMeeting() {
    console.log('validateCoacheeDeleteMeeting');

    let meetingId = this.meetingToCancel.id;

    this.coacheeDeleteModalVisibility(false);
    this.meetingToCancel = null;

    this.meetingsService.deleteMeeting(meetingId).subscribe(
      (response) => {
        console.log('confirmCancelMeeting, res', response);
        // this.onMeetingCancelled.emit();
        this.onRefreshRequested();
        window.location.reload();
        Materialize.toast('Meeting supprimé !', 3000, 'rounded');
      }, (error) => {
        console.log('confirmCancelMeeting, error', error);
        Materialize.toast('Impossible de supprimer le meeting', 3000, 'rounded');
      }
    );
  }

  /*************************************
   ----------- Modal control - rate session ------------
   *************************************/

  setSessionRate(value: number) {
    this.sessionRate = value.toString();
  }

  setSessionPreRate(value: number) {
    this.sessionPreRate = value.toString();
  }

  updateRateSessionModalVisibility(isVisible: boolean) {
    if (isVisible) {
      $('#rate_session_modal').openModal();
    } else {
      $('#rate_session_modal').closeModal();
    }
  }

  openRateSessionModal(meetingId: string) {
    this.rateSessionMeetingId = meetingId;
    this.updateRateSessionModalVisibility(true);
  }

  cancelRateSessionModal() {
    this.updateRateSessionModalVisibility(false);
    this.rateSessionMeetingId = null;
    this.sessionRate = null;
  }

  validateRateSessionModal() {
    console.log('validateRateSessionModal');

    this.meetingsService.addSessionRateToMeeting(this.rateSessionMeetingId, this.sessionRate).subscribe(
      (response) => {
        console.log('validateRateSessionModal, res', response);
        this.onRefreshRequested();
        this.updateRateSessionModalVisibility(false);
        Materialize.toast('Votre coach vient d\'être noté !', 3000, 'rounded');
      }, (error) => {
        console.log('validateRateSessionModal, error', error);
        this.updateRateSessionModalVisibility(false);
        Materialize.toast('Impossible de noter votre coach', 3000, 'rounded');
      }
    );
  }

}
