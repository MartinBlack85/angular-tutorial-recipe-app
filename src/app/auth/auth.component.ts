import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { AuthService, AuthResponseData } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoggedIn = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService, private router: Router) {}

    onSwitchMode() {
        this.isLoggedIn = !this.isLoggedIn;
    }

    onSubmit(form: NgForm) {
        if(!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        //Observable is a generic type, need to define it's type
        let authObservable: Observable<AuthResponseData>;

        this.isLoading = true;

        // in one of the case the subscription will happen either for login or signin
        if(this.isLoggedIn) {
            authObservable = this.authService.login(email, password);
        } else {
            authObservable = this.authService.signUp(email, password);
        }

        authObservable.subscribe(responseData => {
            console.log(responseData);
            this.isLoading = false;
            //when signin/login happens, user object gets created and user will get navigated to the recipes page
            //this is programmatic navigation, not based on user click operations
            this.router.navigate(['/recipes']);
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
        });


        form.reset();
    }
}