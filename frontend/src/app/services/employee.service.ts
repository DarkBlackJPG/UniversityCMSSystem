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


  getEmployeeCourses(employeeId: number) {
    return this.http.get(`${this.url}/employee/${employeeId}/my_courses/get/all`);
  }

  updateEmployeeData(newEmployeeData: Employee) {

  }



}
