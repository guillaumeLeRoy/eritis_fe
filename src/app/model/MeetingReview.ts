export const MEETING_REVIEW_TYPE_SESSION_CONTEXT = "SESSION_CONTEXT";
export const MEETING_REVIEW_TYPE_SESSION_GOAL = "SESSION_GOAL";
export const MEETING_REVIEW_TYPE_SESSION_RESULT = "SESSION_RESULT";
export const MEETING_REVIEW_TYPE_SESSION_UTILITY = "SESSION_UTILITY";
export const MEETING_REVIEW_TYPE_SESSION_RATE = "SESSION_RATE";

export interface MeetingReview {
  id: string,
  type: string,
  value: string,
  date: string
}
