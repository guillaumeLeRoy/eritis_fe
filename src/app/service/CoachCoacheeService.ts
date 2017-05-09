import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Coach} from "../model/Coach";

import {Response} from "@angular/http";
import {AuthService} from "./auth.service";


@Injectable()
export class CoachCoacheeService {

  constructor(private apiService: AuthService) {
  }

  getAllCoachs(): Observable<Coach[]> {
    console.log("getAllCoachs, start request");

    return this.apiService.get(AuthService.GET_COACHS, null).map(
      (response: Response) => {
        let json = response.json();
        console.log("getAllCoachs, response json : ", json);
        return json;
      });
  }


  // updateCoacheeSelectedCoach(coacheeId: string, coachId: string): Observable<Coach | Coachee> {
  //   console.log("updateCoacheeSelectedCoach, coacheeId", coacheeId);
  //   console.log("updateCoacheeSelectedCoach, coachId", coachId);
  //
  //   let params = [coacheeId, coachId];
  //   return this.apiService.put(AuthService.UPDATE_COACHEE_SELECTED_COACH, params, null).map(
  //     (response: Response) => {
  //       return this.onUserResponse(response);
  //     });
  // }

}
