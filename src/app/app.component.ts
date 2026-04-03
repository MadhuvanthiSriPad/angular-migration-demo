import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  sidenavOpened = true;

  constructor(public authService: AuthService) {}

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
