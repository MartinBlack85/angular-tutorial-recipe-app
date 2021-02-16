import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";

import * as fromAppStateStore from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {

    //storing the user class as a BehaviorSubject, this can inform all component about the user change
    //each time at login or logout a user (creation) event will be emitted with the nex() function
    //each time the authentication status changes a new user subject will be emitted
    //need to add the tap() operator in the pipe() - it allows to perform some action on response data without changing the response
    //new users will be created in the tap() operator's anonim function (see bellow)
    //without a persistent storage, the authentication token in the user object disappears with the object upon page reload
    //user = new BehaviorSubject<User>(null);   -   ngrx replaces this service
    private tokenExpirationTimer: any;
    
    constructor(private store: Store<fromAppStateStore.AppState>) {}

    // need to call it when we emit a new user in the app
    setLogoutTimer(expiration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.store.dispatch(new AuthActions.Logout());
        }, expiration);
    }

    clearLogoutTimer() {
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }
}