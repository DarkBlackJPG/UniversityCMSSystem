import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(private service: UsersService,
    private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.service.loginService(this.username, this.password).subscribe(
      (response: any) => {
        if(response) {
          if(response.type == 0) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/user']);
          }
        } else {
          alert('Bad credentials');
        }
      }
    );
  }

}
