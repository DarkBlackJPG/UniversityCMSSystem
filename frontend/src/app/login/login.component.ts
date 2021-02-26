import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UsersService} from '../services/users.service';
import {UserValidationServiceService} from "../services/user-validation-service.service";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {NavigationService} from "../services/navigation.service";
import {Page} from "../services/PageEnum";

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
              private validationService: UserValidationServiceService,
              private navService: NavigationService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.service.loginService(this.username, this.password).subscribe(
      (response: any) => {
        if (response.message === undefined) {

          localStorage.setItem('session', JSON.stringify(response));

          if (response.type == 0) {
            this.router.navigate(['/admin']).then(() => {
                this.navService.setPageValue(Page.ADMIN_LANDING)
            });
          } else if (response.type == 1) {
            this.router.navigate(['/employee']).then(() => {
              this.navService.setPageValue(Page.PROFESSOR_LANDING)
            });
          } else {
            this.router.navigate(['/student']).then(() => {
              this.navService.setPageValue(Page.STUDENT_LANDING)
            });
          }
          this.validationService.setOpen(false);
          this.validationService.setOpen(true);
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
