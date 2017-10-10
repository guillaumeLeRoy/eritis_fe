import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Coach} from "../../../model/Coach";

@Component({
  selector: 'er-admin-coach-item',
  templateUrl: './admin-coach-item.component.html',
  styleUrls: ['./admin-coach-item.component.scss']
})
export class AdminCoachItemComponent implements OnInit {

  @Input()
  coach: Coach;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private router: Router) {
  }

  ngOnInit() {
    console.log("AdminCoachItemComponent, ngOnInit : ", this.coach);

  }

  goToCoachProfile(coachId: string) {
    console.log("goToCoachProfile, %s : ", coachId);
    window.scrollTo(0, 0);
    this.router.navigate(['admin/profile/coach', coachId]);
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
