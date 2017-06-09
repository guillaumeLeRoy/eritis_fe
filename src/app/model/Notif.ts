export class Notif {
  id: string;
  message: string;
  is_read: boolean;

  constructor(id: string) {
    this.id = id;
  }
}
