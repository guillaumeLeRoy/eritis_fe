import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
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
import {runInThisContext} from "vm";

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
  private status = 'visiter';
  private subscriptionGetCoach: Subscription;
  private subscriptionGetUser: Subscription;

  private formCoach: FormGroup;

  private avatarUrl: File;

  private updateUserLoading = false;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef, private formBuilder: FormBuilder, private coachService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.formCoach = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      avatar: ['', Validators.required],
      description: ['', Validators.required],
    });

    this.getCoach();
    this.getUser();
  }

  getCoach() {
    this.subscriptionGetCoach = this.route.params.subscribe(
      (params: any) => {
        let coachId = params['id'];
        this.status = params['status'];

        this.coachService.getCoachForId(coachId).subscribe(
          (coach: Coach) => {
            console.log("gotCoach", coach);

            this.setFormValues(coach);
            this.coach = Observable.of(coach);
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

  setFormValues(coach: Coach) {
    this.formCoach.setValue({
      firstName: coach.firstName,
      lastName: coach.lastName,
      avatar: coach.avatar_url,
      description: coach.description
    });
  }

  submitCoachProfilUpdate() {
    console.log("submitCoachProfilUpdate");

    this.updateUserLoading = true;

    let formData: FormData = new FormData();
    formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);

    let headers = new Headers();
    headers.append('Accept', 'application/json');

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
        this.coach.take(1).flatMap(
          (coach: Coach) => {
            console.log("Upload avatar");
            let params = [coach.id];
            if (this.avatarUrl != null) {
              return this.authService.put(AuthService.PUT_COACH_PROFILE_PICT, params, formData, {headers: headers})
                .map(res => res.json())
                .catch(error => Observable.throw(error))
            }
          }
        ).subscribe(
          data => {
            console.log('Upload avatar success', data);
            console.log("coach updated : ", user);
            //refresh page
            this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            this.getCoach();
          }, error => {
            console.log('Upload avatar error', error);
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
          }
        )
      },
      (error) => {
        console.log('coach update, error', error);
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
    this.router.navigate(['/meetings']);
  }

  goToCoachsAdmin() {
    this.router.navigate(['admin/coachs-list']);
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
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
