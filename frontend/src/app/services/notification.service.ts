import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";

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

  constructor(private http: HttpClient) { }

  getAllNotificationsFor(notificationType: number) {
    return this.http.get(`${this.url}/notifications/get/all/${notificationType}`);
  }
}
