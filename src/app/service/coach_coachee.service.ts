///<reference path="auth.service.ts"/>
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Coach} from "../model/Coach";
import {Headers, Response} from "@angular/http";
import {AuthService} from "./auth.service";
import {PotentialCoachee} from "../model/PotentialCoachee";
import {Coachee} from "../model/Coachee";
import {HRUsageRate} from "../model/HRUsageRate";
import {PotentialCoach} from "../model/PotentialCoach";
import {PotentialRh} from "../model/PotentialRh";
import {Notif} from "../model/Notif";
import {ApiUser} from "../model/ApiUser";
import {HR} from "../model/HR";
import {CoacheeObjective} from "../model/CoacheeObjective";

@Injectable()
export class CoachCoacheeService {

  constructor(private apiService: AuthService) {
  }

  /* Coach endpoints */

  getAllCoachs(isAdmin?: boolean): Observable<Coach[]> {
    console.log("getAllCoachs, start request");

    return this.apiService.get(AuthService.GET_COACHS, null, isAdmin).map(
      (res: Response) => {
        let resArray: Array<any> = res.json();

        let coachs = new Array<Coach>();
        for (let c of resArray) {
          coachs.push(Coach.parseCoach(c));
        }
        return coachs;
      });
  }

  getCoachForId(coachId: string, isAdmin?: boolean): Observable<Coach> {
    console.log("getCoachForId, start request");

    let params = [coachId]
    return this.apiService.get(AuthService.GET_COACH_FOR_ID, params, isAdmin).map(
      (response: Response) => {
        console.log("getCoachForId, got coach", response);
        return Coach.parseCoach(response.json());
      }, (error) => {
        console.log("getCoachForId, error", error);
      });
  }

  updateCoachProfilePicture(coachId: string, avatarFile: File): Observable<string> {
    let params = [coachId];

    let formData: FormData = new FormData();
    formData.append('uploadFile', avatarFile, avatarFile.name);

    let headers = new Headers();
    headers.append('Accept', 'application/json');

    return this.apiService.put(AuthService.PUT_COACH_PROFILE_PICT, params, formData, {headers: headers}, true)
      .map(res => res.json());
  }

  /* Coachee endpoints */

  getCoachees(isAdmin?: boolean): Observable<Array<Coachee>> {
    return this.apiService.get(AuthService.GET_COACHEES, null, isAdmin).map(
      (res: Response) => {
        let resArray: Array<any> = res.json();

        let coachees = new Array<Coachee>();
        for (let c of resArray) {
          coachees.push(Coachee.parseCoachee(c));
        }
        return coachees;
      }
    );
  }

  getCoacheeForId(coacheeId: string, isAdmin?: boolean): Observable<Coachee> {
    console.log("getCoacheeForId, start request");

    let params = [coacheeId]
    return this.apiService.get(AuthService.GET_COACHEE_FOR_ID, params, isAdmin).map(
      (response: Response) => {
        console.log("getCoacheeForId, got coachee", response);
        return Coachee.parseCoachee(response.json());
      }, (error) => {
        console.log("getCoacheeForId, error", error);
      });
  }

  /* HR endpoints */

  getRhs(isAdmin?: boolean): Observable<Array<HR>> {
    return this.apiService.get(AuthService.GET_HRS, null, isAdmin).map(
      (res: Response) => {
        let resArray: Array<any> = res.json();

        let hrs = new Array<HR>();
        for (let c of resArray) {
          hrs.push(HR.parseRh(c));
        }
        return hrs;
      }
    );
  }


  getRhForId(rhId: string, isAdmin?: boolean): Observable<HR> {
    console.log("getRhForId, start request");

    let params = [rhId]
    return this.apiService.get(AuthService.GET_HR_FOR_ID, params, isAdmin).map(
      (response: Response) => {
        console.log("getRhForId, got rh", response);
        let rh: HR = HR.parseRh(response.json());
        return rh;
      }, (error) => {
        console.log("getRhForId, error", error);
      });
  }

  getAllCoacheesForRh(rhId: string, isAdmin?: boolean): Observable<Coachee[]> {
    console.log("getAllCoacheesForRh, start request");
    let params = [rhId];
    return this.apiService.get(AuthService.GET_COACHEES_FOR_HR, params, isAdmin).map(
      (response: Response) => {
        let json: any[] = response.json();

        let coachees: Coachee[] = new Array;
        for (let jsonCoachee of json) {
          coachees.push(Coachee.parseCoachee(jsonCoachee));
        }
        console.log("getAllCoacheesForRh, coachees : ", coachees);
        return coachees;
      });
  }

  getAllPotentialCoacheesForRh(rhId: string, isAdmin?: boolean): Observable<PotentialCoachee[]> {
    console.log("getAllPotentialCoacheesForRh, start request");
    let params = [rhId];
    return this.apiService.get(AuthService.GET_POTENTIAL_COACHEES_FOR_HR, params, isAdmin).map(
      (response: Response) => {
        let json: PotentialCoachee[] = response.json();
        console.log("getAllPotentialCoacheesForRh, response json : ", json);
        return json;
      });
  }

  getUsageRate(rhId: string): Observable<HRUsageRate> {
    console.log("getUsageRate, start request");
    let param = [rhId];
    return this.apiService.get(AuthService.GET_USAGE_RATE_FOR_HR, param).map(
      (response: Response) => {
        let json: HRUsageRate = response.json();
        console.log("getUsageRate, response json : ", json);
        return json;
      });
  }

  /**
   * Add a new objective to this coachee.
   * @param coacheeId
   * @param rhId
   * @param objective
   */
  addObjectiveToCoachee(rhId: string, coacheeId: string, objective: string): Observable<CoacheeObjective> {
    let param = [rhId, coacheeId];

    let body = {
      "objective": objective
    }

    return this.apiService.post(AuthService.POST_COACHEE_OBJECTIVE, param, body).map(
      (response: Response) => {
        let json: CoacheeObjective = response.json();
        console.log("POST coachee new objective, response json : ", json);
        return json;
      });
  }

  /* Potentials endpoints */

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
    return this.apiService.getPotentialRh(AuthService.GET_POTENTIAL_RH_FOR_TOKEN, param);
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
    } else if (user instanceof HR) {
      path = AuthService.GET_HR_NOTIFICATIONS;
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
    } else if (user instanceof HR) {
      path = AuthService.PUT_HR_NOTIFICATIONS_READ;
    }

    return this.apiService.put(path, param, null).map(
      (response: Response) => {
        console.log("readAllNotifications done");
      },
      (error) => {
        console.log('readAllNotifications error', error);
      });
  }


}
