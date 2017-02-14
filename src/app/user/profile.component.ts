import {Component, OnInit, AfterViewInit, AfterContentInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Coach} from "./Coach";
import {Coachee} from "./coachee";
import {AuthService} from "../service/auth.service";
import {ApiUser} from "./apiUser";

@Component({
  selector: 'rb-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit,AfterContentInit {


  private coach: Subject<Coach>;
  private coachee: Subject<Coachee>;

  private connectedUser: Observable<ApiUser>;

  constructor(private authService: AuthService) {
    this.coachee = new Subject<Coachee>();
    this.coach = new Subject<Coach>();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.connectedUser = this.authService.getConnectedUser();
    console.log("ngAfterViewInit, connectedUser : ", this.connectedUser);
  }

  ngAfterContentInit(): void {
    console.log("ngAfterContentInit");

    this.authService.getConnectedUser().subscribe(
      (user: ApiUser) => {
        console.log("getConnectedUser, user : ", user);

        if (user) {
          if (user.status == 1) {
            //coach
            console.log("getConnectedUser, create a coach");

            let coach: Coach = new Coach();
            coach.display_name = user.display_name;
            coach.avatar_url = user.avatar_url;

            this.coach.next(coach);

          } else if (user.status == 2) {
            //coachee

            let coachee: Coachee = new Coachee();
            coachee.display_name = user.display_name;
            coachee.avatar_url = user.avatar_url;

            console.log("getConnectedUser, create a coachee : ", coachee);

            console.log("getConnectedUser, call next");

            this.coachee.next(coachee);
          }
        }

      }
    );
  }

}
