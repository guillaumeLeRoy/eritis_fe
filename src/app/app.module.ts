import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {RecipesComponent} from './recipes/recipes.component';
import {RecipesListComponent} from './recipes/recipes-list/recipes-list.component';
import {RecipeItemComponent} from './recipes/recipes-list/recipe-item.component';
import {RecipeDetailsComponent} from './recipes/recipe-details/recipe-details.component';
import {ShopingListComponent} from './shoping-list/shoping-list.component';
import {ShopingListAddComponent} from './shoping-list/shoping-list-add/shoping-list-add.component';
import {MyDirectiveDirective} from './shoping-list/my-directive.directive';
import {UnlessDirective} from './shoping-list/unless.directive';
import {DropdownDirective} from './dropdown.directive';
import {DataService} from './service/data.service';
import {LogService} from './service/log.service';
import {ShoppingListService} from './shoping-list/shopping-list.service';
import {routing} from "./app.routing";
import {RecipeEditComponent} from './recipes/recipe-edit/recipe-edit.component';
import {RecipeStartComponent} from './recipes/recipe-start.component';
import {SignupComponent} from './login/signup/signup.component';
import {SigninComponent} from './login/signin/signin.component';
import {AuthService} from "./service/auth.service";
import {AuthGuard} from "./login/auth.guard";
import {WelcomeComponent} from './welcome/welcome.component';
import {ChatComponent} from './chat/chat.component';
import {ChatItemComponent} from './chat/chat-item.component';
import {CoachListComponent} from './user/coach-list/coach-list.component';
import {CoachItemComponent} from './user/coach-list/coach-item.component';
import {CoachCoacheeService} from "./service/CoachCoacheeService";
import {CoachDetailsComponent} from './user/coach-details/coach-details.component';
import {MaterialModule} from "@angular/material";//lib
import {CalendarModule} from 'angular-calendar';//lib
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import {InputTextModule} from "primeng/components/inputtext/inputtext";


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipesListComponent,
    RecipeItemComponent,
    RecipeDetailsComponent,
    ShopingListComponent,
    ShopingListAddComponent,
    MyDirectiveDirective,
    UnlessDirective,
    DropdownDirective,
    RecipeEditComponent,
    RecipeStartComponent,
    SignupComponent,
    SigninComponent,
    ProfileCoachComponent,
    ProfileCoacheeComponent,
    ProfileCoachSummaryComponent,
    WelcomeComponent,
    ChatComponent,
    ChatItemComponent,
    CoachListComponent,
    CoachItemComponent,
    CoachDetailsComponent,
    MeetingListComponent,
    MeetingItemCoacheeComponent,
    MeetingItemCoachComponent,
    MeetingDateComponent,
    PreMeetingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    ReactiveFormsModule,
    MaterialModule.forRoot(),
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    InputTextModule,
    SliderModule,
  ],
  providers: [DataService, LogService, ShoppingListService, AuthService, AuthGuard, CoachCoacheeService, MeetingsService, FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
