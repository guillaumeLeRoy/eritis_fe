import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Coach} from "../../../model/Coach";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/apiUser";
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'rb-profile-coach',
  templateUrl: 'profile-coach.component.html',
  styleUrls: ['profile-coach.component.css']
})
export class ProfileCoachComponent implements OnInit, AfterViewInit,OnDestroy {

  private coach: Observable<Coach>;
  private connectedUser: Observable<ApiUser>;
  private connectedUserSubscription: Subscription

  private formCoach: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.formCoach = this.formBuilder.group({
      pseudo: [''],
      avatar: ['']
    });
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
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  submitCoachProfileUpdate() {
    console.log("submitProfileUpdate");

    // this.coach.last().flatMap(
    //   (coach: Coach) => {
    //     console.log("submitProfileUpdate, coache obtained");
    //
    //     // return this.authService.updateCoachForId(coach.id, this.formCoach.value.pseudo, this.formCoach.value.avatar);
    //   }
    // ).subscribe(
    //   (user: ApiUser) => {
    //     console.log("coach updated : ", user);
    //     //refresh page
    //     this.onUserObtained(user);
    //   },
    //   (error) => {
    //     console.log('coach update, error', error);
    //     //TODO display error
    //   });
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

      }
    }

    this.cd.detectChanges();
  }
}
