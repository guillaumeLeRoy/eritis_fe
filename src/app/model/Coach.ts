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

  score: string;

  sessionsCount: string;

  description: string;

  chat_room_url: string;

  linkedin_url: string;

  training: string;

  degree: string;

  extraActivities: string;

  coachForYears: string;

  coachingExperience: string;

  coachingHours: string;

  coachingSpecifics : string;

  supervisor: string;

  favoriteCoachingSituation: string;

  status: string;

  revenues: string;

  insurance_url: string;

  invoice_address: string;

  invoice_city: string;

  invoice_entity: string;

  invoice_postcode: string;

  languages: string;

  therapyElements: string;

  experienceShortSession: string;

  constructor(id: string) {
    this.id = id;
  }

}
