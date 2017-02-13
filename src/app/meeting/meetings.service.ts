import {Injectable} from '@angular/core';
import {Http, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {Meeting} from "./meeting";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";

declare let firebase: any

@Injectable()
export class MeetingsService {

  constructor(private httpService: Http) {
  }

  getAllMeetingsForCoacheeId(coacheeId: string): Observable<Meeting[]> {

    //TODO check if token not null
    let currentUser = firebase.auth().currentUser;

    console.log("getAllMeetingsForCoacheeId, currentUser : ", currentUser);

    let promise = currentUser.getToken();
    let obs = PromiseObservable.create(promise); // Observable.fromPromise(promise)

    return obs.flatMap(
      (token) => {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        return this.httpService.get('http://localhost:8080/api/meetings/coachee/' + coacheeId, {headers: headers})
          .map(response => {
            let json = response.json();
            console.log("getAllMeetingsForCoacheeId, response json : ", json);
            return json;
          });
      }
    );
  }
}
