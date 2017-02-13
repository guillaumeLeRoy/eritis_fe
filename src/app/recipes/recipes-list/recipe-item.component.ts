import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Recipe } from '../recipe';
import { DataService } from '../../service/data.service';

@Component({
  selector: 'rb-recipe-item',
  templateUrl: './recipe-item.component.html',
})
export class RecipeItemComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() recipeId: number;

  value: string
  constructor(private dataService: DataService) { }

  ngOnInit() {
    // this.dataService.pushedData.subscribe(
    //   data => this.value = data
    // )
  }

  onStore(input: string) {
    // console.log("onStore, input : " + input)
    // this.dataService.addData(input)
    // console.log("onStore, data : " + this.dataService.getData())
  }

}
