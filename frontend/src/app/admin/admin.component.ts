import { Component, OnInit } from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import {Route, Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private administratorService: AdministratorFunctionsService, private router: Router) { }
  myUser: any = {};

  ngOnInit(): void {
    let userString = localStorage.getItem('session');
    if(userString) {
      this.myUser = JSON.parse(userString);
      if (this.myUser.type !== 0) {
        this.router.navigate(['']);
      }
    } else {
      this.router.navigate([''])
    }
  }

  set_register(number: number) {
    this.administratorService.setIsStudentRegistration(number);
  }
}
