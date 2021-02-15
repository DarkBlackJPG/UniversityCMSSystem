import {CourseAPI} from './CourseAPI';

export class StudentAPI {
    public id: number;
    public username: string;
    public name: string;
    public surname: string;
    public email: string;
    public status: number;
    public type: number;
    public index: string;
    public academicLevel: string;
    public enrolledCourses: CourseAPI[];
}
