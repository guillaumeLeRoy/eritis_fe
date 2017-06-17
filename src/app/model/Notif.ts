export class Notif {
  id: string;
  message: string;
  is_read: boolean;
  date: string;

  constructor(id: string) {
    this.id = id;
  }
}
