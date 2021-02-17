import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  active_employe: any;

  constructor() { }

  ngOnInit(): void {
    this.active_employe = JSON.parse(localStorage.getItem("session"));
  }

}
