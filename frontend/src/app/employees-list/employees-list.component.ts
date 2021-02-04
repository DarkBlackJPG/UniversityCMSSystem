import { Component, OnInit } from '@angular/core';
import {Employee} from "../models/database/Employee";
import {EmployeeService} from "../services/employee.service";

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  public isCollapsed = false;
  constructor(private employeeService: EmployeeService) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((result: Employee[]) => {
      this.employees = result;
    });
  }

}
