import { Component, OnInit } from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private administratorService: AdministratorFunctionsService) { }

  ngOnInit(): void {
  }

  set_register(number: number) {
    this.administratorService.setIsStudentRegistration(number);
  }
}
