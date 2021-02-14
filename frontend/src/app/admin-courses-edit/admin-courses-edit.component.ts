import {Component, OnInit, ViewChild} from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Employee} from "../models/database/Employee";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {merge, Subject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import Swal from 'sweetalert2/dist/sweetalert2.js';
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
  constructor(private administratorService: AdministratorFunctionsService) { }

  ngOnInit(): void {
    this.administratorService.getAllEmployees().subscribe((response:Employee[]) => {
      this.allEmployees = response.filter( data => data.educational == 1);
      for (let i = 0; i < this.allEmployees.length; i++) {
        this.teacherNames.push(this.allEmployees[i].user_id + ' ' + this.allEmployees[i].name +' ' + this.allEmployees[i].surname)
      }
    })
  }
  set_register(number: number) {
    this.administratorService.setIsStudentRegistration(number);
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
      if( this.newTeacher.split(' ')[0] == this.newCourseTeachers[i].user_id) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Nastavnik se vec nalazi na spisku!',
        })
        return;
      }
    }
    for (let i = 0; i < this.allEmployees.length; i++) {
      if(this.allEmployees[i].user_id == this.newTeacher.split(' ')[0]) {
        this.newCourseTeachers.push(this.allEmployees[i]);
      }
    }

  }

  removeEmployee(employee: Employee) {
    for (let i = 0; i < this.newCourseTeachers.length; i++) {
      if(employee.user_id == this.newCourseTeachers[i].user_id) {
        this.newCourseTeachers.splice(i, 1);
        break;
      }
    }

  }

  add_course() {
    // TODO
  }

  cancel_new_course() {
    // TODO Treba izbrisati do sad uradjen rad
    document.getElementById('new_course_card').classList.add('animate__fadeOutLeftBig')
    document.getElementById('new_course_card').classList.remove('animate__fadeInLeftBig')
  }

  trigger_add_new_course() {
    document.getElementById('new_course_card').classList.remove('animate__fadeInLeftBig')
    document.getElementById('update_course_card').classList.remove('animate__fadeInLeftBig')
    document.getElementById('update_course_card').classList.add('invisible')

    document.getElementById('new_course_card').classList.remove('invisible')
    document.getElementById('new_course_card').classList.add('animate__fadeInLeftBig')
  }
  trigger_update_existing_course() {

  }
}
