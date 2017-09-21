import {Injectable} from "@angular/core";
import {Headers, Http, RequestOptionsArgs, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/Coachee";
import {AuthService} from "./auth.service";
import {Admin} from "../model/Admin";
import {HR} from "../model/HR";
import {PossibleCoach} from "../model/PossibleCoach";
import {Meeting} from "../model/Meeting";

@Injectable()
export class AdminAPIService {

  constructor(private httpService: Http) {
    console.log("ctr done");
  }

  createPotentialCoach(email: string) {
    let body = {
      "email": email,
    };
    return this.post(AuthService.POST_POTENTIAL_COACH, null, body).map(
      (res: Response) => {
        let potentialCoach: any = res.json();
        return potentialCoach;
      }
    );
  }

  createPotentialRh(body: any) {
    return this.post(AuthService.POST_POTENTIAL_RH, null, body).map(
      (res: Response) => {
        let potentialRh: any = res.json();
        return potentialRh;
      }
    );
  }

  getAdmin(): Observable<Admin> {
    return this.get(AuthService.GET_ADMIN, null).map(
      (res: Response) => {
        let admin: Admin = res.json();
        return admin;
      }
    );
  }

  getCoachs(): Observable<Array<Coach>> {
    return this.get(AuthService.ADMIN_GET_COACHS, null).map(
      (res: Response) => {
        let resArray: Array<any> = res.json();

        let coachs = new Array<Coach>();
        for (let c of resArray) {
          coachs.push(Coach.parseCoach(c));
        }
        return coachs;
      }
    );
  }

  getCoach(id: string): Observable<Coach> {
    let params = [id];
    return this.get(AuthService.ADMIN_GET_COACH, params).map(
      (res: Response) => {
        console.log('getCoach', res.json());
        let coach: Coach = Coach.parseCoach(res.json());
        return coach;
      }
    );
  }

  getCoachees(): Observable<Array<Coachee>> {
    return this.get(AuthService.ADMIN_GET_COACHEES, null).map(
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

  getCoachee(id: string): Observable<Coachee> {
    let params = [id];
    return this.get(AuthService.ADMIN_GET_COACHEE, params).map(
      (res: Response) => {
        return Coachee.parseCoachee(res.json());
      }
    );
  }

  getRhs(): Observable<Array<HR>> {
    return this.get(AuthService.ADMIN_GET_RHS, null).map(
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

  getRh(id: string): Observable<HR> {
    let params = [id];
    return this.get(AuthService.ADMIN_GET_RH, params).map(
      (res: Response) => {
        return HR.parseRh(res.json());
      }
    );
  }

  getPossibleCoachs(): Observable<Array<PossibleCoach>> {
    return this.get(AuthService.ADMIN_GET_POSSIBLE_COACHS, null).map(
      (res: Response) => {
        let possibleCoachs: Array<PossibleCoach> = res.json();
        return possibleCoachs;
      }
    );
  }

  getPossibleCoach(id: string): Observable<PossibleCoach> {
    let params = [id];
    return this.get(AuthService.ADMIN_GET_POSSIBLE_COACH, params).map(
      (res: Response) => {
        let possibleCoach: PossibleCoach = res.json();
        return possibleCoach;
      }
    );
  }

  updateCoachProfilePicture(coachId: string, avatarFile: File): Observable<string> {
    let params = [coachId];

    let formData: FormData = new FormData();
    formData.append('uploadFile', avatarFile, avatarFile.name);

    let headers = new Headers();
    headers.append('Accept', 'application/json');

    return this.put(AuthService.ADMIN_PUT_COACH_PROFILE_PICT, params, formData, {headers: headers})
      .map(res => res.json());
  }

  getMeetingsForCoacheeId(coacheeId: string): Observable<Array<Meeting>> {
    let param = [coacheeId];

    return this.get(AuthService.ADMIN_GET_MEETINGS_FOR_COACHEE_ID, param).map(response => {
      let json: Meeting[] = response.json();
      console.log("getAllMeetingsForCoacheeId, response json : ", json);
      let res: Array<any> = response.json();
      let meetings = new Array<Meeting>();
      for (var meeting of res) {
        meetings.push(Meeting.parseFromBE(meeting));
      }
      return meetings;
    });
  }

  getMeetingsForCoachId(coachId: string): Observable<Array<Meeting>> {
    let param = [coachId];

    return this.get(AuthService.ADMIN_GET_MEETINGS_FOR_COACH_ID, param)
      .map(response => {
        console.log("getAllMeetingsForCoachId, response : ", response);
        let res: Array<any> = response.json();
        let meetings = new Array<Meeting>();
        for (var meeting of res) {
          if (meeting != null) {
            meetings.push(Meeting.parseFromBE(meeting));
          }
        }
        return meetings;
      });
  }

  private post(path: string, params: string[], body: any): Observable<Response> {
    return this.httpService.post(this.generatePath(path, params), body)
  }

  private put(path: string, params: string[], body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.httpService.put(this.generatePath(path, params), body, options)
  }

  private get(path: string, params: string[]): Observable<Response> {
    return this.getWithSearchParams(path, params, null);
  }

  private getWithSearchParams(path: string, params: string[], searchParams: URLSearchParams): Observable<Response> {
    return this.httpService.get(this.generatePath(path, params), {search: searchParams})
  }

  private generatePath(path: string, params: string[]): string {
    // console.log("generatePath, path : ", path);
    // console.log("generatePath, params : ", params);

    var completedPath = "";
    let segs = path.split("/");
    var paramIndex = 0;
    for (let seg of segs) {
      if (seg == "" || seg == null) {
        continue;
      }

      completedPath += "/";
      if (seg.charAt(0) == ":") {
        completedPath += params[paramIndex];
        paramIndex++;
      } else {
        completedPath += seg;
      }
    }

    //always add a "/" at the end
    completedPath += "/";

    // console.log("generatePath, completedPath : ", completedPath);
    // console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);

    let finalUrl = environment.BACKEND_BASE_URL + completedPath;
    console.log("generatePath, finalUrl : ", finalUrl);

    return finalUrl;
  }

}


