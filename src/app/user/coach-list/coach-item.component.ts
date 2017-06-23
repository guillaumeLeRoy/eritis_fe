import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {Coach} from "../../model/Coach";

@Component({
  selector: 'rb-coach-item',
  templateUrl: './coach-item.component.html',
  styleUrls: ['./coach-item.component.scss']
})
export class CoachItemComponent implements OnInit {

  @Input()
  coach: Coach

  constructor() {
  }

  ngOnInit() {
    console.log("CoachItemComponent, ngOnInit : ", this.coach);

  }

}
