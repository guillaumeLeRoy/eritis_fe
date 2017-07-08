import {RouterModule, Routes} from "@angular/router";
import {SigninComponent} from "./login/signin/signin.component";
import {SignupAdminComponent} from "./login/signup/signup-admin/signup-admin.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {ChatComponent} from "./chat/chat.component";
import {MeetingListComponent} from "./meeting/meeting-list/meeting-list.component";
import {ProfileCoachComponent} from "./user/profile/coach/profile-coach.component";
import {ProfileCoacheeComponent} from "./user/profile/coachee/profile-coachee.component";
import {MeetingDateComponent} from "./meeting/meeting-date/meeting-date.component";
import {AdminCoachsListComponent} from "./admin/coachs-list/admin-coachs-list.component";
import {AdminComponent} from "./admin/admin.component";
import {ProfileRhComponent} from "./user/profile/rh/profile-rh.component";
import {SignupCoacheeComponent} from "./login/signup/signup-coachee/signup-coachee.component";
import {SignupCoachComponent} from "./login/signup/signup-coach/signup-coach.component";
import {SignupRhComponent} from "./login/signup/signup-rh/signup-rh.component";
import {AvailableMeetingsComponent} from "./meeting/meeting-list/coach/available-meetings/available-meetings.component";
import {CoacheesListComponent} from "./admin/coachees-list/coachees-list.component";
import {RhsListComponent} from "./admin/rhs-list/rhs-list.component";
import {RegisterCoachComponent} from "./login/register/register-coach/register-coach.component";
import {RegisterCoachFormComponent} from "./login/register/register-coach/register-coach-form/register-coach-form.component";
import {RegisterCoachMessageComponent} from "./login/register/register-coach/register-coach-message/register-coach-message.component";
import {CodeDeontologieComponent} from "./login/register/register-coach/code-deontologie/code-deontologie.component";
import {PossibleCoachsListComponent} from "./admin/possible-coachs-list/possible-coachs-list.component";
import {ProfileCoachAdminComponent} from "./user/profile/coach/profile-coach-admin/profile-coach-admin.component";
import {PossibleCoachComponent} from "./user/profile/possible-coach/possible-coach.component";

const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: WelcomeComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'register_coach/step1', component: RegisterCoachComponent},
  {path: 'register_coach/code_deontologie', component: CodeDeontologieComponent},
  {path: 'register_coach/step2', component: RegisterCoachFormComponent},
  {path: 'register_coach/step3', component: RegisterCoachMessageComponent},
  {path: 'signup_coachee', component: SignupCoacheeComponent},
  {path: 'signup_coach', component: SignupCoachComponent},
  {path: 'signup_rh', component: SignupRhComponent},
  // {path: 'profile_coach', component: ProfileCoachComponent},
  // {path: 'profile_coachee', component: ProfileCoacheeComponent},
  {path: 'profile_rh', component: ProfileRhComponent},
  {path: 'profile_coach_admin/:id', component: ProfileCoachAdminComponent},
  {path: 'profile_possible_coach_admin/:id', component: PossibleCoachComponent},
  {path: 'profile_coach/:id', component: ProfileCoachComponent},
  {path: 'profile_coachee/:admin/:id', component: ProfileCoacheeComponent},
  {path: 'profile_coachee/:id', component: ProfileCoacheeComponent},
  {path: 'meetings', component: MeetingListComponent},
  {path: 'date/:meetingId', component: MeetingDateComponent},
  {path: 'available_meetings', component: AvailableMeetingsComponent},
  {
    path: 'admin', component: AdminComponent,
    children: [
      {path: 'signup', component: SignupAdminComponent},
      {path: 'coachs-list', component: AdminCoachsListComponent},
      {path: 'coachees-list', component: CoacheesListComponent},
      {path: 'rhs-list', component: RhsListComponent},
      {path: 'possible_coachs-list', component: PossibleCoachsListComponent}
    ]
  },

  // {path: 'coachees', component: CoachListComponent, canActivate: [AuthGuard]},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
