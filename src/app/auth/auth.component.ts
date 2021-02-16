import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromAppStateStore from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoggedIn = true;
    isLoading = false;
    error: string = null;   // not used for the programmatic error message alert solution
    // ViewChild will find the first occurance of the PlaceholderDirective
    @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;

    private closeSubscription: Subscription;
    private storeSubscription: Subscription;

    constructor( 
        private componentFactoryResolver: ComponentFactoryResolver,
        private store: Store<fromAppStateStore.AppState>
        ) {}

    // updating the UI based on the state in the ngrx store
    ngOnInit() {
        this.storeSubscription = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
            if(this.error) {
                this.showErrorAlert(this.error);
            }
        });
    }

    onSwitchMode() {
        this.isLoggedIn = !this.isLoggedIn;
    }

    onSubmit(form: NgForm) {
        if(!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        // in one of the case the subscription will happen either for login or signin
        if(this.isLoggedIn) {
            //authObservable = this.authService.login(email, password);

            this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}));
        } else {
            this.store.dispatch(new AuthActions.SignupStart({email: email, password: password}));
        }

        form.reset();
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());
    }

    ngOnDestroy() {
        if(this.closeSubscription) {
            this.closeSubscription.unsubscribe();
        }
        if(this.storeSubscription) {
            this.storeSubscription.unsubscribe();
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