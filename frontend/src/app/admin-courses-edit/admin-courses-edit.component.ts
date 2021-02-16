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
import {Course} from "../models/database/Course";
import {CoursesService} from "../services/courses.service";

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


  constructor(private courseService: CoursesService, private administratorService: AdministratorFunctionsService) {
  }

  ngOnInit(): void {
    this.administratorService.getAllEmployees().subscribe((response: Employee[]) => {
      this.allEmployees = response.filter(data => data.educational == 1);
      for (let i = 0; i < this.allEmployees.length; i++) {
        this.teacherNames.push(this.allEmployees[i].user_id + ' ' + this.allEmployees[i].name + ' ' + this.allEmployees[i].surname)
      }
    })
  }

  addNewCourse: boolean = true;
  editExisting: boolean = false;

  add_course() {
    // TODO
    let hasError = false;

    if (this.newCourseDataObject.type === null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Obavezno mora da stoji da li je predmet obavezan ili ne!',
      })
      hasError = true;
    }

    // @ts-ignore
    this.newCourseDataObject.type = this.newCourseDataObject.type === 'true';

    if (this.newCourseDataObject.isMaster === null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Obavezno mora da stoji da li je predmet na master studijama ili nije!',
      })
      hasError = true;
    }
    // @ts-ignore
    this.newCourseDataObject.isMaster = this.newCourseDataObject.isMaster === 'true';

    if (this.newCourseDataObject.isSI === null && this.newCourseDataObject.isRTI === null && this.newCourseDataObject.isOther === null && (this.newCourseDataObject.isMaster !== null && this.newCourseDataObject.isMaster === false)) {
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
      let isRTI: number = 0;
      let isSI: number = 0;
      let isOther: number = 0;

      let coursesToSend: Course[] = [];

      let names: string[] = []
      if (!this.newCourseDataObject.isMaster) {
        isRTI = this.newCourseDataObject.isRTI ? 1 : 0;
        isSI = this.newCourseDataObject.isSI ? 1 : 0;
        isOther = this.newCourseDataObject.isOther ? 1 : 0;

        if (isRTI + isOther + isSI > 1) {
          this.newCourseDataObject.isMapped = true;
        }

        if (isRTI == 1) {
          let tempCourse: Course = this.create_course(
            0,
            [],
            [],
            [
              {
                conditions: this.newCourseDataObject.conditions,
                outcome: this.newCourseDataObject.outcome,
                ESPB: this.newCourseDataObject.ESPB,
                purpose: this.newCourseDataObject.purpose,
                lectureDates: this.newCourseDataObject.lectureDates,
                auditoryExcercisesDates: this.newCourseDataObject.auditoryExcercisesDates,
                labInfo: this.newCourseDataObject.labInfo,
                homeworks: this.newCourseDataObject.homeworks,
              },
            ],
            this.newCourseDataObject.acronym,
            -1,
            this.newCourseDataObject.type,
            this.newCourseDataObject.semester,
            this.newCourseDataObject.name,
            this.newCourseDataObject.coursecode_RTI,
            false,
            this.newCourseDataObject.isMapped);
          names.push(this.newCourseDataObject.coursecode_RTI)
          coursesToSend.push(tempCourse)
        }

        if (isSI == 1) {
          let tempCourse: Course = this.create_course(
            1,
            [],
            [],
            [
              {
                conditions: this.newCourseDataObject.conditions,
                outcome: this.newCourseDataObject.outcome,
                ESPB: this.newCourseDataObject.ESPB,
                purpose: this.newCourseDataObject.purpose,
                lectureDates: this.newCourseDataObject.lectureDates,
                auditoryExcercisesDates: this.newCourseDataObject.auditoryExcercisesDates,
                labInfo: this.newCourseDataObject.labInfo,
                homeworks: this.newCourseDataObject.homeworks,
              },
            ],
            this.newCourseDataObject.acronym,
            -1,
            this.newCourseDataObject.type,
            this.newCourseDataObject.semester,
            this.newCourseDataObject.name,
            this.newCourseDataObject.coursecode_SI,
            false,
            this.newCourseDataObject.isMapped);
          names.push(this.newCourseDataObject.coursecode_SI)
          coursesToSend.push(tempCourse)
        }

        if (isOther == 1) {
          let tempCourse: Course = this.create_course(
            2,
            [],
            [],
            [
              {
                conditions: this.newCourseDataObject.conditions,
                outcome: this.newCourseDataObject.outcome,
                ESPB: this.newCourseDataObject.ESPB,
                purpose: this.newCourseDataObject.purpose,
                lectureDates: this.newCourseDataObject.lectureDates,
                auditoryExcercisesDates: this.newCourseDataObject.auditoryExcercisesDates,
                labInfo: this.newCourseDataObject.labInfo,
                homeworks: this.newCourseDataObject.homeworks,
              },
            ],
            this.newCourseDataObject.acronym,
            -1,
            this.newCourseDataObject.type,
            this.newCourseDataObject.semester,
            this.newCourseDataObject.name,
            this.newCourseDataObject.coursecode_Other,
            false,
            this.newCourseDataObject.isMapped);
          names.push(this.newCourseDataObject.coursecode_Other)
          coursesToSend.push(tempCourse)
        }

        for (let i = 0; i < names.length; i++) {
          if (names[i].indexOf(" ") != -1) {
            Swal.fire({
              icon: 'error',
              title: 'Oops!',
              text: "Sifra ne sme da ima razmake!",
            });
            return;
          }
          for (let j = 0; j < names.length; j++) {
            if (i != j && names[i].trim().toLowerCase() === names[j].trim().toLowerCase()) {
              Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: "Sifre treba da budu disjunktne za sve odseke!",
              });
              return;
            }
          }
        }

      } else {
        let tempCourse: Course = this.create_course(3, [], [], [
            {
              conditions: this.newCourseDataObject.conditions,
              ESPB: this.newCourseDataObject.ESPB,
              outcome: this.newCourseDataObject.outcome,
              purpose: this.newCourseDataObject.purpose,
              lectureDates: this.newCourseDataObject.lectureDates,
              auditoryExcercisesDates: this.newCourseDataObject.auditoryExcercisesDates,
              labInfo: this.newCourseDataObject.labInfo,
              homeworks: this.newCourseDataObject.homeworks,
              classCount: this.newCourseDataObject.classCount,
            },
          ]
          , this.newCourseDataObject.acronym
          , -1
          , this.newCourseDataObject.type
          , this.newCourseDataObject.semester
          , this.newCourseDataObject.name
          , this.newCourseDataObject.coursecode_SI
          , true
          , false);

        coursesToSend.push(tempCourse)
      }


      this.administratorService.insert_new_course(coursesToSend).subscribe((response: any) => {
          if (response.message != 'ok') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Doslo je do greske, kurs/kursevi nisu dodati! Proverite sve unete podatke. Kurs mora da ima jedinstvenu sifru",
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

  private create_course(department: number, notifs: any[],
                        engagement: any[], courseDetails: any[],
                        acronym: string, id: number, type: boolean,
                        semester: number, courseName: string,
                        coursecode: string, isMaster: boolean,
                        isMapped: boolean): Course {
    let tempCourse: Course = new Course();
    tempCourse.department = department;
    tempCourse.notifications = notifs;
    tempCourse.engagement = engagement;
    tempCourse.courseDetails = courseDetails;
    tempCourse.acronym = acronym;
    tempCourse.id = id;
    tempCourse.type = type ? 1 : 0;
    tempCourse.semester = semester;
    tempCourse.name = courseName;
    tempCourse.coursecode = coursecode;
    tempCourse.isMaster = isMaster;
    tempCourse.isMapped = isMapped;
    return tempCourse;
  }

  cancel_new_course() {
    // TODO Treba izbrisati do sad uradjen rad
    this.editExisting = false;
    this.addNewCourse = false;
    this.newCourseDataObject = new NewCourseData();
  }

  trigger_add_new_course() {
    this.editExisting = false;
    this.addNewCourse = true;
  }

  allCourses: Course[] = [];
  courseNames: string[] = [];
  selectedEditCourse: NewCourseData = null;

  trigger_update_existing_course() {
    if (this.allCourses.length == 0) {
      const mySwal = Swal.fire({
        title: 'Sacekajte da dohvatimo sve podatke!',
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
        },
      });
      this.courseService.getCourseIds().subscribe((result: Course[]) => {
        this.allCourses = result;
        for (const vC of result) {
          this.courseNames.push(vC.coursecode + "| " + vC.name);
        }
        mySwal.close();
      });

    }
    this.editExisting = true;
    this.addNewCourse = false;
  }

  cancel_edit_course() {

  }

  select_edit_course() {
    let coursecode = this.currentCourseCode.split('|')[0].trim();
    for (let i = 0; i < this.allCourses.length; i++) {
      if (this.allCourses[i].coursecode === coursecode) {
        let editCourse = this.course_to_newCourseData(this.allCourses[i]);
        this.selectedEditCourse = editCourse;
        this.updateCourseCode = editCourse.coursecode_SI;
        break;
      }
    }
  }

  private course_to_newCourseData(course: Course) {
    const temp = new NewCourseData();
    if (course.department == 0) {
      temp.isRTI = true;
      // @ts-ignore
      temp.isMaster = 'false';
    } else if (course.department == 1) {
      temp.isSI = true;
      // @ts-ignore
      temp.isMaster = 'false';
    } else if (course.department == 2) {
      temp.isOther = true;
      // @ts-ignore
      temp.isMaster = 'false';
    } else if (course.department == 3) {
      // @ts-ignore
      temp.isMaster = 'true';
    }
    temp.coursecode_SI = course.coursecode;
    temp.type = course.type == 1;
    temp.isMapped = course.isMapped;
    temp.name = course.name;
    temp.ESPB = course.courseDetails[0].ESPB;
    temp.outcome = course.courseDetails[0].outcome;
    temp.purpose = course.courseDetails[0].purpose;
    temp.labInfo = course.courseDetails[0].labInfo;
    temp.conditions = course.courseDetails[0].conditions;
    temp.homeworks = course.courseDetails[0].homeworks;
    temp.acronym = course.acronym;
    temp.lectureDates = course.courseDetails[0].lectureDates;
    temp.auditoryExcercisesDates = course.courseDetails[0].auditoryExcercisesDates;
    temp.classCount = course.courseDetails[0].classCount;
    temp.semester = course.semester;

    return temp;
  }
  currentCourseCode: string = '';
  set_current_course_name($event) {
    this.currentCourseCode = $event.target.value;
  }
  updateCourseCode: string = '';

  update_course_info() {
    let hasError = false;

    if (this.selectedEditCourse.type === null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Obavezno mora da stoji da li je predmet obavezan ili ne!',
      })
      hasError = true;
    }

    // @ts-ignore
    this.selectedEditCourse.type = this.selectedEditCourse.type === 'true';

    if (this.selectedEditCourse.isMaster === null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Obavezno mora da stoji da li je predmet na master studijama ili nije!',
      })
      hasError = true;
    }
    // @ts-ignore
    this.selectedEditCourse.isMaster = this.selectedEditCourse.isMaster === 'true';

    if (this.selectedEditCourse.isSI === null && this.selectedEditCourse.isRTI === null && this.selectedEditCourse.isOther === null && (this.selectedEditCourse.isMaster !== null && this.selectedEditCourse.isMaster === false)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mora da se oznaci koji je smer u pitanju!',
      })
      hasError = true;
    }

    if (this.selectedEditCourse.semester <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Semestar mora da se definise!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.ESPB <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'ESPB bodovi moraju da budu pozitivni!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.classCount == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Mora da se definise fond casova!',
      })
      hasError = true;
    }
    let classCountRegex = new RegExp('^\\d\\+\\d\\+\\d$')
    if (!classCountRegex.test(this.selectedEditCourse.classCount)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Format fonda casova je Predavanja + vezve + laboratorija!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.conditions == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definisu uslovi za polaganje predmeta!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.purpose == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definise cilj predmeta!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.outcome == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definise ishod predmeta!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.lectureDates == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definisu termini odrzavanja predavanja!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.auditoryExcercisesDates == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Moraju da se definisu termini odrzavanja vezbi!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.acronym == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Morate uneti akronim!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.isMaster == false && this.selectedEditCourse.isRTI == true && this.selectedEditCourse.isSI == true && (this.selectedEditCourse.coursecode_SI == '' || this.selectedEditCourse.coursecode_RTI == '')) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Treba definisati obe sifre za predmete za SI i rti!',
      })
      hasError = true;
    }
    if (this.selectedEditCourse.name == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Treba definisati puno ime predmeta!',
      })
      hasError = true;
    }

    if (!hasError) {
      let dept = 0;
      if (this.selectedEditCourse.isSI) {
        dept = 1;
      } else if(this.selectedEditCourse.isOther) {
        dept = 2;
      } else if (this.selectedEditCourse.isMaster) {
        dept = 3;
      }
      let courseToUpdate = this.create_course(
        dept,
        [],
        [],
        [
          {
            conditions: this.selectedEditCourse.conditions,
            ESPB: this.selectedEditCourse.ESPB,
            outcome: this.selectedEditCourse.outcome,
            purpose: this.selectedEditCourse.purpose,
            lectureDates: this.selectedEditCourse.lectureDates,
            auditoryExcercisesDates: this.selectedEditCourse.auditoryExcercisesDates,
            labInfo: this.selectedEditCourse.labInfo,
            homeworks: this.selectedEditCourse.homeworks,
            classCount: this.selectedEditCourse.classCount,
          }],
        this.selectedEditCourse.acronym,
        -1,
        this.selectedEditCourse.type,
        this.selectedEditCourse.semester,
        this.selectedEditCourse.name,
        this.selectedEditCourse.coursecode_SI,
        this.selectedEditCourse.isMaster,
        this.selectedEditCourse.isMapped
      )
      this.administratorService.update_existing_course(courseToUpdate, this.updateCourseCode).subscribe((response: any) => {
          if (response.message != 'ok') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: "Doslo je do greske, kurs/kursevi nisu dodati! Proverite sve unete podatke. Kurs mora da ima jedinstvenu sifru",
            })
          } else {
            Swal.fire({
              icon: 'success',
              title: 'Cestitam!',
              text: "Dodat je nov kurs!",
            })
            this.selectedEditCourse = new NewCourseData();
            if (this.allCourses.length == 0) {
              const mySwal = Swal.fire({
                title: 'Sacekajte da dohvatimo sve podatke!',
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading()
                },
              });
              this.courseService.getCourseIds().subscribe((result: Course[]) => {
                this.allCourses = result;
                for (const vC of result) {
                  this.courseNames.push(vC.coursecode + "| " + vC.name);
                }
                mySwal.close();
              });

            }
            this.selectedEditCourse = null;
            this.updateCourseCode = null;
            this.editExisting = true;
            this.addNewCourse = false;
          }
        }
      );
    }
  }

  change_department($event) {
    let value = Number($event.target.value);
    switch (value) {
      case 0:
        this.selectedEditCourse.isRTI = true;
        this.selectedEditCourse.isSI = false;
        this.selectedEditCourse.isOther = false;
        break;
      case 1:
        this.selectedEditCourse.isRTI = false;
        this.selectedEditCourse.isSI = true;
        this.selectedEditCourse.isOther = false;
        break;
      case 2:
        this.selectedEditCourse.isRTI = false;
        this.selectedEditCourse.isSI = false;
        this.selectedEditCourse.isOther = true;
        break;
    }

  }

  change_course_level($event) {
    let value = Number($event.target.value);
    switch (value) {
      case 0:
        this.selectedEditCourse.isMaster = false;
        break;
      case 1:
        this.selectedEditCourse.isMaster = true;
        break;
    }
  }

  change_selected_course_type($event) {
    let value = Number($event.target.value);
    switch (value) {
      case 0:
        this.selectedEditCourse.type = false;
        break;
      case 1:
        this.selectedEditCourse.type = true;
        break;
    }
  }
}
