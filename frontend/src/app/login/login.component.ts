import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UsersService} from '../services/users.service';
import {AppComponent} from "../app.component";
import {UserValidationServiceService} from "../services/user-validation-service.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private service: UsersService,
              private router: Router,
              private validationService: UserValidationServiceService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.service.loginService(this.username, this.password).subscribe(
      (response: any) => {
        if (response) {

          localStorage.setItem('session', JSON.stringify(response));

          if (response.type == 0) {
            this.router.navigate(['/admin']).then(() => {

            });
          } else if (response.type == 1) {
            this.router.navigate(['/faculty']);
          } else {
            this.router.navigate(['/student']);
          }
          this.validationService.toggle();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Losi kredencijali ili deaktiviran nalog',
          })
        }

      }
    );


  }

}
