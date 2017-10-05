import {AfterViewInit, Component, OnDestroy, OnInit} from "@angular/core";
import {AuthService} from "../../../../service/auth.service";
import {ApiUser} from "../../../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../../../model/Coach";
import {HR} from "../../../../model/HR";
import {Coachee} from "../../../../model/Coachee";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Meeting} from "../../../../model/Meeting";
import {Observable} from "rxjs/Observable";
import {MeetingsService} from "../../../../service/meetings.service";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss']
})
export class CoachDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: BehaviorSubject<ApiUser>;

  private connectedUserSubscription: Subscription;
  private getAllMeetingsForCoachIdSubscription: Subscription;

  private meetingsArray: Array<Meeting>;

  private meetingsOpened: Observable<Array<Meeting>>;

  constructor(private authService: AuthService, private meetingsService: MeetingsService) {
    this.user = new BehaviorSubject(null);
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.onRefreshRequested();
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }

    if (this.getAllMeetingsForCoachIdSubscription) {
      this.getAllMeetingsForCoachIdSubscription.unsubscribe();
    }
  }

  onRefreshRequested() {
    this.connectedUserSubscription = this.authService.refreshConnectedUser()
      .subscribe((user?: Coach | Coachee | HR) => {
          this.onUserObtained(user);
        }
      );
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {

      if (user instanceof Coach) {
        // coachee
        console.log('get a coach');
      }

      this.user.next(user);
      this.getAllMeetingsForCoach(user.id);
    }
  }

  private getAllMeetingsForCoach(coachId: string) {
    this.getAllMeetingsForCoachIdSubscription = this.meetingsService.getAllMeetingsForCoachId(coachId, false)
      .subscribe(
        (meetings: Meeting[]) => {
          console.log('got meetings for coach', meetings);
          this.onMeetingsObtained(meetings);
        }, (error) => {
          console.log('got meetings for coach ERROR', error);
        }
      );
  }

  private onMeetingsObtained(meetings: Array<Meeting>) {
    console.log('got meetings for coach', meetings);

    this.meetingsArray = meetings;
    this.getBookedMeetings();
  }

  private getBookedMeetings() {
    console.log('getBookedMeetings');
    if (this.meetingsArray != null) {
      let opened: Array<Meeting> = new Array<Meeting>();
      for (let meeting of this.meetingsArray) {
        console.log('getBookedMeetings, meeting : ', meeting);

        if (meeting != null && meeting.isOpen && meeting.agreed_date != undefined) {
          opened.push(meeting);
          console.log('getBookedMeetings, add meeting');
        }
      }
      this.meetingsOpened = Observable.of(opened);
    }
  }

}
