import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Coachee} from "../../../model/coachee";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/apiUser";
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'rb-profile-coachee',
  templateUrl: 'profile-coachee.component.html',
  styleUrls: ['profile-coachee.component.css']
})
export class ProfileCoacheeComponent implements OnInit, AfterViewInit,OnDestroy {

  private coachee: Observable<Coachee>;

  private connectedUser: Observable<ApiUser>;
  private connectedUserSubscription: Subscription

  private formCoachee: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.formCoachee = this.formBuilder.group({
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
        //refresh page
        this.onUserObtained(user);
      },
      (error) => {
        console.log('coachee update, error', error);
        //TODO display error
      });
  }


  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);

    this.connectedUser = Observable.of(user);

    if (user) {

      if (user.status == 2) {
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
