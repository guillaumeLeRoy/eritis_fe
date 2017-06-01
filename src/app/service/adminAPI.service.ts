import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {Coach} from "../model/Coach";
import {Coachee} from "../model/Coachee";
import {AuthService} from "./auth.service";
import {Admin} from "../model/Admin";

@Injectable()
export class AdminAPIService {

  constructor(private httpService: Http) {
    console.log("ctr done");
  }

  createPotentialCoach(body: any) {
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
        let coachs: Array<Coach> = res.json();
        return coachs;
      }
    );
  }

  getCoachees(): Observable<Array<Coachee>> {
    return this.get(AuthService.ADMIN_GET_COACHEES, null).map(
      (res: Response) => {
        let Coachees: Array<Coachee> = res.json();
        return Coachees;
      }
    );
  }

  getRhs(): Observable<Array<Coachee>> {
    return this.get(AuthService.ADMIN_GET_RHS, null).map(
      (res: Response) => {
        let Coachees: Array<Coachee> = res.json();
        return Coachees;
      }
    );
  }

  private post(path: string, params: string[], body: any): Observable<Response> {
    return this.httpService.post(this.generatePath(path, params), body)
  }

  private put(path: string, params: string[], body: any): Observable<Response> {
    return this.httpService.put(this.generatePath(path, params), body)
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
      // console.log("generatePath, seg : ", seg);
      // console.log("generatePath, paramIndex : ", paramIndex);

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


  /* ----------- PARSER ------------- */

  private parseCoach(json: any): Coach {
    let coach: Coach = new Coach(json.id);
    coach.email = json.email;
    coach.display_name = json.display_name;
    coach.avatar_url = json.avatar_url;
    coach.start_date = json.start_date;
    coach.description = json.description;
    return coach;
  }

  private parseCoachee(json: any): Coachee {
    let coachee: Coachee = new Coachee(json.id);
    coachee.id = json.id;
    coachee.email = json.email;
    coachee.display_name = json.display_name;
    coachee.avatar_url = json.avatar_url;
    coachee.start_date = json.start_date;
    coachee.selectedCoach = json.selectedCoach;
    coachee.contractPlan = json.plan;
    coachee.availableSessionsCount = json.available_sessions_count;
    coachee.updateAvailableSessionCountDate = json.update_sessions_count_date;
    return coachee;
  }
}


