import {Component, OnInit, OnDestroy} from '@angular/core';
import {Recipe} from '../recipe';
import {ShoppingListService} from '../../shoping-list/shopping-list.service';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {RecipeService} from "../recipe.service";

@Component({
  selector: 'rb-recipe-details',
  templateUrl: './recipe-details.component.html'
})
export class RecipeDetailsComponent implements OnInit, OnDestroy {

  private subscription: Subscription
  selectedRecipe: Recipe
  private recipeIndex: number

  constructor(private shoppingListService: ShoppingListService, private route: ActivatedRoute, private recipeService: RecipeService, private router: Router) {
  }

  ngOnInit() {
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        this.recipeIndex = params['id']
        this.selectedRecipe = this.recipeService.getRecipe(this.recipeIndex)

      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onAddToShoppingList() {
    this.shoppingListService.addItems(this.selectedRecipe.ingredients)
  }


  onEdit() {
    this.router.navigate(['/recipes', this.recipeIndex, 'edit'])
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.selectedRecipe)
    this.router.navigate(['/recipes'])
  }
}
