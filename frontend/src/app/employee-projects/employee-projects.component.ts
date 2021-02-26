import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-employee-projects',
  templateUrl: './employee-projects.component.html',
  styleUrls: ['./employee-projects.component.css']
})
export class EmployeeProjectsComponent implements OnInit {

  constructor(private router: Router) { }
  userData: any = {}
  ngOnInit(): void {

  }

}
