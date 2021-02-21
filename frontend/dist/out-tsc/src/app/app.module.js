import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { CourseComponent } from './course/course.component';
import { DepartmentCoursesComponent } from './department-courses/department-courses.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { ContactComponent } from './contact/contact.component';
import { RegisterComponent } from './register/register.component';
import { ProjectProposalsComponent } from './project-proposals/project-proposals.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AdminViewAccountsComponent } from './admin-view-accounts/admin-view-accounts.component';
import { AdminRegistrationComponent } from './admin-registration/admin-registration.component';
import { AdminCoursesEditComponent } from './admin-courses-edit/admin-courses-edit.component';
import { AdminEngagementPlanComponent } from './admin-engagement-plan/admin-engagement-plan.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EmployeeProjectsComponent } from './employee-projects/employee-projects.component';
import { GovernmentProjectsComponent } from './government-projects/government-projects.component';
import { AdminNotificationsComponent } from './admin-notifications/admin-notifications.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeMyCoursesComponent } from './employee-my-courses/employee-my-courses.component';
import { EmployeeCourseNotificationsComponent } from './employee-course-notifications/employee-course-notifications.component';
import { EmployeeCourseListsComponent } from './employee-course-lists/employee-course-lists.component';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EmployeeStudentRegistrationListComponent } from './employee-student-registration-list/employee-student-registration-list.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { StudentComponent } from './student/student.component';
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
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
            EmployeeProjectsComponent,
            GovernmentProjectsComponent,
            AdminNotificationsComponent,
            EmployeeComponent,
            EmployeeMyCoursesComponent,
            EmployeeCourseNotificationsComponent,
            EmployeeCourseListsComponent,
            EmployeeStudentRegistrationListComponent,
            CourseDetailsComponent,
            StudentComponent,
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            FormsModule,
            HttpClientModule,
            NgbModule,
            CKEditorModule,
            DragDropModule,
            FontAwesomeModule,
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map