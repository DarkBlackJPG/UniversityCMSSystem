import {Course} from "./Course";

export class Employee {
  constructor() {
    this.user_id = 0;
    this.name = '';
    this.surname = '';
    this.email = '';
    this.address = '';
    this.phonenumber = '';
    this.website = '';
    this.biography = '';
    this.title ='' ;
    this.educational = 1;
    this.profilePicture = 'default';
    this.office ='';
    this.courses =[] ;
  }
  user_id: number;
  address: string;
  name: string;
  surname: string;
  email: string;
  phonenumber: string;
  website: string;
  biography: string;
  status: number;
  title: any;
  profilePicture: string;
  educational: number;
  office: string;
  courses: Course[];
}
