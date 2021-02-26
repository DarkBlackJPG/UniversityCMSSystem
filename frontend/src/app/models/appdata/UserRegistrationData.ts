export class UserRegistrationData {
  status: number;

  constructor() {
    this.name = '';
    this.surname = '';
    this.username = '';
    this.password = '';
    this.password_repeat = '';
    this.index = '';
    this.type = 'd';
    this.verifyPassword = false;
    this.semester = 1;
    this.status = 1;
    this.department = 1;
    this.active = true;
  }

  public name: string;
  public surname: string;
  public username: string;
  public semester: number;
  public password: string;
  public password_repeat: string;
  public department: number;
  public index: string;
  public type: string;
  public verifyPassword: boolean;
  public active: boolean;
}
