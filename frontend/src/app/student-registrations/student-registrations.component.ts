import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../services/student.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {formatWithOptions} from "util";
@Component({
  selector: 'app-student-registrations',
  templateUrl: './student-registrations.component.html',
  styleUrls: ['./student-registrations.component.css']
})
export class StudentRegistrationsComponent implements OnInit {


  constructor(private router: Router,
              private studentService: StudentService) {
  }

  myUser: any = {};
  myCourses: any[] = [];
  registrations: any[] = [];
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
  courseToSearch: any = null;
  isEnrolled(reg) {
    for (const elem of reg.enrolled) {
      if(elem === this.myUser.id) {
        return true
      }
    }
    return false;
  }
  register_for_activity(reg: any) {
    if (reg.max_num_students !== 0 && reg.enrolled_number + 1 > reg.max_num_students) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Prijavljen je maksimalan broj ljudi!',
      })
      return;
    }
    this.studentService.registerForCourseEvent(this.myUser, reg).subscribe( (response: any) => {
      console.log(response)
      if(response.message === 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Prijavljen.',
          text: 'Uspesno obavljena prijava!',
        })
        this.courseToSearch = null;
      }
    });
  }

  show_course(course: any) {
    this.courseToSearch = course;
    this.studentService.getMyCourseRegistrations(course.id).subscribe( (regs: any[]) => {
      console.log(regs)
      this.registrations = regs;
    })
  }

  unregister_for_activity(reg: any) {
    this.studentService.unregisterForCourseEvent(this.myUser, reg).subscribe( (response: any) => {
      console.log(response)
      if(response.message === 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Odjavljen.',
          text: 'Uspesno odjavljena prijava!',
        })
        this.courseToSearch = null;
      }
    });
  }
}
