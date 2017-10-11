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

  getAllMeetingsForCoacheeId(coacheeId: string, isAdmin?: boolean): Observable<Array<Meeting>> {
    console.log("getAllMeetingsForCoacheeId, coacheeId : ", coacheeId);

    let param = [coacheeId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACHEE_ID, param, isAdmin).map(response => {
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

  getAllMeetingsForCoachId(coachId: string, isAdmin?: boolean): Observable<Array<Meeting>> {
    console.log("getAllMeetingsForCoachId, coachId : ", coachId);

    let param = [coachId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACH_ID, param, isAdmin)
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

  /**
   * Create a meeting for the given Coachee
   * @param coacheeId
   * @returns {Observable<R>}
   */
  createMeeting(coacheeId: string, context: string, goal: string, dates: Array<MeetingDate>): Observable<Meeting> {
    console.log("createMeeting coacheeId %s", coacheeId);//todo check if userId ok

    let body = this.getUpdateOrCreateMeetingRequestBody(coacheeId, context, goal, dates);

    return this.apiService.post(AuthService.POST_MEETING, null, body).map((response: Response) => {
      let meeting: Meeting = Meeting.parseFromBE(response.json());
      console.log("createMeeting, response json : ", meeting);
      return meeting;
    });
  }

  /**
   * Update a meeting
   * @param coacheeId
   * @returns {Observable<R>}
   */
  updateMeeting(coacheeId: string, meetingId: string, context: string, goal: string, dates: Array<MeetingDate>): Observable<Meeting> {
    console.log("updateMeeting coacheeId %s", coacheeId);//todo check if userId ok

    let body = this.getUpdateOrCreateMeetingRequestBody(coacheeId, context, goal, dates);
    let param = [meetingId];
    return this.apiService.put(AuthService.PUT_MEETING, param, body).map((response: Response) => {
      let meeting: Meeting = Meeting.parseFromBE(response.json());
      console.log("updateMeeting, response json : ", meeting);
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
  addPotentialDateToMeeting(meetingId: string, date: MeetingDate): Observable<MeetingDate> {
    console.log("addPotentialDateToMeeting");

    // convert milliSec to sec ...
    let secDate: any = {};
    secDate.start_date = date.start_date / 1000;
    secDate.end_date = date.end_date / 1000;

    let body = JSON.stringify(secDate);
    console.log("addPotentialDateToMeeting, body %s", body);

    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_POTENTIAL_DATE, param, body)
      .map((response: Response) => {
        let meetingDate: MeetingDate = MeetingDate.parseFromBE(response.json());
        console.log("addPotentialDateToMeeting, response meetingDate : ", meetingDate);
        return meetingDate;
      });
  }

  /**
   * Fetch all potential dates for the given meeting
   * Backend returns dates in Unix time in seconds but but MeetingDate deals with timestamp.
   * @param meetingId
   * @returns {Observable<R>}
   */
  getMeetingPotentialTimes(meetingId: string, isAdmin?: boolean): Observable<Array<MeetingDate>> {
    console.log("getMeetingPotentialTimes, meetingId : ", meetingId);
    let param = [meetingId];
    return this.apiService.get(AuthService.GET_MEETING_POTENTIAL_DATES, param, isAdmin).map((response: Response) => {
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
  getMeetingContext(meetingId: string, isAdmin?: boolean): Observable<MeetingReview[]> {
    console.log("getMeetingContext");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_CONTEXT);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingContext, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == SESSION_GOAL
  getMeetingGoal(meetingId: string, isAdmin?: boolean): Observable<MeetingReview[]> {
    console.log("getMeetingGoal");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_GOAL);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingGoal, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RESULT
  getSessionReviewResult(meetingId: string, isAdmin?: boolean): Observable<MeetingReview[]> {
    console.log("getSessionReviewResult");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RESULT);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getSessionReviewResult, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_UTILITY
  getSessionReviewUtility(meetingId: string, isAdmin?: boolean): Observable<MeetingReview[]> {
    console.log("getSessionReviewUtility");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_UTILITY);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getSessionReviewUtility, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RATE
  getSessionReviewRate(meetingId: string, isAdmin?: boolean): Observable<MeetingReview[]> {
    console.log("getSessionReviewRate");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RATE);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getSessionReviewRate, response json : ", json);
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

  setFinalDateToMeeting(meetingId: string, potentialDateId: string): Observable<Meeting> {
    console.log("setFinalDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
    let param = [meetingId, potentialDateId];
    return this.apiService.put(AuthService.PUT_FINAL_DATE_TO_MEETING, param, null).map((response: Response) => {
      let meeting: Meeting = response.json();
      console.log("setFinalDateToMeeting, response json : ", meeting);
      return meeting;
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


  private getUpdateOrCreateMeetingRequestBody(coacheeId: string, context: string, goal: string, dates: Array<MeetingDate>): string {
    let contextBody = {
      value: context,
      type: MEETING_REVIEW_TYPE_SESSION_CONTEXT,
    };

    let goalBody = {
      value: goal,
      type: MEETING_REVIEW_TYPE_SESSION_GOAL,
    };

    // convert milliSec to sec ...
    let datesInSeconds: Array<any> = new Array();
    for (let date of dates) {
      let secDate: any = {};
      secDate.start_date = date.start_date / 1000;
      secDate.end_date = date.end_date / 1000;
      datesInSeconds.push(secDate);
    }

    let body: any = {
      coacheeId: coacheeId,
      context: contextBody,
      goal: goalBody,
      dates: datesInSeconds
    };

    return JSON.stringify(body);

  }
}
