/**
 *
 */
export class ContractPlan {
  plan_id: number
  plan_name: string
  sessions_count: number

  constructor(id: number){
    this.plan_id = id;
  }
}

