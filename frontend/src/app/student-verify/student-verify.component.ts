import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {UsersService} from "../services/users.service";
import {StudentService} from "../services/student.service";
import {UserValidationServiceService} from "../services/user-validation-service.service";

@Component({
  selector: 'app-student-verify',
  templateUrl: './student-verify.component.html',
  styleUrls: ['./student-verify.component.css']
})
export class StudentVerifyComponent implements OnInit {

  constructor(private router: Router,
              private studentService: StudentService,
              private validationService: UserValidationServiceService) {
  }

  myUser: any = {};
  password: string = '';
  passwordVerify: string = '';

  ngOnInit(): void {

    let userString = localStorage.getItem('session');
    if (userString) {
      this.myUser = JSON.parse(userString);
      if (this.myUser.student_data.verify !== true) {
        this.router.navigate(['student']);
      }
    } else {
      this.router.navigate([''])
    }
  }

  // Swal.fire({
  //             icon: 'success',
  //             title: 'Prijavljen.',
  //             text: 'Uspesno obavljena prijava!',
  //           })
  send_password() {
    if (this.passwordVerify === '' || this.password === '' || (this.passwordVerify !== this.password)) {
      Swal.fire({
        icon: 'error',
        title: 'Greska.',
        text: 'Sifre treba da se poklapaju i treba da se podudaraju!',
      });
      return;
    }
    this.studentService.registerNewPassword(this.password, this.myUser).subscribe( (response: any) => {
      if(response.message !== 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Greska.',
          text: 'Doslo je do greske, nije promenjena sifra!',
        })
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Prijavljen.',
          text: 'Uspesno obavljena promena sifre!',
        });
        this.validationService.logout('/login');
      }
    });
  }
}
