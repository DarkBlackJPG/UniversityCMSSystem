import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Employee} from "../models/database/Employee";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = 'http://localhost:4000'

  constructor(protected http: HttpClient) { }

  getAllEmployees() {
    return this.http.get(`${this.url}/employees/get/all`);
  }

  getEmployeeById(employeeId: number[]) {
    return this.http.post(`${this.url}/employees/get`, {data: employeeId});
  }

  getEmployeeCourses(employeeId: number) {
    return this.http.get(`${this.url}/employee/${employeeId}/my_courses/get/all`);
  }

  updateEmployeeData(newEmployeeData: any) {
    return this.http.post(`${this.url}/employee/profile/update`, {data: newEmployeeData});
  }

  updateEmployeePicture(userId: number, employeePicture: {picture: string}) {
    return this.http.post(`${this.url}/employee/profile/profilepicture/upload/${userId}`, {picture: employeePicture});
  }

  updateCourseData(courseData: any) {
    return this.http.post(`${this.url}/employee/course/${courseData.id}/update`, {data: courseData});
  }

  appendNewUploadedLecture(courseId:number, filedata: any) {
    return this.http.post(`${this.url}/employee/course/${courseId}/lectures/update`, {data: filedata});
  }

  appendNewUploadedExcercise(id, filedata: { date: Date; filename: any; download_link: any; size: string; type: any; posted: { surname: any; name: any; id: any } }) {
    return this.http.post(`${this.url}/employee/course/${id}/excercises/update`, {data: filedata});
  }
  appendNewUploadedExam(id, filedata: { date: Date; filename: any; download_link: any; size: string; type: any; posted: { surname: any; name: any; id: any } }) {
    return this.http.post(`${this.url}/employee/course/${id}/exams/update`, {data: filedata});
  }

  uploadNewLabNotification(id, newLabTextNotif: any) {
    return this.http.post(`${this.url}/employee/course/${id}/labs/notification/create`, {data: newLabTextNotif});
  }
  uploadNewProjectNotification(id, newLabTextNotif: any) {
    return this.http.post(`${this.url}/employee/course/${id}/projects/notification/create`, {data: newLabTextNotif});
  }
  appendNewLabFile(id, newLabTextNotif: any) {
    return this.http.post(`${this.url}/employee/course/${id}/labs/files/create`, {data: newLabTextNotif});
  }
  appendNewProjectFile(id, newLabTextNotif: any) {
    return this.http.post(`${this.url}/employee/course/${id}/projects/files/create`, {data: newLabTextNotif});
  }

  openNewRegistrationList(newRegistrationList: { course_id: number; max_num_students: number; title: string; isActive: boolean; enrolled_number: number; date_open: Date; date_close: Date; location: string; upload_enabled: boolean; id: number; student_files: any[]; exam_date: Date; enrolled: any[] }) {
    return this.http.post(`${this.url}/employee/course/registration_lists/new`, {data: newRegistrationList});
  }

  getAllRegistrationListsForCourse(courseId: number) {
    return this.http.get(`${this.url}/employee/course/${courseId}/registration_lists/get_all`);
  }

  deleteCourseRegistrationList(courseId: number, data: any) {
    return this.http.post(`${this.url}/employee/course/${courseId}/registration_lists/delete`, {data: data});

  }
  updateRegList(courseId: number, data: any) {
    return this.http.post(`${this.url}/employee/course/${courseId}/registration_lists/update`, {data: data});
  }

  change_section_visibility(id: number, e: string, exams_visible: boolean) {
    return this.http.post(`${this.url}/employee/course/${id}/change_section_visibility`, {data: {section: e, status: exams_visible}});
  }
}
