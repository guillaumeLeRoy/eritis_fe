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

  first_name: string;

  description: string;

  last_name: string;

  start_date: string;

  company_name: string;

  private constructor(id: string) {
    this.id = id;
  }

  static parseRh(json: any): HR {
    console.log(json);
    let rh: HR = new HR(json.id);
    rh.email = json.email;
    rh.description = json.description;
    rh.first_name = json.first_name;
    rh.last_name = json.last_name;
    rh.start_date = json.start_date;
    rh.avatar_url = json.avatar_url;
    rh.company_name = json.company_name;
    return rh;
  }
}
