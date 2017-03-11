import {ApiUser} from "./apiUser";
export class Coachee implements ApiUser {
  id: string;
  firebaseToken: string;


  email: string

  // firebase_id: string;

  avatar_url: string;

  display_name: string;

  // //1 for coach, 2 for coachee
  // status: Number;

  // score: Number;

  start_date: string;

  constructor(id: string) {
    this.id = id;
  }

}
