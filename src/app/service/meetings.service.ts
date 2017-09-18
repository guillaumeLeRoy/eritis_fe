import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Meeting} from "../model/Meeting";
import {AuthService} from "./auth.service";
import {Response, URLSearchParams} from "@angular/http";
import {MeetingDate} from "../model/MeetingDate";
import {
  MEETING_REVIEW_TYPE_SESSION_CONTEXT,
  MEETING_REVIEW_TYPE_SESSION_GOAL,
  MEETING_REVIEW_TYPE_SESSION_RATE,
  MEETING_REVIEW_TYPE_SESSION_RESULT,
  MEETING_REVIEW_TYPE_SESSION_UTILITY,
  MeetingReview
} from "../model/MeetingReview";

@Injectable()
export class MeetingsService {

  constructor(private apiService: AuthService) {
  }

  getAllMeetingsForCoacheeId(coacheeId: string): Observable<Array<Meeting>> {
    let param = [coacheeId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACHEE_ID, param).map(response => {
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

  getAllMeetingsForCoachId(coachId: string): Observable<Array<Meeting>> {
    let param = [coachId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACH_ID, param).map(response => {
      let json: Meeting[] = response.json();
      console.log("getAllMeetingsForCoachId, response json : ", json);
      let res: Array<any> = response.json();
      let meetings = new Array<Meeting>();
      for (var meeting of res) {
        meetings.push(Meeting.parseFromBE(meeting));
      }
      return meetings;
    });
  }

  /**
   * Create a meeting for the given Coachee
   * @param coacheeId
   * @returns {Observable<R>}
   */
  createMeeting(coacheeId: string): Observable<Meeting> {
    console.log("bookAMeeting coacheeId %s", coacheeId);//todo check if userId ok

    let body = {
      coacheeId: coacheeId
    };

    return this.apiService.post(AuthService.POST_MEETING, null, body).map((response: Response) => {
      let meeting: Meeting = Meeting.parseFromBE(response.json());
      console.log("bookAMeeting, response json : ", meeting);
      return meeting;
    });
  }

  /**
   * Delete a meeting
   * @returns {Observable<Response>}
   */
  deleteMeeting(meetingId: string): Observable<Response> {
    let param = [meetingId];
    return this.apiService.delete(AuthService.DELETE_MEETING, param);
  }

  /**
   * Close the given meeting with a comment
   * Only a Coach can close a meeting.
   * @param meetingId
   * @param comment
   * @returns {Observable<R>}
   */
  closeMeeting(meetingId: string, result: string, utility: string): Observable<Meeting> {
    console.log("closeMeeting, meetingId %s, result : %s, utility : %s", meetingId, result, utility);
    let body = {
      result: result,
      utility: utility,
    };
    let param = [meetingId];
    return this.apiService.put(AuthService.CLOSE_MEETING, param, body).map((response: Response) => {
      let meeting: Meeting = Meeting.parseFromBE(response.json());
      console.log("closeMeeting, response meeting : ", meeting);
      return meeting;
    });
  }


  /**
   * Add this date as a Potential Date for the given meeting
   * @param meetingId
   * @returns {Observable<R>}
   */
  addPotentialDatesToMeeting(meetingId: string, dates: Array<MeetingDate>): Observable<MeetingDate> {
    console.log("addPotentialDatesToMeeting");

    // convert milliSec to sec ...
    let datesInSeconds: Array<any> = new Array();
    for (let date of dates) {
      let secDate: any = {};
      secDate.start_date = date.start_date / 1000;
      secDate.end_date = date.end_date / 1000;
      datesInSeconds.push(secDate);
    }

    let jsonBody: any = {};
    jsonBody.dates = datesInSeconds;

    let body = JSON.stringify(jsonBody);
    console.log("addPotentialDatesToMeeting, body %s", body);

    let param = [meetingId];
    return this.apiService.put(AuthService.PUT_MEETING_POTENTIALS_DATE, param, body).map((response: Response) => {
      let meetingDate: MeetingDate = MeetingDate.parseFromBE(response.json());
      console.log("getCoachForId, response meetingDate : ", meetingDate);
      return meetingDate;
    });
  }

  /**
   * Fetch all potential dates for the given meeting
   * Backend returns dates in Unix time in seconds but but MeetingDate deals with timestamp.
   * @param meetingId
   * @returns {Observable<R>}
   */
  getMeetingPotentialTimes(meetingId: string): Observable<MeetingDate[]> {
    console.log("getMeetingPotentialTimes, meetingId : ", meetingId);
    let param = [meetingId];
    return this.apiService.get(AuthService.GET_MEETING_POTENTIAL_DATES, param).map((response: Response) => {
      let dates: Array<any> = response.json();
      console.log("getMeetingPotentialTimes, response json : ", dates);

      let datesMilli = new Array<MeetingDate>();
      for (var date of dates) {
        let dateMilli = MeetingDate.parseFromBE(date);
        datesMilli.push(dateMilli)
      }
      return datesMilli;
    });
  }

  //get all MeetingReview for context == SESSION_CONTEXT
  getMeetingContext(meetingId: string): Observable<MeetingReview[]> {
    console.log("getMeetingContext");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_CONTEXT);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingContext, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == SESSION_GOAL
  getMeetingGoal(meetingId: string): Observable<MeetingReview[]> {
    console.log("getMeetingGoal");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_GOAL);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingGoal, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RESULT
  getSessionReviewResult(meetingId: string): Observable<MeetingReview[]> {
    console.log("getSessionReviewResult");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RESULT);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getSessionReviewResult, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_UTILITY
  getSessionReviewUtility(meetingId: string): Observable<MeetingReview[]> {
    console.log("getSessionReviewUtility");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_UTILITY);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getSessionReviewUtility, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RATE
  getSessionReviewRate(meetingId: string): Observable<MeetingReview[]> {
    console.log("getSessionReviewRate");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RATE);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getSessionReviewRate, response json : ", json);
      return json;
    });
  }

