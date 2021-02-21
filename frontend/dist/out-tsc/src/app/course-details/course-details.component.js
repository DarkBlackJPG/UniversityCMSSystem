import { __decorate } from "tslib";
import { Component } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
let CourseDetailsComponent = class CourseDetailsComponent {
    constructor(activatedRoute, courseService, route, employeeService) {
        this.activatedRoute = activatedRoute;
        this.courseService = courseService;
        this.route = route;
        this.employeeService = employeeService;
        this.courseDetails = null;
        this.currentView = 1;
        this.employees = [];
        this.registrations = [];
    }
    ngOnInit() {
        this.course = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
        this.courseService.getCourseById(this.course).subscribe((response) => {
            if (response.message === undefined) {
                this.courseDetails = response;
                this.engagementIds = new Set();
                for (const engagement of this.courseDetails.engagement) {
                    this.engagementIds.add(engagement.lectureLecturer);
                    this.engagementIds.add(engagement.auditoryExcercisesLecturer);
                }
                let userList = [...this.engagementIds].map(value => Number(value));
                this.employeeService.getEmployeeById(userList).subscribe((response) => {
                    this.employees = response;
                });
                this.courseService.getCourseRegistrationLists(this.courseDetails.id).subscribe((response) => this.registrations = response);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "Predmet ne postoji!",
                });
            }
        });
    }
    change_view(number) {
        this.currentView = number;
    }
    check_seven_day_date(date) {
        let notificationDate = new Date(date);
        notificationDate.setHours(0, 0, 0, 0);
        let seven_days = this.today.getTime() - (7 * 24 * 60 * 60 * 1000);
        return notificationDate.getTime() >= seven_days;
    }
    get_year(semester) {
        return parseInt(String(Number(semester) / 2));
    }
    route_to_employee_details(id) {
        //
    }
};
CourseDetailsComponent = __decorate([
    Component({
        selector: 'app-course-details',
        templateUrl: './course-details.component.html',
        styleUrls: ['./course-details.component.css']
    })
], CourseDetailsComponent);
export { CourseDetailsComponent };
//# sourceMappingURL=course-details.component.js.map