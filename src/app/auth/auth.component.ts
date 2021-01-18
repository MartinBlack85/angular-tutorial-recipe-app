import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {
    isLoggedIn = true;
    isLoading = false;
    error: string = null;

    constructor(private authService: AuthService) {}

    onSwitchMode() {
        this.isLoggedIn = !this.isLoggedIn;
    }

    onSubmit(form: NgForm) {
        if(!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;
        if(this.isLoggedIn) {
            //...
        } else {
            this.authService.signUp(email, password).subscribe(responseData => {
            console.log(responseData);
            this.isLoading = false;
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            });
        }

        form.reset();
    }
}