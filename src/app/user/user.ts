export interface User {
  id: string,
  email: string,
  password: string;
  confirmPassword?: string
  status: boolean  //1 for coach, 2 for coachee
}
