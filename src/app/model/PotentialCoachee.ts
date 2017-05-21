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
}
