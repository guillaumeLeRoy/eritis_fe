import {ApiUser} from "./apiUser";
/**
 * Created by guillaume on 15/05/2017.
 */
export class Rh implements ApiUser {

  //implement ApiUser
  readonly id: string;
  firebaseToken: string;

  email: string;

  avatar_url: string;

  display_name: string;

  start_date: string;

  constructor(id: string) {
    this.id = id;
  }

}
