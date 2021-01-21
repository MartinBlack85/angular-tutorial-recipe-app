import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { AuthService, AuthResponseData } from "./auth.service";
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoggedIn = true;
    isLoading = false;
    error: string = null;   // not used for the programmatic error message alert solution
    // ViewChild will find the first occurance of the PlaceholderDirective
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
    private closeSubscription: Subscription;

    constructor(private authService: AuthService, private router: Router, private componentFactoryResolver: ComponentFactoryResolver) {}

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
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
        });

        form.reset();
    }

    onHandleError() {
        this.error = null;
    }

    ngOnDestroy() {
        if(this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
    }

    //creating error message alert programatically
    private showErrorAlert(message: string) {

        //  cannot create a component like this: 
        // const alertComponent = new AlertComponent();
        // instead let Angular to create component - need to use component factory:
        // only need to pass the type: AlertComponent for the parameter
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

        // ViewvContainerRef allows to interact that exact part of the DOM where it points
        const hostViewContainerRef = this.alertHost.viewContainerRef;

        // Clears all previously rendered content in the DOM rendered by the ViewvContainerRef
        hostViewContainerRef.clear();

        //using the componentFactory to create a new alert message component in the DOM based on the ViewContainerRef
        const componentReference = hostViewContainerRef.createComponent(alertComponentFactory);

        // using the component reference for data and event binding
        // instance have reference to the alert component class's properties
        componentReference.instance.message = message;
        this.closeSubscription = componentReference.instance.close.subscribe(() => {
            this.closeSubscription.unsubscribe();
            hostViewContainerRef.clear();
        });
    }
}