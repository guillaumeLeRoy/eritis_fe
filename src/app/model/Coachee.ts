import {ApiUser} from "./ApiUser";
import {Coach} from "./Coach";
import {ContractPlan} from "./ContractPlan";
import {HR} from "./HR";
import {CoacheeObjective} from "./CoacheeObjective";
import {Plan} from "./Plan";
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
   * Number of available sessions this month
   */
  availableSessionsCount: number;

  /**
   * Date when the number of available sessions was updated
   */
  updateAvailableSessionCountDate: string;

  /**
   * Number of sessions done this month
   */
  sessionsDoneMonthCount: number;

  /**
   * Number of sessions done since the beginning
   */
  sessionsDoneTotalCount: number;

  /**
   * HR associated with this user.
   */
  associatedRh: HR;

  /**
   * Last objective defined by HR
   */
  last_objective: CoacheeObjective;

  /**
   * Business plan ( how many available sessions per month )
   */
  plan: Plan;


  constructor(id: string) {
    this.id = id;
  }

  static parseCoachee(json: any): Coachee {
    // TODO : don't really need to manually parse the received Json
    let coachee: Coachee = new Coachee(json.id);
    coachee.id = json.id;
    coachee.email = json.email;
    coachee.first_name = json.first_name;
    coachee.last_name = json.last_name;
    coachee.avatar_url = json.avatar_url;
    coachee.start_date = json.start_date;
    coachee.selectedCoach = json.selectedCoach;
    coachee.contractPlan = json.plan;
    coachee.availableSessionsCount = json.available_sessions_count;
    coachee.updateAvailableSessionCountDate = json.update_sessions_count_date;
    coachee.sessionsDoneMonthCount = json.sessions_done_month_count;
    coachee.sessionsDoneTotalCount = json.sessions_done_total_count;
    coachee.associatedRh = json.associatedRh;
    coachee.last_objective = json.last_objective;
    coachee.plan = json.plan;
    return coachee;
  }

}
