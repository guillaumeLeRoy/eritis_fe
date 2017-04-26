import {Component, OnInit, Input, AfterViewInit, ChangeDetectorRef, EventEmitter, Output} from '@angular/core';
import {Meeting} from "../../../model/meeting";
import {Observable} from "rxjs";
import {MeetingReview} from "../../../model/MeetingReview";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CoachCoacheeService} from "../../../service/CoachCoacheeService";
import {Coachee} from "../../../model/coachee";
import {MeetingDate} from "../../../model/MeetingDate";

@Component({
  selector: 'rb-meeting-item-coach',
  templateUrl: 'meeting-item-coach.component.html',
  styleUrls: ['meeting-item-coach.component.css']
})
export class MeetingItemCoachComponent implements OnInit,AfterViewInit {

  @Input()
  meeting: Meeting;

  @Output()
  meetingUpdated = new EventEmitter();

  months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  private coachee: Coachee;

  private goal: string;
  private reviewValue: string;
  private reviewNextStep: string;

  private hasValue: boolean;
  private hasNextStep: boolean;
  private hasGoal: boolean;

  private loading: boolean;
  private showDetails = false;

  /* Meeting potential dates */
  private potentialDates: Observable<MeetingDate[]>;

  private closeMeetingForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private coachCoacheeService: CoachCoacheeService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    console.log("ngOnInit, meeting : ", this.meeting);

    this.closeMeetingForm = this.formBuilder.group({
      recap: ["", Validators.required],
      score: ["", Validators.required]
    });

    this.coachee = this.meeting.coachee;
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.getGoal();
    this.getReviewValue();
    this.getReviewNextStep();
    this.loadMeetingPotentialTimes();
  }

  loadMeetingPotentialTimes() {
    this.coachCoacheeService.getMeetingPotentialTimes(this.meeting.id).subscribe(
      (dates: MeetingDate[]) => {
        console.log("potential dates obtained, ", dates);
        this.potentialDates = Observable.of(dates);
        this.cd.detectChanges();
      }, (error) => {
        console.log('get potentials dates error', error);
      }
    );
  }

  confirmPotentialDate(date: MeetingDate) {
    this.coachCoacheeService.setFinalDateToMeeting(this.meeting.id, date.id).subscribe(
      (meeting: Meeting) => {
        console.log("confirmPotentialDate, response", meeting);
        this.meeting = meeting;
        this.cd.detectChanges();
      }, (error) => {
        console.log('get potentials dates error', error);
      }
    );
  }

  submitCloseMeetingForm() {
    console.log("submitCloseMeetingForm form : ", this.closeMeetingForm.value)

    //TODO use score value
    this.coachCoacheeService.closeMeeting(this.meeting.id, this.closeMeetingForm.value.recap, "5").subscribe(
      (meeting: Meeting) => {
        console.log("submitCloseMeetingForm, got meeting : ", meeting);
        //refresh list of meetings
        this.meeting = meeting;
        this.cd.detectChanges();
      }, (error) => {
        console.log('closeMeeting error', error);
        //TODO display error
      }
    );
  }

  private getGoal() {
    this.loading = true;

    this.coachCoacheeService.getMeetingGoal(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingGoal, got goal : ", reviews);
        if (reviews != null)
          this.goal = reviews[0].comment;
        else
          this.goal = null;

        this.cd.detectChanges();
        this.hasGoal = (this.goal != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingGoal error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReviewValue() {
    this.loading = true;

    this.coachCoacheeService.getMeetingValue(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingValue, got goal : ", reviews);
        if (reviews != null)
          this.reviewValue = reviews[0].comment;
        else
          this.reviewValue = null;

        this.cd.detectChanges();
        this.hasValue = (this.reviewValue != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingValue error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  private getReviewNextStep() {
    this.loading = true;

    this.coachCoacheeService.getMeetingNextStep(this.meeting.id).subscribe(
      (reviews: MeetingReview[]) => {
        console.log("getMeetingNextStep, got goal : ", reviews);
        if (reviews != null)
          this.reviewNextStep = reviews[0].comment;
        else
          this.reviewNextStep = null;

        this.cd.detectChanges();
        this.hasNextStep = (this.reviewNextStep != null);
        this.loading = false;
      },
      (error) => {
        console.log('getMeetingNextStep error', error);
        //this.displayErrorPostingReview = true;
      });
  }

  toggleShowDetails() {
    this.showDetails = this.showDetails ? false : true;
  }

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getDate(date: string) {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
  }

}
