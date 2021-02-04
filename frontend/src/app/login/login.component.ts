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
          let data = {
            id: response.id,
            type: response.type,
            username: response.username,
            name: response.name,
            surname: response.surname
          };
          localStorage.setItem('session', JSON.stringify(data));
          if (response.type == 0) {
            this.router.navigate(['/admin']).then(() => {
            });
          } else {
            this.router.navigate(['/user']);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Losi kredencijali',
          })
        }
        this.validationService.toggle();
      }
    );


  }

}
