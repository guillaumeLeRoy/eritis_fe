import {ApiUser} from "./apiUser";
import {Coach} from "./Coach";
import {ContractPlan} from "./ContractPlan";
import {Rh} from "./Rh";
export class Coachee implements ApiUser {

  id: string;
  firebaseToken: string;

  email: string

  avatar_url: string;

  display_name: string;

  start_date: string;

  selectedCoach: Coach;

  contractPlan: ContractPlan;

  /**
   * Number of available sessions
   */
  availableSessionsCount: number;

  /**
   * Date when the number of available sessions was updated
   */
  updateAvailableSessionCountDate: string;

  /**
   * Rh associated with this user.
   */
  associatedRh : Rh

  constructor(id: string) {
    this.id = id;
  }

}
