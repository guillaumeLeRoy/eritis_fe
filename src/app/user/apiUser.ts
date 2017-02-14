export interface ApiUser {
  id: string,
  display_name: string,
  avatar_url: string;
  score: number
  status: number  //1 for coach, 2 for coachee
}
