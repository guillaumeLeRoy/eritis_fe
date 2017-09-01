import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Meeting} from '../../../../model/Meeting';
import {MeetingsService} from '../../../../service/meetings.service';
import {AuthService} from "../../../../service/auth.service";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../../../model/Coach";
import {ApiUser} from "../../../../model/ApiUser";
import {Router} from "@angular/router";
import {MeetingDate} from "../../../../model/MeetingDate";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-available-meetings',
  templateUrl: './available-meetings.component.html',
  styleUrls: ['./available-meetings.component.scss']
})
export class AvailableMeetingsComponent implements OnInit {

  private availableMeetings: Observable<Meeting[]>;

  private hasAvailableMeetings = false;

  private connectedUserSubscription: Subscription;
  private user: Observable<ApiUser>;

  private selectedDate: string;
  private selectedHour: number;
  private selectedMeeting: Meeting;

  loading = true;

  constructor(private authService: AuthService, private meetingService: MeetingsService, private cd: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    this.onRefreshRequested();
    this.loading = true;
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
        this.getAllMeetings();
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  private getAllMeetings() {
    this.meetingService.getAvailableMeetings().subscribe(
      (meetings: Meeting[]) => {
        console.log('got getAllMeetings', meetings);
        this.availableMeetings = Observable.of(meetings);
        if (meetings != null && meetings.length > 0) this.hasAvailableMeetings = true;
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }


  onSelectMeetingBtnClicked(meeting: Meeting) {
    this.user.take(1).subscribe(
      (user: Coach) => {
        this.meetingService.associateCoachToMeeting(meeting.id, user.id).subscribe(
          (meeting: Meeting) => {
            console.log('on meeting associated : ', meeting);
            //navigate to dashboard
            this.router.navigate(['/meetings']);
          }
        );
      }
    );
  }

  confirmPotentialDate(meetingId: string) {

    let minDate = new Date(this.selectedDate);
    minDate.setHours(this.selectedHour);
    let maxDate = new Date(this.selectedDate);
    maxDate.setHours(this.selectedHour + 1);

    let timestampMin: number = +minDate.getTime().toFixed(0) / 1000;
    let timestampMax: number = +maxDate.getTime().toFixed(0) / 1000;

    // create new date
    this.meetingService.addPotentialDateToMeeting(meetingId, timestampMin, timestampMax).subscribe(
      (meetingDate: MeetingDate) => {
        console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);

        // validate date
        this.meetingService.setFinalDateToMeeting(meetingId, meetingDate.id).subscribe(
          (meeting: Meeting) => {
            console.log("confirmPotentialDate, response", meeting);
            this.onRefreshRequested();
            Materialize.toast('Meeting validé !', 3000, 'rounded')
            window.location.reload();
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

  onSubmitValidateMeeting() {
    this.user.take(1).subscribe(
      (user: Coach) => {
        this.meetingService.associateCoachToMeeting(this.selectedMeeting.id, user.id).subscribe(
          (meeting: Meeting) => {
            console.log('on meeting associated : ', meeting);
            //navigate to dashboard
            this.confirmPotentialDate(meeting.id);
            this.coachValidateModalVisibility(false);
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
