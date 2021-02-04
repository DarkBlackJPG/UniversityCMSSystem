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
}