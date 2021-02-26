export class UserRegistrationDataAPI {

  public name: string;
  public surname: string;
  public username: string;
  public password: string;
  public password_repeat: string;
  public index: string;
  public type: string;
  public verifyPassword: boolean;
  public active: boolean;
  public semester: number;
  public department: number;

  constructor() {
    this.name = '';
    this.surname = '';
    this.username = '';
    this.password = '';
    this.password_repeat = '';
    this.index = '';
    this.type = '';
    this.verifyPassword = false;
    this.active = false;
    this.semester = 1;
    this.department = 1;
  }
}
