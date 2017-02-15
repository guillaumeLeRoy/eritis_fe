export interface ApiUser {
  id: string;
  email : string;
  display_name: string;
  avatar_url: string;
  score: number;
  status: number;  //1 for coach, 2 for coachee
  start_date : string;
}
