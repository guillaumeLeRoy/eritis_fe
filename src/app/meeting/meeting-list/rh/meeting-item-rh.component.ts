import {Component, Input, OnInit} from '@angular/core';
import {Coachee} from "../../../model/coachee";

@Component({
  selector: 'rb-meeting-item-rh',
  templateUrl: './meeting-item-rh.component.html',
  styleUrls: ['./meeting-item-rh.component.css']
})
export class RhComponent implements OnInit {

  @Input()
  coachee: Coachee;

  private goal: string;
  private hasGoal: false;
  private loading: boolean;


  constructor() { }

  ngOnInit() {

  }

}
