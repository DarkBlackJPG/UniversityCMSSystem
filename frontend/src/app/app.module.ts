import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {LandingComponent} from './landing/landing.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/fontawesome-free/'
import {AdminComponent} from './admin/admin.component';
import {UserComponent} from './user/user.component';
import {CourseComponent} from './course/course.component';
import {DepartmentCoursesComponent} from './department-courses/department-courses.component';
import {EmployeesListComponent} from './employees-list/employees-list.component';
import {ContactComponent} from './contact/contact.component';
import {RegisterComponent} from './register/register.component';
import {ProjectProposalsComponent} from './project-proposals/project-proposals.component';
import {NotificationsComponent} from './notifications/notifications.component';
import {AdminViewAccountsComponent} from './admin-view-accounts/admin-view-accounts.component';
import {AdminRegistrationComponent} from './admin-registration/admin-registration.component';
import {AdminCoursesEditComponent} from './admin-courses-edit/admin-courses-edit.component';
import {AdminEngagementPlanComponent} from './admin-engagement-plan/admin-engagement-plan.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingComponent,
    AdminComponent,
    UserComponent,
    CourseComponent,
    DepartmentCoursesComponent,
    EmployeesListComponent,
    ContactComponent,
    RegisterComponent,
    ProjectProposalsComponent,
    NotificationsComponent,
    AdminViewAccountsComponent,
    AdminRegistrationComponent,
    AdminCoursesEditComponent,
    AdminEngagementPlanComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    CKEditorModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
