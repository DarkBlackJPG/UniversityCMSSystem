import { __decorate } from "tslib";
import { Component } from '@angular/core';
let NotificationsComponent = class NotificationsComponent {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    ngOnInit() {
        this.notificationService.getNotificationID().subscribe((id) => {
            this.notificationService.getAllNotificationsFor(id).subscribe((notifications) => {
                this.notifications = notifications;
                this.notifications.map(value => { value.date = new Date(value.date); });
            });
        });
    }
};
NotificationsComponent = __decorate([
    Component({
        selector: 'app-notifications',
        templateUrl: './notifications.component.html',
        styleUrls: ['./notifications.component.css']
    })
], NotificationsComponent);
export { NotificationsComponent };
//# sourceMappingURL=notifications.component.js.map