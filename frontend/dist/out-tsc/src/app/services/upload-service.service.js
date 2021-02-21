import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { HttpRequest } from "@angular/common/http";
let UploadServiceService = class UploadServiceService {
    constructor(http) {
        this.http = http;
        this.baseUrl = 'http://localhost:4000';
    }
    upload(file) {
        const formData = new FormData();
        formData.append('file', file);
        const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formData, {
            reportProgress: false,
            responseType: 'json'
        });
        return this.http.request(req);
    }
    getFiles() {
        return this.http.get(`${this.baseUrl}/files`);
    }
};
UploadServiceService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], UploadServiceService);
export { UploadServiceService };
//# sourceMappingURL=upload-service.service.js.map