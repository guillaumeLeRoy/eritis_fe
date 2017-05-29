import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../model/meeting";
import {MeetingsService} from "../../../service/meetings.service";
import {AuthService} from "../../../service/auth.service";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../../model/Coach";
import {ApiUser} from "../../../model/apiUser";
import {Router} from "@angular/router";

@Component({
  selector: 'er-available-meetings',
  templateUrl: './available-meetings.component.html',
  styleUrls: ['./available-meetings.component.css']
})
export class AvailableMeetingsComponent implements OnInit {

  private availableMeetings: Observable<Meeting[]>;

  private hasAvailableMeetings = false;

  private connectedUserSubscription: Subscription;
  private user: Observable<Coach>;

  constructor(private authService: AuthService, private meetingService: MeetingsService, private cd: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
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
        this.getAllMeetings();
      }

      this.user = Observable.of(user);
      this.cd.detectChanges();
    }
  }

  private getAllMeetings() {
    this.meetingService.getAvailablesMeetings().subscribe(
      (meetings: Meeting[]) => {
        console.log('got getAllMeetings', meetings);
        this.availableMeetings = Observable.of(meetings);
        if (meetings != null && meetings.length > 0) this.hasAvailableMeetings = true;
        this.cd.detectChanges();
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
}
