import {Routes, RouterModule} from "@angular/router";
import {RecipesComponent} from "./recipes/recipes.component";
import {ShopingListComponent} from "./shoping-list/shoping-list.component";
import {RECIPE_ROUTES} from "./recipes/recipes.routes";
import {SigninComponent} from "./login/signin/signin.component";
import {SignupComponent} from "./login/signup/signup.component";
import {AuthGuard} from "./login/auth.guard";
import {WelcomeComponent} from "./welcome/welcome.component";
import {ChatComponent} from "./chat/chat.component";
import {CoachListComponent} from "./user/coach-list/coach-list.component";
import {USER_ROUTES} from "./user/user_routes";
import {CoachDetailsComponent} from "./user/coach-details/coach-details.component";
import {MeetingListComponent} from "./meeting/meeting-list/meeting-list.component";
import {ProfileComponent} from "./user/profile.component";

const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'recipes', component: RecipesComponent, children: RECIPE_ROUTES},
  {path: 'shopping-list', component: ShopingListComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'coachs', component: CoachListComponent},
  {path: 'coachs/:id', component: CoachDetailsComponent},
  {path: 'coachees', component: CoachListComponent},
  {path: 'meetings/:id', component: MeetingListComponent},
  // {path: 'coachees', component: CoachListComponent, canActivate: [AuthGuard]},

]


export const routing = RouterModule.forRoot(APP_ROUTES)
