import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EmployeeService} from "../services/employee.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private employeeService: EmployeeService) { }
  employeeId: number = 0;
  employee: any = {};
  ngOnInit(): void {
    this.employeeId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    let ar:number[] = [];
    ar.push(this.employeeId);
    this.employeeService.getEmployeeById(ar).subscribe( (response: any) => {
        if(!response) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Korisnik ne postoji!",
          });
        } else {
          console.log(response)
          this.employee = response[0];
        }
    });
  }

}
