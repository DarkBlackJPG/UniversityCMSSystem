import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../services/employee.service";
import {UploadServiceService} from "../services/upload-service.service";
import {Course} from "../models/database/Course";
import {CoursesService} from "../services/courses.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-employee-course-notifications',
  templateUrl: './employee-course-notifications.component.html',
  styleUrls: ['./employee-course-notifications.component.css']
})

export class EmployeeCourseNotificationsComponent implements OnInit {
  public Editor = ClassicEditor;


  constructor(private employeeService: EmployeeService,
              private uploadService: UploadServiceService,
              private courseService: CoursesService,
  ) {
  }

  myCourses: any[] = [];
  notifications: any[] = [];
  course: any = {};
  newNotification: any = {
    course_id: -1,
    id: -1,
    title: '',
    description: '',
    date: new Date(),
    file: '',
  };
  userData: any = {};

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem('session'));
    this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
      this.myCourses = courses;
    });
  }

  course_selection_change($event) {
    let courseId = $event.target.value;
    if (courseId != -1) {
      for (const course of this.myCourses) {
        if (course.id == courseId) {
          this.course = course;
          this.courseService.getCoursesNotifications(courseId).subscribe((data: any[]) => {
            this.notifications = data;
          });
        }
      }
    } else {
      this.course = null;
    }
  }

  cancel_input() {
    this.newNotification = {
      course_id: -1,
      id: -1,
      title: '',
      description: '',
      date: new Date(),
      file: '',
    };
  }

  send_notification() {
    if (this.newNotification.date === undefined ||
      this.newNotification.title === '' ||
      this.newNotification.description === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Sva polja su obavezna izuzev fajla!',
      })
      return;
    }

    if (this.fileList[0] != undefined) {
      this.uploadService.upload(this.fileList[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore
          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = file_data.file_extension;
          let date = new Date();
          let uploader = {
            id: this.userData.id,
            name: this.userData.name,
            surname: this.userData.surname,
          };
          let download_link = file_data.filename;

          let notification = {
            title: this.newNotification.title,
            description: this.newNotification.description,
            date: this.newNotification.date,
            file: {
              filename: filename,
              type: type,
              size: size,
              date: date,
              posted: uploader,
              download_link: download_link,
            }
          }

          this.courseService.add_new_notification({
            courseId: this.course.id,
            notification: notification
          }).subscribe((resp: any) => {
            if (resp.message == 'ok') {
              Swal.fire({
                icon: 'success',
                title: 'Jupi!',
                text: 'Postavljeno obavestenje!',
              })
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Nesto nije dobro!',
              })
            }
          });
        }
      });
    } else {
      let notification = {
        title: this.newNotification.title,
        description: this.newNotification.description,
        date: this.newNotification.date,
        file: {}
      }
      this.courseService.add_new_notification({
        courseId: this.course.id,
        notification: notification
      }).subscribe((resp: any) => {
        if (resp.message == 'ok') {
          Swal.fire({
            icon: 'success',
            title: 'Jupi!',
            text: 'Postavljeno obavestenje!',
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Nesto nije dobro!',
          })
        }
      });
    }
  }

  fileList = FileList;

  set_selected($event) {
    this.fileList = $event.target.files;
  }
}
