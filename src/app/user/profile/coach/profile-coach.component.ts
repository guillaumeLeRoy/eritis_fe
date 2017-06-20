import {AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../../model/Coach";
import {AuthService} from "../../../service/auth.service";
import {ApiUser} from "../../../model/ApiUser";
import {CoachCoacheeService} from "../../../service/coach_coachee.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Coachee} from "../../../model/coachee";
import {HR} from "app/model/HR";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-profile-coach',
  templateUrl: './profile-coach.component.html',
  styleUrls: ['./profile-coach.component.css']
})

export class ProfileCoachComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  iCoach: Coach;

  private user: Observable<Coach | Coachee | HR>;
  private coach: Observable<Coach>;
  private status = 'visiter';
  // private subscriptionGetCoach: Subscription;

  private formCoach: FormGroup;

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
    this.route.params.subscribe(
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
    this.authService.getConnectedUserObservable().subscribe(
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
        console.log("coach updated : ", user);
        //refresh page
        Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
        this.getCoach();
      },
      (error) => {
        console.log('coach update, error', error);
        //TODO display error
        Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
      });
  }

  goToMeetings() {
    window.scrollTo(0, 0);
    this.router.navigate(['/meetings']);
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
  }

  ngOnDestroy(): void {
    // if (this.subscriptionGetCoach) {
    //   this.subscriptionGetCoach.unsubscribe();
    // }

    // if (this.subscriptionConnectUser) {
    //   this.subscriptionConnectUser.unsubscribe();
    // }
  }

}
