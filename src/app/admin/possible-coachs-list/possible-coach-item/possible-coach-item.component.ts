import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";
import {AdminAPIService} from "../../../service/adminAPI.service";
import {PossibleCoach} from "../../../model/PossibleCoach";

declare var Materialize: any;

@Component({
  selector: 'rb-possible-coach-item',
  templateUrl: './possible-coach-item.component.html',
  styleUrls: ['./possible-coach-item.component.scss']
})
export class PossibleCoachItemComponent implements OnInit {

  @Output()
  coachAdded = new EventEmitter();

  @Input()
  coach: PossibleCoach

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private router: Router, private apiService: AdminAPIService) {
  }

  ngOnInit() {
    console.log("PossibleCoachItemComponent, ngOnInit : ", this.coach);

  }

  goToCoachProfile(coachId: string) {
    this.router.navigate(['admin/profile/possible-coach', coachId]);
  }

  sendInvite(email: string) {
    console.log('sendInvite, email', email);

    this.apiService.createPotentialCoach(email).subscribe(
      (res: any) => {
        console.log('createPotentialCoach, res', res);
        this.coachAdded.emit(null);
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
