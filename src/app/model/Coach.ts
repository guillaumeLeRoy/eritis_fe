import {ApiUser} from "./apiUser";
/**
 * Created by guillaume on 01/02/2017.
 */
export class Coach implements ApiUser {
  readonly id: string;
  firebaseToken : string;

  email: string

  // firebase_id: string;

  avatar_url: string;

  display_name: string;

  // //1 for coach, 2 for coachee
  // status: Number;

  start_date: string;

  description: string;


  constructor(id: string) {
    this.id = id;
  }

}
