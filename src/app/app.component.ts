import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoggingService } from './logging.service';
import * as fromAppStateStore from './store/app.reducer';
import * as AuthActions from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private store: Store<fromAppStateStore.AppState>, private loggingService: LoggingService) {}

  // checking the reloaded user from the browser's userStorage after the page reloads, app.component gets initiated in the earliest stage
  // loggingService shows the services loading behavior
  ngOnInit() {
    this.store.dispatch(new AuthActions.AutoLogin());
    this.loggingService.printLog('Hello from AppComponent ngOnInit');
  }

}
