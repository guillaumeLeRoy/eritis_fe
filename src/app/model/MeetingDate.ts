/**
 * Created by guillaume on 14/03/2017.
 */

export class MeetingDate {
  id: string
  start_date: number
  end_date: number

  constructor(id: string) {
    this.id = id;
  }
}

export class TempMeetingDate {
  start_date: Date
  end_date: Date


}
