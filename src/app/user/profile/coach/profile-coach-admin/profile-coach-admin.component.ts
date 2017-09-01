import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminAPIService} from "../../../../service/adminAPI.service";
import {Subscription} from "rxjs/Subscription";
import {Observable} from "rxjs/Observable";
import {Coach} from "../../../../model/Coach";

declare var Materialize: any;
declare var $: any;

@Component({
  selector: 'er-profile-coach-admin',
  templateUrl: './profile-coach-admin.component.html',
  styleUrls: ['./profile-coach-admin.component.scss']
})
export class ProfileCoachAdminComponent implements OnInit, AfterViewInit, OnDestroy {

  private coach: Observable<Coach>;
  private subscriptionGetCoach: Subscription;

  private loading: boolean = true;

  private avatarLoading = false;
  private avatarFile: File;


  constructor(private apiService: AdminAPIService, private router: Router, private cd: ChangeDetectorRef, private route: ActivatedRoute, private adminAPIService: AdminAPIService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loading = true;
    this.getCoach();
  }

  private getCoach() {
    this.subscriptionGetCoach = this.route.params.subscribe(
      (params: any) => {
        let coachId = params['id'];

        this.apiService.getCoach(coachId).subscribe(
          (coach: Coach) => {
            console.log("gotCoach", coach);
            this.coach = Observable.of(coach);
            this.cd.detectChanges();
            this.loading = false;
          }
        );
      }
    )
  }

  ngAfterViewInit(): void {
    console.log("afterViewInit");
    // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
  }

  sendInvite(email: string) {
    console.log('sendInvite, email', email);

    this.apiService.createPotentialCoach(email).subscribe(
      (res: any) => {
        console.log('createPotentialCoach, res', res);
        this.getCoach();
        Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
      }, (error) => {
        console.log('createPotentialCoach, error', error);
        Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
      }
    );
  }

  goToCoachsAdmin() {
    this.router.navigate(['admin/coachs-list']);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGetCoach) {
      console.log("Unsubscribe coach");
      this.subscriptionGetCoach.unsubscribe();
    }
  }

  previewPicture(event: any) {
    console.log('filePreview', event.target.files[0]);

    this.avatarFile = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = function (e: any) {
        $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
      }

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  uploadAvatarPicture() {

    if (this.avatarFile !== null && this.avatarFile !== undefined) {
      console.log("Upload avatar");
      this.avatarLoading = true;

      this.coach.last().flatMap(
        (coach: Coach) => {
          return this.adminAPIService.updateCoachProfilePicture(coach.id, this.avatarFile);
        }
      ).subscribe(
        (res: any) => {
          // refresh page
          console.log("Upload avatar, DONE, res : " + res);
          this.avatarLoading = false;
          window.location.reload();
        }, (error) => {
          Materialize.toast('Impossible de modifier votre photo', 3000, 'rounded');
          this.avatarLoading = false;
        }
      );

    }
  }
}
