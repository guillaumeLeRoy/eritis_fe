export const MEETING_REVIEW_TYPE_SESSION_VALUE = "SESSION_VALUE";
export const MEETING_REVIEW_TYPE_SESSION_NEXT_STEP = "SESSION_NEXT_STEP";

export interface MeetingReview {
  id: string,
  comment: string,
  score: string,
  date: string
}
