import {ApiUser} from "./ApiUser";
import {Coach} from "./Coach";
import {ContractPlan} from "./ContractPlan";
import {HR} from "./HR";
import {CoacheeObjective} from "./CoacheeObjective";
export class Coachee implements ApiUser {

  /**
   * Eritis database id
   */
  id: string;
  firebaseToken: string;

  email: string

  avatar_url: string;

  first_name: string;

  last_name: string;

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
   * HR associated with this user.
   */
  associatedRh: HR;

  /**
   * Last objective defined by HR
   */
  last_objective: CoacheeObjective;


  constructor(id: string) {
    this.id = id;
  }

}
