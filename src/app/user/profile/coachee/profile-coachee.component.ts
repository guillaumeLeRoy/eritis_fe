import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {Coachee} from "../../../model/Coachee";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/ApiUser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Coach} from "../../../model/Coach";
import {ActivatedRoute, Router} from "@angular/router";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {HR} from "../../../model/HR";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-profile-coachee',
  templateUrl: 'profile-coachee.component.html',
  styleUrls: ['profile-coachee.component.css']
})
export class ProfileCoacheeComponent implements OnInit, AfterViewInit, OnDestroy {

  // private connectedUser: Observable<ApiUser>;
  // private connectedUserSubscription: Subscription;

  private user: Observable<Coach | Coachee | HR>;
  private coachee: Observable<Coachee>;
  private status = 'visiter';
  // private subscriptionGetCoach: Subscription;

  private formCoachee: FormGroup;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef, private formBuilder: FormBuilder, private coachService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.formCoachee = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      avatar: ['', Validators.required]
    });

    this.getCoachee();
    this.getUser();
  }

  getCoachee() {
    this.route.params.subscribe(
      (params: any) => {
        let coacheeId = params['id'];
        this.status = params['status'];

        this.coachService.getCoacheeForId(coacheeId).subscribe(
          (coachee: Coachee) => {
            console.log("gotCoachee", coachee);

            this.setFormValues(coachee);
            this.coachee = Observable.of(coachee);
            this.cd.detectChanges();
          }
        );
      }
    )
  }

  getUser() {
    this.authService.getConnectedUserObservable().subscribe(
      (user: Coach | Coachee | HR) => {
        console.log('getConnectedUser : ' + user);

        this.user = Observable.of(user);
        this.cd.detectChanges()
      }
    );
  }

  setFormValues(coachee: Coachee) {
    this.formCoachee.setValue({
      firstName: coachee.firstName,
      lastName: coachee.lastName,
      avatar: coachee.avatar_url
    });
  }

  submitCoacheeProfilUpdate() {
    console.log("submitCoacheeProfilUpdate");
    this.coachee.last().flatMap(
      (coachee: Coachee) => {
        console.log("submitCoacheeProfilUpdate, coachee obtained");
        return this.authService.updateCoacheeForId(coachee.id,
          this.formCoachee.value.firstName,
          this.formCoachee.value.lastName,
          this.formCoachee.value.avatar);
      }
    ).subscribe(
      (user: ApiUser) => {
        console.log("coachee updated : ", user);
        //refresh page
        Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
        this.getCoachee();
      },
      (error) => {
        console.log('coachee update, error', error);
        //TODO display error
        Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
      });
  }

  goToMeetings() {
    window.scrollTo(0, 0);
    this.router.navigate(['/meetings']);
  }

  goToCoacheesAdmin() {
    window.scrollTo(0, 0);
    this.router.navigate(['admin/coachees-list']);
  }

  ngAfterViewInit(): void {
    // let user: ApiUser = this.authService.getConnectedUser();
    // console.log("ngAfterViewInit, user : ", user);
    // this.onUserObtained(user);
    //
    // this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
    //   (user: ApiUser) => {
    //     console.log("getConnectedUser");
    //     this.onUserObtained(user);
    //   }
    // );
  }

  ngOnDestroy(): void {
    // if (this.connectedUserSubscription) {
    //   this.connectedUserSubscription.unsubscribe();
    // }
  }

  // submitCoacheeProfileUpdate() {
  //   console.log("submitProfileUpdate");
  //
  //   this.coachee.last().flatMap(
  //     (coachee: Coachee) => {
  //       console.log("submitProfileUpdate, coache obtained");
  //       return this.authService.updateCoacheeForId(coachee.id, this.formCoachee.value.pseudo, this.formCoachee.value.avatar);
  //     }
  //   ).subscribe(
  //     (user: ApiUser) => {
  //       console.log("coachee updated : ", user);
  //       //refresh page
  //       this.onUserObtained(user);
  //     },
  //     (error) => {
  //       console.log('coachee update, error', error);
  //       //TODO display error
  //     });
  // }


  // private onUserObtained(user: ApiUser) {
  //   console.log("onUserObtained, user : ", user);
  //
  //   this.connectedUser = Observable.of(user);
  //   if (user instanceof Coachee) {
  //     this.coachee = Observable.of(user);
  //   }
  //
  //   this.cd.detectChanges();
  // }
}
