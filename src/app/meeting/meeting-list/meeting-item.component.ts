import {Component, OnInit, Input} from '@angular/core';
import {Meeting} from "../meeting";
import {CoachCoacheeService} from "../../user/CoachCoacheeService";
import {Observable} from "rxjs";
import {Coach} from "../../user/Coach";

@Component({
  selector: 'rb-meeting-item',
  templateUrl: './meeting-item.component.html',
  styleUrls: ['./meeting-item.component.css'],
})
export class MeetingItemComponent implements OnInit {

  @Input()
  private meeting: Meeting;

  private coach: Observable<Coach>;

  constructor(private coachCoacheeService: CoachCoacheeService) {
  }

  ngOnInit() {
    this.coach = this.coachCoacheeService.getCoachForId(this.meeting.coach_id);
  }

}
