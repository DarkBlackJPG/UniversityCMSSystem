export class UserRegistrationData {

  constructor() {
    this.name = '';
    this.surname = '';
    this.username = '';
    this.password = '';
    this.password_repeat = '';
    this.index = '';
    this.type = '';
    this.verifyPassword = false;
    this.active = true;
  }

  public name: string;
  public surname: string;
  public username: string;
  public password: string;
  public password_repeat: string;
  public index: string;
  public type: string;
  public verifyPassword: boolean;
  public active: boolean;
}
