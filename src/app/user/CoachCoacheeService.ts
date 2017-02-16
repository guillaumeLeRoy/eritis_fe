import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {Observable} from "rxjs";
import {Coach} from "./Coach";

declare let firebase: any

@Injectable()
export class CoachCoacheeService {

  constructor(private httpService: Http) {
  }

  getAllCoachs(): Observable<Coach[]> {

    //TODO check if token not null
    let currentUser = firebase.auth().currentUser;

    console.log("getAllCoachs, currentUser : ", currentUser);

    let promise = currentUser.getToken().then(function (idToken) {
      console.log("getAllCoachs, getToken : ", idToken);
      return idToken;
    });

    let obs = PromiseObservable.create(promise); // Observable.fromPromise(promise)

    return obs.flatMap(
      (token) => {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        return this.httpService.get('http://localhost:8080/api/coachs/', {headers: headers})
          .map(response => {
            let json = response.json();
            console.log("getAllCoachs, response json : ", json);
            return json;
          });
      }
    );
  }


  getCoachForId(id: string): Observable<Coach> {
    console.log("getCoachForId, id", id);

    //TODO check if token not null
    let currentUser = firebase.auth().currentUser;

    console.log("getCoachForId, currentUser : ", currentUser);

    let promise = currentUser.getToken();

    let obs = PromiseObservable.create(promise); // Observable.fromPromise(promise)

    return obs.flatMap(
      (token) => {
        console.log("getCoach, token : ", token);

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        return this.httpService.get('http://localhost:8080/api/coachs/' + id, {headers: headers})
          .map(response => {
            let json = response.json();
            console.log("getCoach, response json : ", json);
            return json;
          });
      }
    );
  }


  bookAMeetingWithCoach(dateSc: number, coachId: string, coacheeId: string): Observable<any> {
    console.log("bookAMeeting, date %s, coachId %s, coacheeId %s", dateSc, coachId, coacheeId);//todo check if userId ok

    //TODO check if token not null
    let currentUser = firebase.auth().currentUser;
    let promise = currentUser.getToken();

    let obs = PromiseObservable.create(promise); // Observable.fromPromise(promise)

    return obs.flatMap(
      (token) => {
        console.log("bookAMeeting, token : ", token);

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        let body = {
          date: dateSc.toString(),
          coachId: coachId,
          coacheeId: coacheeId
        };
        return this.httpService.post('http://localhost:8080/api/meeting/', body, {headers: headers})
          .map(response => {
            let json = response.json();
            console.log("bookAMeeting, response json : ", json);
            return json;
          });
      }
    );
  }

  addAMeetingReview(meetingId: string, comment: string, rate: string) {
    console.log("addAMeetingReview, meetingId %s, comment %s, rate %s", meetingId, comment, rate);

    //TODO check if token not null
    let currentUser = firebase.auth().currentUser;
    let promise = currentUser.getToken();

    let obs = PromiseObservable.create(promise); // Observable.fromPromise(promise)

    return obs.flatMap(
      (token) => {
        console.log("addAMeetingReview, token : ", token);

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        let body = {
          comment: comment,
          score: rate,
        };
        return this.httpService.post('http://localhost:8080/api/meeting/' + meetingId + '/review', body, {headers: headers})
          .map(response => {
            let json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
          });
      }
    );
  }

}
