import {Component, Input, OnInit} from '@angular/core';
import {Coachee} from "../../../model/coachee";
import {PotentialCoachee} from "../../../model/PotentialCoachee";
import {Observable} from "rxjs/Observable";
import {RhUsageRate} from "../../../model/UsageRate";
import {CoachCoacheeService} from "../../../service/CoachCoacheeService";
import {isNull} from "util";

@Component({
  selector: 'rb-meeting-item-rh',
  templateUrl: './meeting-item-rh.component.html',
  styleUrls: ['./meeting-item-rh.component.css']
})
export class MeetingItemRhComponent implements OnInit {

  @Input()
  coachee: Coachee;

  @Input()
  potentialCoachee: PotentialCoachee;

  private goal: string;
  private hasGoal: false;
  private loading: boolean;

  private coacheeUsageRate: Observable<RhUsageRate>;

  constructor(private coachCoacheeService: CoachCoacheeService) { }

  ngOnInit(): void {
    console.log('ngOnInit');

    if (this.coachee)
      this.getUsageRate(this.coachee.id);

  }

  private getUsageRate(rhId: string) {
    this.coachCoacheeService.getUsageRate(rhId).subscribe(
      (rate: RhUsageRate) => {
        console.log("getUsageRate, rate : ", rate);
        this.coacheeUsageRate = Observable.of(rate);
      }
    );
  }

}
