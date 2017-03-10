import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Meeting} from "../model/meeting";
import {AuthService} from "./auth.service";

declare let firebase: any

@Injectable()
export class MeetingsService {

  constructor(private apiService: AuthService) {
  }

  getAllMeetingsForCoacheeId(coacheeId: string): Observable<Meeting[]> {
    let param = [coacheeId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACHEE_ID, param) .map(response => {
      let json: Meeting[] = response.json();
      console.log("getAllMeetingsForCoacheeId, response json : ", json);
      return json;
    });
  }

  getAllMeetingsForCoachId(coachId: string): Observable<Meeting[]> {
    let param = [coachId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACH_ID, param) .map(response => {
      let json: Meeting[] = response.json();
      console.log("getAllMeetingsForCoachId, response json : ", json);
      return json;
    });
  }
}
