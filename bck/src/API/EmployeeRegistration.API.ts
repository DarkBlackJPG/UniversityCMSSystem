import {TitleAPI} from './TitleAPI';

export class EmployeeRegistrationAPI {
    public name: string;
    public surname: string;
    public username: string;
    public password: string;
    public address: string;
    public email: string;
    public password_verify: string;
    public phonenumber: string;
    public website: string;
    public bio: string;
    public title: TitleAPI;
    public office: string;
    public active: number;

    constructor() {
        this.name = '';
        this.surname = '';
        this.username = '';
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
