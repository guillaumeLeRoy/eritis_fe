import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {ApiUser} from "../../../model/ApiUser";
import {HR} from "../../../model/HR";
import {AuthService} from "../../../service/auth.service";
import {Coach} from "app/model/Coach";
import {Coachee} from "app/model/Coachee";
import {ActivatedRoute, Router} from "@angular/router";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {Headers} from "@angular/http"

declare var Materialize: any;
declare var $: any;

@Component({
  selector: 'rb-profile-rh',
  templateUrl: './profile-rh.component.html',
  styleUrls: ['./profile-rh.component.scss']
})
export class ProfileRhComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<Coach | Coachee | HR>;
  private rh: Observable<Coach>;
  private mrh: Coach;
  private subscriptionGetRh: Subscription;
  private subscriptionGetUser: Subscription;

  private isOwner = false;

  private formRh: FormGroup;

  private avatarUrl: File;

  private updateUserLoading = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private cd: ChangeDetectorRef, private route: ActivatedRoute, private coachService: CoachCoacheeService, private router: Router) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.formRh = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });

    this.getRhAndUser();
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
    // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
  }

  private getRhAndUser() {
    console.log("getRh");

    this.subscriptionGetRh = this.route.params.subscribe(
      (params: any) => {
        let rhId = params['id'];

        this.coachService.getRhForId(rhId).subscribe(
          (rh: Coach) => {
            console.log("gotRh", rh);

            this.setFormValues(rh);
            this.mrh = rh;
            this.rh = Observable.of(rh);
            console.log("getUser");
            let user = this.authService.getConnectedUser();
            this.user = Observable.of(user);
            this.isOwner = (user instanceof HR) && (rh.email === user.email);
            this.cd.detectChanges();

          }, (error) => {
            console.log('getRh, error', error);
          }
        );
      }
    )
  }

  setFormValues(rh: Coach) {
    this.formRh.setValue({
      firstName: rh.firstName,
      lastName: rh.lastName
    });
  }

  submitRhProfilUpdate() {
    console.log("submitRhProfilUpdate");

    this.updateUserLoading = true;

    let formData: FormData = new FormData();
    formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);

    let headers = new Headers();
    headers.append('Accept', 'application/json');

    this.rh.last().flatMap(
      (rh: HR) => {
        console.log("submitRhProfilUpdate, rh obtained");
        return this.authService.updateRhForId(rh.id,
          this.formRh.value.firstName,
          this.formRh.value.lastName,
          this.mrh.avatar_url);
      }
    ).subscribe(
      (user: ApiUser) => {
        this.rh.take(1).flatMap(
          (rh: HR) => {
            console.log("Upload avatar");
            let params = [rh.id];

            if (this.avatarUrl != null) {
              return this.authService.put(AuthService.PUT_RH_PROFILE_PICT, params, formData, {headers: headers})
                .map(res => res.json())
                .catch(error => Observable.throw(error))
            }
          }
        ).subscribe(
          data => {
            console.log('Upload avatar success', data);
            console.log("rh updated : ", user);
            this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            //refresh page
            setTimeout('', 1000);
            window.location.reload();

          }, error => {
            console.log('Upload avatar error', error);
            this.updateUserLoading = false;
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
          }
        )
      },
      (error) => {
        console.log('rh update, error', error);
        this.updateUserLoading = false;
        Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
      });
  }

  filePreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.avatarUrl = event.target.files[0];
      console.log("filePreview", this.avatarUrl);

      let reader = new FileReader();

      reader.onload = function (e: any) {
        // $('#avatar-preview').attr('src', e.target.result);
        $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  goToMeetings() {
    this.router.navigate(['/meetings']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetRh) {
      console.log("Unsubscribe rh");
      this.subscriptionGetRh.unsubscribe();
    }

    if (this.subscriptionGetUser) {
      console.log("Unsubscribe user");
      this.subscriptionGetUser.unsubscribe();
    }
  }

}
