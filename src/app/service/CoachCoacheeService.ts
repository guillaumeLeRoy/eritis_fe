import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Coach} from "../model/Coach";
import {MeetingReview} from "../model/MeetingReview";
import {Response} from "@angular/http";
import {AuthService} from "./auth.service";
import {Coachee} from "../model/coachee";
import {ApiUser} from "../model/apiUser";
import {MeetingDate} from "../model/MeetingDate";
import {Meeting} from "../model/meeting";

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


  getCoachForId(id: string): Observable<Coach> {
    console.log("getCoachForId, id", id);

    let param = [id];
    return this.apiService.get(AuthService.GET_COACH_FOR_ID, param).map((response: Response) => {
      let json = response.json();
      console.log("getCoachForId, response json : ", json);
      return json;
    });
  }

  getCoacheeForId(id: string): Observable<Coachee> {
    console.log("getCoacheeForId, id", id);

    let param = [id];
    return this.apiService.get(AuthService.GET_COACHEE_FOR_ID, param).map((response: Response) => {
      let json: Coachee = response.json();
      console.log("getCoacheeForId, response json : ", json);
      return json;
    });
  }

  /**
   * Add this date as a Potential Date for the given meeting
   * @param meetingId
   * @param startDate
   * @param endDate
   * @returns {Observable<R>}
   */
  addPotentialDateToMeeting(meetingId: string, startDate: number, endDate: number): Observable<MeetingDate> {
    console.log("addPotentialDateToMeeting, meeting id : %s, startDate : %s, endDate : %s", meetingId, startDate, endDate);
    let body = {
      start_date: startDate.toString(),
      end_date: endDate.toString(),
    };
    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_POTENTIAL_DATE, param, body).map((response: Response) => {
      let json: MeetingDate = response.json();
      console.log("getCoachForId, response json : ", json);
      return json;
    });
  }

  /**
   * Fetch all potential dates for the given meeting
   * @param meetingId
   * @returns {Observable<R>}
   */
  getMeetingPotentialTimes(meetingId: string): Observable<MeetingDate[]> {
    console.log("getMeetingPotentialTimes, meetingId : ", meetingId);
    let param = [meetingId];
    return this.apiService.get(AuthService.GET_MEETING_POTENTIAL_DATES, param).map((response: Response) => {
      let dates: MeetingDate[] = response.json();
      console.log("getMeetingPotentialTimes, response json : ", dates);
      return dates;
    });
  }

  /**
   *
   * @param meetingId
   * @param potentialDateId
   * @returns {Observable<R>}
   */
  setPotentialDateToMeeting(meetingId: string, potentialDateId: string): Observable<Meeting> {
    console.log("setPotentialDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
    let param = [meetingId, potentialDateId];
    return this.apiService.put(AuthService.PUT_POTENTIAL_DATE_TO_MEETING, param, null).map((response: Response) => {
      let meeting: Meeting = response.json();
      console.log("setPotentialDateToMeeting, response json : ", meeting);
      return meeting;
    });
  }

  getMeetingReviews(meetingId: string): Observable<MeetingReview[]> {
    console.log("getMeetingReviews");

    let param = [meetingId];
    return this.apiService.get(AuthService.GET_MEETING_REVIEWS, param).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingReviews, response json : ", json);
      return json;
    });
  }


  addAMeetingReview(meetingId: string, comment: string, rate: string): Observable<MeetingReview> {

    //convert rating into Integer
    let rating = +rate;

    console.log("addAMeetingReview, meetingId %s, comment : %s, rating : %s", meetingId, comment, rating);
    let body = {
      comment: comment,
      score: rating,
    };
    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }

  /**
   * Close the given meeting with a comment and a rate.
   * Only a Coach can close a meeting.
   * @param meetingId
   * @param comment
   * @param rate
   * @returns {Observable<R>}
   */
  closeMeeting(meetingId: string, comment: string, rate: string): Observable<Meeting> {
    //convert rating into Integer
    let rating = +rate;

    console.log("closeMeeting, meetingId %s, comment : %s", meetingId, comment);
    let body = {
      comment: comment,
      score: rating
    };
    let param = [meetingId];
    return this.apiService.put(AuthService.CLOSE_MEETING, param, body).map((response: Response) => {
      let json: Meeting = response.json();
      console.log("closeMeeting, response json : ", json);
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
