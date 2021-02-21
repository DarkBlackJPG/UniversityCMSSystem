import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
let CoursesService = class CoursesService {
    constructor(http) {
        this.http = http;
        this.departmentID = new BehaviorSubject(0);
        this.url = 'http://localhost:4000';
    }
    watchSelectedDepartment() {
        return this.departmentID;
    }
    changeDepartmentID(id) {
        this.departmentID.next(id);
    }
    getCourseIds() {
        return this.http.get(`${this.url}/course/get/ids`);
    }
    getDepartmentIds() {
        return this.http.get(`${this.url}/department/get/ids`);
    }
    getCoursesByDepartment(departmentId) {
        return this.http.get(`${this.url}/department/course/info/get/${departmentId}`);
    }
    getCoursesNotifications(courseId) {
        return this.http.get(`${this.url}/courses/notifications/${courseId}`);
    }
    add_new_notification(data) {
        return this.http.post(`${this.url}/courses/notifications/upload`, data);
    }
    update_notification(param) {
        return this.http.post(`${this.url}/courses/notifications/update`, param);
    }
    getCourseRegistrationLists(courseId) {
        return this.http.get(`${this.url}/courses/${courseId}/registration_lists/get/all`);
    }
    getCourseById(courseId) {
        return this.http.get(`${this.url}/course/${courseId}/get_details`);
    }
};
CoursesService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], CoursesService);
export { CoursesService };
//# sourceMappingURL=courses.service.js.map