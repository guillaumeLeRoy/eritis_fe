import {Component, Input, OnInit} from '@angular/core';
import {Coachee} from "../../model/Coachee";
import {Router} from "@angular/router";

@Component({
  selector: 'rb-coachee-item',
  templateUrl: './coachee-item.component.html',
  styleUrls: ['./coachee-item.component.css']
})
export class CoacheeItemComponent implements OnInit {

  @Input()
  coachee: Coachee;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToCoacheeProfile(coacheeId: String) {
    window.scrollTo(0, 0);
    this.router.navigate(['/profile_coachee', 'admin', coacheeId]);
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
