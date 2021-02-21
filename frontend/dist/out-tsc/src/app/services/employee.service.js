import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let EmployeeService = class EmployeeService {
    constructor(http) {
        this.http = http;
        this.url = 'http://localhost:4000';
    }
    getAllEmployees() {
        return this.http.get(`${this.url}/employees/get/all`);
    }
    getEmployeeById(employeeId) {
        return this.http.post(`${this.url}/employees/get`, { data: employeeId });
    }
    getEmployeeCourses(employeeId) {
        return this.http.get(`${this.url}/employee/${employeeId}/my_courses/get/all`);
    }
    updateEmployeeData(newEmployeeData) {
        return this.http.post(`${this.url}/employee/profile/update`, { data: newEmployeeData });
    }
    updateEmployeePicture(userId, employeePicture) {
        return this.http.post(`${this.url}/employee/profile/profilepicture/upload/${userId}`, { picture: employeePicture });
    }
    updateCourseData(courseData) {
        return this.http.post(`${this.url}/employee/course/${courseData.id}/update`, { data: courseData });
    }
    appendNewUploadedLecture(courseId, filedata) {
        return this.http.post(`${this.url}/employee/course/${courseId}/lectures/update`, { data: filedata });
    }
    appendNewUploadedExcercise(id, filedata) {
        return this.http.post(`${this.url}/employee/course/${id}/excercises/update`, { data: filedata });
    }
    appendNewUploadedExam(id, filedata) {
        return this.http.post(`${this.url}/employee/course/${id}/exams/update`, { data: filedata });
    }
    uploadNewLabNotification(id, newLabTextNotif) {
        return this.http.post(`${this.url}/employee/course/${id}/labs/notification/create`, { data: newLabTextNotif });
    }
    uploadNewProjectNotification(id, newLabTextNotif) {
        return this.http.post(`${this.url}/employee/course/${id}/projects/notification/create`, { data: newLabTextNotif });
    }
    appendNewLabFile(id, newLabTextNotif) {
        return this.http.post(`${this.url}/employee/course/${id}/labs/files/create`, { data: newLabTextNotif });
    }
    appendNewProjectFile(id, newLabTextNotif) {
        return this.http.post(`${this.url}/employee/course/${id}/projects/files/create`, { data: newLabTextNotif });
    }
    openNewRegistrationList(newRegistrationList) {
        return this.http.post(`${this.url}/employee/course/registration_lists/new`, { data: newRegistrationList });
    }
    getAllRegistrationListsForCourse(courseId) {
        return this.http.get(`${this.url}/employee/course/${courseId}/registration_lists/get_all`);
    }
    deleteCourseRegistrationList(courseId, data) {
        return this.http.post(`${this.url}/employee/course/${courseId}/registration_lists/delete`, { data: data });
    }
    updateRegList(courseId, data) {
        return this.http.post(`${this.url}/employee/course/${courseId}/registration_lists/update`, { data: data });
    }
    change_section_visibility(id, e, exams_visible) {
        return this.http.post(`${this.url}/employee/course/${id}/change_section_visibility`, { data: { section: e, status: exams_visible } });
    }
};
EmployeeService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], EmployeeService);
export { EmployeeService };
//# sourceMappingURL=employee.service.js.map