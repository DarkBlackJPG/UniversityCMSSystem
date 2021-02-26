import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {

  constructor(private router: Router) { }
  myUser: any = {};
  ngOnInit(): void {
    let userString = localStorage.getItem('session');
    if(userString) {
      this.myUser = JSON.parse(userString);
      if (this.myUser.type !== 2) {
        this.router.navigate(['']);
      }
      if (this.myUser.student_data.verify === true) {
        this.router.navigate(['/verify'])
      }
    } else {
      this.router.navigate([''])
    }
  }

}
