
import { Ingredient } from "../../shared/ingredient.model";

// importing all from the shopping-list.actions class
import * as ShoppingListActions from "./shopping-list.actions";

// The reducer part of the Ngrx state management
// The function needs to parameters which will be handled and passed automatically by the Ngrx package (current state and the action for reducer)
// The action will update the state of the app

// creating an interface for a better type definition of app states for the reducer actions:
export interface State {
    ingredients: Ingredient[],
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

// creating a central interface for multiple states
export interface AppState {
    shoppingList: State
}

// Need to setup an initial state here as JS object with the State interface instead of using the Ingredients in the shopping-list service
const initialState: State = {
    ingredients: [ new Ingredient('Onions', 2), new Ingredient('Tomatoes', 3)],
    editedIngredient: null,
    editedIngredientIndex: -1
};

// assigning the initial state to the parameter as a default value (typescript feature) - possible if the initial state would be null
// Ngrx will initialize the app state globally through this function
// When defining new state based on the action type, never change the current state, need a copy object of the old state with the spread operator
// pulling out the objects from the old object's array and put into the new state object and adding a fitting action type
// the returned action object type will reflect the new state of the app in the Ngrx store
export function shoppingListReducer(state: State = initialState, action: ShoppingListActions.ShoppingListActions) {
    switch(action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };
        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient,
                ...action.payload
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((ing, ingIndex) => {
                    return ingIndex !== state.editedIngredientIndex;
                }),
                editedIngredientIndex: -1,
                editedIngredient: null
            };
        case ShoppingListActions.START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] }
            };
        case ShoppingListActions.STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state;
        
    }
}