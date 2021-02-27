import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  public departmentID = new BehaviorSubject(0);
  constructor(private http: HttpClient) { }
  url = 'http://localhost:4000'

  watchSelectedDepartment() {
    return this.departmentID;
  }
  changeDepartmentID(id: number) {
    this.departmentID.next(id);
  }

  getCourseIds() {
    return this.http.get(`${this.url}/course/get/ids`);
  }

  getDepartmentIds() {
    return this.http.get(`${this.url}/department/get/ids`);
  }

  getCoursesByDepartment(departmentId: number) {
    return this.http.get(`${this.url}/department/course/info/get/${departmentId}`);
  }

  getCoursesNotifications(courseId: number) {
    return this.http.get(`${this.url}/courses/notifications/${courseId}`);
  }

  add_new_notification(data) {
    return this.http.post(`${this.url}/courses/notifications/upload`, data);
  }

  update_notification(param: {courseId: number, notification: {date: any; file: any; description: any; title: any}}) {
    return this.http.post(`${this.url}/courses/notifications/update`, param);
  }

  getCourseRegistrationLists(courseId: any) {
    return this.http.get(`${this.url}/courses/${courseId}/registration_lists/get/all`);
  }

  getCourseById(courseId: number) {
    return this.http.get(`${this.url}/course/${courseId}/get_details`);
  }

  removeCourse(course: any) {
    return this.http.post(`${this.url}/courses/remove`, {data: course});
  }
}
