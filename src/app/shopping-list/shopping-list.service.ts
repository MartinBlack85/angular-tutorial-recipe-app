import { Subject } from 'rxjs';

import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
        new Ingredient('Onions', 2),
        new Ingredient('Tomatoes', 3)
    ];

    //Return the copy of the original ingredients array (objects and arrays are reference types)
    //Need to infrom Angular with an event that new data is available for the original array, but we are only using the copy of the original array
    getIngredients() {
        return this.ingredients.slice();
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    addIngredients(ingredients: Ingredient[]) {
        //This solution will emit additional events, not the best solution
        // for (let ingredient of ingredients) {
        //     this.addIngredient(ingredient);
        // }

        //using the spread operator: turn an array of elements into a list of elements
        //a list of single ingredeint elements will be pushed into the ingredeints array (not an array into the array)
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);
        this.ingredientsChanged.next(this.ingredients.slice());
    }
}