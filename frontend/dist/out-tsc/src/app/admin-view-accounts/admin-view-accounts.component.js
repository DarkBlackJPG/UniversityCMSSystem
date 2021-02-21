import { __decorate } from "tslib";
import { Component, ViewChild } from '@angular/core';
import { merge, Subject } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, map } from "rxjs/operators";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { HttpResponse } from "@angular/common/http";
const STUDENT_FOCUS = 0;
const FACULTY_FOCUS = 1;
let AdminViewAccountsComponent = class AdminViewAccountsComponent {
    constructor(administratorService, uploadService, employeeService) {
        this.administratorService = administratorService;
        this.uploadService = uploadService;
        this.employeeService = employeeService;
        this.studentsIDs = ['a'];
        this.facultyIDs = [];
        this.students = ['a'];
        this.faculty = [];
        this.titles = [];
        this.selected_employee = null;
        this.isSelected = -1;
        this.focus_students$ = new Subject();
        this.click_students$ = new Subject();
        this.focus_faculty$ = new Subject();
        this.click_faculty$ = new Subject();
        this.search_students = (text$) => {
            const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
            const clicksWithClosedPopup$ = this.click_students$.pipe(filter(() => !this.instance_student.isPopupOpen()));
            const inputFocus$ = this.focus_students$;
            return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map(term => (term === '' ? this.studentsIDs
                : this.studentsIDs.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)));
        };
        this.search_faculty = (text$) => {
            const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
            const clicksWithClosedPopup$ = this.click_faculty$.pipe(filter(() => !this.instance_faculty.isPopupOpen()));
            const inputFocus$ = this.focus_faculty$;
            return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map(term => (term === '' ? this.facultyIDs
                : this.facultyIDs.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)));
        };
        this.fileList = FileList;
    }
    ngOnInit() {
        this.aa = "sds";
        this.administratorService.getAllTitles().subscribe((titles) => {
            this.titles = titles;
        });
        this.administratorService.getAllEmployees().subscribe((employees) => {
            this.faculty = employees;
            for (let i = 0; i < this.faculty.length; i++) {
                this.facultyIDs.push(this.faculty[i].id + '. ' + this.faculty[i].name + ' ' + this.faculty[i].surname);
            }
        });
    }
    set_register(number) {
        this.administratorService.setIsStudentRegistration(number);
    }
    find_student() {
        if (this.model1 != null && this.model1 !== '') {
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Greska!',
                text: 'Nepravilno odradjen unos! Polje za unos studenta je prazno',
            });
        }
    }
    find_faculty() {
        if (this.model2 != null && this.model2 !== '') {
            let user_id = this.model2.split(' ');
            user_id = String(user_id[0]);
            user_id = Number(user_id.split('.').join(""));
            for (let i = 0; i < this.faculty.length; i++) {
                if (this.faculty[i].id == user_id) {
                    this.selected_employee = this.faculty[i];
                    break;
                }
            }
            this.isSelected = 1;
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Greska!',
                text: 'Nepravilno odradjen unos! Polje za unos zaposlenog je prazno',
            });
        }
    }
    update_employee() {
        if (this.selected_employee.name === '' ||
            this.selected_employee.surname === '' ||
            this.selected_employee.employee_data.address === '' ||
            this.selected_employee.employee_data.office === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Obavezna polja su polja za ime, prezime, adresu, kontakt i kancelariju/kabinet!',
            });
            return;
        }
        this.administratorService.updateEmployeeData(this.selected_employee).subscribe((response) => {
            if (response.message === 'ok') {
                Swal.fire({
                    icon: 'success',
                    title: 'Super!',
                    text: 'Uspesno azuriran profil!',
                });
                this.selected_employee = null;
                this.isSelected = -1;
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Doslo je do greske, profil nije azuriran!',
                });
            }
        });
    }
    upload_image($event) {
        var _URL = window.URL || window.webkitURL;
        this.fileList = $event.target.files;
        var file, img;
        let skip = false;
        if ((file = this.fileList[0])) {
            img = new Image();
            var objectUrl = _URL.createObjectURL(file);
            img.onload = function () {
                if (this.width > 300 || this.height > 300) {
                    skip = true;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Slika prevazilazi velicinu od 300x300!',
                    });
                }
                _URL.revokeObjectURL(objectUrl);
            };
            img.src = objectUrl;
        }
        if (skip === false && this.fileList[0] != undefined) {
            this.uploadService.upload(this.fileList[0]).subscribe((res) => {
                if (res instanceof HttpResponse) {
                    // @ts-ignore
                    let file_data = res.body.file_data;
                    let download_link = file_data.filename;
                    this.selected_employee.employee_data.profilePicture = download_link;
                    this.employeeService.updateEmployeePicture(this.selected_employee.id, download_link).subscribe((doc) => {
                    });
                    localStorage.setItem('session', JSON.stringify(this.selected_employee));
                }
            });
        }
    }
    cancel() {
        this.isSelected = -1;
        this.selected_employee = null;
    }
    check_title(id, id2) {
        return Number(id) === Number(id2);
    }
    change_title($event) {
        const title_id = Number($event.target.value);
        for (let i = 0; i < this.titles.length; i++) {
            if (this.titles[i].id == title_id) {
                this.selected_employee.title = this.titles[i];
                break;
            }
        }
    }
};
__decorate([
    ViewChild('instance_student', { static: true })
], AdminViewAccountsComponent.prototype, "instance_student", void 0);
__decorate([
    ViewChild('instance_faculty', { static: true })
], AdminViewAccountsComponent.prototype, "instance_faculty", void 0);
AdminViewAccountsComponent = __decorate([
    Component({
        selector: 'app-admin-view-accounts',
        templateUrl: './admin-view-accounts.component.html',
        styleUrls: ['./admin-view-accounts.component.css']
    })
], AdminViewAccountsComponent);
export { AdminViewAccountsComponent };
//# sourceMappingURL=admin-view-accounts.component.js.map