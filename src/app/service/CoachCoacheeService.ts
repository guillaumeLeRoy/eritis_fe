///<reference path="auth.service.ts"/>
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Coach} from "../model/Coach";

import {Response} from "@angular/http";
import {AuthService} from "./auth.service";
import {PotentialCoachee} from "../model/PotentialCoachee";
import {Coachee} from "../model/Coachee";
import {RhUsageRate} from "../model/UsageRate";
import {PotentialCoach} from "../model/PotentialCoach";
import {PotentialRh} from "../model/PotentialRh";
import {Notif} from "../model/Notif";
import {ApiUser} from "../model/ApiUser";
import {Rh} from "../model/Rh";


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

  getAllCoacheesForRh(rhId: string): Observable<Coachee[]> {
    console.log("getAllCoacheesForRh, start request");
    let param = [rhId];
    return this.apiService.get(AuthService.GET_COACHEES_FOR_RH, param).map(
      (response: Response) => {
        let json: Coachee[] = response.json();
        console.log("getAllCoacheesForRh, response json : ", json);
        return json;
      });
  }

  getAllPotentialCoacheesForRh(rhId: string): Observable<PotentialCoachee[]> {
    console.log("getAllPotentialCoacheesForRh, start request");
    let param = [rhId];
    return this.apiService.get(AuthService.GET_POTENTIAL_COACHEES_FOR_RH, param).map(
      (response: Response) => {
        let json: PotentialCoachee[] = response.json();
        console.log("getAllPotentialCoacheesForRh, response json : ", json);
        return json;
      });
  }

  getPotentialCoachee(token: string): Observable<PotentialCoachee> {
    console.log("getPotentialCoachee, start request");
    let param = [token];
    return this.apiService.getPotentialCoachee(AuthService.GET_POTENTIAL_COACHEE_FOR_TOKEN, param);
  }

  getPotentialCoach(token: string): Observable<PotentialCoach> {
    console.log("getPotentialCoach, start request");
    let param = [token];
    return this.apiService.getPotentialCoachee(AuthService.GET_POTENTIAL_COACH_FOR_TOKEN, param);
  }

  getPotentialRh(token: string): Observable<PotentialRh> {
    console.log("getPotentialRh, start request");
    let param = [token];
    return this.apiService.getPotentialCoachee(AuthService.GET_POTENTIAL_RH_FOR_TOKEN, param);
  }

  getUsageRate(rhId: string): Observable<RhUsageRate> {
    console.log("getUsageRate, start request");
    let param = [rhId];
    return this.apiService.get(AuthService.GET_USAGE_RATE_FOR_RH, param).map(
      (response: Response) => {
        let json: RhUsageRate = response.json();
        console.log("getUsageRate, response json : ", json);
        return json;
      });
  }

  postPotentialCoachee(body: any): Observable<PotentialCoachee> {
    console.log("postPotentialCoachee, start request");
    return this.apiService.post(AuthService.POST_POTENTIAL_COACHEE, null, body).map(
      (response: Response) => {
        let json: PotentialCoachee = response.json();
        console.log("postPotentialCoachee, response json : ", json);
        return json;
      });
  }

  getAllNotificationsForUser(user: ApiUser): Observable<Notif[]> {
    console.log("getAllNotifications, start request");
    let param = [user.id];

    let path = AuthService.GET_COACHEE_NOTIFICATIONS;
    if (user instanceof Coach) {
      path = AuthService.GET_COACH_NOTIFICATIONS;
    } else if (user instanceof  Rh) {
      path = AuthService.GET_RH_NOTIFICATIONS;
    }

    return this.apiService.get(path, param).map(
      (response: Response) => {
        let json: Notif[] = response.json();
        console.log("getAllNotifications, response json : ", json);
        return json;
      });
  }

  readAllNotificationsForUser(user: ApiUser): any {
    console.log("readAllNotifications, start request");

    let param = [user.id];

    let path = AuthService.PUT_COACHEE_NOTIFICATIONS_READ;
    if (user instanceof Coach) {
      path = AuthService.PUT_COACH_NOTIFICATIONS_READ;
    } else if (user instanceof  Rh) {
      path = AuthService.PUT_RH_NOTIFICATIONS_READ;
    }

    return this.apiService.put(path, param, null).map(
      (response: Response) => {
        console.log("readAllNotifications done");
      },
      (error) => {
        console.log('readAllNotifications error', error);
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
