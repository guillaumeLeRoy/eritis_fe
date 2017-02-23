import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {MeetingsService} from "../../service/meetings.service";
import {ActivatedRoute} from "@angular/router";
import {Meeting} from "../meeting";
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/apiUser";

@Component({
  selector: 'rb-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent implements OnInit, AfterViewInit, OnDestroy {

  // private userId: string;

  private meetings: Observable<Meeting[]>;
  private subscription: Subscription;
  private connectedUserSubscription: Subscription;

  constructor(private route: ActivatedRoute, private meetingsService: MeetingsService, private authService: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    var user = this.authService.getConnectedUser();
    console.log("ngAfterViewInit, user : ", user);
    this.onUserObtained(user);

    this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
      (user: ApiUser) => {
        console.log("getConnectedUser");
        this.onUserObtained(user);
      }
    );

    // this.route.params.subscribe(
    //   (params: any) => {
    //     // this.userId = params['id']
    //
    //   }
    // )
  }

  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);
    if (user) {

      if (user.status == 1) {
        //coach
        console.log("get a coach");

        this.subscription = this.meetingsService.getAllMeetingsForCoachId(user.id).subscribe(
          (meetings: Meeting[]) => {
            this.meetings = Observable.of(meetings);
            this.cd.detectChanges();
          }
        );

      } else if (user.status == 2) {
        //coachee
        console.log("get a coachee");

        this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(user.id).subscribe(
          (meetings: Meeting[]) => {
            this.meetings = Observable.of(meetings);
            this.cd.detectChanges();
          }
        );
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }

  }

}
