import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ActiveUser } from "./models/appdata/ActiveUser";
let AppComponent = class AppComponent {
    constructor(adminService, notificationService, userValidation, courseService, router) {
        this.adminService = adminService;
        this.notificationService = notificationService;
        this.userValidation = userValidation;
        this.courseService = courseService;
        this.router = router;
        this.title = 'frontend';
        this.notificationTypes = [];
    }
    ngOnInit() {
        this.refreshSession();
        this.userValidation.isOpen$.subscribe(isOpen => {
            if (isOpen) {
                this.refreshSession();
            }
        });
        this.courseService.getDepartmentIds().subscribe((response) => {
            for (let i = 0; i < response.length; ++i) {
                switch (response[i].acronym) {
                    case 'rti':
                        this.rtiCoursesId = response[i].id;
                        break;
                    case 'si':
                        this.siCoursesId = response[i].id;
                        break;
                    case 'other':
                        this.otherCoursesId = response[i].id;
                        break;
                    case 'mast':
                        this.masterCourseId = response[i].id;
                        break;
                }
            }
        });
    }
    refreshSession() {
        let temp = JSON.parse(localStorage.getItem('session'));
        if (temp) {
            this.sessionNull = false;
            let sessionData = new ActiveUser(temp);
            if (sessionData.type == 0) {
                this.sessionIsProfessor = false;
                this.sessionIsStudent = false;
                this.sessionIsAdmin = true;
            }
            else if (sessionData.type == 1) {
                this.sessionIsProfessor = true;
                this.sessionIsStudent = false;
                this.sessionIsAdmin = false;
            }
            else {
                this.sessionIsProfessor = false;
                this.sessionIsStudent = true;
                this.sessionIsAdmin = false;
            }
        }
        else {
            this.sessionNull = true;
            this.sessionIsProfessor = false;
            this.sessionIsStudent = false;
            this.sessionIsAdmin = false;
        }
        this.notificationService.getAllNotificationTypes().subscribe((resp) => {
            this.notificationTypes = resp;
        });
    }
    logout() {
        this.sessionNull = true;
        this.sessionIsProfessor = false;
        this.sessionIsStudent = false;
        this.sessionIsAdmin = false;
        localStorage.removeItem('session');
    }
    view_course_info(courseId) {
        this.courseService.changeDepartmentID(courseId);
        this.router.navigate(['department/courses/info']);
    }
    view_notifications_for(number) {
        this.notificationService.setNotificationID(number);
    }
    set_register(number) {
        this.adminService.setIsStudentRegistration(number);
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    })
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map