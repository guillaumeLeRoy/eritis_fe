import {Injectable, EventEmitter} from '@angular/core';
import {Recipe} from './recipe';
import {Ingredient} from '../ingredient';
import {Headers, Http} from "@angular/http";
import {Observable, Subject} from "rxjs";
import 'rxjs/Rx';
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {FirebaseService} from "../service/firebase.service";

@Injectable()
export class RecipeService {

  recipesChanged = new EventEmitter<Recipe[]>()

  private recipes: Recipe[] = [
    new Recipe('dummy test', 'dummy tt', 'https://www.royalcanin.com/~/media/Royal-Canin/Product-Categories/cat-adult-landing-hero.ashx', [
      new Ingredient("french fries", 2),
      new Ingredient("Pork meat", 1)
    ]),
    new Recipe('dummy test bis', 'dummy tt bis', 'https://www.royalcanin.com/~/media/Royal-Canin/Product-Categories/cat-adult-landing-hero.ashx', []),
    new Recipe('dummy test bis', 'dummy tt bis', 'https://www.royalcanin.com/~/media/Royal-Canin/Product-Categories/cat-adult-landing-hero.ashx', []),
    new Recipe('dummy test bis', 'dummy tt bis boom', 'https://www.royalcanin.com/~/media/Royal-Canin/Product-Categories/cat-adult-landing-hero.ashx', [])
  ]

  constructor(private httpService: Http, private firebase: FirebaseService) {
  }

  getRecipes() {
    return this.recipes;
  }

  getRecipe(index: number) {
    return this.recipes[index]
  }

  deleteRecipe(recipe: Recipe) {
    this.recipes.splice(this.recipes.indexOf(recipe))
  }

  addNewRecipe(recipe: Recipe) {
    return this.recipes.push(recipe)
  }

  editRecipe(oldRecipe: Recipe, recipe: Recipe) {
    this.recipes[this.recipes.indexOf(oldRecipe)] = recipe
  }

  // storeData(): Observable<Response> {
  // const body = JSON.stringify(this.recipes)
  // const headers = new Headers({
  //   "Content-Type": "Application/json"
  // })
  // return this.http.put(baseUrl + "/recipes.json", body, {headers: headers})
  // }

  storeData() {
    // const body = JSON.stringify(this.recipes)
    // const headers = new Headers({
    //   "Content-Type": "Application/json"
    // })
    // return this.http.put(baseUrl + "/recipes.json", body, {headers: headers})

    var recipesRef = this.firebase.getInstance().database().ref('recipes/');
    recipesRef.set(this.recipes).then(function (result) {
      console.log("storeData, recipes stored with success,", result)
    }).catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      console.log("storeData, error : ", errorMessage)
    });

  }

  fetchData() {
    console.log("fetchData, start request,   this.recipes :", this.recipes)

    var recipesRef = this.firebase.getInstance().database().ref('recipes/');
    recipesRef.once('value', function (snapshot) {

      console.log("fetchData, received snapshot", snapshot.val())
      console.log("fetchData,   this : ", this)
      this.recipes = snapshot.val()
      this.recipesChanged.emit(this.recipes)

      // snapshot.forEach(function(childSnapshot) {
      //   var childKey = childSnapshot.key();
      //   var childData = childSnapshot.val();
      //
      //
      // });
    }.bind(this));

    // return this.http.get(baseUrl + "/recipes.json")
    //   .map((response: Response) => response.json())
    //   .subscribe(
    //     (data: Recipe[]) => {
    //       console.log(data)
    //       this.recipes = data
    //       this.recipesChanged.emit(data)
    //     }
    //   )


  }

  getTopQuestions(): Observable<any> {

    const subject = new Subject<any>()

    //TODO check if token not null
    var currentUser = this.firebase.auth().currentUser

    console.log("getTopQuestions, currentUser : ", currentUser)

    var promise = currentUser.getToken().then(function (idToken) {
      console.log("getTopQuestions, getToken : ", idToken)
      return idToken
    });

    var obs = PromiseObservable.create(promise); // Observable.fromPromise(promise)

    obs.subscribe(
      (token) => {
        var headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);

        console.log("getTopQuestions, httpService : ", this.httpService)
        console.log("getTopQuestions, idToken : ", token)

        this.httpService.get('http://localhost:8080/api/questions/', {headers: headers})
          .subscribe(response => {

            var json = response.json()
            console.log("getTopQuestions, json : ", json)

            subject.next(json)

          });
      }
    )

    return subject.asObservable()


  }

}
