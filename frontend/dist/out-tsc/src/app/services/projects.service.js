import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let ProjectsService = class ProjectsService {
    constructor(http) {
        this.http = http;
        this.url = 'http://localhost:4000';
    }
    getAllEmployees() {
        return this.http.get(`${this.url}/projects/get/all/proposals`);
    }
};
ProjectsService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], ProjectsService);
export { ProjectsService };
//# sourceMappingURL=projects.service.js.map