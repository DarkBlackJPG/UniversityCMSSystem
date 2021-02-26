import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../services/student.service";

@Component({
  selector: 'app-student-my-courses',
  templateUrl: './student-my-courses.component.html',
  styleUrls: ['./student-my-courses.component.css']
})
export class StudentMyCoursesComponent implements OnInit {

  constructor(private router: Router,
              private studentService: StudentService) {
  }

  myUser: any = {};
  myCourses: any[] = [];
  ngOnInit(): void {
    let user = localStorage.getItem('session');
    if (user) {
      this.myUser = JSON.parse(user)
      if (this.myUser.student_data.verify === true) {
        this.router.navigate(['/verify'])
      }
      this.studentService.getMyCourses(this.myUser).subscribe( (data: any) => {
        console.log(data)
        for (const datum of data) {
          this.myCourses.push(datum.courses[0])
        }
      });
    } else {
      this.router.navigate(['']);
    }
  }

}
