import { Component, OnInit } from '@angular/core';
import {EmployeeService} from "../services/employee.service";
import {UploadServiceService} from "../services/upload-service.service";
import {CoursesService} from "../services/courses.service";

@Component({
  selector: 'app-employee-student-registration-list',
  templateUrl: './employee-student-registration-list.component.html',
  styleUrls: ['./employee-student-registration-list.component.css']
})
export class EmployeeStudentRegistrationListComponent implements OnInit {
  courseLists: any[];

  constructor(private employeeService: EmployeeService,
              private uploadService: UploadServiceService,
              private courseService: CoursesService
  ) {

  }
  course: any = null;
  userData: any = {};
  myCourses: any[] = [];
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('session'));
    this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
      this.myCourses = courses;
    });
  }

  course_selection_change($event) {
    let courseId = $event.target.value;
    if (courseId != -1) {
      for (const course of this.myCourses) {
        if (course.id == courseId) {
          this.course = course;
          this.courseService.getCourseRegistrationLists(courseId).subscribe((data: any[]) => {
            this.courseLists = data;
          });
        }
      }
    } else {
      this.course = null;
    }
  }
}
