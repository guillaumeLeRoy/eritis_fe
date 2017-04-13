export interface User {
  id: string,
  email: string,
  password: string;
  confirmPassword?: string;

  /*
    Only for a Coachee
   */
  contractPlanId? : string;
}
