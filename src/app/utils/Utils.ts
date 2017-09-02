import {MeetingDate} from "../model/MeetingDate";
import {NgbDateStruct} from "@ng-bootstrap/ng-bootstrap";
/**
 * Created by guillaume on 02/09/2017.
 */
export class Utils {

  public static months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  public static days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  static meetingDateToString(date: MeetingDate): string {
    let ngbDate = this.stringToDate(date.start_date);
    return this.ngbDateStructToString(ngbDate);
  }

  static ngbDateStructToString(date: NgbDateStruct): string {
    let newDate = new Date(date.year, date.month - 1, date.day);
    return this.days[newDate.getDay()] + ' ' + newDate.getDay() + ' ' + this.months[newDate.getMonth()];
  }

  static stringToDate(date: string): NgbDateStruct {
    let d = new Date(date);
    return {day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear()};
  }

  static dateToString(date: string): string {
    return this.getHours(date) + ':' + this.getMinutes(date);
  }

  static getHours(date: string): number {
    return (new Date(date)).getHours();
  }

  static getMinutes(date: string): string {
    let m = (new Date(date)).getMinutes();
    if (m === 0) {
      return '00';
    }
    return m.toString();
  }

}
