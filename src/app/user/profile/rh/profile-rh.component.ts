import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {HR} from "../../../model/HR";
import {AuthService} from "../../../service/auth.service";
import {ActivatedRoute} from "@angular/router";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {Headers} from "@angular/http";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

declare var Materialize: any;
declare var $: any;

@Component({
  selector: 'er-profile-rh',
  templateUrl: './profile-rh.component.html',
  styleUrls: ['./profile-rh.component.scss']
})
export class ProfileRhComponent implements OnInit, OnDestroy {

  private rhObs: BehaviorSubject<HR>;

  private subscriptionGetRh: Subscription;
  private subscriptionGetRoute: Subscription;

  private isOwner = false;

  private formRh: FormGroup;

  private avatarUrl: File;

  private updateUserLoading = false;

  loading: boolean = true;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private route: ActivatedRoute, private coachService: CoachCoacheeService) {
    this.rhObs = new BehaviorSubject(null);
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.loading = true;

    this.formRh = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.getRhAndUser();
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetRh) {
      console.log("Unsubscribe rh");
      this.subscriptionGetRh.unsubscribe();
    }

    if (this.subscriptionGetRoute) {
      console.log("Unsubscribe user");
      this.subscriptionGetRoute.unsubscribe();
    }
  }

  private getRhAndUser() {
    console.log("getRh");

    this.subscriptionGetRoute = this.route.params.subscribe(
      (params: any) => {
        let rhId = params['id'];

        this.subscriptionGetRh = this.coachService.getRhForId(rhId).subscribe(
          (rh: HR) => {
            console.log("gotRh", rh);

            this.setFormValues(rh);
            console.log("getUser");
            let user = this.authService.getConnectedUser();
            this.isOwner = (user instanceof HR) && (rh.email === user.email);
            // this.cd.detectChanges();
            this.loading = false;
            this.rhObs.next(rh);
          }, (error) => {
            console.log('getRh, error', error);
            this.loading = false;
          }
        );
      }
    )
  }

  setFormValues(rh: HR) {
    this.formRh.setValue({
      firstName: rh.first_name,
      lastName: rh.last_name,
      description: rh.description,
    });
  }

  submitRhProfilUpdate() {
    console.log("submitRhProfilUpdate");

    this.updateUserLoading = true;

    this.rhObs.asObservable().take(1).flatMap(
      (rh: HR) => {
        console.log("submitRhProfilUpdate, rh obtained");
        return this.authService.updateRhForId(rh.id,
          this.formRh.value.firstName,
          this.formRh.value.lastName,
          this.formRh.value.description,
          rh.avatar_url);
      }
    ).flatMap(
      (rh: HR) => {
        if (this.avatarUrl != null && this.avatarUrl !== undefined) {
          console.log("Upload avatar");
          let params = [rh.id];

          let formData: FormData = new FormData();
          formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);

          let headers = new Headers();
          headers.append('Accept', 'application/json');

          return this.authService.put(AuthService.PUT_HR_PROFILE_PICT, params, formData, {headers: headers})
            .map(res => res.json())
            .catch(error => Observable.throw(error))
        }
        else {
          return Observable.of(rh);
        }
      }
    ).subscribe(
      (rh: HR) => {
        console.log('Upload avatar success', rh);
        this.updateUserLoading = false;
        Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
        //refresh page
        setTimeout('', 1000);
        // window.location.reload();
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


}
