import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
let NotificationService = class NotificationService {
    constructor(http) {
        this.http = http;
        this._notificationID = new BehaviorSubject(0);
        this.url = "http://localhost:4000";
    }
    getNotificationID() {
        return this._notificationID;
    }
    setNotificationID(value) {
        this._notificationID.next(value);
    }
    getAllNotificationsFor(notificationType) {
        return this.http.get(`${this.url}/notifications/get/all/${notificationType}`);
    }
    getAllNotificationTypes() {
        return this.http.get(`${this.url}/notifications/types/get/all`);
    }
    removeNotificationType(typeID) {
        return this.http.post(`${this.url}/notifications/types/remove`, { data: typeID });
    }
    updateNotification(notificationID) {
        return this.http.post(`${this.url}/notifications/update`, { data: notificationID });
    }
    updateNotificationType(notificationID) {
        return this.http.post(`${this.url}/notifications/types/update`, { data: notificationID });
    }
    addNewNotificationType(notificationID) {
        return this.http.post(`${this.url}/notifications/types/add`, { data: notificationID });
    }
    addNewNotification(notificationID) {
        return this.http.post(`${this.url}/notifications/add`, { data: notificationID });
    }
    removeNotification(notificationID) {
        return this.http.post(`${this.url}/notifications/remove`, { data: notificationID });
    }
};
NotificationService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], NotificationService);
export { NotificationService };
//# sourceMappingURL=notification.service.js.map