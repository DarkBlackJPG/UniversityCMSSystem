import {Component, OnInit} from '@angular/core';
import {UserRegistrationData} from "../models/appdata/UserRegistrationData";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {UsersService} from "../services/users.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private usersService: UsersService) {
  }

  userData = new UserRegistrationData();

  ngOnInit(): void {
  }

  register_user() {
    if (this.userData.type == '' || this.userData.semester === undefined || this.userData.index == '' || this.userData.password_repeat == '' || this.userData.password == '' || this.userData.username == '' || this.userData.surname == '' || this.userData.name == '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Sva polja su obavezna!',
      })
      return;
    }
    if (this.userData.type === 'm' || this.userData.type === 'p') {
      this.userData.department = 3
    }

    if(this.userData.department === -1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Sva polja su obavezna!',
      })
      return;
    }
    if(this.userData.semester < 0 || this.userData.semester > 8) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Semestar je izvan opsega!',
      })
      return;
    }

    let indexRegex = "^\\d{4}\\/\\d{4}$";
    let indexRegexer = new RegExp(indexRegex);
    if (!indexRegexer.test(this.userData.index)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Indeks nije u odgovarajucem formatu!',
      })
      return
    }
    if (this.userData.password != this.userData.password_repeat) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Lozinke se ne podudaraju!',
      })
      return;
    }
    let firstnameLetter = this.userData.name[0].toLowerCase();
    let lastnameLetter = this.userData.surname[0].toLowerCase();
    let year = this.userData.index.split('/')[0];
    year = year[2] + year[3];
    let num = this.userData.index.split('/')[1];
    let studType = this.userData.type;
    let regexPattern = "^" + lastnameLetter + firstnameLetter + year + num + studType + "@student.etf.bg.ac.rs$"
    let usernameRegex = new RegExp(regexPattern);
    if (!usernameRegex.test(this.userData.username)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Username ne odgovara unetim podacima!',
      })
      return;
    }

    this.userData.verifyPassword = false;


    this.usersService.student_register(this.userData).subscribe((response: any) => {
      if (response.message != 'ok') {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Doslo je do greske prilikom registracije! Moguce je da student sa ovim kredencijalima vec postoji',
        });
        return;
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Super',
          text: 'Uspesno ste registrovani!!',
        });
      }
    });
  }

  update_level($event) {
    this.userData.type = $event.target.value;
  }

  update_department($event) {
    this.userData.department = Number($event.target.value);
  }
}