  //add review for type SESSION_CONTEXT
  addAContextForMeeting(meetingId: string, context: string): Observable<MeetingReview> {
    console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, context);
    let body = {
      value: context,
      type: MEETING_REVIEW_TYPE_SESSION_CONTEXT,
    };
    let param = [meetingId];
    return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }

  //add review for type MEETING_REVIEW_TYPE_SESSION_GOAL
  addAGoalToMeeting(meetingId: string, goal: string): Observable<MeetingReview> {
    console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, goal);
    let body = {
      value: goal,
      type: MEETING_REVIEW_TYPE_SESSION_GOAL,
    };
    let param = [meetingId];
    return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }

  /**
   * Add a rate for this meeting
   * @returns {Observable<R>}
   */
  addSessionRateToMeeting(meetingId: string, rate: string) {
    console.log("addSessionRateToMeeting, meetingId %s, rate : %s", meetingId, rate);
    let body = {
      type: MEETING_REVIEW_TYPE_SESSION_RATE,
      value: rate,
    };
    let param = [meetingId];
    return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addSessionRateToMeeting, response json : ", json);
      return json;
    });
  }

  /**
   * Fetch all meetings where no coach is associated
   * @returns {Observable<R>}
   */
  getAvailableMeetings(): Observable<Array<Meeting>> {
    console.log("getAvailableMeetings");
    return this.apiService.get(AuthService.GET_AVAILABLE_MEETINGS, null).map((response: Response) => {
      let res: Array<any> = response.json();
      let meetings = new Array<Meeting>();
      for (var meeting of res) {
        meetings.push(Meeting.parseFromBE(meeting));
      }
      console.log("getAvailableMeetings");
      return meetings;
    });
  }


  /**
   * Associated this coach with this meeting
   * @returns {Observable<R>}
   */
  associateCoachToMeeting(meetingId: string, coachId: string): Observable<Meeting> {
    console.log("associateCoachToMeeting");
    let param = [meetingId, coachId];
    return this.apiService.put(AuthService.PUT_COACH_TO_MEETING, param, null).map((response: Response) => {
      let meeting: Meeting = Meeting.parseFromBE(response.json());
      return meeting;
    });
  }

}
