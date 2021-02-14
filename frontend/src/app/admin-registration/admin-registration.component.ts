import { Component, OnInit } from '@angular/core';
import {AdministratorFunctionsService} from "../services/administrator-functions.service";
import {Title} from "../models/database/Title";

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css']
})
export class AdminRegistrationComponent implements OnInit {

  titles: Title[] = [];
  selectedTitle: Title = null;

  isStudentRegistration: number;
  constructor(private administratorService: AdministratorFunctionsService) { }

  ngOnInit(): void {
    this.administratorService.getIsStudentRegistration().subscribe((value)=>{
      this.isStudentRegistration = value;
    })

    this.administratorService.getAllTitles().subscribe((titles: Title[]) => {
      this.titles = titles;
    })
  }
  set_register(number: number) {
    this.administratorService.setIsStudentRegistration(number);
  }


  changeSelectedTitle($event) {
    for (let i = 0; i < this.titles.length; i++) {
      if (this.titles[i].id == $event.target.value){
        this.selectedTitle = this.titles[i];
      }
    }
  }
}
