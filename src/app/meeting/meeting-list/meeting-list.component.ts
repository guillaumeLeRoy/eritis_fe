import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MeetingsService} from "../../service/meetings.service";
import {Meeting} from "../../model/meeting";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/apiUser";
import {Coach} from "../../model/Coach";
import {Coachee} from "../../model/coachee";

@Component({
  selector: 'rb-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit, AfterViewInit, OnDestroy {

  private meetings: Observable<Meeting[]>;
  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  private user: Observable<Coach | Coachee>;

  constructor(private meetingsService: MeetingsService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.onRefreshRequested();
  }

  onRefreshRequested() {
    console.log("onRefreshRequested");

    var user = this.authService.getConnectedUser();
    console.log("ngAfterViewInit, user : ", user);
    this.onUserObtained(user);

    if (user == null) {
      this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        (user: Coach | Coachee) => {
          console.log("getConnectedUser");
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

        this.meetings = Observable.of(meetings);
        this.cd.detectChanges();
      }
    );
  }

  private getAllMeetingsForCoachee(coacheeId: string) {
    this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(
      (meetings: Meeting[]) => {

        console.log("got meetings for coachee", meetings);

        this.meetings = Observable.of(meetings);
        this.cd.detectChanges();
      }
    );
  }

  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);
    if (user) {

      if (user instanceof Coach) {
        //coach
        console.log("get a coach");
        this.getAllMeetingsForCoach(user.id);
      } else if (user instanceof Coachee) {
        //coachee
        console.log("get a coachee");
        this.getAllMeetingsForCoachee(user.id);
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();

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
