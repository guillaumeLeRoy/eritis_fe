import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, Input} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {Coach} from "../../model/Coach";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/ApiUser";
import {MeetingsService} from "../../service/meetings.service";

@Component({
  selector: 'rb-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css']
})
export class CoachDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  coach: Coach;

  private connectedUser: Observable<ApiUser>;
  private subscriptionConnectUser: Subscription;

  constructor(private router: Router, private authService: AuthService, private cd: ChangeDetectorRef, private meetingService: MeetingsService) {
  }

  ngOnInit() {
    let user = this.authService.getConnectedUser();
    if (user) {
      this.onConnectedUserReceived(user);
    } else {
      this.subscriptionConnectUser = this.authService.getConnectedUserObservable().subscribe(
        (user: ApiUser) => {
          console.log("ngOnInit, sub received user", user);
          this.onConnectedUserReceived(user);
        }
      );
    }
  }

  private onConnectedUserReceived(user: ApiUser) {
    this.connectedUser = Observable.of(user);
    this.cd.detectChanges();
  }


  createAMeeting() {
    this.connectedUser.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return;
        }

        this.meetingService.createMeeting(user.id).subscribe(
          (success) => {
            console.log('addPotentialDateToMeeting success', success);
            //redirect to meetings page
            this.router.navigate(['/meetings']);
          },
          (error) => {
            console.log('addPotentialDateToMeeting error', error);
            // this.displayErrorBookingDate = true;
          }
        );
      }
    );
  }

  ngAfterViewInit(): void {
    // this.route.params.subscribe(
    //   (params: any) => {
    //     this.coachId = params['id']
    //     this.subscriptionGetCoach = this.coachService.getCoachForId(this.coachId).subscribe(
    //       (coach: Coach) => {
    //         console.log("ngAfterViewInit, post sub coach", coach);
    //
    //         this.coach = Observable.of(coach);
    //         this.cd.detectChanges();
    //       }
    //     );
    //   }
    // )
  }

  ngOnDestroy(): void {
    // if (this.subscriptionGetCoach) {
    //   this.subscriptionGetCoach.unsubscribe();
    // }

    if (this.subscriptionConnectUser) {
      this.subscriptionConnectUser.unsubscribe();
    }
  }

}
