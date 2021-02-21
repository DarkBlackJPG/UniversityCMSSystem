import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { HttpResponse } from "@angular/common/http";
import Swal from 'sweetalert2/dist/sweetalert2.js';
let EmployeeComponent = class EmployeeComponent {
    constructor(uploadService, employeeService) {
        this.uploadService = uploadService;
        this.employeeService = employeeService;
        this.fileList = FileList;
    }
    ngOnInit() {
        this.active_employe = JSON.parse(localStorage.getItem("session"));
    }
    save_profile() {
        if (this.active_employe.name === '' ||
            this.active_employe.surname === '' ||
            this.active_employe.employee_data.address === '' ||
            this.active_employe.employee_data.office === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Obavezna polja su polja za ime, prezime, adresu, kontakt i kancelariju/kabinet!',
            });
            return;
        }
        this.employeeService.updateEmployeeData(this.active_employe).subscribe((response) => {
            if (response.message === 'ok') {
                Swal.fire({
                    icon: 'success',
                    title: 'Super!',
                    text: 'Uspesno azuriran profil!',
                });
                localStorage.setItem('session', JSON.stringify(this.active_employe));
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
                    this.active_employe.employee_data.profilePicture = download_link;
                    this.employeeService.updateEmployeePicture(this.active_employe.id, download_link).subscribe((doc) => {
                    });
                    localStorage.setItem('session', JSON.stringify(this.active_employe));
                }
            });
        }
    }
};
EmployeeComponent = __decorate([
    Component({
        selector: 'app-employee',
        templateUrl: './employee.component.html',
        styleUrls: ['./employee.component.css']
    })
], EmployeeComponent);
export { EmployeeComponent };
//# sourceMappingURL=employee.component.js.map