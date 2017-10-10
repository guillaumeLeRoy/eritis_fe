import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HR} from "../../../model/HR";

@Component({
  selector: 'er-admin-rh-item',
  templateUrl: './admin-rh-item.component.html',
  styleUrls: ['./admin-rh-item.component.scss']
})
export class AdminRhItemComponent implements OnInit {

  @Input()
  rh: HR;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  constructor(private router: Router) { }

  ngOnInit() {
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

  goToRhProfile() {
    this.router.navigate(['admin/profile/rh', this.rh.id])
  }
}
