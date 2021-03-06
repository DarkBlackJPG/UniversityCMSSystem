import {Component} from '@angular/core';
import {UserValidationServiceService} from "./services/user-validation-service.service";
import {ActiveUser} from "./models/appdata/ActiveUser";
import {CoursesService} from "./services/courses.service";
import {Course} from "./models/database/Course";
import {Department} from "./models/database/Department";
import {Router} from "@angular/router";
import {browser} from "protractor";
import {NotificationService} from "./services/notification.service";
import {faCoffee} from '@fortawesome/fontawesome-free';
import {AdministratorFunctionsService} from "./services/administrator-functions.service";
import {NotificationType} from "./models/database/NotificationType";
import {Page} from "./services/PageEnum";
import {NavigationService} from "./services/navigation.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'frontend';
  sessionNull: boolean;
  sessionIsAdmin: boolean;
  sessionIsProfessor: boolean;
  sessionIsStudent: boolean;

  rtiCoursesId: number;
  siCoursesId: number;
  otherCoursesId: number;
  masterCourseId: number;

  notificationTypes: NotificationType[] = [];

  activePage: Page = Page.LANDING;
  PAGE = Page;
  constructor(private navigationService: NavigationService, private adminService: AdministratorFunctionsService, private notificationService: NotificationService, private userValidation: UserValidationServiceService, private courseService: CoursesService, private router: Router) {

  }

  ngOnInit(): void {
    this.refreshSession();
    this.userValidation.isOpen$.subscribe(isOpen => {
      if (isOpen) {
        this.refreshSession();
      }

    });

    this.navigationService.getObserver().subscribe( (value)=> {
      this.activePage = value;
    })

    this.courseService.getDepartmentIds().subscribe((response: Department[]) => {
      for (let i = 0; i < response.length; ++i) {
        switch (response[i].acronym) {
          case 'rti':
            this.rtiCoursesId = response[i].id;
            break;
          case 'si':
            this.siCoursesId = response[i].id;
            break;
          case 'other':
            this.otherCoursesId = response[i].id;
            break;
            case 'mast':
            this.masterCourseId = response[i].id;
            break;
        }
      }
    })
  }

  refreshSession() {
    let temp = JSON.parse(localStorage.getItem('session'));
    if (temp) {
      this.sessionNull = false;
      let sessionData = new ActiveUser(temp);
      if (sessionData.type == 0) {
        this.sessionIsProfessor = false;
        this.sessionIsStudent = false;
        this.sessionIsAdmin = true
      } else if (sessionData.type == 1) {
        this.sessionIsProfessor = true;
        this.sessionIsStudent = false;
        this.sessionIsAdmin = false;
      } else {
        this.sessionIsProfessor = false;
        this.sessionIsStudent = true;
        this.sessionIsAdmin = false;
      }
    } else {
      this.sessionNull = true;
      this.sessionIsProfessor = false;
      this.sessionIsStudent = false;
      this.sessionIsAdmin = false;
    }

    this.notificationService.getAllNotificationTypes().subscribe((resp:NotificationType[]) => {
      this.notificationTypes = resp;
    })
  }

  logout() {
    this.sessionNull = true;
    this.sessionIsProfessor = false;
    this.sessionIsStudent = false;
    this.sessionIsAdmin = false;
    localStorage.removeItem('session');
  }

  view_course_info(courseId: number) {
    this.courseService.changeDepartmentID(courseId);
    this.router.navigate(['department/courses/info']);
  }

  view_notifications_for(number: number) {
    this.notificationService.setNotificationID(number);
    this.changePage(Page.NOTIFICATIONS);
  }

  set_register(number: number) {

    this.adminService.setIsStudentRegistration(number);
  }

  changePage(next: any) {
    this.navigationService.setPageValue(next);
  }
}
