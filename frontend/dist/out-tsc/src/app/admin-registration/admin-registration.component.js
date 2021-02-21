import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { UserRegistrationData } from "../models/appdata/UserRegistrationData";
import { EmployeeRegistration } from "../models/appdata/EmployeeRegistration";
let AdminRegistrationComponent = class AdminRegistrationComponent {
    constructor(administratorService) {
        this.administratorService = administratorService;
        this.titles = [];
        this.selectedTitle = null;
        this.studentRegistration = new UserRegistrationData();
        this.employeeRegistration = new EmployeeRegistration();
    }
    ngOnInit() {
        this.administratorService.getIsStudentRegistration().subscribe((value) => {
            this.isStudentRegistration = value;
        });
        this.administratorService.getAllTitles().subscribe((titles) => {
            this.titles = titles;
        });
    }
    set_register(number) {
        this.administratorService.setIsStudentRegistration(number);
    }
    changeSelectedTitle($event) {
        for (let i = 0; i < this.titles.length; i++) {
            if (this.titles[i].id == $event.target.value) {
                this.employeeRegistration.title = this.titles[i];
            }
        }
    }
    student_register() {
        if (this.studentRegistration.type == '' || this.studentRegistration.index == '' || this.studentRegistration.password_repeat == '' || this.studentRegistration.password == '' || this.studentRegistration.username == '' || this.studentRegistration.surname == '' || this.studentRegistration.name == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Sva polja su obavezna!',
            });
            return;
        }
        let indexRegex = "^\\d\\d\\d\\d\/\\d\\d\\d\\d$";
        let indexRegexer = new RegExp(indexRegex);
        if (!indexRegexer.test(this.studentRegistration.index)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Indeks nije u odgovarajucem formatu!',
            });
            return;
        }
        if (this.studentRegistration.password != this.studentRegistration.password_repeat) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lozinke se ne podudaraju!',
            });
            return;
        }
        let firstnameLetter = this.studentRegistration.name[0].toLowerCase();
        let lastnameLetter = this.studentRegistration.surname[0].toLowerCase();
        let year = this.studentRegistration.index.split('/')[0];
        year = year[2] + year[3];
        let num = this.studentRegistration.index.split('/')[1];
        let studType = this.studentRegistration.type;
        let regexPattern = "^" + lastnameLetter + firstnameLetter + year + num + studType + "@student.etf.bg.ac.rs$";
        let usernameRegex = new RegExp(regexPattern);
        if (!usernameRegex.test(this.studentRegistration.username)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username ne odgovara unetim podacima!',
            });
            return;
        }
        this.studentRegistration.verifyPassword = true;
        this.administratorService.add_new_student(this.studentRegistration).subscribe((response) => {
            if (response.message != 'ok') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Doslo je do greske prilikom registracije! Moguce je da student sa ovim kredencijalima vec postoji',
                });
                return;
            }
            else {
                Swal.fire({
                    icon: 'success',
                    title: 'Super',
                    text: 'Uspesno je student registrovan!!',
                });
                this.studentRegistration = new UserRegistrationData();
            }
        });
    }
    employee_register() {
        // Todo upload slike
        if (this.employeeRegistration.name === '' ||
            this.employeeRegistration.surname === '' ||
            this.employeeRegistration.username === '' ||
            this.employeeRegistration.password === '' ||
            this.employeeRegistration.password_verify === '' ||
            this.employeeRegistration.address === '' ||
            this.employeeRegistration.title === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Potrebno je uneti:",
                html: 'Potrebno je uneti: <br> <ul class="text-left"> <li>Ime</li> <li>Prezime</li> <li>Korisnicko ime</li> <li>Lozinku i ponovljenu lozinku</li> <li>Adresu i </li> <li>Zvanje</li> </ul>',
            });
            return;
        }
        if (this.employeeRegistration.password_verify !== this.employeeRegistration.password) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: "Lozinke se ne podudaraju",
            });
            return;
        }
        this.employeeRegistration.email = this.employeeRegistration.username + "@etf.rs.bg.ac.rs";
        this.administratorService.add_new_employee(this.employeeRegistration).subscribe((response) => {
            if (response.message != 'ok') {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Doslo je do greske prilikom registracije! Moguce je da student sa ovim kredencijalima vec postoji',
                });
                return;
            }
            else {
                Swal.fire({
                    icon: 'success',
                    title: 'Super',
                    text: 'Uspesno je zaposleni registrovan!!',
                });
                this.employeeRegistration = new EmployeeRegistration();
                //@ts-ignore
                document.getElementById('zvanjeZaposlenog').value = '-1';
            }
        });
    }
};
AdminRegistrationComponent = __decorate([
    Component({
        selector: 'app-admin-registration',
        templateUrl: './admin-registration.component.html',
        styleUrls: ['./admin-registration.component.css']
    })
], AdminRegistrationComponent);
export { AdminRegistrationComponent };
//# sourceMappingURL=admin-registration.component.js.map