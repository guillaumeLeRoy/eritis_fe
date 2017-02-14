import {Component, OnInit, AfterViewInit, AfterContentInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Coach} from "./Coach";
import {Coachee} from "./coachee";
import {AuthService} from "../service/auth.service";
import {ApiUser} from "./apiUser";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CoachCoacheeService} from "./CoachCoacheeService";

@Component({
  selector: 'rb-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {


  private coach: Observable<Coach>;
  private coachee: Observable<Coachee>;

  private connectedUser: Observable<ApiUser>;

  private form: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private coachService: CoachCoacheeService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      pseudo: [''],
      avatar: ['']
    })
  }

  ngAfterViewInit(): void {
    this.connectedUser = this.authService.getConnectedUser();
    console.log("ngAfterViewInit, connectedUser : ", this.connectedUser);

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

            this.coach = Observable.of(coach);

          } else if (user.status == 2) {
            //coachee

            let coachee: Coachee = new Coachee();
            coachee.id = user.id;
            coachee.display_name = user.display_name;
            coachee.avatar_url = user.avatar_url;
            coachee.start_date = user.start_date;

            console.log("getConnectedUser, create a coachee : ", coachee);

            console.log("getConnectedUser, call next");

            this.coachee = Observable.of(coachee);

          }
        }

      }
    );
  }


  submitProfileUpdate() {
    console.log("submitProfileUpdate");

    this.coachee.last().flatMap(
      (coachee: Coachee) => {
        console.log("submitProfileUpdate, coache obtained");

        return this.coachService.updateCoacheeForId(coachee.id, this.form.value.pseudo, this.form.value.avatar);
      }
    ).subscribe(
      (coachee: Coachee) => {
        console.log("coachee updated : ", coachee);
      });
  }


}
