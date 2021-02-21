import { Component, OnInit } from '@angular/core';
import {Course} from "../models/database/Course";
import {CoursesService} from "../services/courses.service";
import {UserValidationServiceService} from "../services/user-validation-service.service";

@Component({
  selector: 'app-department-courses',
  templateUrl: './department-courses.component.html',
  styleUrls: ['./department-courses.component.css']
})
export class DepartmentCoursesComponent implements OnInit {
  departmentCourses: Course[];
  semesters: number[]
  sessionIsActive: boolean;
  constructor(private courseService: CoursesService,
              private userValidationService: UserValidationServiceService) {
  }

  ngOnInit(): void {
    let data = localStorage.getItem('session');
    if (data !== undefined && data !== null) {
      this.sessionIsActive = true;
    } else {
      this.sessionIsActive = false;

    }
    this.courseService.watchSelectedDepartment().subscribe((newId) => {
      let courseIdString = newId;
      let department = Number(courseIdString);
      this.semesters = []
      this.courseService.getCoursesByDepartment(department).subscribe(
        (courses: Course[]) => {
          this.departmentCourses = courses
          for (let i = 0; i < this.departmentCourses.length; ++i) {
            let exists = false;
            for (let j = 0; j < this.semesters.length; ++j) {
              if(this.departmentCourses[i].semester == this.semesters[j]) {
                exists = true;
              }
            }
            if (!exists) {
              this.semesters.push(this.departmentCourses[i].semester);
            }
          }
        });

    })
  }

  filterCourses(departmentCourses: Course[], semester: number) {
    let courses = []
    for (let i = 0; i < departmentCourses.length; ++i) {
      if (departmentCourses[i].semester == semester) {
        courses.push(departmentCourses[i]);
      }
    }
    return courses;
  }
}
