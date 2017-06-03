import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {ApiUser} from "../../../model/ApiUser";
import {Rh} from "../../../model/Rh";
import {AuthService} from "../../../service/auth.service";

@Component({
  selector: 'rb-profile-rh',
  templateUrl: './profile-rh.component.html',
  styleUrls: ['./profile-rh.component.css']
})
export class ProfileRhComponent implements OnInit, AfterViewInit,OnDestroy {

  private rh: Observable<Rh>;

  private connectedUser: Observable<ApiUser>;
  private connectedUserSubscription: Subscription;

  private formRh: FormGroup;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) { }


  ngOnInit() {
    this.formRh = this.formBuilder.group({
      pseudo: [''],
      avatar: ['']
    });
  }

  ngAfterViewInit(): void {
    let user: ApiUser = this.authService.getConnectedUser();
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

  submitRhProfileUpdate() {
    console.log("submitProfileUpdate");

    this.rh.last().flatMap(
      (rh: Rh) => {
        console.log("submitProfileUpdate, rh obtained");
        return this.authService.updateCoacheeForId(rh.id, this.formRh.value.pseudo, this.formRh.value.avatar);
      }
    ).subscribe(
      (user: ApiUser) => {
        console.log("rh updated : ", user);
        //refresh page
        this.onUserObtained(user);
      },
      (error) => {
        console.log('rh update, error', error);
        //TODO display error
      });
  }


  private onUserObtained(user: ApiUser) {
    console.log("onUserObtained, user : ", user);

    this.connectedUser = Observable.of(user);
    if (user instanceof Rh) {
      this.rh = Observable.of(user);
    }

    this.cd.detectChanges();
  }

}
