import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";

import { User } from "./user.model";
import { environment } from "../../environments/environment";
import * as fromAppStateStore from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

// creating an interface to define the return type of the http post requests for authentication:
export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean
}

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
    

    constructor(private http: HttpClient, private router: Router, private store: Store<fromAppStateStore.AppState>) {}

    // in the url need to replace the [API_KEY] with the your own Firebase api key
    // need to attach a javascript object based on firebase api authentication requirements
    // only returns an observable, need to subscribe in that component where we need the return response from the http request
    // post<AuthResponseData> we define the response data from the http post request
    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, 
        {
            email: email,
            password: password,
            returnSecureToken: true
        },
        ).pipe(
            catchError(this.handleError), 
            tap(responseData => {
                this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            })
        );
    }

    // AuthresponseData has anoptional last value which will be returned for the sign in http request
    // This login method only returnes an observable, but we need to subscribe in the Auth component
    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken: true
        },
        ).pipe(
            catchError(this.handleError),
            tap(responseData => {
                this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn);
            })
        );
    }

    //rerieve the user data from the browser's local storage after a page reload
    //this method looks into the localStorage and looks for a snapshot in the storage
    //userData is stored in string format, need to turn it back onto an object literal
    // using the store to dispatch reducer action
    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string; // not defined as Date due to manual converting
        } = JSON.parse(localStorage.getItem('userData'));

        // in case the user didn't sign in or logged in before the page reload
        if(!userData) {
            return;
        }

        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            new Date(userData._tokenExpirationDate)
        );

        // because token is a getter that checks validity, this check will only be true if it is a valid token (expirition time)
        if(loadedUser.token) {
            //emitting a new authenticated user object on an observable
            //this.user.next(loadedUser);

            //dispatching the auth reducer action
            this.store.dispatch(new AuthActions.Login({
                email: loadedUser.email, 
                userId: loadedUser.id, 
                token: loadedUser.token, 
                expirationDate: new Date(userData._tokenExpirationDate)
                }
            ));

            //calling autoLogout when a user object get's emitted and need to pass the calculated remaining token time
            //calculation: future date in miliseconds - current date in miliseconds = time difference of expiration
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout() {
        //when user object becomes null the authenticated state changes and we get logout effect
        // this.user.next(null);

        // dispatch the auth action
        this.store.dispatch(new AuthActions.Logout());

        //redirect is needed to be implemented in the auth service, because other features will trigger it as well (not just in the header)
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    // need to call it when we emit a new user in the app
    autoLogout(expiration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expiration);
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        //generating expiration date token object based on the token expiration time from Firebase:
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        
        //emitting the new user object on signin, login or token expiration
        //this.user.next(user); -  ngrx auth action replaces this service

        const user = new User(email, userId, token, expirationDate);

        //dispatch auth action
        this.store.dispatch(new AuthActions.Login({
            email: email, 
            userId: userId, 
            token: token, 
            expirationDate: expirationDate
            }
        ));

        // calling autoLogout and passing an expiration timer value when a new user object get's emitted
        this.autoLogout(expiresIn * 1000);

        // need to store the authentication token of the user object in an external storage by using the browsers's local storage:
        // localsotrage can store key value pairs that remains persistant during a page reload - setItem('key', 'value')
        localStorage.setItem('userData', JSON.stringify(user));
    }

    // this error handling function will handle error in the pipe() for both signin and login auth methods
    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';
            if(!errorResponse.error || !errorResponse.error.error) {
                return throwError(errorMessage);
            }
            switch(errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'The email address is already in use by another account';
                    break;
                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = 'Password sign-in is disabled for this project';
                    break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    errorMessage = 'Requests have been blocked from this device due to unusual activity. Try again later';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'Email does not exist';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'Password is invalid or does not exist';
                    break;
                case 'USER_DISABLED':
                    errorMessage = 'The user account has been disabled';
                    break;
            }
            return throwError(errorMessage);
    }
}