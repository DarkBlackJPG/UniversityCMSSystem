import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  url = 'http://localhost:4000'

  loginService(username: string, password: string) {
    let data = {
      username: username,
      password: password,
    };

    return this.http.post(`${this.url}/login`, data);
  }
  
  register(username: string, password: string) {
    let data = {
      username: username,
      password: password,
      type: 0
    };

    return this.http.post(`${this.url}/register`, data);
  }
}
