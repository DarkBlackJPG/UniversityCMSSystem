import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { UserRegistrationData } from "../models/appdata/UserRegistrationData";
import Swal from 'sweetalert2/dist/sweetalert2.js';
let RegisterComponent = class RegisterComponent {
    constructor(usersService) {
        this.usersService = usersService;
        this.userData = new UserRegistrationData();
    }
    ngOnInit() {
    }
    register_user() {
        if (this.userData.type == '' || this.userData.index == '' || this.userData.password_repeat == '' || this.userData.password == '' || this.userData.username == '' || this.userData.surname == '' || this.userData.name == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Sva polja su obavezna!',
            });
            return;
        }
        let indexRegex = "^\\d\\d\\d\\d\/\\d\\d\\d\\d$";
        let indexRegexer = new RegExp(indexRegex);
        if (!indexRegexer.test(this.userData.index)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Indeks nije u odgovarajucem formatu!',
            });
            return;
        }
        if (this.userData.password != this.userData.password_repeat) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lozinke se ne podudaraju!',
            });
            return;
        }
        let firstnameLetter = this.userData.name[0].toLowerCase();
        let lastnameLetter = this.userData.surname[0].toLowerCase();
        let year = this.userData.index.split('/')[0];
        year = year[2] + year[3];
        let num = this.userData.index.split('/')[1];
        let studType = this.userData.type;
        let regexPattern = "^" + lastnameLetter + firstnameLetter + year + num + studType + "@student.etf.bg.ac.rs$";
        let usernameRegex = new RegExp(regexPattern);
        if (!usernameRegex.test(this.userData.username)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Username ne odgovara unetim podacima!',
            });
            return;
        }
        this.userData.verifyPassword = false;
        this.usersService.student_register(this.userData).subscribe((response) => {
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
                    text: 'Uspesno ste registrovani!!',
                });
            }
        });
    }
};
RegisterComponent = __decorate([
    Component({
        selector: 'app-register',
        templateUrl: './register.component.html',
        styleUrls: ['./register.component.css']
    })
], RegisterComponent);
export { RegisterComponent };
//# sourceMappingURL=register.component.js.map