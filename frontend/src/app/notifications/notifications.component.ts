import { Component, OnInit } from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {Notification} from "../models/database/Notification";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[];

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationService.getNotificationID().subscribe((id) => {
      this.notificationService.getAllNotificationsFor(id).subscribe((notifications:Notification[]) => {
        this.notifications = notifications;
        this.notifications.map(value => { value.date = new Date(value.date)});
      })
    })
  }


}
