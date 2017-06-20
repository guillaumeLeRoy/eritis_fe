import {ApiUser} from "./ApiUser";
/**
 * Created by guillaume on 01/02/2017.
 */
export class Coach implements ApiUser {
  readonly id: string;
  firebaseToken: string;

  email: string

  avatar_url: string;

  firstName: string;

  lastName: string;

  start_date: string;

  description: string;

  chat_room_url: string;

  constructor(id: string) {
    this.id = id;
  }

}
