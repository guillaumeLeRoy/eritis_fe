import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../../service/auth.service";
import {Coach} from "../../../../model/Coach";
import {ApiUser} from "../../../../model/ApiUser";
import {Observable} from "rxjs/Observable";
import {Meeting} from "../../../../model/Meeting";
import {HR} from "../../../../model/HR";
import {Coachee} from 'app/model/Coachee';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'er-available-meetings-list',
  templateUrl: './available-meetings-list.component.html',
  styleUrls: ['./available-meetings-list.component.scss']
})
export class AvailableMeetingsListComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: BehaviorSubject<Coach | Coachee | HR>;

  private connectedUserSubscription: Subscription;

  constructor(private authService: AuthService, private cd: ChangeDetectorRef) {
    this.user = new BehaviorSubject(null);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    this.getConnectedUser();
  }

  ngOnDestroy(): void {
    if (this.connectedUserSubscription) {
      this.connectedUserSubscription.unsubscribe();
    }
  }

  getConnectedUser() {
    this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
      (user: Coach) => {
        console.log('getConnectedUser');
        this.onUserObtained(user);
        this.cd.detectChanges();
      }
    );
  }

  private onUserObtained(user: Coach | Coachee | HR) {
    console.log('onUserObtained, user : ', user);
    if (user) {
      this.user.next(user);
    }
  }
}
