import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import * as fromAppStateStore from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSubscription: Subscription;
    collapsed = true;

    constructor(
        private store: Store<fromAppStateStore.AppState>) 
        {}

    ngOnInit() {
        // receiving a user object from the emitted user Subject
        this.userSubscription = this.store
            .select('auth')
            .pipe(map(authState => {
                return authState.user;}))
            .subscribe(user => {
            // if login status is ture the user object is not null
                this.isAuthenticated = !user ? false : true;
            //shorthand version: this.isAuthenticated = !!user;
        });
    }

    onSaveData() {
        //this.dataStorageService.storeRecipes();
        this.store.dispatch(new RecipeActions.StoreRecipes())
    }

    onFetchData() {
        //this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(new RecipeActions.FetchRecipes());
    }

    onLogout() {
        this.store.dispatch(new AuthActions.Logout());
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}