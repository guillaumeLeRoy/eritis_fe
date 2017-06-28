import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";

import {AppComponent} from "./app.component";
import {HeaderComponent} from "./header/header.component";
import {DataService} from "./service/data.service";
import {LogService} from "./service/log.service";
import {routing} from "./app.routing";
import {SignupAdminComponent} from "./login/signup/signup-admin.component";
import {SigninComponent} from "./login/signin/signin.component";
import {AuthService} from "./service/auth.service";
import {AuthGuard} from "./login/auth.guard";
import {WelcomeComponent} from "./welcome/welcome.component";
import {ChatComponent} from "./chat/chat.component";
import {ChatItemComponent} from "./chat/chat-item.component";
import {CoachListComponent} from "./user/coach-item/coach-list.component";
import {CoachItemComponent} from "./user/coach-item/coach-item.component";
import {CoachCoacheeService} from "./service/coach_coachee.service";
import {CalendarModule} from "angular-calendar"; // lib
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MeetingsService} from "./service/meetings.service";
import {MeetingListComponent} from "./meeting/meeting-list/meeting-list.component";
import {MeetingItemCoacheeComponent} from "./meeting/meeting-list/coachee/meeting-item-coachee.component";
import {PreMeetingComponent} from "./meeting/pre-meeting.component";
import {ProfileCoachComponent} from "./user/profile/coach/profile-coach.component";
import {ProfileCoacheeComponent} from "./user/profile/coachee/profile-coachee.component";
import {ProfileCoachSummaryComponent} from "./user/profile/coach/profile-coach-summary.component";
import {MeetingItemCoachComponent} from "./meeting/meeting-list/coach/meeting-item-coach.component";
import {FirebaseService} from "./service/firebase.service";
import {MeetingDateComponent} from "./meeting/meeting-date/meeting-date.component";
import {SliderModule} from "primeng/components/slider/slider";
import {Ng2PageScrollModule} from "ng2-page-scroll";
import {AdminAPIService} from "./service/adminAPI.service";
import {AdminComponent} from "./admin/admin.component";
import {MeetingItemRhComponent} from "./meeting/meeting-list/rh/meeting-item-rh.component";
import {ProfileRhComponent} from "./user/profile/rh/profile-rh.component";
import {SignupCoacheeComponent} from "./login/signup/signup-coachee.component";
import {SignupCoachComponent} from "./login/signup/signup-coach.component";
import {SignupRhComponent} from "./login/signup/signup-rh.component";
import {AvailableMeetingsComponent} from "./meeting/meeting-list/coach/available-meetings.component";
import {AdminCoachsListComponent} from "./admin/coachs-list/admin-coachs-list.component";
import { CoacheesListComponent } from './admin/coachees-list/coachees-list.component';
import { RhsListComponent } from './admin/rhs-list/rhs-list.component';
import { MeetingListCoachComponent } from './meeting/meeting-list/coach/meeting-list-coach/meeting-list-coach.component';
import { MeetingListCoacheeComponent } from './meeting/meeting-list/coachee/meeting-list-coachee/meeting-list-coachee.component';
import { MeetingListRhComponent } from './meeting/meeting-list/rh/meeting-list-rh/meeting-list-rh.component';
import { CoacheeItemComponent } from './user/coachee-item/coachee-item.component';
import { RhItemComponent } from './user/rh-item/rh-item.component';
import { RegisterCoachComponent } from './login/register/register-coach/register-coach.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignupAdminComponent,
    SigninComponent,
    ProfileCoachComponent,
    ProfileCoacheeComponent,
    ProfileRhComponent,
    ProfileCoachSummaryComponent,
    WelcomeComponent,
    ChatComponent,
    ChatItemComponent,
    CoachListComponent,
    CoachItemComponent,
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
    CoacheesListComponent,
    RhsListComponent,
    MeetingListCoachComponent,
    MeetingListCoacheeComponent,
    MeetingListRhComponent,
    CoacheeItemComponent,
    RhItemComponent,
    RegisterCoachComponent
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
    Ng2PageScrollModule.forRoot()
  ],
  providers: [DataService, LogService, AuthService, AuthGuard, CoachCoacheeService, MeetingsService, FirebaseService, AdminAPIService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
