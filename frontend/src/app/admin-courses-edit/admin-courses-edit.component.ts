import {Component, OnInit} from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {CoursesService} from "../services/courses.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-courses-edit',
  templateUrl: './admin-courses-edit.component.html',
  styleUrls: ['./admin-courses-edit.component.css']
})
export class AdminCoursesEditComponent implements OnInit {
  public Editor = ClassicEditor;

  myUser: any = {}
  myUserCourses: any[] = [];

  newCourse: any = {
    type: -1,
    isMaster: false,
    coursecode_SI: '',
    coursecode_RTI: '',
    coursecode_Other: '',
    coursecode_Master: '',
    isRTI: false,
    isSI: false,
    isOther: false,
    semester: 1,
    ESPB: 0,
    classCount: '',
    name: '',
    acronym: '',
    conditions: '',
    purpose: '',
    outcome: '',
    lectureDates: '',
    excercisesDates: '',
    labInfo: '',
    homeworks: '',
    isMapped: false,
  };

  constructor(private courseService: CoursesService, private administratorService: AdministratorFunctionsService,
              private router: Router) {
  }

  ngOnInit(): void {
    let userString = localStorage.getItem('session');
    if (userString) {
      this.myUser = JSON.parse(userString);
      if (this.myUser.type !== 0) {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate([''])
    }


    this.courseService.getCourseIds().subscribe((courses: any) => {
      if (courses) {
        this.myUserCourses = courses;
      } else {
        this.swalError('Trenutno nema kurseva');
      }
    })


  }

  swalError(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: message,
    });
  }

  swalSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: 'Uspeh.',
      text: message,
    });
  }

  addNewCourse: boolean = false;
  editExisting: boolean = true;

  trigger_add_new_course() {
    this.addNewCourse = true;
    this.editExisting = false;
  }

  trigger_update_existing_course() {
    this.addNewCourse = false;
    this.editExisting = true;
  }

  selectedEditCourse: any = null;

  edit_course_selected($event) {
    let id = Number($event.target.value)
    if (id === -1) {
      this.selectedEditCourse = null;
      return;
    }
    for (const course of this.myUserCourses) {
      if (course.id === id) {
        console.log(course);
        this.selectedEditCourse = course;
      }
    }
  }

  selected_edit_course_change_type($event) {
    this.selectedEditCourse.type = Number($event.target.value);

  }

  selectedEditCourse_isMaster($event) {
    let value = Number($event.target.value);
    this.selectedEditCourse.isMaster = value === 1;
  }

  selectedEditCourse_department_change($event) {
    this.selectedEditCourse.department = Number($event.target.value);
  }


  update_course() {
    let classCountRegex = new RegExp('\\d\\+\\d\\+\\d')

    if (this.selectedEditCourse.coursecode === '') {
      this.swalError('Sifra kursa ne moze da ostnane prazna!');
      return;
    }

    if (this.selectedEditCourse.semester < 1 || this.selectedEditCourse.semester > 8) {

      this.swalError('Semestar nije u opsegu!');
      return;
    }
    if (this.selectedEditCourse.department < 0) {

      this.swalError('Odabrati departman!');
      return;
    }
    if (this.selectedEditCourse.department === 3 && this.selectedEditCourse.isMaster === false) {

      this.swalError('Odabrati departman!');
      return;
    }

    if (this.selectedEditCourse.courseDetails[0].ESPB === '' || Number(this.selectedEditCourse.courseDetails[0].ESPB) < 1) {

      this.swalError('ESPB nije u opsegu!');
      return;
    }

    if (!classCountRegex.test(this.selectedEditCourse.courseDetails[0].classCount)) {

      this.swalError('Fond casova ne zadovoljava pattern!');
      return;
    }

    if (this.selectedEditCourse.name === '') {

      this.swalError('Ime kursa ne moze da ostane prazno!');
      return;
    }

    if (this.selectedEditCourse.acronym === '') {

      this.swalError('Akronim kursa ne moze da ostane prazan!');
      return;
    }


    if (this.selectedEditCourse.courseDetails[0].conditions === '') {

      this.swalError('Uslovi kursa su obavezni!');
      return;
    }
    if (this.selectedEditCourse.courseDetails[0].purpose === '') {

      this.swalError('Cilj kursa ne moze da bude prazan!');
      return;
    }
    if (this.selectedEditCourse.courseDetails[0].outcome === '') {
      this.swalError('Ishod kursa ne moze da ostane prazan!');
      return;
    }

    if (this.selectedEditCourse.isMaster) {
      this.selectedEditCourse.department = 3;
    }

    this.administratorService.update_existing_course(this.selectedEditCourse).subscribe((response: any) => {
      if (response.message === 'ok') {
        this.swalSuccess('Uspesno je kurs azuriran')
        this.selectedEditCourse = null;
        this.courseService.getCourseIds().subscribe((courses: any) => {
          if (courses) {
            this.myUserCourses = courses;
          } else {
            this.swalError('Trenutno nema kurseva');
          }
        })
      } else {
        this.swalError('Doslo je do greske, kurs nije azuriran');
      }
    })

  }

  new_course_change_type($event) {
    this.newCourse.type = Number($event.target.value);
  }

  change_academic_level($event) {
    this.newCourse.isMaster = Number($event.target.value) === 1;
    if (this.newCourse.isMaster) {
      this.newCourse.isSI = false;
      this.newCourse.isRTI = false;
      this.newCourse.isOther = false;
    }
  }

  add_new_course() {
    if (this.newCourse.type < 0) {
      this.swalError('Treba definisati da li je kurs obavezan ili izboran tip!');
      return;
    }

    if (this.newCourse.semester < 1 || this.newCourse > 8) {
      this.swalError('Semestar je u opsegu od 1 do 8');
      return;
    }

    if (this.newCourse.ESPB === '' || this.newCourse.ESPB < 0) {
      this.swalError('ESPB treba da bude definisan i nenulti broj')
      return;
    }

    const classCountRegex = new RegExp('\\d\+\\d\+\\d');

    if (classCountRegex.test(this.newCourse.classCount)) {
      this.swalError('Fond casova nije u dobrom formatu');
      return;
    }

    if (this.newCourse.name === '') {
      this.swalError('Pun naziv kursa treba da bude definisan');
      return;
    }

    if (this.newCourse.acronym === '') {
      this.swalError('Akronim treba da bude definisan');
      return;
    }

    if (this.newCourse.conditions === '') {
      this.swalError('Uslovi polaganja predmeta su neophodni');
      return;
    }

    if (this.newCourse.outcome === '') {
      this.swalError('Ishod predmeta je neophodna');
      return;
    }

    if (this.newCourse.lectureDates === '') {
      this.swalError('Termini odrzavanja predavanja su obavezna');
      return;
    }

    if (this.newCourse.excercisesDates === '') {
      this.swalError('Termini odrzavanja vezbi su obavezna');
      return;
    }

    if (this.newCourse.isMaster) {
      this.newCourse.department = 3;
    }

    if (this.newCourse.isRTI && this.newCourse.coursecode_RTI === '') {
      this.swalError('Sifra predmeta za RTI je obavezna obzirom da se predmet odrzava i na RTI');
      return;
    }
    if (this.newCourse.isSI && this.newCourse.coursecode_SI === '') {
      this.swalError('Sifra predmeta za SI je obavezna obzirom da se predmet odrzava i na SI');
      return;
    }
    if (this.newCourse.isOther && this.newCourse.coursecode_Other === '') {
      this.swalError('Sifra predmeta za druge smerove je obavezna obzirom da se predmet odrzava i na druge smerove');
      return;
    }
    if (this.newCourse.isMaster && this.newCourse.coursecode_Master === '') {
      this.swalError('Sifra predmeta za master obavezna obzirom da se predmet odrzava na masteru');
      return;
    }

    const rti = this.newCourse.isRTI === true ? 1 : 0;
    const si = this.newCourse.isRTI === true ? 1 : 0;
    const other = this.newCourse.isRTI === true ? 1 : 0;
    let isMapped = false;
    if (rti + si + other > 1) {
      isMapped = true;
    }
    const coursesToSend = [];
    const mappedData = [
      {
        conditions: this.newCourse.conditions,
        ESPB: this.newCourse.ESPB,
        outcome: this.newCourse.outcome,
        purpose: this.newCourse.purpose,
        auditoryExcercisesDates: this.newCourse.excercisesDates,
        lectureDates: this.newCourse.lectureDates,
        labInfo: this.newCourse.labInfo,
        homeworks: this.newCourse.homeworks,
        classCount: this.newCourse.classCount,
      }
    ];


    if (this.newCourse.isMaster) {
      let newCourse = {};
      newCourse['name'] = this.newCourse.name;
      newCourse['coursecode'] = this.newCourse.coursecode_Master;
      newCourse['acronym'] = this.newCourse.acronym;
      newCourse['semester'] = this.newCourse.semester;
      newCourse['type'] = this.newCourse.type;
      newCourse['department'] = 3;
      newCourse['courseDetails'] = mappedData;
      newCourse['isMapped'] = false;
      newCourse['isMaster'] = true;
      newCourse['engagement'] = [];
      newCourse['notifications'] = [];
      coursesToSend.push(newCourse);

    } else {
      let newCourse = {};
      if (this.newCourse.isRTI) {
        newCourse['name'] = this.newCourse.name;
        newCourse['coursecode'] = this.newCourse.coursecode_RTI;
        newCourse['acronym'] = this.newCourse.acronym;
        newCourse['semester'] = this.newCourse.semester;
        newCourse['type'] = this.newCourse.type;
        newCourse['department'] = 0;
        newCourse['courseDetails'] = mappedData;
        newCourse['isMapped'] = isMapped;
        newCourse['isMaster'] = false;
        newCourse['engagement'] = [];
        newCourse['notifications'] = [];
        coursesToSend.push(newCourse);
      }
      newCourse = {};

      if (this.newCourse.isSI) {
        newCourse['name'] = this.newCourse.name;
        newCourse['coursecode'] = this.newCourse.coursecode_SI;
        newCourse['acronym'] = this.newCourse.acronym;
        newCourse['semester'] = this.newCourse.semester;
        newCourse['type'] = this.newCourse.type;
        newCourse['department'] = 1;
        newCourse['courseDetails'] = mappedData;
        newCourse['isMapped'] = isMapped;
        newCourse['isMaster'] = false;
        newCourse['engagement'] = [];
        newCourse['notifications'] = [];
        coursesToSend.push(newCourse);
      }
      newCourse = {};

      if (this.newCourse.isOther) {
        newCourse['name'] = this.newCourse.name;
        newCourse['coursecode'] = this.newCourse.coursecode_Other;
        newCourse['acronym'] = this.newCourse.acronym;
        newCourse['semester'] = this.newCourse.semester;
        newCourse['type'] = this.newCourse.type;
        newCourse['department'] = 2;
        newCourse['courseDetails'] = mappedData;
        newCourse['isMapped'] = isMapped;
        newCourse['isMaster'] = false;
        newCourse['engagement'] = [];
        newCourse['notifications'] = [];
        coursesToSend.push(newCourse);
      }


    }

    console.log(coursesToSend)

    this.administratorService.insert_new_course(coursesToSend).subscribe((response: any) => {
      if(response.message === 'ok') {
        this.swalSuccess('Uspesno dodad kurs');
        this.courseService.getCourseIds().subscribe((data: any) => {
          if(data) {
            this.myUserCourses = data;
          } else {
            this.swalError("Nema kurseva da se prikazu");
          }
          this.newCourse = {
            type: -1,
            isMaster: false,
            coursecode_SI: '',
            coursecode_RTI: '',
            coursecode_Other: '',
            coursecode_Master: '',
            isRTI: false,
            isSI: false,
            isOther: false,
            semester: 1,
            ESPB: 0,
            classCount: '',
            name: '',
            acronym: '',
            conditions: '',
            purpose: '',
            outcome: '',
            lectureDates: '',
            excercisesDates: '',
            labInfo: '',
            homeworks: '',
            isMapped: false,
          };
        })
      } else {
        this.swalError(response.message)
      }
    })

  }
}
