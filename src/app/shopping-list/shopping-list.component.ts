import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';

import { Ingredient } from '../shared/ingredient.model';
import * as fromShoppingListReducer from './store/shopping-list.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[]}>;
  // private ingredientsChangedSubscription: Subscription;

  // Need to inject the store  for the integrated app state management
  // The structure of the Store based on the identifier defined in the app module and on the new state(key-value) from the reducer function
  constructor( 
    private loggingService: LoggingService, 
    private store: Store<fromShoppingListReducer.AppState>) { }

  ngOnInit() {
    // select method selects a slice of the state from the store, this gives an Observable - needs the asnyc pipe in the template
    this.ingredients = this.store.select('shoppingList');

    // also can subscribe manually
    // this.store.select('shoppingList').subscribe();

    // loggingService shows the loading behavior of service between different modules
    this.loggingService.printLog('Hello from ShoppingListComponent ngOnInit');
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy() {

  }

  


}
