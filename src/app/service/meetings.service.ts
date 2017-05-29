import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Meeting} from "../model/meeting";
import {AuthService} from "./auth.service";
import {Response, URLSearchParams} from "@angular/http";
import {MeetingDate} from "../model/MeetingDate";
import {
  MEETING_REVIEW_TYPE_SESSION_CONTEXT,
  MEETING_REVIEW_TYPE_SESSION_GOAL,
  MEETING_REVIEW_TYPE_SESSION_NEXT_STEP,
  MEETING_REVIEW_TYPE_SESSION_VALUE,
  MeetingReview
} from "../model/MeetingReview";

@Injectable()
export class MeetingsService {

  constructor(private apiService: AuthService) {
  }

  getAllMeetingsForCoacheeId(coacheeId: string): Observable<Meeting[]> {
    let param = [coacheeId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACHEE_ID, param).map(response => {
      let json: Meeting[] = response.json();
      console.log("getAllMeetingsForCoacheeId, response json : ", json);
      return json;
    });
  }

  getAllMeetingsForCoachId(coachId: string): Observable<Meeting[]> {
    let param = [coachId];

    return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACH_ID, param).map(response => {
      let json: Meeting[] = response.json();
      console.log("getAllMeetingsForCoachId, response json : ", json);
      return json;
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
      let meeting: Meeting = response.json();
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
   * Delete a potential date
   * @param potentialId
   * @returns {Observable<R>}
   */
  updatePotentialTime(potentialId: string, startDate: number, endDate: number): Observable<MeetingDate> {
    console.log("updatePotentialTime, potentialId %s", potentialId);

    let body = {
      start_date: startDate.toString(),
      end_date: endDate.toString(),
    };
    let param = [potentialId];
    return this.apiService.put(AuthService.PUT_POTENTIAL_DATE_TO_MEETING, param, body).map((response: Response) => {
      let json: MeetingDate = response.json();
      console.log("updatePotentialTime, response json : ", json);
      return json;
    });
  }

  /**
   * Delete a potential date
   * @param potentialId
   * @returns {Observable<R>}
   */
  removePotentialTime(potentialId: string): Observable<any> {
    console.log("removePotentialTime, potentialId %s", potentialId);
    let param = [potentialId];
    return this.apiService.delete(AuthService.DELETE_POTENTIAL_DATE, param).map((response: Response) => {
      let json: Meeting = response.json();
      console.log("removePotentialTime, response json : ", json);
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
  setFinalDateToMeeting(meetingId: string, potentialDateId: string): Observable<Meeting> {
    console.log("setFinalDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
    let param = [meetingId, potentialDateId];
    return this.apiService.put(AuthService.PUT_FINAL_DATE_TO_MEETING, param, null).map((response: Response) => {
      let meeting: Meeting = response.json();
      console.log("setFinalDateToMeeting, response json : ", meeting);
      return meeting;
    });
  }

  // getMeetingReviews(meetingId: string): Observable<MeetingReview[]> {
  //   console.log("getMeetingReviews");
  //
  //   let param = [meetingId];
  //   return this.apiService.get(AuthService.GET_MEETING_REVIEWS, param).map((response: Response) => {
  //     let json: MeetingReview[] = response.json();
  //     console.log("getMeetingReviews, response json : ", json);
  //     return json;
  //   });
  // }

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

  //get all MeetingReview for context == SESSION_VALUE
  getMeetingValue(meetingId: string): Observable<MeetingReview[]> {
    console.log("getMeetingGoal");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_VALUE);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingValue, response json : ", json);
      return json;
    });
  }

  //get all MeetingReview for context == SESSION_NEXT_STEP
  getMeetingNextStep(meetingId: string): Observable<MeetingReview[]> {
    console.log("getMeetingGoal");

    let searchParams: URLSearchParams = new URLSearchParams();
    searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_NEXT_STEP);

    let param = [meetingId];
    return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map((response: Response) => {
      let json: MeetingReview[] = response.json();
      console.log("getMeetingNextStep, response json : ", json);
      return json;
    });
  }

  //add review for type SESSION_CONTEXT
  addAContextForMeeting(meetingId: string, context: string): Observable<MeetingReview> {
    console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, context);
    let body = {
      comment: context,
      type: MEETING_REVIEW_TYPE_SESSION_CONTEXT,
    };
    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }

  // updateContextForMeeting(reviewId: string, context: string): Observable<MeetingReview> {
  //   console.log("updateContextForMeeting, reviewId %s, comment : %s", reviewId, context);
  //   let body = {
  //     comment: context,
  //   };
  //   let param = [reviewId];
  //   return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map((response: Response) => {
  //     let json: MeetingReview = response.json();
  //     console.log("updateContextForMeeting, response json : ", json);
  //     return json;
  //   });
  // }

  //add review for type SESSION_GOAL
  addAGoalToMeeting(meetingId: string, goal: string): Observable<MeetingReview> {
    console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, goal);
    let body = {
      comment: goal,
      type: MEETING_REVIEW_TYPE_SESSION_GOAL,
    };
    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }


  // updateGoalForMeeting(reviewId: string, goal: string): Observable<MeetingReview> {
  //   console.log("updateGoalForMeeting, reviewId %s, comment : %s", reviewId, goal);
  //   let body = {
  //     comment: goal,
  //   };
  //   let param = [reviewId];
  //   return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map((response: Response) => {
  //     let json: MeetingReview = response.json();
  //     console.log("updateGoalForMeeting, response json : ", json);
  //     return json;
  //   });
  // }

  //add review for type SESSION_VALUE
  addAMeetingReviewForValue(meetingId: string, comment: string): Observable<MeetingReview> {
    console.log("addAMeetingReviewForValue, meetingId %s, comment : %s", meetingId, comment);
    let body = {
      comment: comment,
      type: MEETING_REVIEW_TYPE_SESSION_VALUE,
    };
    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }

  //add review for type SESSION_NEXT_STEP
  addAMeetingReviewForNextStep(meetingId: string, comment: string): Observable<MeetingReview> {
    console.log("addAMeetingReviewForNextStep, meetingId %s, comment : %s", meetingId, comment);
    let body = {
      comment: comment,
      type: MEETING_REVIEW_TYPE_SESSION_NEXT_STEP
    };
    let param = [meetingId];
    return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map((response: Response) => {
      let json: MeetingReview = response.json();
      console.log("addAMeetingReview, response json : ", json);
      return json;
    });
  }

  // /**
  //  * Delete a review
  //  */
  // removeReview(reviewId: string): Observable<any> {
  //   console.log("removeReview, reviewId %s", reviewId);
  //   let param = [reviewId];
  //   return this.apiService.delete(AuthService.DELETE_MEETING_REVIEW, param).map((response: Response) => {
  //     let json = response.json();
  //     console.log("removeReview, response json : ", json);
  //     return json;
  //   });
  // }


  /**
   * Fetch all meetings where no coach is associated
   * @returns {Observable<R>}
   */
  getAvailablesMeetings(): Observable<Meeting[]> {
    console.log("getAvailablesMeetings");
    return this.apiService.get(AuthService.GET_AVAILABLE_MEETINGS, null).map((response: Response) => {
      let meetings: Meeting[] = response.json();
      console.log("getAvailablesMeetings");
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
      let meeting: Meeting = response.json();
      console.log("associateCoachToMeeting");
      return meeting;
    });
  }

}
