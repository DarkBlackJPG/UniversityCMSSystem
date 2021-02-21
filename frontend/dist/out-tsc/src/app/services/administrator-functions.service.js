import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
let AdministratorFunctionsService = class AdministratorFunctionsService {
    constructor(http) {
        this.http = http;
        this.isStudentRegistration = new BehaviorSubject(0);
        this.url = "http://localhost:4000";
    }
    getIsStudentRegistration() {
        return this.isStudentRegistration;
    }
    setIsStudentRegistration(value) {
        this.isStudentRegistration.next(value);
    }
    getAllTitles() {
        return this.http.get(`${this.url}/titles/get/all`);
    }
    getAllStudents() {
        return this.http.get(`${this.url}/students/get/all`);
    }
    getAllEmployees() {
        return this.http.get(`${this.url}/employees/get/all/ignore_active`);
    }
    getEnrolledStudents(courseID) {
        return this.http.get(`${this.url}/course/${courseID}/get/enrolled/all`);
    }
    findStudent(student) {
    }
    findEmployee(employee) {
    }
    updateStudent(student) {
    }
    updateEmployee(employee) {
        return this.http.post(`${this.url}/employees/update`, { data: employee });
    }
    enrollStudent(course, index) {
        const data = {
            course_id: course,
            student_index: index
        };
        return this.http.post(`${this.url}/course/student/enroll`, data);
    }
    removeStudentFromCourse(course, index) {
        const data = {
            course_id: course,
            student_index: index
        };
        return this.http.post(`${this.url}/course/student/remove`, data);
    }
    update_course_engagement(selectedCourseObject, courseGroups) {
        return this.http.post(`${this.url}/course/engagement/update`, {
            course_id: selectedCourseObject.coursecode,
            engagement: courseGroups
        });
    }
    getEngagementForCourse(selectedCourseObject) {
        return this.http.get(`${this.url}/course/${selectedCourseObject.coursecode}/get/engagement`);
    }
    insert_new_course(newCourseDataObject) {
        return this.http.post(`${this.url}/course/create`, { data: newCourseDataObject });
    }
    update_existing_course(course) {
        return this.http.post(`${this.url}/course/update`, { data: course });
    }
    add_new_student(userData) {
        return this.http.post(`${this.url}/students/create/new`, { data: userData });
    }
    add_new_employee(userData) {
        return this.http.post(`${this.url}/employees/create/new`, { data: userData });
    }
    updateEmployeeData(selected_employee) {
        return this.http.post(`${this.url}/employees/update`, { data: selected_employee });
    }
};
AdministratorFunctionsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], AdministratorFunctionsService);
export { AdministratorFunctionsService };
//# sourceMappingURL=administrator-functions.service.js.map