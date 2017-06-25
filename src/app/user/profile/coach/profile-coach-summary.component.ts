import {Component, OnInit, Input} from '@angular/core';
import {Coach} from "../../../model/Coach";

@Component({
  selector: 'rb-profile-coach-summary',
  templateUrl: './profile-coach-summary.component.html',
  styleUrls: ['./profile-coach-summary.component.scss']
})
export class ProfileCoachSummaryComponent implements OnInit {

  @Input()
  coach: Coach;

  constructor() {
  }

  ngOnInit() {
  }

}
