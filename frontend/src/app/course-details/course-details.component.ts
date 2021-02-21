import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CoursesService} from "../services/courses.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {EmployeeService} from "../services/employee.service";
import {StudentService} from "../services/student.service";
import {UploadServiceService} from "../services/upload-service.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

  constructor(private studentService: StudentService,
              private activatedRoute: ActivatedRoute,
              private courseService: CoursesService,
              private route: Router,
              private employeeService: EmployeeService,
              private uploadService: UploadServiceService) { }

  course: number;
  courseDetails = null;
  currentView = 1;
  today: Date;

  engagementIds;

  employees: any[] = [];
  registrations: any[] = [];
  myUser: any = {};
  ngOnInit(): void {
    let user = localStorage.getItem('session');
    if(!user) {
      this.route.navigate(['']);
    } else {
      this.myUser = JSON.parse(user);
    }
    this.course = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.today = new Date();
    this.today.setHours(0,0,0,0);
    this.courseService.getCourseById(this.course).subscribe((response:any) => {
      if(response.message === undefined) {
        this.courseDetails = response;
        this.engagementIds = new Set();
        for (const engagement of this.courseDetails.engagement) {
          this.engagementIds.add(engagement.lectureLecturer);
          this.engagementIds.add(engagement.auditoryExcercisesLecturer);
        }
        let userList = [...this.engagementIds].map(value => Number(value));
        this.employeeService.getEmployeeById(userList).subscribe((response:any[]) => {
          this.employees = response;
        });

        this.studentService.getMyCourseRegistrations(this.courseDetails.id).subscribe((response:any[]) => this.registrations = response);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Predmet ne postoji!",
        });
      }
    });
  }

  filteredRegs: any[] = [];

  change_view(number: number) {
    this.currentView = number;
    if (number === 9) {
      this.filteredRegs = this.registrations.filter( value => value.uploadEnabled === true)
    }
  }

  check_seven_day_date(date: string) {
    let notificationDate = new Date(date);
    notificationDate.setHours(0,0,0,0);
    let seven_days = this.today.getTime() - (7 * 24 * 60 * 60 * 1000)
    return notificationDate.getTime() >= seven_days;
  }

  get_year(semester: any) {
    return parseInt(String(Number(semester) / 2));
  }

  route_to_employee_details(id) {
    //
  }

  check_enrolled(registration: any) {
    for (const enrolledElement of registration.enrolled) {
      if(enrolledElement === this.myUser.id) {
        return true;
      }
    }
    return false;
  }

  payload: any = {
    reg: null,
    file: FileList,
  }
  accept_file($event, reg) {
    this.payload = {
      reg: reg,
      file: $event.target.files,
    };

    console.log(this.payload.file)
  }

  upload_file(registration: any) {
    if(this.payload.reg.id !== registration.id) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Nije dobro dugme sa postavljenim fajlom!",
      });
      return;
    }

    if (this.payload.file[0] !== undefined) {
      this.uploadService.upload(this.payload.file[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore
          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = this.payload.file[0].name.split('.')[this.payload.file[0].name.split('.').length - 1];
          let date = new Date();
          let uploader = {
            id: this.myUser.id,
            name: this.myUser.name,
            surname: this.myUser.surname,
          };
          let download_link = file_data.filename;
          this.studentService.uploadFileForCourseEvent({
            size: size,
            filename: filename,
            type: type,
            date: date,
            uploader: uploader,
            download_link: download_link,
          }, this.payload.reg).subscribe((response: any) => {
            console.log(response);
            if (response.message === 'ok') {
              Swal.fire({
                icon: 'success',
                title: 'Super!',
                text: "Uspesno postavljen fajl!",
              });

            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Nije postavljen fajl!",
              });
            }
          });
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Nije postavljen fajl!",
      });
    }
  }
}
