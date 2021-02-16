import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import {LandingComponent} from "./landing/landing.component";
import {AdminComponent} from "./admin/admin.component";
import {UserComponent} from "./user/user.component";
import {CourseComponent} from "./course/course.component";
import {DepartmentCoursesComponent} from "./department-courses/department-courses.component";
import {EmployeesListComponent} from "./employees-list/employees-list.component";
import {ContactComponent} from "./contact/contact.component";
import {RegisterComponent} from "./register/register.component";
import {ProjectProposalsComponent} from "./project-proposals/project-proposals.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import {AdminViewAccountsComponent} from "./admin-view-accounts/admin-view-accounts.component";
import {AdminRegistrationComponent} from "./admin-registration/admin-registration.component";
import {AdminCoursesEditComponent} from "./admin-courses-edit/admin-courses-edit.component";
import {AdminEngagementPlanComponent} from "./admin-engagement-plan/admin-engagement-plan.component";


const routes: Routes = [
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
  // ---------| Admin pages end
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
