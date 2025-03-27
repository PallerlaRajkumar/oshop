import { Component } from '@angular/core';
import { AuthService } from '..//auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <h1>Login</h1>
      <button class="btn btn-primary" (click)="loginWithGoogle()">Login with Google</button>
    </div>
  `
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  async loginWithGoogle() {
    try {
      await this.auth.loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  }
}
