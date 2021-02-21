import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import { merge, Subject } from "rxjs";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CourseGroup } from "../models/appdata/CourseGroup";
let AdminEngagementPlanComponent = class AdminEngagementPlanComponent {
    constructor(administratorService, courseService) {
        this.administratorService = administratorService;
        this.courseService = courseService;
        this.allCourses = [];
        this.viewableCourses = [];
        this.viewableCoursesNames = [];
        this.selectedCourseObject = null;
        this.selectedCourseEngagement = [];
        this.lecturers = [];
        this.filterText = "Prikazuju se svi kursevi";
        this.enrolledStudents = [];
        this.courses_instance = null;
        this.focusCourses$ = new Subject();
        this.clickCourses$ = new Subject();
        this.searchCourses = (text$) => {
            const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
            const clicksWithClosedPopup$ = this.clickCourses$.pipe(filter(() => !this.courses_instance.isPopupOpen()));
            const inputFocus$ = this.focusCourses$;
            return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map(term => (term === '' ? this.viewableCoursesNames
                : this.viewableCoursesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)));
        };
        this.courseGroups = [];
    }
    ngOnInit() {
        this.courseService.getCourseIds().subscribe((result) => {
            this.allCourses = result;
            this.viewableCourses = this.allCourses;
            for (const vC of this.allCourses) {
                this.viewableCoursesNames.push(vC.coursecode + "| " + vC.name);
            }
        });
        this.administratorService.getAllEmployees().subscribe((employees) => {
            this.lecturers = employees;
        });
    }
    set_register(number) {
        this.administratorService.setIsStudentRegistration(number);
    }
    course_selected() {
        this.courseGroups = [];
        if (Number(this.selectedCourse) < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Morate odabrati jedan predmet!',
            });
        }
        else {
            for (const allCourses of this.allCourses) {
                if (allCourses.coursecode == this.selectedCourse) {
                    this.selectedCourseObject = allCourses;
                    break;
                }
            }
            this.administratorService.getEnrolledStudents(this.selectedCourseObject.coursecode).subscribe((response) => {
                this.enrolledStudents = response;
            });
            this.administratorService.getEngagementForCourse(this.selectedCourseObject).subscribe((response) => {
                // @ts-ignore
                this.courseGroups = response;
            });
        }
    }
    filter_courses($event) {
        this.selectedCourse = '-1';
        if ($event.target.value == 1) {
            this.viewableCourses = this.allCourses.filter((course) => course.department == 1);
        }
        else if ($event.target.value == 0) {
            this.viewableCourses = this.allCourses.filter((course) => course.department == 0);
        }
        else if ($event.target.value == 2) {
            this.viewableCourses = this.allCourses.filter((course) => course.isMaster);
        }
        else {
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
            });
        }
        else {
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
        this.administratorService.update_course_engagement(this.selectedCourseObject, this.courseGroups).subscribe((response) => {
            if (response.message != 'ok') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Doslo je do greske, angazovanje nije dodato',
                });
            }
            else {
                this.administratorService.getEngagementForCourse(this.selectedCourseObject).subscribe((response) => {
                    this.courseGroups = response;
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Super!',
                    text: 'Student je uspesno izbrisan!',
                });
            }
        });
    }
    add_new_student() {
        let regex = new RegExp("^\\d{4}\\/\\d{4}$");
        if (this.newEnrolledStudentIndex == null || this.newEnrolledStudentIndex == '' || !regex.test(this.newEnrolledStudentIndex)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Indeks nije u adekvatnom formatu!',
            });
        }
        else {
            this.administratorService.enrollStudent(this.selectedCourseObject.coursecode, this.newEnrolledStudentIndex).subscribe((response) => {
                if (response.message != 'ok') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Doslo je do greske, student nije dodat',
                    });
                }
                else {
                    this.administratorService.getEnrolledStudents(this.selectedCourseObject.coursecode).subscribe((response) => {
                        this.enrolledStudents = response;
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Super!',
                        text: 'Student je uspesno dodat!',
                    });
                }
            });
        }
    }
    remove_student_from_course(student) {
        this.administratorService.removeStudentFromCourse(this.selectedCourseObject.coursecode, student.index).subscribe((response) => {
            if (response.message != 'ok') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Doslo je do greske, student nije dodat',
                });
            }
            else {
                this.administratorService.getEnrolledStudents(this.selectedCourseObject.coursecode).subscribe((response) => {
                    this.enrolledStudents = response;
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Super!',
                    text: 'Student je uspesno izbrisan!',
                });
            }
        });
    }
    convert_lecturer_id(lectureLecturer) {
        let lecturer = this.lecturers.find(value => value.id == lectureLecturer);
        return lecturer == undefined ? '' : lecturer.name + " " + lecturer.surname;
    }
};
__decorate([
    ViewChild('instance_faculty', { static: true })
], AdminEngagementPlanComponent.prototype, "courses_instance", void 0);
AdminEngagementPlanComponent = __decorate([
    Component({
        selector: 'app-admin-engagement-plan',
        templateUrl: './admin-engagement-plan.component.html',
        styleUrls: ['./admin-engagement-plan.component.css']
    })
], AdminEngagementPlanComponent);
export { AdminEngagementPlanComponent };
//# sourceMappingURL=admin-engagement-plan.component.js.map