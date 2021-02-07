import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromAppStateStore from '../store/app.reducer';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSubscription: Subscription;
    collapsed = true;

    constructor(
        private dataStorageService: DataStorageService, 
        private authService: AuthService, 
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
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}