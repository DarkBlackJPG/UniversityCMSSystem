import {Title} from "../database/Title";

export class EmployeeRegistration {
  public name: string;
  public surname: string;
  public username: string;
  public password: string;
  public address: string;
  public email: string;
  public profilePicture: string;
  public password_verify: string;
  public phonenumber: string;
  public website: string;
  public bio: string;
  public title: Title;
  public office: string;
  public active: number;

  constructor() {
    this.name = '';
    this.surname = '';
    this.username = '';
    this.profilePicture = 'default.jpg';
    this.password = '';
    this.address = '';
    this.password_verify = '';
    this.phonenumber = '';
    this.website = '';
    this.bio = '';
    this.email = '';
    this.title = null;
    this.office = '';
    this.active = 1;
  }
}
