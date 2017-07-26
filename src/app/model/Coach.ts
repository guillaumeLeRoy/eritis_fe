import {ApiUser} from "./ApiUser";
/**
 * Created by guillaume on 01/02/2017.
 */
export class Coach implements ApiUser {
  readonly id: string;
  firebaseToken: string;

  email: string

  avatar_url: string;

  first_name: string;

  last_name: string;

  start_date: string;

  description: string;

  chat_room_url: string;

  linkedin_url: string;

  training: string;

  degree: string;

  extraActivities: string;

  coachForYears: string;

  coachingExperience: string;

  coachingHours: string;

  supervisor: string;

  favoriteCoachingSituation: string;

  status: string;

  revenues: string;

  assurance_url: string;

  constructor(id: string) {
    this.id = id;
  }

}
