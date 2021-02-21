import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let UsersService = class UsersService {
    constructor(http) {
        this.http = http;
        this.url = 'http://localhost:4000';
    }
    loginService(username, password) {
        let data = {
            username: username,
            password: password,
        };
        return this.http.post(`${this.url}/login`, data);
    }
    register(username, password) {
        let data = {
            username: username,
            password: password,
            type: 0
        };
        return this.http.post(`${this.url}/register`, data);
    }
    student_register(userData) {
        return this.http.post(`${this.url}/students/create/new`, { data: userData });
    }
};
UsersService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map