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
import {ProfilePossibleCoachComponent} from "./user/profile/possible-coach/profile-possible-coach.component";
import {ProfileCoacheeAdminComponent} from "app/user/profile/coachee/profile-coachee-admin/profile-coachee-admin.component";
import {ProfileRhAdminComponent} from "./user/profile/rh/profile-rh-admin/profile-rh-admin.component";
import {LegalNoticeComponent} from "./legals/legal-notice/legal-notice.component";
import {TermsOfUseComponent} from "./legals/terms-of-use/terms-of-use.component";
import {CookiePolicyComponent} from "./legals/cookie-policy/cookie-policy.component";
import {HomeAdminComponent} from "./admin/home-admin/home-admin.component";
import {AuthGuard} from "./service/auth-guard.service";
import {NotAuthGuard} from "./service/not-auth-guard";
import {DashboardComponent} from "./dashboard/dashboard.component";

const APP_ROUTES: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: WelcomeComponent, canActivate: [NotAuthGuard]},

  //{path: 'chat', component: ChatComponent},

  {path: 'signin', component: SigninComponent},

  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard],
    children: [
      {path: '', redirectTo: 'meetings', pathMatch: 'full'},
      {path: 'profile_rh/:id', component: ProfileRhComponent},
      {path: 'profile_coach/:id', component: ProfileCoachComponent},
      {path: 'profile_coachee/:id', component: ProfileCoacheeComponent},
      {path: 'meetings', component: MeetingListComponent},
      {path: 'date/:meetingId', component: MeetingDateComponent},
      {path: 'date', component: MeetingDateComponent},
      {path: 'available_meetings', component: AvailableMeetingsComponent}
    ]
  },

  {path: 'legal-notice', component: LegalNoticeComponent},
  {path: 'terms-of-use', component: TermsOfUseComponent},
  {path: 'cookie-policy', component: CookiePolicyComponent},

  {path: 'register_coach/step1', component: RegisterCoachComponent},
  {path: 'register_coach/code_deontologie', component: CodeDeontologieComponent},
  {path: 'register_coach/step2', component: RegisterCoachFormComponent},
  {path: 'register_coach/step3', component: RegisterCoachMessageComponent},

  {path: 'signup_coachee', component: SignupCoacheeComponent},
  {path: 'signup_coach', component: SignupCoachComponent},
  {path: 'signup_rh', component: SignupRhComponent},

  {path: 'admin', component: AdminComponent,
    children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'home', component: HomeAdminComponent},
      {path: 'signup', component: SignupAdminComponent},
      {path: 'coachs-list', component: AdminCoachsListComponent},
      {path: 'coachees-list', component: CoacheesListComponent},
      {path: 'rhs-list', component: RhsListComponent},
      {path: 'possible_coachs-list', component: PossibleCoachsListComponent},
      {path: 'profile/coach/:id', component: ProfileCoachAdminComponent},
      {path: 'profile/coachee/:id', component: ProfileCoacheeAdminComponent},
      {path: 'profile/possible-coach/:id', component: ProfilePossibleCoachComponent},
      {path: 'profile/rh/:id', component: ProfileRhAdminComponent}
    ]
  },

  // {path: 'coachees', component: CoachListComponent, canActivate: [AuthGuard]},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
