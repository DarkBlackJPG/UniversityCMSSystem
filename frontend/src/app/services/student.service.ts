import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url = "http://localhost:4000";
  constructor(private http: HttpClient) { }

  coursesForSemester(semester: number, department: number) {
    return this.http.get(`${this.url}/courses/semester/${semester}/${department}`);
  }

  getMyCourses(student: any) {
    return this.http.get(`${this.url}/student/${student.id}/courses`);
  }
  getMyCourseRegistrations(course_ids: number[]) {
    return this.http.post(`${this.url}/student/courses/registrations`, {course_ids: course_ids});
  }
  enrollmentStatus(student: any, coursesAndStatuses: any) {
    return this.http.post(`${this.url}/student/enroll/courses`, {
      student: student,
      coursesAndStatuses: coursesAndStatuses,
    });
  }

  registerForCourseEvent(student: any, course: any) {
    return this.http.post(`${this.url}/student/registration/create`, {
      student: student,
      course: course,
    });
  }

  uploadFileForCourseEvent(file: any, course: any) {
    return this.http.post(`${this.url}/student/registration/update/file_upload`, {
      file: file,
      registrationEvent: course,
    });
  }

  getMyUploads(course: any) {

  }

  unregisterForCourseEvent(myUser: any, reg: any) {
    return this.http.post(`${this.url}/student/remove/from/registration`, {
      student: myUser,
      course: reg,
    });
  }

  registerNewPassword(password: string, myUser: any) {
    return this.http.post(`${this.url}/student/verify`, {
      password: password,
      user: myUser,
    });
  }

  checkEnrollment(userId: number, coursecode: string) {
    return this.http.get(`${this.url}/student/${userId}/course/${coursecode}/enrolled`);
  }

  changePassword(id, newPassword: string) {
    return this.http.post(`${this.url}/student/change_password`, {
      id: id,
      pwd: newPassword
    });
  }
}
