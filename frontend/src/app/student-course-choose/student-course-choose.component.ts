import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../services/student.service";
import {formatWithOptions} from "util";
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-student-course-choose',
  templateUrl: './student-course-choose.component.html',
  styleUrls: ['./student-course-choose.component.css']
})
export class StudentCourseChooseComponent implements OnInit {

  constructor(private router: Router,
              private studentService: StudentService) {
  }

  availableCourses: any[] = [];
  enrollment_status: Object = {};
  myUser: any = {};

  ngOnInit(): void {
    let user = localStorage.getItem('session');

    if (user) {
      this.myUser = JSON.parse(user)
      if (this.myUser.student_data.verify === true) {
        this.router.navigate(['/verify'])
      }
      console.log(this.myUser)
      this.studentService.coursesForSemester(this.myUser.student_data.semester, this.myUser.student_data.department).subscribe((docs: any[]) => {
        console.log(docs);
        for (const doc of docs) {
          this.enrollment_status[doc.coursecode] = this.check_enrollement(doc);
        }
        this.availableCourses = docs;
      });
    } else {
      this.router.navigate(['']);
    }
  }

  private check_enrollement(course: any) {
    for (const stud of course.enrolled_students) {
      //console.log(stud)
      if (stud.student_id === this.myUser.id) {
        return true;
      }
    }
    return false;
  }

  confirm_selection() {
    let data = [];
    for (const [key, value] of Object.entries(this.enrollment_status)) {
      let a: string = key;
      if (value === true) {
        data.push({
          course_id: key,
          enrollment_status: value,
        });
      }


    }
    console.log(data)
    this.studentService.enrollmentStatus(this.myUser, data).subscribe((doc: any) => {
      if (doc.message === 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Super!',
          text: 'Uspesno si se prijavio/odjavio u zavisnosti od oznacenih zelja!',
        });
        this.studentService.coursesForSemester(this.myUser.student_data.semester, this.myUser.student_data.department).subscribe((docs: any[]) => {
          console.log(docs);
          this.enrollment_status = {};
          for (const doc of docs) {
            this.enrollment_status[doc.coursecode] = this.check_enrollement(doc);
          }
          this.availableCourses = docs;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Ouch...',
          text: 'Doslo je do neocekivane greske!',
        });
      }
    });

  }
}
