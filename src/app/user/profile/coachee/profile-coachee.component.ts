import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {Coachee} from "../../../model/coachee";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/apiUser";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-profile-coachee',
  templateUrl: 'profile-coachee.component.html',
  styleUrls: ['profile-coachee.component.css']
})
export class ProfileCoacheeComponent implements OnInit, AfterViewInit,OnDestroy {

  private coachee: Observable<Coachee>;
  private user: Coachee;

  private connectedUser: Observable<ApiUser>;
  private connectedUserSubscription: Subscription;

  private formCoachee: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.formCoachee = this.formBuilder.group({
      pseudo: ['', Validators.required],
      avatar: ['']
    });
  }

  ngAfterViewInit(): void {
    var user: ApiUser = this.authService.getConnectedUser();
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
        Materialize.toast('Profil modifié !', 3000, 'rounded');
        this.onUserObtained(user);
        // this.refresh();
      },
      (error) => {
        console.log('coachee update, error', error);
        //TODO display error
        Materialize.toast('Impossible de modifier le profil', 3000, 'rounded');
      });
  }


  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);

    this.connectedUser = Observable.of(user);
    if (user instanceof Coachee) {
      this.coachee = Observable.of(user);
      this.formCoachee.controls.pseudo.patchValue(user.display_name);
      this.formCoachee.controls.avatar.patchValue(user.avatar_url);
    }

    this.cd.detectChanges();
  }

  refresh() {
    location.reload();
  }
}
