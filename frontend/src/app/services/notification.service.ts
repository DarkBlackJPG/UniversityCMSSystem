import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Notification} from "../models/database/Notification";
import {NotificationType} from "../models/database/NotificationType";


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notificationID = new BehaviorSubject(0);
  private url = "http://localhost:4000";


  getNotificationID() {
    return this._notificationID;
  }

  setNotificationID(value: number) {
    this._notificationID.next(value);
  }

  constructor(private http: HttpClient) {
  }

  getAllNotificationsFor(notificationType: number) {
    return this.http.get(`${this.url}/notifications/get/all/${notificationType}`);
  }

  getAllNotificationTypes() {
    return this.http.get(`${this.url}/notifications/types/get/all`);
  }

  removeNotificationType(typeID: number) {
    return this.http.post(`${this.url}/notifications/types/remove`, {data: typeID});
  }

  updateNotification(notificationID: Notification) {
    return this.http.post(`${this.url}/notifications/update`, {data: notificationID});
  }

  updateNotificationType(notificationID: NotificationType) {
    return this.http.post(`${this.url}/notifications/types/update`, {data: notificationID});
  }

  addNewNotificationType (notificationID: NotificationType) {
    return this.http.post(`${this.url}/notifications/types/add`, {data: notificationID});
  }

  addNewNotification (notificationID: Notification) {
    return this.http.post(`${this.url}/notifications/add`, {data: notificationID});
  }

  removeNotification(notificationID: number) {
    return this.http.post(`${this.url}/notifications/remove`, {data: notificationID});
  }

}
