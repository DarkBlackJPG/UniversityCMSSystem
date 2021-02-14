import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

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

  constructor(private http: HttpClient) { }

  url = "http://localhost:4000";

  getAllTitles() {
    return this.http.get(`${this.url}/titles/get/all`);
  }

  getAllStudents() {
    return this.http.get(`${this.url}/students/get/all`);
  }

  getAllEmployees() {
    return this.http.get(`${this.url}/employees/get/all`);
  }

  findStudent(student: any) {

  }

  findEmployee(employee: any) {

  }

  updateStudent(student: any) {

  }

  updateEmployee(employee: any) {

  }
}
