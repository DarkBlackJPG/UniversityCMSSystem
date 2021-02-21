import {Component, OnInit, ViewChild} from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import {Course} from "../models/database/Course";
import {Observable} from "rxjs/internal/Observable";
import {debounceTime, distinctUntilChanged, filter, map} from "rxjs/operators";
import {merge, Subject} from "rxjs";
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import {CoursesService} from "../services/courses.service";
import {removeSummaryDuplicates} from "@angular/compiler";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {CourseGroup} from "../models/appdata/CourseGroup";
import {Employee} from "../models/database/Employee";
import {Student} from "../models/database/Student";
import {getLocaleCurrencyCode} from "@angular/common";


@Component({
  selector: 'app-admin-engagement-plan',
  templateUrl: './admin-engagement-plan.component.html',
  styleUrls: ['./admin-engagement-plan.component.css']
})
export class AdminEngagementPlanComponent implements OnInit {
  allCourses: Course[] = [];
  viewableCourses: Course[] = [];
  viewableCoursesNames: string[] = [];
  selectedCourse: string;
  selectedCourseObject: Course = null;
  selectedCourseEngagement: CourseGroup[] = [];

  lecturers: any[] = [];
  filterText: string = "Prikazuju se svi kursevi";
  enrolledStudents: Student[] = [];
  searchModel: any;

  constructor(private administratorService: AdministratorFunctionsService,
              private courseService: CoursesService) {
  }

  ngOnInit(): void {
    this.courseService.getCourseIds().subscribe((result: Course[]) => {
      this.allCourses = result;
      this.viewableCourses = this.allCourses;
      for (const vC of this.allCourses) {
        this.viewableCoursesNames.push(vC.coursecode + "| " + vC.name);
      }
    });

    this.administratorService.getAllEmployees().subscribe((employees: Employee[]) => {
      this.lecturers = employees;
    })
  }

  set_register(number: number) {
    this.administratorService.setIsStudentRegistration(number);
  }

  @ViewChild('instance_faculty', {static: true}) courses_instance: NgbTypeahead = null;
  focusCourses$ = new Subject<string>();
  clickCourses$ = new Subject<string>();

  searchCourses = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickCourses$.pipe(filter(() => !this.courses_instance.isPopupOpen()));
    const inputFocus$ = this.focusCourses$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.viewableCoursesNames
        : this.viewableCoursesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
  courseGroups: CourseGroup[] = [];
  numberOfGroups: number;
  newEnrolledStudentIndex: string;


  course_selected() {
    this.courseGroups = [];
    if (Number(this.selectedCourse) < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Morate odabrati jedan predmet!',
      })
    } else {
      for (const allCourses of this.allCourses) {
        if (allCourses.coursecode == this.selectedCourse) {
          this.selectedCourseObject = allCourses;
          break;
        }
      }
      this.administratorService.getEnrolledStudents(this.selectedCourseObject.coursecode).subscribe((response: Student[]) => {
        console.log(response)
        this.enrolledStudents = response;
      });
      this.administratorService.getEngagementForCourse(this.selectedCourseObject).subscribe((response: CourseGroup[]) => {
        // @ts-ignore
        this.courseGroups = response;

      });
    }
  }

  filter_courses($event) {
    this.selectedCourse = '-1';
    if ($event.target.value == 1) {

      this.viewableCourses = this.allCourses.filter((course) => course.department == 1)

    } else if ($event.target.value == 0) {
      this.viewableCourses = this.allCourses.filter((course) => course.department == 0)
    } else if ($event.target.value == 2) {
      this.viewableCourses = this.allCourses.filter((course) => course.isMaster)
    } else {
      this.viewableCourses = this.allCourses;
    }
    let all = [];

    for (let i = 0; i < this.viewableCourses.length; i++) {
      all.push(this.viewableCourses[i].name);
    }
    this.viewableCoursesNames = all;
  }

  generate_groups() {
    if (this.numberOfGroups <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Broj grupa mora da bude pozitivan, nenulti broj!',
      })
    } else {
      this.courseGroups = [];
      for (let i = 0; i < this.numberOfGroups; i++) {
        this.courseGroups.push(new CourseGroup());
      }
    }
  }

  verifyData() {
    for (let i = 0; i < this.courseGroups.length; i++) {
      if (this.courseGroups[i].lectureLecturer < 0 || this.courseGroups[i].auditoryExcercisesLecturer < 0
        || this.courseGroups[i].auditoryExcercisesGroupName == ''
        || this.courseGroups[i].lectureGroupName == '') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Neadekvatno popunjeni podaci za ' + (i + 1) + '!',
        });
        break;
      }
    }

    // TODO
  }

  submit_groups() {
    this.administratorService.update_course_engagement(this.selectedCourseObject, this.courseGroups).subscribe( (response:any) => {
      if(response.message != 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Doslo je do greske, angazovanje nije dodato',
        });
      } else {
        this.administratorService.getEngagementForCourse(this.selectedCourseObject).subscribe((response: CourseGroup[]) => {
          this.courseGroups = response;
        });
        Swal.fire({
          icon: 'success',
          title: 'Super!',
          text: 'Student je uspesno izbrisan!',
        });
      }
    })
  }

  add_new_student() {
    let regex = new RegExp("^\\d{4}\\/\\d{4}$");

    if (this.newEnrolledStudentIndex == null || this.newEnrolledStudentIndex == '' || !regex.test(this.newEnrolledStudentIndex)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Indeks nije u adekvatnom formatu!',
      });
    } else {
      this.administratorService.enrollStudent(this.selectedCourseObject.coursecode, this.newEnrolledStudentIndex).subscribe((response:any) => {
        console.log(response)
        if(response.message != 'ok') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: response.message,
          });
        } else {
          this.administratorService.getEnrolledStudents(this.selectedCourseObject.coursecode).subscribe((response: Student[]) => {
            console.log(response)
            this.enrolledStudents = response;
          });
          Swal.fire({
            icon: 'success',
            title: 'Super!',
            text: 'Student je uspesno dodat!',
          });
        }
      })
    }
  }

  remove_student_from_course(student: Student) {
    this.administratorService.removeStudentFromCourse(this.selectedCourseObject.coursecode, student.index).subscribe((response:any) => {
      if(response.message != 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Doslo je do greske, student nije dodat',
        });
      } else {
        this.administratorService.getEnrolledStudents(this.selectedCourseObject.coursecode).subscribe((response: Student[]) => {
          console.log(response)
          this.enrolledStudents = response;
        });
        Swal.fire({
          icon: 'success',
          title: 'Super!',
          text: 'Student je uspesno izbrisan!',
        });
      }
    })
  }

  convert_lecturer_id(lectureLecturer: number) {
    let lecturer = this.lecturers.find(value => value.id == lectureLecturer);
    return lecturer == undefined ? '' : lecturer.name + " " + lecturer.surname
  }
}
