import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { take, exhaustMap, map } from "rxjs/operators";

import { AuthService } from "./auth.service";
import * as fromAppStateStore from '../store/app.reducer';

// Interceptor service to attach the authentication token for the user object 
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService, private store: Store<fromAppStateStore.AppState>) {}

    // various observable will be gathered and returned as one complex observable in the end
    // need to subscribe to the http get observable in that component where we want to use the incoming data, there we subscribe here
    // the take() function takes only 1 value from the observable provided by the BevavoirSubject then automatically unsubscribe
    // exhasutMap() operator waits for the first observable to complete (take()), getting data and replace with a new inner observable in chain
    // exhaustMap() will replace the prvoius observable with a new one containing the http get result
    // the take() operator will get the latest user object from the first observable and will swap the chain with a new observable
    // the url needs a query parameter for Firebase token authentication using HttpParams
    //will return 1 observable
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            exhaustMap(user => {
                //if user object is null, we forward the original http request
                if(!user) {
                    return next.handle(req);
                }
                //cloning the request and modifiy into a new one
                const modifiedRequest = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedRequest);
            })
        );
    }
}