import { Component, OnInit } from '@angular/core';
import {Employee} from "../models/database/Employee";
import {EmployeeService} from "../services/employee.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.css']
})
export class EmployeesListComponent implements OnInit {
  employees: Employee[] = [];
  employeeModal: Employee;
  showModal: boolean;
  public isCollapsed = false;
  constructor(private employeeService: EmployeeService,
              private router: Router) { }

  ngOnInit(): void {
    this.employeeService.getAllEmployees().subscribe((result: Employee[]) => {
      this.employees = result;
    });
    this.employeeModal = this.employees[0];
    this.showModal = false;
  }

  showEmployeeModal(employee: Employee) {
    this.employeeModal = employee;
    this.showModal = true;
  }

  closeEmployeeModal () {
    this.showModal = false;
  }

}
