import {CourseAPI} from './CourseAPI';

export class EmployeeAPI {
    public user_id: number;
    public address: string;
    public phonenumber: string;
    public website: string;
    public name: string;
    public surname: string;
    public email: string;
    public biography: string;
    public profilePicture: string;
    public title: string;
    public educational: number;
    public office: string;
    public status: number;
    public courses: CourseAPI[];
};
