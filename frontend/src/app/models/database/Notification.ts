import DateTimeFormat = Intl.DateTimeFormat;

export class Notification {
  id: number;
  date: Date;
  description: string;
  title: string;
  notification_type: number;
  notification_type_name: string;
}
