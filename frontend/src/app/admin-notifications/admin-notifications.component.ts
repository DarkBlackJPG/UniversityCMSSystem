import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {NotificationType} from "../models/database/NotificationType";
import {Notification} from "../models/database/Notification";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import {UserValidationServiceService} from "../services/user-validation-service.service";
@Component({
  selector: 'app-admin-notifications',
  templateUrl: './admin-notifications.component.html',
  styleUrls: ['./admin-notifications.component.css']
})
export class AdminNotificationsComponent implements OnInit {
  public Editor = ClassicEditor;
  constructor(private userValidationServiceService: UserValidationServiceService, private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notificationService.getAllNotificationTypes().subscribe((res: NotificationType[]) => {
      this.allNotificationTypes = res;
    })
  }

  currentPage = 0;

  allNotifications: Notification[] = [];
  allNotificationTypes: NotificationType[] = [];

  newNotificationType: NotificationType = new NotificationType();
  newNotification: Notification = new Notification();
  existingNotification: Notification = new Notification();
  existingNotificationType: NotificationType = new NotificationType();


  typeToRemove: number = -1;
  notificationToRemove: number = -1;

  addNewNotification() {
    if (this.newNotification.title == '' || this.newNotification.description == '' || this.newNotification.notification_type == undefined || this.newNotification.notification_type < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Uneti podaci nisu u redu!",
      })
      return;
    }

    this.notificationService.addNewNotification(this.newNotification).subscribe((res: any) => {
      if (res.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske",
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno dodata notifikacija",
        });
        this.newNotification = new Notification();
        // Todo azuirranje?
        this.currentPage = -1;
      }
    })
  }

  addNewNotificationType() {
    if (this.newNotificationType.name === undefined && this.newNotificationType.name === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Naziv tipa notifikacije je obavezno!",
      });
      return;
    }
    for (const allNotificationType of this.allNotificationTypes) {

      if (allNotificationType.name.toLowerCase() == this.newNotificationType.name.toLowerCase()) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Tip obavestenja koji je definisan vec postoji!",
        });
        this.newNotificationType = new NotificationType();
        return;
      }
    }

    this.notificationService.addNewNotificationType(this.newNotificationType).subscribe((res: any) => {
      if (String(res.message).trim().toLowerCase() !== "ok".trim().toLowerCase()) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske",
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno dodat tip notifikacije",
        });
        this.notificationService.getAllNotificationTypes().subscribe((res: NotificationType[]) => {
          this.allNotificationTypes = res;
        });
        this.userValidationServiceService.setOpen(false);
        this.userValidationServiceService.setOpen(true);
        this.newNotificationType = new NotificationType();
        this.currentPage = -1;
      }
    })
  }

  removeNotificationType() {
    this.notificationService.removeNotificationType(this.existingNotificationType.id).subscribe((res: any) => {
      if (res.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske",
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno izbrisan tip notifikacije",
        });
        this.notificationService.getAllNotificationTypes().subscribe((res: NotificationType[]) => {
          this.allNotificationTypes = res;
        });
        this.existingNotificationType = new NotificationType();
        this.currentPage = -1;
        this.userValidationServiceService.setOpen(false);
        this.userValidationServiceService.setOpen(true);
      }
    })
  }

  removeNotification() {
    this.notificationService.removeNotification(this.notificationToRemove).subscribe((res: any) => {
      if (res.message == 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske",
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno izbrisan tip notifikacije",
        });
        this.notificationToRemove = -1;
      }
    })
  }

  updateNotificationType() {
    if (this.existingNotificationType.name == undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Polje za ime ne moze da bude prazno",
      })
    }
    this.notificationService.updateNotificationType(this.existingNotificationType).subscribe((res: any) => {
      if (res.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske",
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno azuriran tip obavestenja",
        });
        this.existingNotificationType = new NotificationType();
        this.notificationService.getAllNotificationTypes().subscribe((res: NotificationType[]) => this.allNotificationTypes = res);
        this.currentPage = -1;
        this.userValidationServiceService.setOpen(false);
        this.userValidationServiceService.setOpen(true);
      }
    })
  }

  updateNotification() {
    this.notificationService.updateNotification(this.updateNotificationData).subscribe((res: any) => {
      if (res.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Doslo je do greske",
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: "Uspesno azuriran tip obavestenja",
        });
        this.updateNotificationData = null;
        this.currentPage = -1;
      }
    })
  }

  change_active_notif($event) {
    for (let notif of this.allNotificationTypes) {
      if (Number(notif.id) === Number($event.target.value)) {
        this.existingNotificationType = notif;
        break
      }
    }
  }

  change_new_notif_type($event) {
    this.newNotification.notification_type = Number($event.target.value);
  }
  notificationsForType: Notification[] = [];
  change_notif_update_type($event) {
    this.updateNotificationData = null;
    let notifType = $event.target.value;
    this.notificationService.getAllNotificationsFor(notifType).subscribe((resp: Notification[]) => {
      console.log(resp)
      this.notificationsForType = resp;
    })
  }
  updateNotificationData: Notification = null;
  load_notification_data($event) {
    let notifId = $event.target.value;
    for (const notification of this.notificationsForType) {
      if(notifId == notification.id) {
        this.updateNotificationData = notification;
        break;
      }
    }
  }

  change_update_type_for_current($event) {
    this.updateNotificationData.notification_type = $event.target.value;
  }
}

