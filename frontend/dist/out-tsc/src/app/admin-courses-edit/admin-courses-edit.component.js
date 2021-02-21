import { __decorate } from "tslib";
import { Component } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NewCourseData } from "../models/appdata/NewCourseData";
import { Course } from "../models/database/Course";
let AdminCoursesEditComponent = class AdminCoursesEditComponent {
    constructor(courseService, administratorService) {
        this.courseService = courseService;
        this.administratorService = administratorService;
        this.Editor = ClassicEditor;
        this.newCourseTeachers = [];
        this.allEmployees = [];
        this.teacherNames = [];
        this.studentsListeningToCourse = [];
        this.newCourseDataObject = new NewCourseData();
        this.addNewCourse = true;
        this.editExisting = false;
        this.allCourses = [];
        this.courseNames = [];
        this.selectedEditCourse = null;
        this.currentCourseCode = '';
        this.updateCourseCode = '';
        this.selectedCourse = null;
    }
    ngOnInit() {
        this.administratorService.getAllEmployees().subscribe((response) => {
            this.allEmployees = response.filter(data => data.educational == 1);
            for (let i = 0; i < this.allEmployees.length; i++) {
                this.teacherNames.push(this.allEmployees[i].user_id + ' ' + this.allEmployees[i].name + ' ' + this.allEmployees[i].surname);
            }
        });
    }
    add_course() {
        // TODO
        let hasError = false;
        if (this.newCourseDataObject.type === null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Obavezno mora da stoji da li je predmet obavezan ili ne!',
            });
            hasError = true;
        }
        // @ts-ignore
        this.newCourseDataObject.type = this.newCourseDataObject.type === 'true';
        if (this.newCourseDataObject.isMaster === null) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Obavezno mora da stoji da li je predmet na master studijama ili nije!',
            });
            hasError = true;
        }
        // @ts-ignore
        this.newCourseDataObject.isMaster = this.newCourseDataObject.isMaster === 'true';
        if (this.newCourseDataObject.isSI === null && this.newCourseDataObject.isRTI === null && this.newCourseDataObject.isOther === null && (this.newCourseDataObject.isMaster !== null && this.newCourseDataObject.isMaster === false)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mora da se oznaci koji je smer u pitanju!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.semester <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Semestar mora da se definise!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.ESPB <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'ESPB bodovi moraju da budu pozitivni!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.classCount == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mora da se definise fond casova!',
            });
            hasError = true;
        }
        let classCountRegex = new RegExp('^\\d\\+\\d\\+\\d$');
        if (!classCountRegex.test(this.newCourseDataObject.classCount)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Format fonda casova je Predavanja + vezve + laboratorija!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.conditions == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Moraju da se definisu uslovi za polaganje predmeta!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.purpose == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Moraju da se definise cilj predmeta!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.outcome == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Moraju da se definise ishod predmeta!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.lectureDates == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Moraju da se definisu termini odrzavanja predavanja!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.auditoryExcercisesDates == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Moraju da se definisu termini odrzavanja vezbi!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.acronym == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Morate uneti akronim!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.isMaster == false && this.newCourseDataObject.isRTI == true && this.newCourseDataObject.isSI == true && (this.newCourseDataObject.coursecode_SI == '' || this.newCourseDataObject.coursecode_RTI == '')) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Treba definisati obe sifre za predmete za SI i rti!',
            });
            hasError = true;
        }
        if (this.newCourseDataObject.name == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Treba definisati puno ime predmeta!',
            });
            hasError = true;
        }
        if (!hasError) {
            let isRTI = 0;
            let isSI = 0;
            let isOther = 0;
            let coursesToSend = [];
            let names = [];
            if (!this.newCourseDataObject.isMaster) {
                isRTI = this.newCourseDataObject.isRTI ? 1 : 0;
                isSI = this.newCourseDataObject.isSI ? 1 : 0;
                isOther = this.newCourseDataObject.isOther ? 1 : 0;
                if (isRTI + isOther + isSI > 1) {
                    this.newCourseDataObject.isMapped = true;
                }
                if (isRTI == 1) {
                    let tempCourse = this.create_course(0, [], [], [
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
                    ], this.newCourseDataObject.acronym, -1, this.newCourseDataObject.type, this.newCourseDataObject.semester, this.newCourseDataObject.name, this.newCourseDataObject.coursecode_RTI, false, this.newCourseDataObject.isMapped);
                    names.push(this.newCourseDataObject.coursecode_RTI);
                    coursesToSend.push(tempCourse);
                }
                if (isSI == 1) {
                    let tempCourse = this.create_course(1, [], [], [
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
                    ], this.newCourseDataObject.acronym, -1, this.newCourseDataObject.type, this.newCourseDataObject.semester, this.newCourseDataObject.name, this.newCourseDataObject.coursecode_SI, false, this.newCourseDataObject.isMapped);
                    names.push(this.newCourseDataObject.coursecode_SI);
                    coursesToSend.push(tempCourse);
                }
                if (isOther == 1) {
                    let tempCourse = this.create_course(2, [], [], [
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
                    ], this.newCourseDataObject.acronym, -1, this.newCourseDataObject.type, this.newCourseDataObject.semester, this.newCourseDataObject.name, this.newCourseDataObject.coursecode_Other, false, this.newCourseDataObject.isMapped);
                    names.push(this.newCourseDataObject.coursecode_Other);
                    coursesToSend.push(tempCourse);
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
            }
            else {
                let tempCourse = this.create_course(3, [], [], [
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
                ], this.newCourseDataObject.acronym, -1, this.newCourseDataObject.type, this.newCourseDataObject.semester, this.newCourseDataObject.name, this.newCourseDataObject.coursecode_SI, true, false);
                coursesToSend.push(tempCourse);
            }
            this.administratorService.insert_new_course(coursesToSend).subscribe((response) => {
                if (response.message != 'ok') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Doslo je do greske, kurs/kursevi nisu dodati! Proverite sve unete podatke. Kurs mora da ima jedinstvenu sifru",
                    });
                }
                else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Cestitam!',
                        text: "Dodat je nov kurs!",
                    });
                    this.newCourseDataObject = new NewCourseData();
                    this.editExisting = false;
                    this.addNewCourse = false;
                }
            });
        }
    }
    create_course(department, notifs, engagement, courseDetails, acronym, id, type, semester, courseName, coursecode, isMaster, isMapped) {
        let tempCourse = new Course();
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
        this.newCourseDataObject = new NewCourseData();
        this.editExisting = false;
        this.addNewCourse = false;
    }
    trigger_add_new_course() {
        this.editExisting = false;
        this.addNewCourse = true;
    }
    trigger_update_existing_course() {
        if (this.allCourses.length == 0) {
            const mySwal = Swal.fire({
                title: 'Sacekajte da dohvatimo sve podatke!',
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            this.courseService.getCourseIds().subscribe((result) => {
                this.allCourses = result;
                mySwal.close();
            });
        }
        this.editExisting = true;
        this.addNewCourse = false;
    }
    cancel_edit_course() {
    }
    select_edit_course() {
        let courseId = Number(this.currentCourseCode);
        for (const course of this.allCourses) {
            if (course.id === courseId) {
                this.selectedCourse = course;
            }
        }
    }
    change_academic_level($event) {
        if ($event.target.value === '1') { // isMaster
            this.selectedCourse.department = 3;
            this.selectedCourse.isMaster = true;
        }
        else { // !isMaster
            this.selectedCourse.department = -1;
            this.selectedCourse.isMaster = false;
        }
    }
    change_course_type($event) {
        this.selectedCourse.type = $event.target.value;
    }
    course_to_newCourseData(course) {
        const temp = new NewCourseData();
        if (course.department == 0) {
            temp.isRTI = true;
            // @ts-ignore
            temp.isMaster = 'false';
        }
        else if (course.department == 1) {
            temp.isSI = true;
            // @ts-ignore
            temp.isMaster = 'false';
        }
        else if (course.department == 2) {
            temp.isOther = true;
            // @ts-ignore
            temp.isMaster = 'false';
        }
        else if (course.department == 3) {
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
    set_current_course_name($event) {
        this.currentCourseCode = $event.target.value;
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
            return;
        }
        if (this.selectedCourse.courseDetails[0].ESPB === undefined || this.selectedCourse.courseDetails[0].ESPB < 1) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "ESPB mora biti pozitivan, nenulti broj",
            });
            return;
        }
        let regex = new RegExp("^\\d\\+\\d\\+\\d$");
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
        this.administratorService.update_existing_course(this.selectedCourse).subscribe((response) => {
            if (response.message === 'ok') {
                Swal.fire({
                    icon: 'success',
                    title: 'Super!',
                    text: "Uspesno azuriran kurs!",
                });
                this.selectedCourse = null;
                const mySwal = Swal.fire({
                    title: 'Sacekajte da dohvatimo sve podatke!',
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });
                this.courseService.getCourseIds().subscribe((result) => {
                    this.allCourses = result;
                    this.courseNames = [];
                    for (const vC of result) {
                        this.courseNames.push(vC.coursecode + "| " + vC.name);
                    }
                    mySwal.close();
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Doslo je do neocekivane greske!",
                });
            }
        });
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
};
AdminCoursesEditComponent = __decorate([
    Component({
        selector: 'app-admin-courses-edit',
        templateUrl: './admin-courses-edit.component.html',
        styleUrls: ['./admin-courses-edit.component.css']
    })
], AdminCoursesEditComponent);
export { AdminCoursesEditComponent };
//# sourceMappingURL=admin-courses-edit.component.js.map