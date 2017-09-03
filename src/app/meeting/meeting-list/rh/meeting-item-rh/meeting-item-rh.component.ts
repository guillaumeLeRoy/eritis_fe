import {AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Coachee} from "../../../../model/Coachee";
import {PotentialCoachee} from "../../../../model/PotentialCoachee";
import {Meeting} from "../../../../model/Meeting";
import {Observable} from "rxjs/Observable";
import {MeetingsService} from "../../../../service/meetings.service";
import {MeetingReview} from "../../../../model/MeetingReview";
import {Router} from "@angular/router";


declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-meeting-item-rh',
  templateUrl: './meeting-item-rh.component.html',
  styleUrls: ['./meeting-item-rh.component.scss']
})
export class MeetingItemRhComponent implements OnInit, AfterViewInit {

  @Input()
  coachee: Coachee;

  @Input()
  potentialCoachee: PotentialCoachee;

  /**
   * Event emitted when user clicks on the "Objective" btn.
   * @type {EventEmitter<string>} the coacheeId
   */
  @Output()
  onUpdateObjectiveBtnClick = new EventEmitter<string>();

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  private loading: boolean;
  private showDetails = false;

  private meetings: Observable<Meeting[]>;
  private hasBookedMeeting = false;
  private goals = {};
  private sessionRates = {};

  constructor(private meetingsService: MeetingsService, private cd: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit(): void {
    console.log('ngOnInit, coachee : ', this.coachee);

    if (this.coachee != null) {
      this.getAllMeetingsForCoachee(this.coachee.id);
    }
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit, coachee : ', this.coachee);

    // this.fetchConnectedUser();
  }

  printDateString(date: string) {
    return this.getDate(date);
  }

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getMinutes(date: string) {
    let m = (new Date(date)).getMinutes();
    if (m === 0)
      return '00';
    return m;
  }

  getDate(date: string): string {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
  }

  goToCoacheeProfile(coacheeId: String) {
    this.router.navigate(['/profile_coachee', coacheeId]);
  }

  toggleShowDetails() {
    this.showDetails = this.showDetails ? false : true;
  }

  private getAllMeetingsForCoachee(coacheeId: string) {
    this.loading = true;

    this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(
      (meetings: Meeting[]) => {
        console.log('got meetings for coachee', meetings);
        let bookedMeetings: Meeting[] = [];

        for (let meeting of meetings) {
          if (meeting.agreed_date != null) {
            bookedMeetings.push(meeting);
            this.hasBookedMeeting = true;

            // get goal
            this.getGoal(meeting.id);
            //get rate
            this.getSessionReviewTypeRate(meeting.id);
          }
        }

        this.meetings = Observable.of(bookedMeetings);
        this.cd.detectChanges();
        this.loading = false;
      }
    );
  }

  private getGoal(meetingId: string) {
    return this.meetingsService.getMeetingGoal(meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goals[meetingId] = reviews[0].value;
        else
          this.goals[meetingId] = 'Non renseigné';
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getSessionReviewTypeRate(meetingId: string) {
    this.meetingsService.getSessionReviewRate(meetingId).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getSessionReviewTypeRate, got rate : ", reviews);
        if (reviews != null)
          this.sessionRates[meetingId] = reviews[0].value;
        else
          this.sessionRates = 'Inconnu';
      },
      (error) => {
        console.log('getSessionReviewTypeRate error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  onClickAddObjectiveBtn() {
    this.onUpdateObjectiveBtnClick.emit(this.coachee.id);
  }

}
