import {Component, OnInit} from '@angular/core';
import {EmployeeService} from "../services/employee.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Observable} from "rxjs/internal/Observable";
import {UploadServiceService} from "../services/upload-service.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {logger} from "codelyzer/util/logger";
import {Route, Router} from "@angular/router";


@Component({
  selector: 'app-employee-course-lists',
  templateUrl: './employee-course-lists.component.html',
  styleUrls: ['./employee-course-lists.component.css']
})
export class EmployeeCourseListsComponent implements OnInit {
  public Editor = ClassicEditor;

  constructor(private employeeService: EmployeeService,
              private uploadService: UploadServiceService,
              private router: Router) {
  }


  myCourses: any[] = [];
  selectedCourse: any = null;

  activePage: number = 1;
  userData: any;
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
    this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
      this.myCourses = courses;
    });
  }

  predavanja = [

  ];
  vezbe = [

  ];
  rokovi = [

  ];

  drop1(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.predavanja, event.previousIndex, event.currentIndex);
  }

  drop2(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.vezbe, event.previousIndex, event.currentIndex);
  }

  drop3(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rokovi, event.previousIndex, event.currentIndex);
  }

  newLecture = FileList;
  newExcercise = FileList;
  newExam = FileList;
  newProjectFile = FileList;
  newLabFile = FileList;


  select_current_course($event) {
    const courseId = Number($event.target.value)
    for (const course of this.myCourses) {
      if (course.id === courseId) {
        this.selectedCourse = course;
        this.predavanja = this.selectedCourse.lectures;
        this.vezbe = this.selectedCourse.excercises;
        this.rokovi = this.selectedCourse.exams;
      }
    }
  }

  update_course() {
    if (this.selectedCourse.coursecode === undefined || this.selectedCourse.coursecode === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Greska sa sifrom predmeta",
      });
      return;
    }

    if (this.selectedCourse.semester === undefined || this.selectedCourse.semester < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Semestar mora biti pozitivan, nenulti broj",
      });

      return
    }
    if (this.selectedCourse.courseDetails[0].ESPB === undefined || this.selectedCourse.courseDetails[0].ESPB < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "ESPB mora biti pozitivan, nenulti broj",
      });
      return;
    }
    let regex = new RegExp("^\\d\\+\\d\\+\\d$")
    if (this.selectedCourse.courseDetails[0].classCount === undefined || !regex.test(this.selectedCourse.courseDetails[0].classCount.trim())) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Fond casova nije u odgovarajucem formatu!",
      });
      return;
    }
    if (this.selectedCourse.acronym === undefined || this.selectedCourse.acronym === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Akronim nije definisan!",
      });
      return;
    }
    if (this.selectedCourse.name === undefined || this.selectedCourse.name === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Naziv nije definisan!",
      });
      return;
    }
    if (this.selectedCourse.courseDetails[0].conditions === undefined || this.selectedCourse.courseDetails[0].conditions === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Uslovi moraju da se definisu!",
      });
      return;
    }
    if (this.selectedCourse.courseDetails[0].purpose === undefined || this.selectedCourse.courseDetails[0].purpose === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Cilj mora da se definise!",
      });
      return;
    }
    if (this.selectedCourse.courseDetails[0].outcome === undefined || this.selectedCourse.courseDetails[0].outcome === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Ishod mora da se definise!",
      });
      return;
    }
    if (this.selectedCourse.courseDetails[0].lectureDates === undefined || this.selectedCourse.courseDetails[0].lectureDates === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Termini predavanja moraju da se definisu!",
      });
      return;
    }
    if (this.selectedCourse.courseDetails[0].auditoryExcercisesDates === undefined || this.selectedCourse.courseDetails[0].auditoryExcercisesDates === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Termini predavanja moraju da se definisu!",
      });
      return;
    }


    this.employeeService.updateCourseData(this.selectedCourse).subscribe( (response:any) => {
      if(response.message === 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Super!',
          text: "Uspesno azuriran kurs!",
        });

        this.selectedCourse = null;
        this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
          this.myCourses = courses;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do neocekivane greske!",
        });
      }
    });

  }

  change_course_type($event) {
    this.selectedCourse.type = $event.target.value;
  }

  change_academic_level($event) {
    if ($event.target.value === '1') { // isMaster
      this.selectedCourse.department = 3;
      this.selectedCourse.isMaster = true;

    } else { // !isMaster
      this.selectedCourse.department = -1;
      this.selectedCourse.isMaster = false;
    }
  }

  change_department($event) {
    this.selectedCourse.department = $event.target.value;

  }

  register_new_lecture_file($event) {
    this.newLecture = $event.target.files;
  }

  upload_new_lecture() {
  if (this.newLecture[0] != undefined) {
      this.uploadService.upload(this.newLecture[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore

          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = this.newLecture[0].name.split('.')[this.newLecture[0].name.split('.').length - 1];

          let download_link = file_data.filename;
          let filedata = {
            filename: filename,
            type: type,
            size: size,
            date: new Date(),
            posted: {
              id: this.userData.id,
              name: this.userData.name,
              surname: this.userData.surname
            },
            download_link: download_link,
          }

          this.employeeService.appendNewUploadedLecture(this.selectedCourse.id, filedata).subscribe( (resp: any) => {
            if (resp.message === 'ok') {
              Swal.fire({
                icon: 'success',
                title: 'Uspeh!',
                text: "Uspesno postavljen fajl!",
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Doslo je do greske prilikom postavljanja!",
              });
            }
            this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
              this.myCourses = courses;
            });
            this.selectedCourse = null;
            this.newLecture = FileList;
          });

        }
      });
    }
  }


  upload_new_exercise() {
  if (this.newExcercise[0] != undefined) {
      this.uploadService.upload(this.newExcercise[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore

          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = this.newExcercise[0].name.split('.')[this.newExcercise[0].name.split('.').length - 1];

          let download_link = file_data.filename;
          let filedata = {
            filename: filename,
            type: type,
            size: size,
            date: new Date(),
            posted: {
              id: this.userData.id,
              name: this.userData.name,
              surname: this.userData.surname
            },
            download_link: download_link,
          }

          this.employeeService.appendNewUploadedExcercise(this.selectedCourse.id, filedata).subscribe( (resp: any) => {
            if (resp.message === 'ok') {
              Swal.fire({
                icon: 'success',
                title: 'Uspeh!',
                text: "Uspesno postavljen fajl!",
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Doslo je do greske prilikom postavljanja!",
              });
            }
            this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
              this.myCourses = courses;
            });
            this.selectedCourse = null;
            this.newExcercise = FileList;
          });

        }
      });
    }
  }

  upload_new_exam() {
  if (this.newExam[0] != undefined) {
      this.uploadService.upload(this.newExam[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore

          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = this.newExam[0].name.split('.')[this.newExam[0].name.split('.').length - 1];

          let download_link = file_data.filename;
          let filedata = {
            filename: filename,
            type: type,
            size: size,
            date: new Date(),
            posted: {
              id: this.userData.id,
              name: this.userData.name,
              surname: this.userData.surname
            },
            download_link: download_link,
          }

          this.employeeService.appendNewUploadedExam(this.selectedCourse.id, filedata).subscribe( (resp: any) => {
            if (resp.message === 'ok') {
              Swal.fire({
                icon: 'success',
                title: 'Uspeh!',
                text: "Uspesno postavljen fajl!",
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Doslo je do greske prilikom postavljanja!",
              });
            }
            this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
              this.myCourses = courses;
            });
            this.selectedCourse = null;
            this.newExam = FileList;
          });

        }
      });
    }
  }

  register_new_excercise_file($event) {
    this.newExcercise = $event.target.files;
  }
  register_new_exam_file($event) {
    this.newExam = $event.target.files;
  }

  currentLabView = -1;
  currentProjView = -1;
  lab_view_change($event) {
    this.currentLabView = Number($event.target.value);
  }

  newLabTextNotif: any = {
    title: '',
    desc: '',
  }
  newProjTextNotif: any = {
    title: '',
    desc: '',
  }

  upload_lab_notif() {
    if (this.newLabTextNotif.title == '' || this.newLabTextNotif.desc == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Oba polja su obavezna!",
      });
      return;
    }

    this.employeeService.uploadNewLabNotification(this.selectedCourse.id, this.newLabTextNotif).subscribe((response: any) => {
      if(response.message === 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Super!',
          text: "Dodato je novo tekstualno polje za laboratoriju!",
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske!",
        });
      }
      this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
        this.myCourses = courses;
      });
      this.currentLabView = -1;
      this.newLabTextNotif = {
        title: '',
        desc: '',
      }
      this.selectedCourse = null;
    });
  }

  proj_view_change($event) {
    this.currentProjView = Number($event.target.value);
  }

  upload_proj_notif() {
    if (this.newProjTextNotif.title == '' || this.newProjTextNotif.desc == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Oba polja su obavezna!",
      });
      return;
    }
    this.employeeService.uploadNewProjectNotification(this.selectedCourse.id, this.newProjTextNotif).subscribe((response: any) => {
      if(response.message === 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Super!',
          text: "Dodato je novo tekstualno polje za projekat!",
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske!",
        });
      }
      this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
        this.myCourses = courses;
      });
      this.currentLabView = -1;
      this.newProjTextNotif = {
        title: '',
        desc: '',
      }
      this.selectedCourse = null;
    });
  }


  register_new_proj_file($event) {
    this.newProjectFile = $event.target.files;
  }

  upload_new_proj_file() {
    if (this.newProjectFile[0] != undefined) {
      this.uploadService.upload(this.newProjectFile[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore

          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = this.newProjectFile[0].name.split('.')[this.newProjectFile[0].name.split('.').length - 1];

          let download_link = file_data.filename;
          let filedata = {
            title: this.newProjTextNotif.title, // Dodato
            desc: this.newProjTextNotif.desc,   // Dodato
            filename: filename,
            type: type,
            size: size,
            date: new Date(),
            posted: {
              id: this.userData.id,
              name: this.userData.name,
              surname: this.userData.surname
            },
            download_link: download_link,
          }

          this.employeeService.appendNewProjectFile(this.selectedCourse.id, filedata).subscribe( (resp: any) => {
            if (resp.message === 'ok') {
              Swal.fire({
                icon: 'success',
                title: 'Uspeh!',
                text: "Uspesno postavljen fajl!",
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Doslo je do greske prilikom postavljanja!",
              });
            }
            this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
              this.myCourses = courses;
            });
            this.selectedCourse = null;
            this.newProjectFile = FileList;
          });

        }
      });
    }
  }

  upload_new_lab_file() {
    if (this.newLabFile[0] != undefined) {
      this.uploadService.upload(this.newLabFile[0]).subscribe((res: any) => {
        if (res instanceof HttpResponse) {
          // @ts-ignore

          let file_data = res.body.file_data;
          let size = String(file_data.size / 1024) + "KB";
          let filename = file_data.originalname;
          let type = this.newLabFile[0].name.split('.')[this.newLabFile[0].name.split('.').length - 1];

          let download_link = file_data.filename;
          let filedata = {
            title: this.newLabTextNotif.title, // Dodato
            desc: this.newLabTextNotif.desc,   // Dodato
            filename: filename,
            type: type,
            size: size,
            date: new Date(),
            posted: {
              id: this.userData.id,
              name: this.userData.name,
              surname: this.userData.surname
            },
            download_link: download_link,
          }

          this.employeeService.appendNewLabFile(this.selectedCourse.id, filedata).subscribe( (resp: any) => {
            if (resp.message === 'ok') {
              Swal.fire({
                icon: 'success',
                title: 'Uspeh!',
                text: "Uspesno postavljen fajl!",
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Doslo je do greske prilikom postavljanja!",
              });
            }
            this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
              this.myCourses = courses;
            });
            this.selectedCourse = null;
            this.newLabFile = FileList;
          });

        }
      });
    }
  }

  register_new_lab_file($event) {
    this.newLabFile = $event.target.files;
  }

  delete_project_file(filename: string) {
    this.employeeService.delete_project_file(filename, this.selectedCourse.id).subscribe( (resp: any) => {
      if (resp.message == 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno izbrisan fajl!",
        });
        this.myCourses = [];
        this.selectedCourse = null;
        this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
          this.myCourses = courses;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: "Doslo je do greske!",
        });
      }
    })
  }

  delete_lab_file(filename: string) {
    this.employeeService.delete_lab_file(filename, this.selectedCourse.id).subscribe( (resp: any) => {
      if (resp.message == 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno izbrisan fajl!",
        });
        this.myCourses = [];
        this.selectedCourse = null;
        this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
          this.myCourses = courses;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: "Doslo je do greske!",
        });
      }
    })
  }

  delete_exam_file(filename: string) {
    this.employeeService.delete_exam_file(filename, this.selectedCourse.id).subscribe( (resp: any) => {
      if (resp.message == 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno izbrisan fajl!",
        });
        this.myCourses = [];
        this.selectedCourse = null;
        this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
          this.myCourses = courses;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: "Doslo je do greske!",
        });
      }
    })
  }

  delete_excercise_file(filename: string) {
    this.employeeService.delete_excercise_file(filename, this.selectedCourse.id).subscribe( (resp: any) => {
      if (resp.message == 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno izbrisan fajl!",
        });
        this.myCourses = [];
        this.selectedCourse = null;
        this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
          this.myCourses = courses;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: "Doslo je do greske!",
        });
      }
    })
  }

  delete_lecture_file(filename: string) {
    this.employeeService.delete_lecture_file(filename, this.selectedCourse.id).subscribe( (resp: any) => {
      if (resp.message == 'ok') {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno izbrisan fajl!",
        });
        this.myCourses = [];
        this.selectedCourse = null;
        this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
          this.myCourses = courses;
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: "Doslo je do greske!",
        });
      }
    })
  }

  project_change_visibility($event) {
    this.employeeService.change_section_visibility(this.selectedCourse.id, 'p', this.selectedCourse.project_visible).subscribe( (response: any) => {
      if(response.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Nije uspesno azurirano stanje vidljivosti!",
        });
      }
    });
  }

  lab_change_visibility($event) {
    this.employeeService.change_section_visibility(this.selectedCourse.id, 'l', this.selectedCourse.lab_visible).subscribe( (response: any) => {
      if(response.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Nije uspesno azurirano stanje vidljivosti!",
        });
      }
    });
  }

  exam_change_visibility($event) {
    this.employeeService.change_section_visibility(this.selectedCourse.id, 'e', this.selectedCourse.exams_visible).subscribe( (response: any) => {
      if(response.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Nije uspesno azurirano stanje vidljivosti!",
        });
      }
    });
  }

  submit_lecture_order() {
    console.log(this.selectedCourse.lectureDates)
    this.employeeService.update_order(this.selectedCourse).subscribe( (response: any) => {
        if(response.message === 'ok') {
          Swal.fire({
            icon: 'success',
            title: 'Uspeh.',
            text: "Uspesno azuriran redosled!",
          });
          this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
            this.myCourses = courses;
          });
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Redosloed nije promenjen usled greske!",
          });
        }

    })
  }

  submit_excercise_order() {
    console.log(this.selectedCourse.excercises)
     this.employeeService.update_order(this.selectedCourse).subscribe( (response: any) => {
        if(response.message === 'ok') {
          Swal.fire({
            icon: 'success',
            title: 'Uspeh.',
            text: "Uspesno azuriran redosled!",
          });
          this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
            this.myCourses = courses;
          });
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Redosloed nije promenjen usled greske!",
          });
        }

    })
  }

  submit_lab_order() {
    console.log(this.selectedCourse.labs_docs)
     this.employeeService.update_order(this.selectedCourse).subscribe( (response: any) => {
        if(response.message === 'ok') {
          Swal.fire({
            icon: 'success',
            title: 'Uspeh.',
            text: "Uspesno azuriran redosled!",
          });
          this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
            this.myCourses = courses;
          });
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Redosloed nije promenjen usled greske!",
          });
        }

    })
  }

  submit_exam_order() {
    console.log(this.selectedCourse.exams)
     this.employeeService.update_order(this.selectedCourse).subscribe( (response: any) => {
        if(response.message === 'ok') {
          Swal.fire({
            icon: 'success',
            title: 'Uspeh.',
            text: "Uspesno azuriran redosled!",
          });
          this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
            this.myCourses = courses;
          });
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Redosloed nije promenjen usled greske!",
          });
        }

    })
  }

  submit_project_order() {
    console.log(this.selectedCourse.projects_docs)
     this.employeeService.update_order(this.selectedCourse).subscribe( (response: any) => {
        if(response.message === 'ok') {
          Swal.fire({
            icon: 'success',
            title: 'Uspeh.',
            text: "Uspesno azuriran redosled!",
          });
          this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses: any[]) => {
            this.myCourses = courses;
          });
        }else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Redosloed nije promenjen usled greske!",
          });
        }

    })
  }

  drop4(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedCourse.labs_docs, event.previousIndex, event.currentIndex);
  }

  drop5(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedCourse.projects_docs, event.previousIndex, event.currentIndex);
  }
}
