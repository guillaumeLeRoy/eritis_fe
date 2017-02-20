import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Coach} from "../model/Coach";
import {MeetingReview} from "../model/MeetingReview";
import {ApiService} from "./api.service";
import {Response} from "@angular/http";
import {AuthService} from "./auth.service";

declare let firebase: any

@Injectable()
export class CoachCoacheeService {

  constructor(private apiService: AuthService) {
  }

  getAllCoachs(): Observable<Coach[]> {
    console.log("getAllCoachs, start request");

    return this.apiService.get(AuthService.GET_COACHS, null) .map(
      (response: Response) => {
        let json = response.json();
        console.log("getAllCoachs, response json : ", json);
        return json;
      });
  }


  getCoachForId(id: string): Observable<Coach> {
    console.log("getCoachForId, id", id);

    let param = [id];
    return this.apiService.get(AuthService.GET_COACH_FOR_ID, param) .map((response: Response) => {
      let json = response.json();
      console.log("getCoachForId, response json : ", json);
      return json;
    });
  }


  bookAMeetingWithCoach(dateSc: number, coachId: string, coacheeId: string): Observable<any> {
    console.log("bookAMeeting, date %s, coachId %s, coacheeId %s", dateSc, coachId, coacheeId);//todo check if userId ok

    let body = {
      date: dateSc.toString(),
      coachId: coachId,
      coacheeId: coacheeId
    };

    return this.apiService.post(AuthService.POST_MEETING, null, body) .map((response: Response) => {
      let json = response.json();
      console.log("getCoachForId, response json : ", json);
      return json;
    });
  }


  getMeetingReviews(meetingId: string): Observable<MeetingReview[]> {
    console.log("getMeetingReviews");

    let param = [meetingId];
    return this.apiService.get(AuthService.GET_MEETING_REVIEWS, param) .map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingReviews, response json : ", json);
      return json;
    });
  }


  addAMeetingReview(meetingId: string, comment: string, rate: string): Observable<MeetingReview> {
    console.log("addAMeetingReview, meetingId %s, comment : %s, rate : %s", meetingId, comment, rate);
    let body = {
      comment: comment,
      score: rate,
    };
    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body) .map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }

}
