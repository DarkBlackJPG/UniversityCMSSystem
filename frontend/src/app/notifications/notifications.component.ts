import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {Notification} from "../models/database/Notification";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  allNotifications: any[];
  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.getNotificationID().subscribe((id) => {
      this.notificationService.getAllNotificationsFor(id).subscribe((notifications:Notification[]) => {
        this.allNotifications = notifications;
        this.allNotifications.map(value => { value.date = new Date(value.date)});
        this.notifications = this.allNotifications.filter(value => {
          let today = new Date();
          today.setMonth(today.getMonth() - 3);
          if (value.date >= today) {
            return value;
          }
        })
      })
    })
  }


}
