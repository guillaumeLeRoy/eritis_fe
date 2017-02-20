import {Component, OnInit, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {Observable} from "rxjs";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/coachee";
import {AuthService} from "../service/auth.service";
import {ApiUser} from "../model/apiUser";
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'rb-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  private coach: Observable<Coach>;
  private coachee: Observable<Coachee>;

  private connectedUser: Observable<ApiUser>;

  private formCoach: FormGroup;
  private formCoachee: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.formCoach = this.formBuilder.group({
      pseudo: [''],
      avatar: ['']
    });

    this.formCoachee = this.formBuilder.group({
      pseudo: [''],
      avatar: ['']
    });
  }


  ngAfterViewInit(): void {
    var user = this.authService.getConnectedUser();
    console.log("ngAfterViewInit, user : ", user);

    this.onUserObtained(user);

    this.authService.getConnectedUserObservable().subscribe(
      (user: ApiUser) => {
        console.log("getConnectedUser");
        this.onUserObtained(user);
      }
    );
  }

  submitCoacheeProfileUpdate() {
    console.log("submitProfileUpdate");

    this.coachee.last().flatMap(
      (coachee: Coachee) => {
        console.log("submitProfileUpdate, coache obtained");

        return this.authService.updateCoacheeForId(coachee.id, this.formCoachee.value.pseudo, this.formCoachee.value.avatar);
      }
    ).subscribe(
      (user: ApiUser) => {
        console.log("coachee updated : ", user);
      });
  }

  submitCoachProfileUpdate() {
    console.log("submitProfileUpdate");

    this.coach.last().flatMap(
      (coach: Coach) => {
        console.log("submitProfileUpdate, coache obtained");

        return this.authService.updateCoachForId(coach.id, this.formCoach.value.pseudo, this.formCoach.value.avatar);
      }
    ).subscribe(
      (user: ApiUser) => {
        console.log("coach updated : ", user);
      });
  }


  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);

    this.connectedUser = Observable.of(user);

    if (user) {

      if (user.status == 1) {
        //coach
        console.log("getConnectedUser, create a coach");

        let coach: Coach = new Coach();
        coach.id = user.id;
        coach.email = user.email;
        coach.display_name = user.display_name;
        coach.avatar_url = user.avatar_url;
        coach.start_date = user.start_date;

        this.coach = Observable.of(coach);

      } else if (user.status == 2) {
        //coachee

        let coachee: Coachee = new Coachee();
        coachee.id = user.id;
        coachee.email = user.email;
        coachee.display_name = user.display_name;
        coachee.avatar_url = user.avatar_url;
        coachee.start_date = user.start_date;

        console.log("getConnectedUser, create a coachee : ", coachee);

        this.coachee = Observable.of(coachee);
      }
    }

    this.cd.detectChanges();
  }
}
