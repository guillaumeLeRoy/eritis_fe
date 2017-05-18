import {RouterModule, Routes} from "@angular/router";
import {SigninComponent} from "./login/signin/signin.component";
import {SignupAdminComponent} from "./login/signup/signup_admin.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {ChatComponent} from "./chat/chat.component";
import {CoachListComponent} from "./user/coach-list/coach-list.component";
import {CoachDetailsComponent} from "./user/coach-details/coach-details.component";
import {MeetingListComponent} from "./meeting/meeting-list/meeting-list.component";
import {ProfileCoachComponent} from "./user/profile/coach/profile-coach.component";
import {ProfileCoacheeComponent} from "./user/profile/coachee/profile-coachee.component";
import {MeetingDateComponent} from "./meeting/meeting-date/meeting-date.component";
import {CoachSelectorComponent} from "./user/coach-selector/coach-selector.component";
import {AdminComponent} from "./admin/admin.component";
import {ProfileRhComponent} from "./user/profile/rh/profile-rh.component";
import {SignupCoacheeComponent} from "./login/signup/signup-coachee.component";

const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup_coachee', component: SignupCoacheeComponent},
  {path: 'profile_coach', component: ProfileCoachComponent},
  {path: 'profile_coachee', component: ProfileCoacheeComponent},
  {path: 'profile_rh', component: ProfileRhComponent},
  {path: 'coachs', component: CoachListComponent},
  {path: 'coachs/:id', component: CoachDetailsComponent},
  {path: 'coachees', component: CoachListComponent},
  {path: 'meetings', component: MeetingListComponent},
  {path: 'date/:meetingId', component: MeetingDateComponent},
  {
    path: 'admin', component: AdminComponent,
    children: [
      {path: 'signup', component: SignupAdminComponent},
      {path: 'coach-selector', component: CoachSelectorComponent}
    ]
  },

  // {path: 'coachees', component: CoachListComponent, canActivate: [AuthGuard]},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
