import { Component, OnInit } from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";

@Component({
  selector: 'app-admin-engagement-plan',
  templateUrl: './admin-engagement-plan.component.html',
  styleUrls: ['./admin-engagement-plan.component.css']
})
export class AdminEngagementPlanComponent implements OnInit {

  constructor(private administratorService: AdministratorFunctionsService) { }

  ngOnInit(): void {
  }
  set_register(number: number) {
    this.administratorService.setIsStudentRegistration(number);
  }

}
