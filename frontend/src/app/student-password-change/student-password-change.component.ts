import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {StudentService} from "../services/student.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-student-password-change',
  templateUrl: './student-password-change.component.html',
  styleUrls: ['./student-password-change.component.css']
})
export class StudentPasswordChangeComponent implements OnInit {


  constructor(private router: Router,
              private studentService: StudentService) {
  }

  myUser: any = {};
  myCourses: any[] = [];
  ngOnInit(): void {
    let user = localStorage.getItem('session');
    if (user) {
      this.myUser = JSON.parse(user)
      if (this.myUser.student_data.verify === true) {
        this.router.navigate(['/verify'])
      }

    } else {
      this.router.navigate(['']);
    }
  }

  oldPassword;
  newPassword;
  verifyNewPassword;

  update_password() {
    if(this.oldPassword === '' ||
      this.newPassword === '' ||
      this.verifyNewPassword === '' ) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Sva polja su obavezna!',
      });
      return;
    }

    if (this.oldPassword !== this.myUser.password || this.newPassword !== this.verifyNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Nesto od unetih podataka nije ispravno. Proverite podatke!',
      });
      return;
    }

    this.studentService.changePassword(this.myUser.id, this.newPassword).subscribe( (response:any) => {
      if( response.message != 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Doslo je do greske, sifra nije azuriran!',
        });
      } else {
        this.myUser.password = this.newPassword;
        localStorage.setItem('session', JSON.stringify(this.myUser));
        this.newPassword = '';
        this.oldPassword = '';
        this.verifyNewPassword = '';

        Swal.fire({
          icon: 'success',
          title: 'Uspeh!',
          text: 'Sifra uspesno azurirana!',
        });

      }
    })

  }
}
