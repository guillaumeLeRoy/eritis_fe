import {Component, OnInit, AfterViewInit} from '@angular/core';
import {Observable} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Coach} from "../Coach";
import {CoachCoacheeService} from "../CoachCoacheeService";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../apiUser";

@Component({
  selector: 'rb-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css']
})
export class CoachDetailsComponent implements OnInit,AfterViewInit {

  model: NgbDateStruct;

  private coachId: string;

  private coach: Observable<Coach>;

  private connectedUser: Observable<ApiUser>;

  constructor(private route: ActivatedRoute, private coachService: CoachCoacheeService, private authService: AuthService) {
  }

  ngOnInit() {
    this.connectedUser = this.authService.getConnectedUser();
    console.log("ngOnInit, connectedUser : ", this.connectedUser);
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(
      (params: any) => {
        this.coachId = params['id']
        this.coach = this.coachService.getCoachForId(this.coachId);
        console.log("ngAfterViewInit, post sub coach", this.coach)
      }
    )
  }

  bookADate() {
    this.connectedUser.take(1).subscribe(
      (user: ApiUser) => {

        if (user == null) {
          console.log('no connected user')
          return
        }

        var date = new Date(this.model.year, this.model.month, this.model.day)
        var timestampSc: number = +date.getTime().toFixed(0) / 1000;
        this.coachService.bookAMeetingWithCoach(timestampSc, this.coachId, user.id).subscribe(
          (success) => {
            console.log('bookAMeetingWithCoach success', success)
          },
          (error) => {
            console.log('bookAMeetingWithCoach error', error)
          }
        );
      }
    );
  }
}
