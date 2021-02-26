import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {CourseGroup} from "../models/appdata/CourseGroup";
import {Course} from "../models/database/Course";
import {NewCourseData} from "../models/appdata/NewCourseData";
import {UserRegistrationData} from "../models/appdata/UserRegistrationData";
import {EmployeeRegistration} from "../models/appdata/EmployeeRegistration";

@Injectable({
  providedIn: 'root'
})
export class AdministratorFunctionsService {

  private isStudentRegistration = new BehaviorSubject(0);

  getIsStudentRegistration() {
    return this.isStudentRegistration;
  }

  setIsStudentRegistration(value: number) {
    this.isStudentRegistration.next(value);
  }

  constructor(private http: HttpClient) {
  }

  url = "http://localhost:4000";

  getAllTitles() {
    return this.http.get(`${this.url}/titles/get/all`);
  }

  getAllStudents() {
    return this.http.get(`${this.url}/administrator/students/get/all`);
  }

  getAllEmployees() {
    return this.http.get(`${this.url}/employees/get/all/ignore_active`);
  }

  getEnrolledStudents(courseID: string) {
    return this.http.get(`${this.url}/course/${courseID}/get/enrolled/all`);
  }

  updateStudent(student: any) {
    return this.http.post(`${this.url}/administrator/student/update`, {data: student});
  }

  enrollStudent(course: string, index: string) {
    const data = {
      course_id: course,
      student_index: index
    };
    return this.http.post(`${this.url}/course/student/enroll`, data);
  }

  removeStudentFromCourse(course: string, index: string) {
    const data = {
      course_id: course,
      student_index: index
    };
    return this.http.post(`${this.url}/course/student/remove`, data);
  }

  update_course_engagement(selectedCourseObject: Course, courseGroups: CourseGroup[]) {
    return this.http.post(`${this.url}/course/engagement/update`, {
      course_id: selectedCourseObject.coursecode,
      engagement: courseGroups
    });
  }

  getEngagementForCourse(selectedCourseObject: Course) {
    return this.http.get(`${this.url}/course/${selectedCourseObject.coursecode}/get/engagement`);
  }

  insert_new_course(newCourseDataObject: Course[]) {
    return this.http.post(`${this.url}/course/create`, {data: newCourseDataObject});
  }

  update_existing_course(course) {
    return this.http.post(`${this.url}/course/update`, {data: course});
  }

  add_new_student(userData: UserRegistrationData) {
    return this.http.post(`${this.url}/students/create/new`, {data: userData});
  }
  add_new_employee(userData: EmployeeRegistration) {
    return this.http.post(`${this.url}/employees/create/new`, {data: userData});
  }

  updateEmployeeData(selected_employee: any) {
    return this.http.post(`${this.url}/employees/update`, {data: selected_employee});
  }
}
