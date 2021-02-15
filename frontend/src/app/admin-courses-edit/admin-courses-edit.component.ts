import {Component, OnInit, ViewChild} from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Employee} from "../models/database/Employee";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {merge, Subject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {NewCourseData} from "../models/appdata/NewCourseData";

@Component({
  selector: 'app-admin-courses-edit',
  templateUrl: './admin-courses-edit.component.html',
  styleUrls: ['./admin-courses-edit.component.css']
})
export class AdminCoursesEditComponent implements OnInit {
  public Editor = ClassicEditor;
  newCourseTeachers: Employee[] = [];
  allEmployees: Employee[] = [];
  teacherNames: string[] = [];
  studentsListeningToCourse: any[] = [];
  newCourseDataObject: NewCourseData = new NewCourseData();

  constructor(private administratorService: AdministratorFunctionsService) {
  }

  ngOnInit(): void {
    this.administratorService.getAllEmployees().subscribe((response: Employee[]) => {
      this.allEmployees = response.filter(data => data.educational == 1);
      for (let i = 0; i < this.allEmployees.length; i++) {
        this.teacherNames.push(this.allEmployees[i].user_id + ' ' + this.allEmployees[i].name + ' ' + this.allEmployees[i].surname)
      }
    })
  }

  add_class($event, className) {
    $event.target.classList.add('animate__animated');
    $event.target.classList.add(className);
  }


  newTeacher: any;
  @ViewChild('newTeacherInstance', {static: true}) newTeacherInstance: NgbTypeahead = null;
  focus_students$ = new Subject<string>();
  click_students$ = new Subject<string>();

  search_students = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click_students$.pipe(filter(() => !this.newTeacherInstance.isPopupOpen()));
    const inputFocus$ = this.focus_students$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.teacherNames
        : this.teacherNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );

  }

  add_new_employee() {
    // TODO
    for (let i = 0; i < this.newCourseTeachers.length; i++) {
      if (this.newTeacher.split(' ')[0] == this.newCourseTeachers[i].user_id) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Nastavnik se vec nalazi na spisku!',
        })
        return;
      }
    }
    for (let i = 0; i < this.allEmployees.length; i++) {
      if (this.allEmployees[i].user_id == this.newTeacher.split(' ')[0]) {
        this.newCourseTeachers.push(this.allEmployees[i]);
      }
    }

  }

  removeEmployee(employee: Employee) {
    for (let i = 0; i < this.newCourseTeachers.length; i++) {
      if (employee.user_id == this.newCourseTeachers[i].user_id) {
        this.newCourseTeachers.splice(i, 1);
        break;
      }
    }

  }

  addNewCourse: boolean = true;
  editExisting: boolean = false;

  add_course() {
    // TODO
    let hasError = false;
    if (this.newCourseDataObject.type == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Obavezno mora da stoji da li je predmet obavezan ili ne!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.isMaster == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Obavezno mora da stoji da li je predmet na master studijama ili nije!',
      })
      hasError = true;
    }

    if (this.newCourseDataObject.isSI == null && this.newCourseDataObject.isRTI == null && (this.newCourseDataObject.isMaster != null && this.newCourseDataObject.isMaster == false)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mora da se oznaci koji je smer u pitanju!',
      })
      hasError = true;
    }

    if (this.newCourseDataObject.semester <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Semestar mora da se definise!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.ESPB <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'ESPB bodovi moraju da budu pozitivni!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.classCount == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mora da se definise fond casova!',
      })
      hasError = true;
    }
    let classCountRegex = new RegExp('^\\d\\+\\d\\+\\d$')
    if (!classCountRegex.test(this.newCourseDataObject.classCount)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Format fonda casova je Predavanja + vezve + laboratorija!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.conditions == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definisu uslovi za polaganje predmeta!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.purpose == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definise cilj predmeta!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.outcome == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definise ishod predmeta!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.lectureDates == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definisu termini odrzavanja predavanja!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.auditoryExcercisesDates == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definisu termini odrzavanja vezbi!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.acronym == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Morate uneti akronim!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.isMaster == false && this.newCourseDataObject.isRTI == true && this.newCourseDataObject.isSI == true && (this.newCourseDataObject.coursecode_SI == '' || this.newCourseDataObject.coursecode_RTI == '')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Treba definisati obe sifre za predmete za SI i rti!',
      })
      hasError = true;
    }
    if (this.newCourseDataObject.name == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Treba definisati puno ime predmeta!',
      })
      hasError = true;
    }

    if (!hasError) {
      if (this.newCourseDataObject.isRTI == true && this.newCourseDataObject.isSI == true) {
        this.newCourseDataObject.isMapped = true;
      }
      this.administratorService.insert_new_course(this.newCourseDataObject).subscribe((response:any) => {
        if (response.message != 'ok') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          })
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Cestitam!',
            text: "Dodat je nov kurs!",
          })
          this.newCourseDataObject = new NewCourseData();
        }
        }
      );
    }
}

cancel_new_course()
{
  // TODO Treba izbrisati do sad uradjen rad
  this.editExisting = false;
  this.addNewCourse = false;
}

trigger_add_new_course()
{
  this.editExisting = false;
  this.addNewCourse = true;
}

trigger_update_existing_course()
{
  this.editExisting = true;
  this.addNewCourse = false;
}
}
