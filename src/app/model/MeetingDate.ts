/**
 * Created by guillaume on 14/03/2017.
 */

export class MeetingDate {

  id: string;
  start_date: number;
  end_date: number;

  constructor() {
  }

  static parseFromBE(json: any): MeetingDate {
    let date = new MeetingDate();
    date.id = json.id;
    // convert dates to use milliseconds ....
    date.start_date = json.start_date * 1000;
    date.end_date = json.end_date * 1000;
    return date;
  }

}
