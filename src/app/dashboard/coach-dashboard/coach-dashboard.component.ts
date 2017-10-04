import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {ApiUser} from "../../model/ApiUser";
import {Subscription} from "rxjs/Subscription";
import {Coach} from "../../model/Coach";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../model/Meeting";
import {MeetingsService} from "../../service/meetings.service";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-coach-dashboard',
  templateUrl: './coach-dashboard.component.html',
  styleUrls: ['./coach-dashboard.component.scss']
})
export class CoachDashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  user: Observable<Coach>;

  private meetingsOpenedCount = 0;

  private getAllMeetingsForCoachIdSubscription: Subscription;
  private connectedUserSubscription: Subscription;

  constructor(private meetingService: MeetingsService, private cd: ChangeDetectorRef) {
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
    this.connectedUserSubscription = this.user.first().subscribe(
      (user: Coach) => {
        this.onUserObtained(user);
        this.cd.detectChanges();
      });
  }

  private onUserObtained(user: ApiUser) {
    console.log('onUserObtained, user : ', user);
    if (user) {
      this.getAllMeetingsForCoach(user.id);
    }
  }

  private getAllMeetingsForCoach(coachId: string) {
    this.getAllMeetingsForCoachIdSubscription = this.meetingService.getAllMeetingsForCoachId(coachId)
      .subscribe(
        (meetings: Meeting[]) => {
          console.log('got meetings for coach', meetings);
          this.onMeetingsObtained(meetings);
          this.cd.detectChanges();
        }, (error) => {
          console.log('got meetings for coach ERROR', error);
        }
      );
  }

  private onMeetingsObtained(meetings: Array<Meeting>) {
    console.log('got meetings for coach', meetings);
    this.meetingsOpenedCount = 0;
    if (meetings) {
      for (let meeting of meetings) {
        if (meeting != null && meeting.isOpen && meeting.agreed_date != undefined) {
          this.meetingsOpenedCount++;
        }
      }
    }
  }

}
