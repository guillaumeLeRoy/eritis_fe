import {Coach} from "./Coach";
import {Coachee} from "./Coachee";
import {MeetingDate} from "./MeetingDate";
export class Meeting {
  id: string
  coach: Coach
  coachee: Coachee
  isOpen: boolean
  agreed_date: MeetingDate

  constructor(id: string) {
    this.id = id;
  }
}
