import {ContractPlan} from "./ContractPlan";
/**
 * Created by guillaume on 18/05/2017.
 */

export class PotentialCoachee {
  readonly id: string;

  email: string;

  start_date: string;

  plan: ContractPlan;

  constructor(id: string) {
    this.id = id;
  }

  static parsePotentialCoachee(json: any): PotentialCoachee {
    let potentialCoachee: PotentialCoachee = new PotentialCoachee(json.id);
    potentialCoachee.email = json.email;
    potentialCoachee.start_date = json.create_date;
    potentialCoachee.plan = json.plan;
    return potentialCoachee;
  }
}
