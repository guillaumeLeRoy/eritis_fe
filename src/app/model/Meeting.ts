import {Coach} from './Coach';
import {Coachee} from './Coachee';
import {MeetingDate} from './MeetingDate';

export class Meeting {

  id: string;

  coach: Coach;

  coachee: Coachee;

  isOpen: boolean;

  agreed_date: MeetingDate;

  created_date: number;

  private constructor() {
  }

  static parseFromBE(json: any): Meeting {
    console.log('parseFromBE, json : ', json);

    let meeting = new Meeting();

    meeting.id = json.id;

    if (json.coach) {
      meeting.coach = Coach.parseCoach(json.coach);
    }

    if (json.coachee) {
      meeting.coachee = Coachee.parseCoachee(json.coachee);
    }

    meeting.isOpen = json.isOpen;

    if (json.agreed_date) {
      meeting.agreed_date = MeetingDate.parseFromBE(json.agreed_date);
    }

    // convert dates to use milliseconds ....
    meeting.created_date = json.created_date * 1000; // todo convert to unix time

    console.log('parseFromBE, Meeting created: ', meeting);

    return meeting;
  }
}
