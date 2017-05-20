import {Component, Input, OnInit} from '@angular/core';
import {Coachee} from "../../../model/coachee";
import {PotentialCoachee} from "../../../model/PotentialCoachee";

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

  constructor() { }

  ngOnInit() {

  }

}
