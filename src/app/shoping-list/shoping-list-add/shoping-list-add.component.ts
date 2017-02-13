import {Component, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {Ingredient} from "../../ingredient";
import {ShoppingListService} from "../shopping-list.service";

@Component({
  selector: 'rb-shoping-list-add',
  templateUrl: './shoping-list-add.component.html'
})
export class ShopingListAddComponent implements OnChanges {

  @Input() item: Ingredient
  @Output() cleared = new EventEmitter
  isAdd = true

  constructor(private sls: ShoppingListService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    var value = changes["item"].currentValue
    console.log("ngOnChanges, value item : ", value)

    if (value === null) {
      this.isAdd = true;
      this.item = {name: null, amount: null}
    } else {
      this.isAdd = false
    }
  }

  onSubmit(ingredient: Ingredient) {
    console.log("onSubmit", ingredient)
    const newIngredient = new Ingredient(ingredient.name, ingredient.amount)
    if (!this.isAdd) {
      //edit
      this.sls.editItem(this.item, newIngredient)
      this.onClear()
    } else {
      this.sls.addItem(newIngredient)
    }
    this.item = newIngredient
  }


  onDelete() {
    this.sls.deleteItem(this.item)
    this.onClear()
  }

  onClear() {
    this.isAdd = true
    this.cleared.emit(null)
  }

}
