import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken: string,
    email: string,
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean
}

const handleAuthenticattion = (expiresIn: number, email: string, userId: string, token: string) => {
    //generating expiration date token object based on the token expiration time from Firebase:
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email, 
        userId: userId, 
        token: token, 
        expirationDate: expirationDate,
        redirect: true
        });
};

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unknown error occured!';
    if(!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
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
        // need to return an observable by using of() with an action to dispatch because error doesn't give an observable automatically
        return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {

    // registering action handlers, declared as normal class properties
    // don't need to subscribe here, ngrx effect will do the subscription
    // ofType operator provides a filter for the effects
    // switchMap takes in a previous observable and returnes a new observable, we can add inner observable with another pipe
    // need the Effct() decorator for ngrx/effect to handle this as an effect

    @Effect()
    authSignUp = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((signupAction: AuthActions.SignupStart) => {
            return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey, 
        {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true
        },
        ).pipe(
            tap(responseData => {
                this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
            }),
            // map here also need to return a non-erronous observable (not empty here)
            // need to create a login action object
            map(responseData => {
                return handleAuthenticattion(
                    +responseData.expiresIn, 
                    responseData.email, 
                    responseData.localId, 
                    responseData.idToken
                );
            }),
            catchError(errorResponse => {
                // run error handling code
                return handleError(errorResponse);
            })
        );
        })
    );

    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),
        switchMap((authData: AuthActions.LoginStart) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
            {
                email: authData.payload.email,
                password: authData.payload.password,
                returnSecureToken: true
            },
        ).pipe(
            tap(responseData => {
                this.authService.setLogoutTimer(+responseData.expiresIn * 1000);
            }),
            // map here also need to return a non-erronous observable (not empty here)
            // need to create a login action object
            map(responseData => {
                //generating expiration date token object based on the token expiration time from Firebase:
                return handleAuthenticattion(
                    +responseData.expiresIn, 
                    responseData.email, 
                    responseData.localId, 
                    responseData.idToken
                );
            }),
            catchError(errorResponse => {
                // run error handling code
                return handleError(errorResponse);
            }), 
        );
        }),
    );

    // this effect only using the router, doesn't dispatch a new action, need to use the {dispatch: false} in decorrator
    // typically effects do dispatch actions
    @Effect({dispatch: false})
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if(authSuccessAction.payload.redirect) {
                this.router.navigate(['/']);
            }
        })
    );

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string; // not defined as Date due to manual converting
            } = JSON.parse(localStorage.getItem('userData'));
    
            // in case the user didn't sign in or logged in before the page reload
            if(!userData) {
                return { type: 'DUMMYTYPE'};
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

                //calling autoLogout when a user object get's emitted and need to pass the calculated remaining token time
                //calculation: future date in miliseconds - current date in miliseconds = time difference of expiration
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                
                this.authService.setLogoutTimer(expirationDuration);
    
                //return the auth reducer action
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email, 
                    userId: loadedUser.id, 
                    token: loadedUser.token, 
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                });
            }

            return { type: 'DUMMYTYPE'};
        })
    )

    @Effect({dispatch: false})
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })  
    );

    // Actions is an observable that gives access to all dispatched actions
    constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {}
    
}