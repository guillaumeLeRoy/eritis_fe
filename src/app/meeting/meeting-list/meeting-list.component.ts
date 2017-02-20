import {Component, OnInit, AfterViewInit} from '@angular/core';
import {MeetingsService} from "../../service/meetings.service";
import {ActivatedRoute} from "@angular/router";
import {Meeting} from "../meeting";
import {Observable} from "rxjs";

@Component({
  selector: 'rb-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit, AfterViewInit {

  private coacheeId: string;

  private meetings: Observable<Meeting[]>;

  constructor(private route: ActivatedRoute, private meetingsService: MeetingsService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    this.route.params.subscribe(
      (params: any) => {
        this.coacheeId = params['id']
        this.meetings = this.meetingsService.getAllMeetingsForCoacheeId(this.coacheeId);
      }
    )
  }

}
