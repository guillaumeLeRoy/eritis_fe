/**
 * Created by guillaume on 29/05/2017.
 */

export class PotentialRh {
  readonly id: string;

  email: string;

  firstName: string;

  lastName: string;

  start_date: string;

  constructor(id: string) {
    this.id = id;
  }

  static parsePotentialRh(json: any): PotentialRh {
    let potentialRh: PotentialRh = new PotentialRh(json.id);
    potentialRh.email = json.email;
    potentialRh.firstName = json.first_name;
    potentialRh.lastName = json.last_name;
    potentialRh.start_date = json.create_date;
    return potentialRh;
  }
}
