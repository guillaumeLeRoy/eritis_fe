import {Component, Input, OnInit} from '@angular/core';
import {Coach} from "../../../model/Coach";
import {Router} from "@angular/router";
import {AdminAPIService} from "../../../service/adminAPI.service";

declare var Materialize: any;

@Component({
  selector: 'rb-possible-coach-item',
  templateUrl: './possible-coach-item.component.html',
  styleUrls: ['./possible-coach-item.component.scss']
})
export class PossibleCoachItemComponent implements OnInit {

  @Input()
  coach: Coach

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private router: Router, private apiService: AdminAPIService) {
  }

  ngOnInit() {
    console.log("PossibleCoachItemComponent, ngOnInit : ", this.coach);

  }

  goToCoachProfile(coachId: String) {
    window.scrollTo(0, 0);
    this.router.navigate(['/profile_coach', '1', coachId]);
  }

  sendInvite(email: string) {
    console.log('sendInvite, email', email);

    this.apiService.createPotentialCoach(email).subscribe(
      (res: any) => {
        console.log('createPotentialCoach, res', res);
        Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
      }, (error) => {
        console.log('createPotentialCoach, error', error);
        Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
      }
    );
  }

  printDateString(date: string) {
    return this.getDate(date);
  }

  getHours(date: string) {
    return (new Date(date)).getHours();
  }

  getMinutes(date: string) {
    let m = (new Date(date)).getMinutes();
    if (m === 0)
      return '00';
    return m;
  }

  getDate(date: string): string {
    return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
  }

}
