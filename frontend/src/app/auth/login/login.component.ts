import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  identifier = '';
  password = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    this.errorMessage = '';
    if (!this.identifier || !this.password) {
      this.errorMessage = 'Please enter your username/email and password.';
      return;
    }

    this.isSubmitting = true;
    this.authService.login({ identifier: this.identifier, password: this.password }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Login failed.';
      }
    });
  }
}
