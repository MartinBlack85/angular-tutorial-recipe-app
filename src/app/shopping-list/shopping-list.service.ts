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
    //Need to infrom Angular with an event that a new data is available for the original array, otherwise only working with the copy array
    getIngredients() {
        return this.ingredients.slice();
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
}