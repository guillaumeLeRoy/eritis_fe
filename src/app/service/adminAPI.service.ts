import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {AuthService} from "./auth.service";
import {Admin} from "../model/Admin";
import {PossibleCoach} from "../model/PossibleCoach";

@Injectable()
export class AdminAPIService {

  constructor(private authService: AuthService) {
  }

  createPotentialCoach(email: string) {
    let body = {
      "email": email,
    };
    return this.authService.post(AuthService.POST_POTENTIAL_COACH, null, body, null, true).map(
      (res: Response) => {
        let potentialCoach: any = res.json();
        return potentialCoach;
      }
    );
  }

  createPotentialRh(body: any) {
    return this.authService.post(AuthService.POST_POTENTIAL_RH, null, body, null, true).map(
      (res: Response) => {
        let potentialRh: any = res.json();
        return potentialRh;
      }
    );
  }

  getAdmin(): Observable<Admin> {
    return this.authService.get(AuthService.GET_ADMIN, null, true).map(
      (res: Response) => {
        let admin: Admin = res.json();
        return admin;
      }
    );
  }

  getPossibleCoachs(): Observable<Array<PossibleCoach>> {
    return this.authService.get(AuthService.ADMIN_GET_POSSIBLE_COACHS, null, true).map(
      (res: Response) => {
        let possibleCoachs: Array<PossibleCoach> = res.json();
        return possibleCoachs;
      }
    );
  }

  getPossibleCoach(id: string): Observable<PossibleCoach> {
    let params = [id];
    return this.authService.get(AuthService.ADMIN_GET_POSSIBLE_COACH, params, true).map(
      (res: Response) => {
        let possibleCoach: PossibleCoach = res.json();
        return possibleCoach;
      }
    );
  }

}


