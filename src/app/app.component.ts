import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  constructor(private authService: AuthService) {}

  // checking the reloaded user from the browser's userStorage after the page reloads, app.component gets initiated in the earliest stage
  ngOnInit() {
    this.authService.autoLogin();
  }

}
