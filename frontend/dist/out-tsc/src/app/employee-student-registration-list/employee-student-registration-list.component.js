import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
let EmployeeStudentRegistrationListComponent = class EmployeeStudentRegistrationListComponent {
    constructor(employeeService, uploadService, courseService) {
        this.employeeService = employeeService;
        this.uploadService = uploadService;
        this.courseService = courseService;
        this.courseLists = [];
        this.newRegistrationList = {
            id: -1,
            title: '',
            exam_date: new Date(),
            location: '',
            course_id: -1,
            date_open: new Date(),
            date_close: new Date(),
            isActive: true,
            enrolled: [],
            max_num_students: 0,
            enrolled_number: 0,
            upload_enabled: true,
            student_files: [],
        };
        this.course = null;
        this.userData = {};
        this.myCourses = [];
        this.editable_course = {};
    }
    ngOnInit() {
        this.userData = JSON.parse(localStorage.getItem('session'));
        this.employeeService.getEmployeeCourses(this.userData.id).subscribe((courses) => {
            this.myCourses = courses;
        });
    }
    course_selection_change($event) {
        let courseId = $event.target.value;
        if (courseId != -1) {
            for (const course of this.myCourses) {
                if (course.id == courseId) {
                    this.course = course;
                    this.employeeService.getAllRegistrationListsForCourse(this.course.id).subscribe((docs) => {
                        for (let doc of docs) {
                            doc.exam_date = new Date(doc.exam_date);
                            doc.date_open = new Date(doc.date_open);
                            doc.date_close = new Date(doc.date_close);
                        }
                        this.courseLists = docs;
                    });
                }
            }
        }
        else {
            this.course = null;
        }
    }
    open_list() {
        if (this.newRegistrationList.title === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Naziv je obavezan!',
            });
            return;
        }
        this.newRegistrationList.date_open = new Date(this.newRegistrationList.date_open);
        this.newRegistrationList.date_close = new Date(this.newRegistrationList.date_close);
        this.newRegistrationList.exam_date = new Date(this.newRegistrationList.exam_date);
        this.newRegistrationList.date_open.setHours(0, 0, 0, 0);
        this.newRegistrationList.date_close.setHours(0, 0, 0, 0);
        this.newRegistrationList.exam_date.setHours(0, 0, 0, 0);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if (this.newRegistrationList.exam_date < today) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum odrzavanja obaveze ne moze biti pre danasnjeg dana!',
            });
            return;
        }
        if (this.newRegistrationList.date_open >= this.newRegistrationList.date_close) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum zavrsetka prijava ne moze da bude pre njihovog otvaranja!',
            });
            return;
        }
        if (this.newRegistrationList.date_close >= this.newRegistrationList.exam_date) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum zavrsetka prijava ne moze da bude posle ili istog dana kada je i odrzavanje obaveze!!',
            });
            return;
        }
        if (this.newRegistrationList.location === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lokacija ne moze da bude prazna!',
            });
            return;
        }
        this.newRegistrationList.course_id = this.course.id;
        if (this.newRegistrationList.date_open === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum pocetka registracija mora da bude definisan!',
            });
            return;
        }
        if (this.newRegistrationList.date_close === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum kraja registracija mora da bude definisan!',
            });
            return;
        }
        if (this.newRegistrationList.isActive === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mora biti definisano da li je registracija aktivna ili ne!',
            });
            return;
        }
        // Ako je nula onda nema ogranicenje
        if (this.newRegistrationList.max_num_students < 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Maksimalan broj studenata ne moze da bude negativan. 0 oznacava da nema ogranicenja, a sve ostalo je gornja granica broja studenata!',
            });
            return;
        }
        this.employeeService.openNewRegistrationList(this.newRegistrationList).subscribe((doc) => {
            if (doc.message === 'ok') {
                Swal.fire({
                    icon: 'success',
                    title: 'Uspeh!',
                    text: 'Uspesno otvoren spisak!',
                });
                this.newRegistrationList = {
                    id: -1,
                    title: '',
                    exam_date: new Date(),
                    location: '',
                    course_id: -1,
                    date_open: new Date(),
                    date_close: new Date(),
                    isActive: true,
                    enrolled: [],
                    max_num_students: 0,
                    enrolled_number: 0,
                    upload_enabled: true,
                    student_files: [],
                };
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Spisak nije otvoren!',
                });
            }
            this.employeeService.getAllRegistrationListsForCourse(this.course.id).subscribe((docs) => {
                for (let doc of docs) {
                    doc.exam_date = new Date(doc.exam_date);
                    doc.date_open = new Date(doc.date_open);
                    doc.date_close = new Date(doc.date_close);
                }
                this.courseLists = docs;
            });
        });
    }
    delete_reg_list(id) {
        Swal.fire({
            title: 'Da li ste sigurni?',
            showDenyButton: true,
            confirmButtonText: `Da`,
            denyButtonText: `Ne`,
        }).then((result) => {
            if (result.isConfirmed) {
                let data = { id: id };
                this.employeeService.deleteCourseRegistrationList(this.course.id, data).subscribe((doc) => {
                    if (doc.message === 'ok') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Uspeh!',
                            text: 'Spisak je uspesno izbrisan!',
                        });
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Spisak nije izbrisan!',
                        });
                    }
                    this.employeeService.getAllRegistrationListsForCourse(this.course.id).subscribe((docs) => {
                        for (let doc of docs) {
                            doc.exam_date = new Date(doc.exam_date);
                            doc.date_open = new Date(doc.date_open);
                            doc.date_close = new Date(doc.date_close);
                        }
                        this.courseLists = docs;
                    });
                });
            }
            else if (result.isDenied) {
                Swal.fire('Nece se izbrisati!', '', 'info');
            }
        });
    }
    set_editable_course(id) {
        for (let list of this.courseLists) {
            if (list.id === id) {
                this.editable_course = list;
            }
        }
    }
    save_changes_to_list() {
        if (this.editable_course.title === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Naziv je obavezan!',
            });
            return;
        }
        this.editable_course.date_open = new Date(this.editable_course.date_open);
        this.editable_course.date_close = new Date(this.editable_course.date_close);
        this.editable_course.exam_date = new Date(this.editable_course.exam_date);
        this.editable_course.date_open.setHours(0, 0, 0, 0);
        this.editable_course.date_close.setHours(0, 0, 0, 0);
        this.editable_course.exam_date.setHours(0, 0, 0, 0);
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        if (this.editable_course.exam_date < today) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum odrzavanja obaveze ne moze biti pre danasnjeg dana!',
            });
            return;
        }
        if (this.editable_course.date_open >= this.editable_course.date_close) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum zavrsetka prijava ne moze da bude pre njihovog otvaranja!',
            });
            return;
        }
        if (this.editable_course.date_close >= this.editable_course.exam_date) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum zavrsetka prijava ne moze da bude posle ili istog dana kada je i odrzavanje obaveze!!',
            });
            return;
        }
        if (this.editable_course.location === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lokacija ne moze da bude prazna!',
            });
            return;
        }
        this.editable_course.course_id = this.course.id;
        if (this.editable_course.date_open === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum pocetka registracija mora da bude definisan!',
            });
            return;
        }
        if (this.editable_course.date_close === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Datum kraja registracija mora da bude definisan!',
            });
            return;
        }
        if (this.editable_course.isActive === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Mora biti definisano da li je registracija aktivna ili ne!',
            });
            return;
        }
        this.employeeService.updateRegList(this.editable_course.id, this.editable_course).subscribe((response) => {
            if (response.message === 'ok') {
                Swal.fire({
                    icon: 'success',
                    title: 'Uspeh.',
                    text: 'Uspesno azurirano!',
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Lista nije azurirana!',
                });
            }
            this.employeeService.getAllRegistrationListsForCourse(this.course.id).subscribe((docs) => {
                for (let doc of docs) {
                    doc.exam_date = new Date(doc.exam_date);
                    doc.date_open = new Date(doc.date_open);
                    doc.date_close = new Date(doc.date_close);
                }
                this.courseLists = docs;
            });
        });
    }
};
EmployeeStudentRegistrationListComponent = __decorate([
    Component({
        selector: 'app-employee-student-registration-list',
        templateUrl: './employee-student-registration-list.component.html',
        styleUrls: ['./employee-student-registration-list.component.css']
    })
], EmployeeStudentRegistrationListComponent);
export { EmployeeStudentRegistrationListComponent };
//# sourceMappingURL=employee-student-registration-list.component.js.map