import {Course} from "./Course";

export class Student {
  public id: number;
  public username: string;
  public password: string;
  public name: string;
  public surname: string;
  public email: string;
  public status: number;
  public type: number;
  public index: string;
  public academicLevel: string;
  public enrolledCourses: Course[];
};
