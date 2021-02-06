import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromShoppingListReducer from '../store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  //using the Template-driven form
  @ViewChild('form', {static: false}) shoppingListForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<fromShoppingListReducer.AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if(stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingListForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  // need to dispatch the Ngrx store actions here for the Ngrx state management
  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      // dispatching the action for ngrx store, passing the new Ingredients value from the form's submit 
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient))
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StoptEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StoptEdit());
  }

}
