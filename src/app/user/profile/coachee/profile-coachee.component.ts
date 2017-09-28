import {ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {Coachee} from "../../../model/Coachee";
import {AuthService} from "../../../service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {Headers} from "@angular/http";
import {Subscription} from "rxjs/Subscription";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'er-profile-coachee',
  templateUrl: 'profile-coachee.component.html',
  styleUrls: ['./profile-coachee.component.scss']
})
export class ProfileCoacheeComponent implements OnInit, OnDestroy {

  private coachee: Observable<Coachee>;
  private isOwner = false;

  private subscriptionGetCoachee: Subscription;
  private subscriptionGetRoute: Subscription;

  private formCoachee: FormGroup;

  private avatarUrl: File;

  private updateUserLoading = false;

  loading: boolean = true;

  constructor(private authService: AuthService, private cd: ChangeDetectorRef, private formBuilder: FormBuilder, private coachService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log("ngOnInit");

    window.scrollTo(0, 0);

    this.loading = true;

    this.formCoachee = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      avatar: ['', Validators.required]
    });

    this.getCoacheeAndUser();
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");

    if (this.subscriptionGetCoachee) {
      console.log("Unsubscribe coach");
      this.subscriptionGetCoachee.unsubscribe();
    }

    if (this.subscriptionGetRoute) {
      console.log("Unsubscribe subscriptionGetRoute");
      this.subscriptionGetRoute.unsubscribe();
    }
  }

  getCoacheeAndUser() {
    this.subscriptionGetRoute = this.route.params.subscribe(
      (params: any) => {
        let coacheeId = params['id'];

        this.subscriptionGetCoachee = this.coachService.getCoacheeForId(coacheeId).subscribe(
          (coachee: Coachee) => {
            console.log("gotCoachee", coachee);

            this.setFormValues(coachee);
            this.coachee = Observable.of(coachee);
            console.log("getUser");
            let user = this.authService.getConnectedUser();
            this.isOwner = (user instanceof Coachee) && (coachee.email === user.email);
            this.cd.detectChanges();
            this.loading = false;
          }
        );
      }
    )
  }

  setFormValues(coachee: Coachee) {
    this.formCoachee.setValue({
      firstName: coachee.first_name,
      lastName: coachee.last_name,
      avatar: coachee.avatar_url
    });
  }

  submitCoacheeProfilUpdate() {
    console.log("submitCoacheeProfilUpdate");

    this.updateUserLoading = true;

    this.coachee.last().flatMap(
      (coachee: Coachee) => {
        console.log("submitCoacheeProfilUpdate, coachee obtained");
        return this.authService.updateCoacheeForId(coachee.id,
          this.formCoachee.value.firstName,
          this.formCoachee.value.lastName,
          this.formCoachee.value.avatar);
      }
    ).flatMap(
      (coachee: Coachee) => {
        console.log('Upload user success', coachee);

        if (this.avatarUrl != null && this.avatarUrl !== undefined) {
          console.log("Upload avatar");
          let params = [coachee.id];

          let formData: FormData = new FormData();
          formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);

          let headers = new Headers();
          headers.append('Accept', 'application/json');

          return this.authService.put(AuthService.PUT_COACHEE_PROFILE_PICT, params, formData, {headers: headers})
            .map(res => res.json())
            .catch(error => Observable.throw(error))
        }
        else {
          return Observable.of(coachee);
        }
      }
    ).subscribe(
      (coachee: Coachee) => {
        console.log('Upload avatar success', coachee);
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
    );
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
