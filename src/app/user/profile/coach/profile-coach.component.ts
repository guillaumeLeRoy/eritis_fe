import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Coach} from "../../../model/Coach";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/ApiUser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'rb-profile-coach',
  templateUrl: 'profile-coach.component.html',
  styleUrls: ['profile-coach.component.css']
})
export class ProfileCoachComponent implements OnInit, AfterViewInit, OnDestroy {

  private coach: Observable<Coach>;
  private connectedUser: Observable<ApiUser>;
  private connectedUserSubscription: Subscription

  private formCoach: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.formCoach = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      avatar: ['', Validators.required],
      description: ['', Validators.required],
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


  submitCoachProfilUpdate() {
    console.log("submitCoachProfilUpdate");
    this.coach.last().flatMap(
      (coach: Coach) => {
        console.log("submitCoachProfilUpdate, coach obtained");
        return this.authService.updateCoachForId(coach.id,
          this.formCoach.value.firstName,
          this.formCoach.value.lastName,
          this.formCoach.value.description,
          this.formCoach.value.avatar);
      }
    ).subscribe(
      (user: ApiUser) => {
        console.log("coach updated : ", user);
        //refresh page
        this.onUserObtained(user);
      },
      (error) => {
        console.log('coach update, error', error);
        //TODO display error
      });
  }

  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);

    this.connectedUser = Observable.of(user);

    if (user instanceof Coach) {
      //update form
      this.formCoach.setValue({
        firstName: user.firstName,
        lastName: user.lastName,
        description: user.description,
        avatar: user.avatar_url,
      });
      console.log("onUserObtained, update form : ", this.formCoach.value);

      this.coach = Observable.of(user);

    }

    this.cd.detectChanges();
  }
}
