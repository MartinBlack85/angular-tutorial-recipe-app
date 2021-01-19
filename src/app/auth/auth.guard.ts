import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import { AuthService } from "./auth.service";

// adding a route guard that runs before the router loads in, prevent unauthorized (manual) access on the routes
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    //need to return the state of the authentication by look at the user BevaviorSubject
    //since user BehaviorSubject is an observable, possible to use map rxjs operators in the pipe() to transform the observable
    //take(1) operator makes sure to unsubscribe the previous observable, by this preventing an ongoing listener
    //can be used in front of the route to guard
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot):
        | boolean
        | UrlTree 
        | Promise<boolean | UrlTree> 
        | Observable<boolean | UrlTree>  {
        return this.authService.user.pipe(
            take(1),
            map(user => {
            const isAuth = !!user;  //shorthand of the ternary operator
            if(isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        })
        );
    }
}