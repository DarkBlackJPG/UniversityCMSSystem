import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from "./landing/landing.component";
import { AdminComponent } from "./admin/admin.component";
import { DepartmentCoursesComponent } from "./department-courses/department-courses.component";
import { EmployeesListComponent } from "./employees-list/employees-list.component";
import { ContactComponent } from "./contact/contact.component";
import { RegisterComponent } from "./register/register.component";
import { ProjectProposalsComponent } from "./project-proposals/project-proposals.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { AdminViewAccountsComponent } from "./admin-view-accounts/admin-view-accounts.component";
import { AdminRegistrationComponent } from "./admin-registration/admin-registration.component";
import { AdminCoursesEditComponent } from "./admin-courses-edit/admin-courses-edit.component";
import { AdminEngagementPlanComponent } from "./admin-engagement-plan/admin-engagement-plan.component";
import { EmployeeProjectsComponent } from "./employee-projects/employee-projects.component";
import { GovernmentProjectsComponent } from "./government-projects/government-projects.component";
import { AdminNotificationsComponent } from "./admin-notifications/admin-notifications.component";
import { EmployeeComponent } from "./employee/employee.component";
import { EmployeeCourseListsComponent } from "./employee-course-lists/employee-course-lists.component";
import { EmployeeCourseNotificationsComponent } from "./employee-course-notifications/employee-course-notifications.component";
import { EmployeeStudentRegistrationListComponent } from "./employee-student-registration-list/employee-student-registration-list.component";
import { CourseDetailsComponent } from "./course-details/course-details.component";
import { StudentComponent } from "./student/student.component";
const routes = [
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    },
    {
        path: 'department/courses/info',
        component: DepartmentCoursesComponent,
    },
    {
        path: 'courses/master/info',
        component: DepartmentCoursesComponent,
    },
    {
        path: 'employee/all',
        component: EmployeesListComponent,
    },
    {
        path: 'contact',
        component: ContactComponent,
    },
    {
        path: 'notifications/get/all',
        component: NotificationsComponent,
    },
    {
        path: 'register/student',
        component: RegisterComponent
    },
    {
        path: 'projects/proposals/all',
        component: ProjectProposalsComponent
    },
    // -------| Admin pages begin
    {
        path: 'admin/accounts/all',
        component: AdminViewAccountsComponent
    },
    {
        path: 'admin/student/register',
        component: AdminRegistrationComponent
    },
    {
        path: 'admin/faculty/register',
        component: AdminRegistrationComponent
    },
    {
        path: 'admin/courses',
        component: AdminCoursesEditComponent
    },
    {
        path: 'admin/courses/engagement_plan',
        component: AdminEngagementPlanComponent
    },
    {
        path: 'admin/notifications',
        component: AdminNotificationsComponent
    },
    // ---------| Admin pages end
    //----------| Employee pages begin
    {
        path: 'employee',
        component: EmployeeComponent
    },
    {
        path: 'employee/my_courses',
        component: EmployeeCourseListsComponent
    },
    {
        path: 'employee/course/notifications',
        component: EmployeeCourseNotificationsComponent
    },
    {
        path: 'employee/student/registration',
        component: EmployeeStudentRegistrationListComponent
    },
    //----------| Employee pages end
    // ---------| Student pages begin
    {
        path: 'student',
        component: StudentComponent,
    },
    // ---------| Student pages end
    {
        path: 'statics/employee/projects',
        component: EmployeeProjectsComponent
    },
    {
        path: 'statics/employee/science',
        component: GovernmentProjectsComponent
    },
    {
        path: 'course/:id',
        component: CourseDetailsComponent
    },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
], AppRoutingModule);
export { AppRoutingModule };
//# sourceMappingURL=app-routing.module.js.map