import { Component, OnInit } from '@angular/core';
import {EmployeeService} from "../services/employee.service";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {Observable} from "rxjs/internal/Observable";
import {UploadServiceService} from "../services/upload-service.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";


@Component({
  selector: 'app-employee-course-lists',
  templateUrl: './employee-course-lists.component.html',
  styleUrls: ['./employee-course-lists.component.css']
})
export class EmployeeCourseListsComponent implements OnInit {
  public Editor = ClassicEditor;


  fileInfos?: Observable<any>;

  constructor(private employeeService: EmployeeService,
              private uploadService: UploadServiceService) { }
  myCourses: any[] = [];
  selectedCourse: any = {};

  activePage: number = 1;

  ngOnInit(): void {
    let userData = JSON.parse(localStorage.getItem('session'));
    this.employeeService.getEmployeeCourses(userData.id).subscribe((courses: any[]) => {
      this.myCourses = courses;
    });
  }

  predavanja = [
    {
      id: 1,
      filename: "Moj zadatak.pdf",
      type: "PDF",
      size: '20MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Drazen',
        surname: 'Draskovic'
      },
      download_link: "",
    },{
      id: 2,
      filename: "Moj drugi.zip",
      type: "ZIP",
      size: '1MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Bosko',
        surname: 'Prasic'
      },
      download_link: "",
    },{
      id: 3,
      filename: "Moj dsaas.pdf",
      type: "PDF",
      size: '20MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Drazen',
        surname: 'Draskovic'
      },
      download_link: "",
    },
  ];
  vezbe = [
    {
      id: 1,
      filename: "Vezbe1.pdf",
      type: "PDF",
      size: '20MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Drazen',
        surname: 'Draskovic'
      },
      download_link: "",
    },{
      id: 2,
      filename: "Vez2.zip",
      type: "ZIP",
      size: '1MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Bosko',
        surname: 'Prasic'
      },
      download_link: "",
    },{
      id: 3,
      filename: "Vezbe3.pdf",
      type: "PDF",
      size: '20MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Drazen',
        surname: 'Draskovic'
      },
      download_link: "",
    },
  ];
  rokovi = [
    {
      id: 1,
      filename: "20202021.pdf",
      type: "PDF",
      size: '20MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Drazen',
        surname: 'Draskovic'
      },
      download_link: "",
    },{
      id: 2,
      filename: "20192020.zip",
      type: "ZIP",
      size: '1MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Bosko',
        surname: 'Prasic'
      },
      download_link: "",
    },
    {
      id: 3,
      filename: "20182019.pdf",
      type: "PDF",
      size: '20MB',
      date: new Date(),
      posted: {
        id: 1,
        name: 'Drazen',
        surname: 'Draskovic'
      },
      download_link: "",
    },
  ];

  drop1(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.predavanja, event.previousIndex, event.currentIndex);
  }
  drop2(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.vezbe, event.previousIndex, event.currentIndex);
  }
  drop3(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.rokovi, event.previousIndex, event.currentIndex);
  }

}
