import {Injectable} from "@angular/core";

@Injectable()
export class SessionService {

  constructor() {
  }

  public saveSessionTTL() {
    let TTL = new Date();
    TTL.setHours(TTL.getHours() + 1);
    // TTL.setMinutes(TTL.getMinutes() + 2);
    let toSave = JSON.stringify({'expires': TTL});
    localStorage.setItem('ACTIVE_SESSION', toSave);

    console.log('saveSessionTTL save : ', toSave);
  }

  public isSessionActive(): boolean {
    let session = localStorage.getItem("ACTIVE_SESSION");

    if (session == undefined) {
      console.log('isSessionActive undefined');
      return false;
    }

    // calculate if session still valid
    console.log('isSessionActive saved : ', session);
    let TTL = new Date(JSON.parse(session).expires);
    let now = new Date();
    console.log('isSessionActive now : ', now);

    let compare = TTL > now;

    console.log('isSessionActive compare : ', compare);

    return compare;
  }

  public clearSession() {
    localStorage.removeItem("ACTIVE_SESSION");
  }

}
