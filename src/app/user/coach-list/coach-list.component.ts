import {Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit} from '@angular/core';
import {Coach} from "../../model/Coach";
import {CoachCoacheeService} from "../../service/CoachCoacheeService";
import {Observable} from "rxjs";

@Component({
  selector: 'rb-coach-list',
  templateUrl: './coach-list.component.html',
  styleUrls: ['./coach-list.component.css']
})
export class CoachListComponent implements OnInit,AfterViewInit {

  private coachs: Observable<Coach[]>

  constructor(private service: CoachCoacheeService) {
  }

  ngOnInit() {
    console.log("ngOnInit");
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
    this.coachs = this.service.getAllCoachs();
  }

}
