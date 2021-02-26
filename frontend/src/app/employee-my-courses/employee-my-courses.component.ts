import { Component, OnInit } from '@angular/core';
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-employee-my-courses',
  templateUrl: './employee-my-courses.component.html',
  styleUrls: ['./employee-my-courses.component.css']
})
export class EmployeeMyCoursesComponent implements OnInit {

  constructor(private router: Router) { }
  userData: any = {}
  ngOnInit(): void {
    let userString = localStorage.getItem('session');
    if(userString) {
      this.userData = JSON.parse(userString);
      if (this.userData.type !== 1) {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate([''])
    }
  }

}
