import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Meeting} from "../meeting/meeting";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";

declare let firebase: any

@Injectable()
export class MeetingsService {

  constructor(private apiService: AuthService) {
  }

  getAllMeetingsForCoacheeId(coacheeId: string): Observable<Meeting[]> {
    let param = [coacheeId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACH_ID, param) .map(response => {
      let json: Meeting[] = response.json();
      console.log("getAllMeetingsForCoacheeId, response json : ", json);
      return json;
    });
  }
}
