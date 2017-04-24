import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MeetingsService} from "../../service/meetings.service";
import {Meeting} from "../../model/meeting";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/apiUser";
import {Coach} from "../../model/Coach";
import {Coachee} from "../../model/coachee";
import {Router} from "@angular/router";

@Component({
  selector: 'rb-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit, AfterViewInit, OnDestroy {

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

  private user: Observable<Coach | Coachee>;

  constructor(private router: Router, private meetingsService: MeetingsService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log("ngOnInit");
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");

    this.onRefreshRequested();
  }

  onRefreshRequested() {
    console.log("onRefreshRequested");

    let user = this.authService.getConnectedUser();
    console.log("onRefreshRequested, user : ", user);
    this.onUserObtained(user);

    if (user == null) {
      this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        (user: Coach | Coachee) => {
          console.log("onRefreshRequested, getConnectedUser");
          this.onUserObtained(user);
        }
      );
    }
  }

  isUserACoach(user: Coach | Coachee) {
    return user instanceof Coach;
  }

  isUserACoachee(user: Coach | Coachee) {
    return user instanceof Coachee;
  }

  private getAllMeetingsForCoach(coachId: string) {
    this.subscription = this.meetingsService.getAllMeetingsForCoachId(coachId).subscribe(
      (meetings: Meeting[]) => {
        console.log("got meetings for coach", meetings);

        this.meetingsArray = meetings;
        this.meetings = Observable.of(meetings);
        this.getOpenedMeetings();
        this.getClosedMeetings();
        this.getUnbookedMeetings();
        this.cd.detectChanges();
      }
    );
  }

  private getAllMeetingsForCoachee(coacheeId: string) {
    this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(
      (meetings: Meeting[]) => {
        console.log("got meetings for coachee", meetings);

        this.meetingsArray = meetings;
        this.meetings = Observable.of(meetings);
        this.getOpenedMeetings();
        this.getClosedMeetings();
        this.cd.detectChanges();
      }
    );
  }

  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);
    if (user) {

      if (user instanceof Coach) {
        // coach
        console.log("get a coach");
        this.getAllMeetingsForCoach(user.id);
      } else if (user instanceof Coachee) {
        // coachee
        console.log("get a coachee");
        this.getAllMeetingsForCoachee(user.id);
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  goToDate() {
    console.log('goToDate');

    this.user.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return;
        }

        // 1) create a new meeting
        // 2) refresh our user to have a correct number of available sessions
        // 3) redirect to our MeetingDateComponent
        this.meetingsService.createMeeting(user.id).flatMap(
          (meeting: Meeting) => {
            console.log('goToDate, meeting created');

            //meeting created, now fetch user
            return this.authService.refreshConnectedUser().flatMap(
              (user: Coach | Coachee) => {
                console.log('goToDate, user refreshed');
                return Observable.of(meeting);
              }
            );
          }
        ).subscribe(
          (meeting: Meeting) => {
            // TODO display a loader
            console.log('goToDate, go to setup dates')
            this.router.navigate(['/date', meeting.id]);
          }
        );
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

  private getUnbookedMeetings() {
    console.log('getAskedMeetings');
    if (this.meetingsArray != null) {
      let unbooked: Meeting[] = [];
      for (let meeting of this.meetingsArray) {
        if (meeting.isOpen && !meeting.agreed_date) {
          unbooked.push(meeting);
          this.hasUnbookedMeeting = true;
        }
      }
      this.meetingsUnbooked = Observable.of(unbooked);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }

  }

}
