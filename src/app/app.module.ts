import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {AuthHeaderComponent} from "./header/auth-header/auth-header.component";
import {SessionService} from "./service/session.service";
import {routing} from "./app.routing";
import {SignupAdminComponent} from "./login/signup/signup-admin/signup-admin.component";
import {SigninComponent} from "./login/signin/signin.component";
import {AuthService} from "./service/auth.service";
import {WelcomeComponent} from "./welcome/welcome.component";
import {ChatComponent} from "./chat/chat.component";
import {ChatItemComponent} from "./chat/chat-item.component";
import {AdminCoachItemComponent} from "./admin/coachs-list/coach-item/admin-coach-item.component";
import {CoachCoacheeService} from "./service/coach_coachee.service";
import {CalendarModule} from "angular-calendar"; // lib
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MeetingsService} from "./service/meetings.service";
import {MeetingListComponent} from "./meeting/meeting-list/meeting-list.component";
import {MeetingItemCoacheeComponent} from "./meeting/meeting-list/coachee/meeting-item-coachee/meeting-item-coachee.component";
import {PreMeetingComponent} from "./meeting/meeting-date/pre-meeting/pre-meeting.component";
import {ProfileCoachComponent} from "./user/profile/coach/profile-coach.component";
import {ProfileCoacheeComponent} from "./user/profile/coachee/profile-coachee.component";
import {MeetingItemCoachComponent} from "./meeting/meeting-list/coach/meeting-item-coach/meeting-item-coach.component";
import {FirebaseService} from "./service/firebase.service";
import {MeetingDateComponent} from "./meeting/meeting-date/meeting-date.component";
import {SliderModule} from "primeng/components/slider/slider";
import {Ng2PageScrollModule} from "ng2-page-scroll";
import {AdminAPIService} from "./service/adminAPI.service";
import {AdminComponent} from "./admin/admin.component";
import {MeetingItemRhComponent} from "./meeting/meeting-list/rh/meeting-item-rh/meeting-item-rh.component";
import {ProfileRhComponent} from "./user/profile/rh/profile-rh.component";
import {SignupCoacheeComponent} from "./login/signup/signup-coachee/signup-coachee.component";
import {SignupCoachComponent} from "./login/signup/signup-coach/signup-coach.component";
import {SignupRhComponent} from "./login/signup/signup-rh/signup-rh.component";
import {AvailableMeetingsComponent} from "./meeting/meeting-list/coach/available-meetings/available-meetings.component";
import {AdminCoachsListComponent} from "./admin/coachs-list/admin-coachs-list.component";
import {AdminCoacheesListComponent} from "./admin/coachees-list/admin-coachees-list.component";
import {AdminRhsListComponent} from "./admin/rhs-list/admin-rhs-list.component";
import {MeetingListCoachComponent} from "./meeting/meeting-list/coach/meeting-list-coach/meeting-list-coach.component";
import {MeetingListCoacheeComponent} from "./meeting/meeting-list/coachee/meeting-list-coachee/meeting-list-coachee.component";
import {MeetingListRhComponent} from "./meeting/meeting-list/rh/meeting-list-rh/meeting-list-rh.component";
import {AdminCoacheeItemComponent} from "./admin/coachees-list/coachee-item/admin-coachee-item.component";
import {AdminRhItemComponent} from "./admin/rhs-list/rh-item/admin-rh-item.component";
import {RegisterCoachComponent} from "./login/register/register-coach/register-coach.component";
import {CodeDeontologieComponent} from "./login/register/register-coach/code-deontologie/code-deontologie.component";
import {RegisterCoachFormComponent} from "./login/register/register-coach/register-coach-form/register-coach-form.component";
import {RegisterCoachMessageComponent} from "./login/register/register-coach/register-coach-message/register-coach-message.component";
import {AdminPossibleCoachsListComponent} from "./admin/possible-coachs-list/admin-possible-coachs-list.component";
import {AdminPossibleCoachItemComponent} from "./admin/possible-coachs-list/possible-coach-item/admin-possible-coach-item.component";
import {ProfileCoachAdminComponent} from "./user/profile/coach/profile-coach-admin/profile-coach-admin.component";
import {ProfilePossibleCoachComponent} from "./user/profile/possible-coach/profile-possible-coach.component";
import {ProfileCoacheeAdminComponent} from "./user/profile/coachee/profile-coachee-admin/profile-coachee-admin.component";
import {ProfileRhAdminComponent} from "./user/profile/rh/profile-rh-admin/profile-rh-admin.component";
import {CookieModule} from "ngx-cookie";
import {NgsRevealModule} from "ng-scrollreveal";
import {LoaderSpinnerComponent} from "./loader/loader-spinner/loader-spinner.component";
import {SharedModule} from "./shared/shared.module";
import {FooterComponent} from "./footer/footer.component";
import {LegalNoticeComponent} from "./legals/legal-notice/legal-notice.component";
import {TermsOfUseComponent} from "./legals/terms-of-use/terms-of-use.component";
import {CookiePolicyComponent} from "./legals/cookie-policy/cookie-policy.component";
import {ProfileHeaderComponent} from "./user/profile/profile-header/profile-header.component";
import {HomeAdminComponent} from "./admin/home-admin/home-admin.component";
import {CoacheeDashboardComponent} from "./dashboard/coachee-dashboard/coachee-dashboard.component";
import {CoachDashboardComponent} from "./dashboard/coach-dashboard/coach-dashboard.component";
import {RhDashboardComponent} from "./dashboard/rh-dashboard/rh-dashboard.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AuthGuard} from "./service/auth-guard.service";
import {NotAuthGuard} from "./service/not-auth-guard";
import {WelcomeHeaderComponent} from './header/welcome-header/welcome-header.component';
import { SimpleHeaderComponent } from './header/simple-header/simple-header.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupAdminComponent,
    SigninComponent,
    ProfileCoachComponent,
    ProfileCoacheeComponent,
    ProfileRhComponent,
    WelcomeComponent,
    ChatComponent,
    ChatItemComponent,
    AdminCoachItemComponent,
    MeetingListComponent,
    MeetingItemCoacheeComponent,
    MeetingItemCoachComponent,
    MeetingDateComponent,
    PreMeetingComponent,
    AdminCoachsListComponent,
    AdminComponent,
    MeetingItemRhComponent,
    SignupCoacheeComponent,
    SignupCoachComponent,
    SignupRhComponent,
    AvailableMeetingsComponent,
    AdminCoacheesListComponent,
    AdminRhsListComponent,
    MeetingListCoachComponent,
    MeetingListCoacheeComponent,
    MeetingListRhComponent,
    AdminCoacheeItemComponent,
    AdminRhItemComponent,
    RegisterCoachComponent,
    CodeDeontologieComponent,
    RegisterCoachFormComponent,
    RegisterCoachMessageComponent,
    AdminPossibleCoachsListComponent,
    AdminPossibleCoachItemComponent,
    ProfileCoachAdminComponent,
    ProfilePossibleCoachComponent,
    ProfileCoacheeAdminComponent,
    ProfileRhAdminComponent,
    LoaderSpinnerComponent,
    FooterComponent,
    LegalNoticeComponent,
    TermsOfUseComponent,
    CookiePolicyComponent,
    ProfileHeaderComponent,
    HomeAdminComponent,
    CoacheeDashboardComponent,
    CoachDashboardComponent,
    RhDashboardComponent,
    DashboardComponent,
    WelcomeHeaderComponent,
    AuthHeaderComponent,
    SimpleHeaderComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ReactiveFormsModule,
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    SliderModule,
    Ng2PageScrollModule.forRoot(),
    CookieModule.forRoot(),
    NgsRevealModule.forRoot(),
    SharedModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, CoachCoacheeService, MeetingsService, FirebaseService, AdminAPIService, SessionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
