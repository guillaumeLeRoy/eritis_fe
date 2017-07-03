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
import {Headers} from "@angular/http";
import {Subscription} from "rxjs/Subscription";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-profile-coachee',
  templateUrl: 'profile-coachee.component.html',
  styleUrls: ['./profile-coachee.component.scss']
})
export class ProfileCoacheeComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<Coach | Coachee | HR>;
  private coachee: Observable<Coachee>;
  private isOwner = false;
  private isAdmin = false;
  private subscriptionGetCoachee: Subscription;
  private subscriptionGetUser: Subscription;

  private formCoachee: FormGroup;

  private avatarUrl: File;

  private updateUserLoading = false;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef, private formBuilder: FormBuilder, private coachService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.formCoachee = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      avatar: ['', Validators.required]
    });

    this.getCoacheeAndUser();
    // this.getUser();
  }

  getCoacheeAndUser() {
    this.subscriptionGetCoachee = this.route.params.subscribe(
      (params: any) => {
        let coacheeId = params['id'];
        this.isAdmin = params['admin'];

        this.coachService.getCoacheeForId(coacheeId).subscribe(
          (coachee: Coachee) => {
            console.log("gotCoachee", coachee);

            this.setFormValues(coachee);
            this.coachee = Observable.of(coachee);
            console.log("getUser");
            let user = this.authService.getConnectedUser();
            this.user = Observable.of(user);
            this.isOwner = (user instanceof Coachee) && (coachee.email === user.email);
            this.cd.detectChanges();
          }
        );
      }
    )
  }

  getUser() {
    this.subscriptionGetUser = this.authService.getConnectedUserObservable().subscribe(
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

    this.updateUserLoading = true;

    let formData: FormData = new FormData();
    formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);

    let headers = new Headers();
    headers.append('Accept', 'application/json');

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
        this.coachee.take(1).flatMap(
          (coachee: Coachee) => {
            console.log("Upload avatar");
            let params = [coachee.id];

            if (this.avatarUrl != null) {
              return this.authService.put(AuthService.PUT_COACHEE_PROFILE_PICT, params, formData, {headers: headers})
                .map(res => res.json())
                .catch(error => Observable.throw(error))
            }
          }
        ).subscribe(
          data => {
            console.log('Upload avatar success', data);
            console.log("coachee updated : ", user);
            this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            //refresh page
            setTimeout('', 1000);
            window.location.reload();
          }, error => {
            console.log('Upload avatar error', error);
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
          }
        )
      },
      (error) => {
        console.log('coachee update, error', error);
        Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
      });
  }

  filePreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.avatarUrl = event.target.files[0];
      console.log("filePreview", this.avatarUrl);

      let reader = new FileReader();

      reader.onload = function (e: any) {
        $('#avatar-preview').attr('src', e.target.result);
      }

      reader.readAsDataURL(event.target.files[0]);
    }
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
    if (this.subscriptionGetCoachee) {
      console.log("Unsubscribe coach");
      this.subscriptionGetCoachee.unsubscribe();
    }

    if (this.subscriptionGetUser) {
      console.log("Unsubscribe user");
      this.subscriptionGetUser.unsubscribe();
    }
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
