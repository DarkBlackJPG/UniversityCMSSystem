export class ActiveUser {
  constructor(parse: any) {
    this.id = parse.id
    this.type = parse.type
    this.username = parse.username
    this.name = parse.name
    this.surname = parse.surname
  }

  id: number;
  type: number;
  username: string;
  name: string;
  surname: string;
}
