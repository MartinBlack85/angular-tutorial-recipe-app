import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

// creating an action object with it's properties based on the Action interface
// readonly access specifier ensure that this class property cannot be modified from outside
export class AddIngredient implements Action {
   readonly type = ADD_INGREDIENT;
   // with the constructor Ingredient can be passed during action despatch in other components
   constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
   readonly type = ADD_INGREDIENTS

   constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
   readonly type = UPDATE_INGREDIENT;

   constructor(public payload: Ingredient) {}
}

export class DeleteIngredient implements Action {
   readonly type = DELETE_INGREDIENT;
}

export class StartEdit implements Action {
   readonly type = START_EDIT;

   constructor(public payload: number) {}
}

export class StoptEdit implements Action {
   readonly type = STOP_EDIT;
}

// creating a union type consist of multiple action class types for the reducer function
export type ShoppingListActions = AddIngredient | AddIngredients | UpdateIngredient | DeleteIngredient | StartEdit | StoptEdit;