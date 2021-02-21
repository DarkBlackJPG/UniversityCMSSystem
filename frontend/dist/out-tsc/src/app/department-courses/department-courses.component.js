import { __decorate } from "tslib";
import { Component } from '@angular/core';
let DepartmentCoursesComponent = class DepartmentCoursesComponent {
    constructor(courseService, userValidationService) {
        this.courseService = courseService;
        this.userValidationService = userValidationService;
    }
    ngOnInit() {
        let data = localStorage.getItem('session');
        if (data !== undefined && data !== null) {
            this.sessionIsActive = true;
        }
        else {
            this.sessionIsActive = false;
        }
        this.courseService.watchSelectedDepartment().subscribe((newId) => {
            let courseIdString = newId;
            let department = Number(courseIdString);
            this.semesters = [];
            this.courseService.getCoursesByDepartment(department).subscribe((courses) => {
                this.departmentCourses = courses;
                for (let i = 0; i < this.departmentCourses.length; ++i) {
                    let exists = false;
                    for (let j = 0; j < this.semesters.length; ++j) {
                        if (this.departmentCourses[i].semester == this.semesters[j]) {
                            exists = true;
                        }
                    }
                    if (!exists) {
                        this.semesters.push(this.departmentCourses[i].semester);
                    }
                }
            });
        });
    }
    filterCourses(departmentCourses, semester) {
        let courses = [];
        for (let i = 0; i < departmentCourses.length; ++i) {
            if (departmentCourses[i].semester == semester) {
                courses.push(departmentCourses[i]);
            }
        }
        return courses;
    }
};
DepartmentCoursesComponent = __decorate([
    Component({
        selector: 'app-department-courses',
        templateUrl: './department-courses.component.html',
        styleUrls: ['./department-courses.component.css']
    })
], DepartmentCoursesComponent);
export { DepartmentCoursesComponent };
//# sourceMappingURL=department-courses.component.js.map