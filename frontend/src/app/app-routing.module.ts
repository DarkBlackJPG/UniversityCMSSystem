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
    path: 'employee/all',
    component: EmployeesListComponent,

  },
  {
    path: 'contact',
    component: ContactComponent,

  },
  {
    path: 'register/student',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
