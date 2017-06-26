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
          this.formCoach.value.avatar,
          this.formCoach.value.description);
      }
    ).subscribe(
      (user: ApiUser) => {
        this.coach.take(1).flatMap(
          (coach: Coach) => {
            console.log("Upload avatar");
            let params = [coach.id];
            return this.authService.put(AuthService.PUT_COACH_PROFILE_PICT, params, formData, {headers: headers})
              .map(res => res.json())
              .catch(error => Observable.throw(error))
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

  fileChange(event) {
    let fileList: FileList = event.target.files;

    console.log('fileChange, fileUrl : ', event.target.location);
    console.log('fileChange, fileList : ', fileList);

    if (fileList.length > 0) {
      let file: File = fileList[0];

      this.avatarUrl = file;

      //Update form value
      this.formCoach.setValue({
        firstName: this.formCoach.value.firstName,
        lastName: this.formCoach.value.lastName,
        description: this.formCoach.value.description,
        avatar: file.name
      });
      // TODO display avatar preview

      console.log('fileChange, file : ', file);
    }
  }

  goToMeetings() {
    window.scrollTo(0, 0);
    this.router.navigate(['/meetings']);
  }

  goToCoachsAdmin() {
    window.scrollTo(0, 0);
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
