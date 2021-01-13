import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [
        new Recipe(
            'A Tasty Steak', 
            'At least your stake is not at stake', 
            'https://cdn.pixabay.com/photo/2018/10/22/22/18/steak-3766548_1280.jpg',
            [
                new Ingredient('Beef', 1),
                new Ingredient('French fries', 25)
            ]),
        new Recipe(
            'Vegan week', 
            'Welcome on the green side', 
            'https://cdn.pixabay.com/photo/2018/04/13/17/14/vegetable-skewer-3317060_1280.jpg',
            [
                new Ingredient('Cucumber', 2),
                new Ingredient('Onion', 1),
                new Ingredient('Sweet potatoe', 3)
            ])
    ];

    constructor(private shoppingListService: ShoppingListService) {}
    
    //Only return the copy of the original array in the services (objects and array are reference types)
    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
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