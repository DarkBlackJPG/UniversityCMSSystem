import DateTimeFormat = Intl.DateTimeFormat;

export class Notification {

  constructor() {
    this.date = new Date();
    this.description = '';
    this.title = '';
  }

  id: number;
  date: Date;
  description: string;
  title: string;
  notification_type: number;
  notification_type_name: string;
}
