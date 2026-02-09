import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  isSubmitting = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  submit(): void {
    this.errorMessage = '';
    if (!this.username || !this.email || !this.password) {
      this.errorMessage = 'Username, email, and password are required.';
      return;
    }

    this.isSubmitting = true;
    this.authService
      .register({
        username: this.username,
        email: this.email,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error?.error?.message || 'Registration failed.';
        }
      });
  }
}
