import { Component, OnInit } from '@angular/core';
import {Course} from "../models/database/Course";
import {CoursesService} from "../services/courses.service";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {



  constructor(private courseService: CoursesService) { }

  ngOnInit(): void {


  }

}
