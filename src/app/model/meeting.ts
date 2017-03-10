import {Coach} from "./Coach";
import {Coachee} from "./coachee";
export interface Meeting {
  id: string
  date: string
  coach: Coach
  coachee: Coachee
  isOpen: boolean
}
