import {CoachDetailsComponent} from "./coach-details/coach-details.component";
import {Routes} from "@angular/router";

export const USER_ROUTES: Routes = [
  {path: ':id', component: CoachDetailsComponent},
]
