import { ActionReducerMap } from '@ngrx/store';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';

export interface AppState {
    shoppingList: fromShoppingList.State;
    auth: fromAuth.State;
}

// ActionReducerMap is the same what used in the appmodule: StoreModule.forRoot
// It is JS object contains key-value pairs based on the AppState interface's properties
export const appReducer: ActionReducerMap<AppState> = {
    'shoppingList': fromShoppingList.shoppingListReducer,
    'auth': fromAuth.authReducer
}