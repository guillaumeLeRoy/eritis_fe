import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {MeetingsService} from "../../../../service/meetings.service";
import {CoachCoacheeService} from "../../../../service/coach_coachee.service";
import {AuthService} from "../../../../service/auth.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../../model/Meeting";
import {Subscription} from "rxjs/Subscription";
import {Coachee} from "../../../../model/Coachee";
import {Coach} from "../../../../model/Coach";
import {HRUsageRate} from "../../../../model/HRUsageRate";
import {ApiUser} from "../../../../model/ApiUser";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-list-coachee',
  templateUrl: './meeting-list-coachee.component.html',
  styleUrls: ['./meeting-list-coachee.component.scss']
})
export class MeetingListCoacheeComponent implements OnInit, AfterViewInit, OnDestroy {

  loading = true;

  private user: Observable<ApiUser>;

  private meetings: Observable<Meeting[]>;
  private meetingsOpened: Observable<Meeting[]>;
  private meetingsClosed: Observable<Meeting[]>;
  private meetingsArray: Meeting[];

  private hasOpenedMeeting = false;
  private hasClosedMeeting = false;

  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  private meetingToCancel: Meeting;

  private rhUsageRate: Observable<HRUsageRate>;

  private rateSessionMeetingId: string
  private sessionRate = '0';
  private sessionPreRate = '0';

  constructor(private router: Router, private meetingsService: MeetingsService, private coachCoacheeService: CoachCoacheeService, private authService: AuthService, private cd: ChangeDetectorRef) {
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
        (user: Coachee) => {
          console.log('onRefreshRequested, getConnectedUser');
          this.onUserObtained(user);
          this.cd.detectChanges();
        }
      );
    } else {
      this.onUserObtained(user);
    }
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof Coachee) {
        // coachee
        console.log('get a coachee');
        this.getAllMeetingsForCoachee(user.id);
        this.cd.detectChanges();
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  private getAllMeetingsForCoachee(coacheeId: string) {
    this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(
      (meetings: Meeting[]) => {
        console.log('got meetings for coachee', meetings);

        this.meetingsArray = meetings;
        this.meetings = Observable.of(meetings);
        this.getOpenedMeetings();
        this.getClosedMeetings();
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

  goToDate() {
    console.log('goToDate');

    this.user.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return;
        }

        // this.router.navigate(['/date', meeting.id]);
        this.router.navigate(['/date']);

        // // 1) create a new meeting
        // // 2) refresh our user to have a correct number of available sessions
        // // 3) redirect to our MeetingDateComponent
        // this.meetingsService.createMeeting(user.id).flatMap(
        //   (meeting: Meeting) => {
        //     console.log('goToDate, meeting created');
        //
        //     //meeting created, now fetch user
        //     return this.authService.refreshConnectedUser().flatMap(
        //       (user: Coach | Coachee) => {
        //         console.log('goToDate, user refreshed');
        //         return Observable.of(meeting);
        //       }
        //     );
        //   }
        // ).subscribe(
        //   (meeting: Meeting) => {
        //     // TODO display a loader
        //     console.log('goToDate, go to setup dates');
        //     window.scrollTo(0, 0);
        //     this.router.navigate(['/date', meeting.id]);
        //   }
        // );


      });
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

  private getUsageRate(rhId: string) {
    this.coachCoacheeService.getUsageRate(rhId).subscribe(
      (rate: HRUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.rhUsageRate = Observable.of(rate);
      }
    );
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
