import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {Coach} from "../../model/Coach";
import {Router} from "@angular/router";

@Component({
  selector: 'rb-coach-item',
  templateUrl: './coach-item.component.html',
  styleUrls: ['./coach-item.component.scss']
})
export class CoachItemComponent implements OnInit {

  @Input()
  coach: Coach

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private router: Router) {
  }

  ngOnInit() {
    console.log("CoachItemComponent, ngOnInit : ", this.coach);

  }

  goToCoachProfile(coachId: String) {
    window.scrollTo(0, 0);
    this.router.navigate(['/profile_coach', 'admin', coachId]);
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
