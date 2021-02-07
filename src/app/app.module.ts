import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core.module';
import * as fromAppStateStore from './store/app.reducer';

// In the Ngrx's StoreModule.forRoot() need to define a map for the reducer functions in a jS object by using custom key-valu identifiers
// This key-value identifier defines the structure of the Ngrx store
// By this setting Ngrx autimatically initiates a store where it registers the reducer functions and can store and update the app states

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromAppStateStore.appReducer),
    SharedModule,
    CoreModule
  ],
  bootstrap: [AppComponent]
  // providers: [LoggingService]  -   for lazy loading use @Injectable({providedIn: 'root'}) in the service class
})
export class AppModule {}
