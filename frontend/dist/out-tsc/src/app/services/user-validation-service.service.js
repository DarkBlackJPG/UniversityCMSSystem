import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
let UserValidationServiceService = class UserValidationServiceService {
    constructor() {
        this.isOpen$ = new BehaviorSubject(false);
    }
    toggle() {
        this.isOpen$.next(!this.isOpen$.getValue());
    }
    setOpen(value) {
        this.isOpen$.next(value);
    }
    getIsOpen() {
        return this.isOpen$;
    }
    refreshValidation() {
    }
};
UserValidationServiceService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UserValidationServiceService);
export { UserValidationServiceService };
//# sourceMappingURL=user-validation-service.service.js.map