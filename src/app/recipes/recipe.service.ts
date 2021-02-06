import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingListReducer from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];

    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'A Tasty Steak', 
    //         'At least your stake is not at stake', 
    //         'https://cdn.pixabay.com/photo/2018/10/22/22/18/steak-3766548_1280.jpg',
    //         [
    //             new Ingredient('Beef', 1),
    //             new Ingredient('French fries', 25)
    //         ]),
    //     new Recipe(
    //         'Vegan week', 
    //         'Welcome on the green side', 
    //         'https://cdn.pixabay.com/photo/2018/04/13/17/14/vegetable-skewer-3317060_1280.jpg',
    //         [
    //             new Ingredient('Cucumber', 2),
    //             new Ingredient('Onion', 1),
    //             new Ingredient('Sweet potatoe', 3)
    //         ])
    // ];

    constructor(private store: Store<fromShoppingListReducer.AppState>) {}

    // method for the http get request to overwrite the original recipes array with the fatched data
    // the recipesChanged Subject emits an event that informs the other componenents about the data change in the services
    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }
    
    //Only return the copy of the original array in the services (objects and array are reference types)
    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }
}