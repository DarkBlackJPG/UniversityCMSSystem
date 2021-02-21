import { __decorate } from "tslib";
import { Component } from '@angular/core';
let EmployeesListComponent = class EmployeesListComponent {
    constructor(employeeService, router) {
        this.employeeService = employeeService;
        this.router = router;
        this.employees = [];
        this.employeeModal = null;
        this.isCollapsed = false;
    }
    ngOnInit() {
        this.employeeService.getAllEmployees().subscribe((result) => {
            this.employees = result;
        });
        this.showModal = false;
    }
    showEmployeeModal(employee) {
        this.employeeModal = employee;
        this.showModal = true;
    }
    closeEmployeeModal() {
        this.showModal = false;
    }
};
EmployeesListComponent = __decorate([
    Component({
        selector: 'app-employees-list',
        templateUrl: './employees-list.component.html',
        styleUrls: ['./employees-list.component.css']
    })
], EmployeesListComponent);
export { EmployeesListComponent };
//# sourceMappingURL=employees-list.component.js.map