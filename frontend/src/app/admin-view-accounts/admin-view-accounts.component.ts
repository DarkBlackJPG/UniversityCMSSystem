import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {merge, Subject} from "rxjs";
import {Observable} from "rxjs/internal/Observable";
import {debounceTime, distinctUntilChanged, filter, last, map} from "rxjs/operators";
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import {Title} from "../models/database/Title";
import {Employee} from "../models/database/Employee";
import Swal from 'sweetalert2/dist/sweetalert2.js';
const STUDENT_FOCUS = 0;
const FACULTY_FOCUS = 1;

@Component({
  selector: 'app-admin-view-accounts',
  templateUrl: './admin-view-accounts.component.html',
  styleUrls: ['./admin-view-accounts.component.css']
})
export class AdminViewAccountsComponent implements OnInit {
  studentsIDs = ['a'];
  facultyIDs = [];
  students = ['a'];
  faculty = [];
  aa: string;
  titles: Title[] = [];

  selected_employee: Employee = null;
  isSelected = -1;



  constructor(private administratorService: AdministratorFunctionsService) {
  }

  ngOnInit(): void {
    this.aa = "sds"
    this.administratorService.getAllTitles().subscribe((titles: Title[]) => {
      this.titles = titles;
    });

    this.administratorService.getAllEmployees().subscribe((employees: Employee[]) => {
      this.faculty = employees;
      for (let i = 0; i < this.faculty.length; i++) {
        this.facultyIDs.push(
          this.faculty[i].user_id +'. ' +this.faculty[i].name + ' ' + this.faculty[i].surname
        );
      }
    })
  }
  set_register(number: number) {
    this.administratorService.setIsStudentRegistration(number);
  }
  model1: any;
  model2: any;
  dropdownList: any;

  @ViewChild('instance_student', {static: true}) instance_student: NgbTypeahead;
  @ViewChild('instance_faculty', {static: true}) instance_faculty: NgbTypeahead;
  focus_students$ = new Subject<string>();
  click_students$ = new Subject<string>();

  focus_faculty$ = new Subject<string>();
  click_faculty$ = new Subject<string>();

  search_students = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click_students$.pipe(filter(() => !this.instance_student.isPopupOpen()));
    const inputFocus$ = this.focus_students$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.studentsIDs
        : this.studentsIDs.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );

  }
  search_faculty = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click_faculty$.pipe(filter(() => !this.instance_faculty.isPopupOpen()));
    const inputFocus$ = this.focus_faculty$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.facultyIDs
        : this.facultyIDs.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );

  }

  lastFocused: number;

  find_student() {
    if (this.model1 != null && this.model1 !== '') {

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Greska!',
        text: 'Nepravilno odradjen unos! Polje za unos studenta je prazno',
      })
    }
  }

  find_faculty() {
    if (this.model2 != null && this.model2 !== '') {
      let user_id = this.model2.split(' ');
      user_id = String(user_id[0]);
      user_id = Number(user_id.split('.').join(""));
      for (let i = 0; i < this.faculty.length; i++) {
        if (this.faculty[i].user_id == user_id) {
         this.selected_employee = this.faculty[i];
         break;
        }
      }
      this.isSelected = 1;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Greska!',
        text: 'Nepravilno odradjen unos! Polje za unos zaposlenog je prazno',
      })
    }
  }

  update_employee() {
    // TODO
    alert(this.dropdownList.value)
  }

  delete_employee() {
    // TODO
  }

  cancel() {
    // TODO
  }
}
