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
  course: any = null;
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
            for (let datum of data) {
              datum.date = new Date(datum.date)
            }
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
          let type = this.fileList[0].name.split('.')[this.fileList[0].name.split('.').length - 1];
          let date = new Date();
          let uploader = {
            id: this.userData.id,
            name: this.userData.name,
            surname: this.userData.surname,
          };
          let download_link = file_data.filename;
          alert(type)
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
    this.courseService.getCoursesNotifications(this.course.id).subscribe((data: any[]) => {
      for (let datum of data) {
        datum.date = new Date(datum.date)
      }
      this.notifications = data;
    });
  }

  fileList = FileList;
  private getFileNameWithExt(file) {

    if (!file || !file.target || !file.target.files || file.target.files.length === 0) {
      return;
    }
    const name = file.target.files[0].name;
    const lastDot = name.lastIndexOf('.');
    const ext = name.substring(lastDot + 1);

    return ext;

  }
  set_selected($event) {
    this.fileList = $event.target.files;
  }

  stringify(file: any) {
    if (file != undefined) {
      return file.name + " " + file.surname;
    } else {
      return '';
    }
  }

  delete_notification(id) {

  }
  updateNotification: any = null;
  update_notification(id) {
    for (const notification of this.notifications) {
      if(notification.id == id) {
        this.updateNotification = notification;
      }
    }
  }
  updateFileList = FileList;
  set_update_selected($event) {
    this.updateFileList = $event.target.files;
  }

  update_send(id) {
    if (this.updateNotification.date === undefined ||
      this.updateNotification.title === '' ||
      this.updateNotification.description === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Sva polja su obavezna izuzev fajla!',
      })
      return;
    }
    if (this.updateFileList[0] != undefined) {
      this.uploadService.upload(this.updateFileList[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore
          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = this.updateFileList[0].name.split('.')[this.updateFileList[0].name.split('.').length - 1];
          let date = new Date();
          let uploader = {
            id: this.userData.id,
            name: this.userData.name,
            surname: this.userData.surname,
          };
          let download_link = file_data.filename;
          let notification = {
            id: this.updateNotification.id,
            title: this.updateNotification.title,
            description: this.updateNotification.description,
            date: this.updateNotification.date,
            file: {
              filename: filename,
              type: type,
              size: size,
              date: date,
              posted: uploader,
              download_link: download_link,
            }
          }
          alert("Salj")
          this.courseService.update_notification({
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
        id: this.updateNotification.id,
        title: this.updateNotification.title,
        description: this.updateNotification.description,
        date: this.updateNotification.date,
        file: this.updateNotification.file
      }

      this.courseService.update_notification({
        courseId: this.course.id,
        notification: notification
      }).subscribe((resp: any) => {
        if (resp.message == 'ok') {
          Swal.fire({
            icon: 'success',
            title: 'Jupi!',
            text: 'Azurirano obavestenje!',
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
    this.courseService.getCoursesNotifications(this.course.id).subscribe((data: any[]) => {
      for (let datum of data) {
        datum.date = new Date(datum.date)
      }
      this.notifications = data;
    });
  }

  delete_file() {
    Swal.fire({
      title: 'Da li sigurno zelite da izbrisete?',
      showDenyButton: true,
      confirmButtonText: `Da`,
      denyButtonText: `Ne`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Izbrisano!', '', 'success')
        this.updateNotification.file = {};
      } else if (result.isDenied) {
        Swal.fire('Fajl nije izbrisan!', '', 'info')
      }
    })
  }
}
