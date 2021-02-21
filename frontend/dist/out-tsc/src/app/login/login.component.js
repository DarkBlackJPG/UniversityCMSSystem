import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
let LoginComponent = class LoginComponent {
    constructor(service, router, validationService) {
        this.service = service;
        this.router = router;
        this.validationService = validationService;
    }
    ngOnInit() {
    }
    login() {
        this.service.loginService(this.username, this.password).subscribe((response) => {
            if (response.message === undefined) {
                localStorage.setItem('session', JSON.stringify(response));
                if (response.type == 0) {
                    this.router.navigate(['/admin']).then(() => {
                    });
                }
                else if (response.type == 1) {
                    this.router.navigate(['/employee']);
                }
                else {
                    this.router.navigate(['/student']);
                }
                this.validationService.toggle();
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Losi kredencijali ili deaktiviran nalog',
                });
            }
        });
    }
};
LoginComponent = __decorate([
    Component({
        selector: 'app-login',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.css']
    })
], LoginComponent);
export { LoginComponent };
//# sourceMappingURL=login.component.js.map