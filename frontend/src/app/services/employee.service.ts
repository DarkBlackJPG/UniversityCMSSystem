import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  url = 'http://localhost:4000'

  constructor(protected http: HttpClient) { }

  getAllEmployees() {
    return this.http.get(`${this.url}/employees/get/all`);
  }
}
