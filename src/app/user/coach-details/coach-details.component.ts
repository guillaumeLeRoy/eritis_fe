import {Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy, Input} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {Coach} from "../../model/Coach";
import {AuthService} from "../../service/auth.service";
import {ApiUser} from "../../model/ApiUser";
import {MeetingsService} from "../../service/meetings.service";
import {CoachCoacheeService} from "../../service/coach_coachee.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Coachee} from "../../model/coachee";
import {Rh} from "app/model/Rh";

declare var $: any;
declare var Materialize: any;

@Component({
  selector: 'rb-coach-details',
  templateUrl: './coach-details.component.html',
  styleUrls: ['./coach-details.component.css']
})

export class CoachDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input()
  iCoach: Coach;

  private user: Observable<Coach | Coachee | Rh>;
  private coach: Observable<Coach>;
  private status = 'visiter';
  // private subscriptionGetCoach: Subscription;

  private formCoach: FormGroup;

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef, private formBuilder: FormBuilder,  private coachService: CoachCoacheeService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.formCoach = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
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
      (user: Coach | Coachee | Rh) => {
        console.log('getConnectedUser : ' + user);

        this.user = Observable.of(user);
        this.cd.detectChanges()
      }
    );
  }

  setFormValues(coach: Coach) {
    this.formCoach.setValue({
      name: coach.display_name,
      surname: coach.display_name,
      avatar: coach.avatar_url,
      description: coach.description
    });
  }

  submitCoachProfilUpdate() {
    console.log("submitCoachProfilUpdate");
    this.coach.last().flatMap(
      (coach: Coach) => {
        console.log("submitCoachProfilUpdate, coach obtained");
        return this.authService.updateCoachForId(coach.id, this.formCoach.value.name,
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
