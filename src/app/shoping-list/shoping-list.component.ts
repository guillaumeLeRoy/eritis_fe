import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../Ingredient';
import {ShoppingListService} from './shopping-list.service';

@Component({
  selector: 'rb-shoping-list',
  templateUrl: './shoping-list.component.html'
})
export class ShopingListComponent implements OnInit {

  items: Ingredient[] = []
  selectedItem: Ingredient = null

  constructor(private shoppingService: ShoppingListService) {
  }

  ngOnInit() {
    this.items = this.shoppingService.getItems()
  }


  onSelectItem(item: Ingredient) {
    this.selectedItem = item
  }

  onCleared() {
    this.selectedItem = null
  }
}
