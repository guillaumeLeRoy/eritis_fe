import {ApiUser} from "./ApiUser";
/**
 * Created by guillaume on 15/05/2017.
 */
export class HR implements ApiUser {

  //implement ApiUser
  readonly id: string;
  firebaseToken: string;

  email: string;

  avatar_url: string;

  firstName: string;

  lastName: string;

  start_date: string;

  constructor(id: string) {
    this.id = id;
  }

}
