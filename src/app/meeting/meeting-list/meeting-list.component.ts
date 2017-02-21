import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MeetingsService} from "../../service/meetings.service";
import {ActivatedRoute} from "@angular/router";
import {Meeting} from "../meeting";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'rb-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit, AfterViewInit, OnDestroy {

  private coacheeId: string;

  private meetings: Observable<Meeting[]>;
  private subscription: Subscription;

  constructor(private route: ActivatedRoute, private meetingsService: MeetingsService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    this.route.params.subscribe(
      (params: any) => {
        this.coacheeId = params['id']
        this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(this.coacheeId).subscribe(
          (meetings: Meeting[]) => {
            this.meetings = Observable.of(meetings);
            this.cd.detectChanges();
          }
        );
      }
    )
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
