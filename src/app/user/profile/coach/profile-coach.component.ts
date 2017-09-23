import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, EventEmitter} from "@angular/core";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../../model/Coach";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/ApiUser";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Coachee} from "../../../model/Coachee";
import {HR} from "app/model/HR";
import {Headers} from "@angular/http"
import {Subscription} from "rxjs/Subscription";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-profile-coach',
  templateUrl: './profile-coach.component.html',
  styleUrls: ['./profile-coach.component.scss']
})

export class ProfileCoachComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: Observable<Coach | Coachee | HR>;
  private coach: Observable<Coach>;
  private mcoach: Coach;
  private subscriptionGetCoach: Subscription;
  private subscriptionGetUser: Subscription;

  private isOwner = false;

  private formCoach: FormGroup;

  private avatarUrl: File;

  private updateUserLoading = false;

  loading: boolean = true;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef, private formBuilder: FormBuilder, private coachService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.loading = true;

    this.formCoach = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      description: ['', Validators.required],
    });

    // this.getUser();
    this.getCoachAndUser();
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
    // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
  }

  private getCoachAndUser() {
    console.log("getCoach");

    this.subscriptionGetCoach = this.route.params.subscribe(
      (params: any) => {
        let coachId = params['id'];

        this.coachService.getCoachForId(coachId).subscribe(
          (coach: Coach) => {
            console.log("gotCoach", coach);

            this.setFormValues(coach);
            this.mcoach = coach;
            this.coach = Observable.of(coach);
            console.log("getUser");
            let user = this.authService.getConnectedUser();
            this.user = Observable.of(user);
            this.isOwner = (user instanceof Coach) && (coach.email === user.email);
            this.cd.detectChanges();
            this.loading  = false;

          }, (error) => {
            console.log('getCoach, error', error);
          }
        );
      }
    )
  }

  // private getUser() {
  //   console.log("getUser");
  //
  //   // this.subscriptionGetUser = this.authService.getConnectedUserObservable().subscribe(
  //   //   (user: Coach | Coachee | HR) => {
  //   //     console.log('gotUser : ' + user);
  //   //
  //   //     this.user = Observable.of(user);
  //   //     this.cd.detectChanges()
  //   //   }, (error) => {
  //   //     console.log('getUser, error', error);
  //   //   }
  //   // );
  //
  //   this.user = Observable.of(this.authService.getConnectedUser());
  // }

  setFormValues(coach: Coach) {
    this.formCoach.setValue({
      firstName: coach.first_name,
      lastName: coach.last_name,
      description: coach.description
    });
  }

  submitCoachProfilUpdate() {
    console.log("submitCoachProfilUpdate");

    this.updateUserLoading = true;

    this.coach.last().flatMap(
      (coach: Coach) => {
        console.log("submitCoachProfilUpdate, coach obtained");
        return this.authService.updateCoachForId(coach.id,
          this.formCoach.value.firstName,
          this.formCoach.value.lastName,
          this.formCoach.value.description,
          this.mcoach.avatar_url);
      }
    ).flatMap(
      (coach: Coach) => {
        console.log('Upload user success', coach);

        if (this.avatarUrl !== null && this.avatarUrl !== undefined) {
          console.log("Upload avatar");
          let params = [this.mcoach.id];

          let formData: FormData = new FormData();
          formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);

          let headers = new Headers();
          headers.append('Accept', 'application/json');

          //todo call coachCoacheeAPIservice
          return this.authService.put(AuthService.PUT_COACH_PROFILE_PICT, params, formData, {headers: headers})
            .map(res => res.json())
            .catch(error => Observable.throw(error))
        } else {
          return Observable.of(coach);
        }
      }
    ).subscribe(
      (coach: Coach) => {
        console.log('Upload avatar success', coach);
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

  goToMeetings() {
    this.router.navigate(['/meetings']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetCoach) {
      console.log("Unsubscribe coach");
      this.subscriptionGetCoach.unsubscribe();
    }

    if (this.subscriptionGetUser) {
      console.log("Unsubscribe user");
      this.subscriptionGetUser.unsubscribe();
    }
  }

}
