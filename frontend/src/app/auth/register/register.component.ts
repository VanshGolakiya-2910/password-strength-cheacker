import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PasswordStrengthUtil, PasswordStrengthResult } from '../../utils/password-strength.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  firstName = '';
  lastName = '';
  isSubmitting = false;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  passwordStrength: PasswordStrengthResult = {
    strength: '',
    strengthScore: 0,
    strengthClass: 'progress-bar bg-warning',
    feedback: []
  };

  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPasswordChange(): void {
    if (this.password) {
      this.passwordStrength = PasswordStrengthUtil.checkPasswordStrength(this.password);
    } else {
      this.passwordStrength = {
        strength: '',
        strengthScore: 0,
        strengthClass: 'progress-bar bg-warning',
        feedback: []
      };
    }
  }

  suggestPassword(): void {
    const strongPassword = PasswordStrengthUtil.generateSecurePassword();
    this.password = strongPassword;
    this.onPasswordChange();
  }

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
          this.errorMessage = 'Unable to create account right now. Please try again.';
        }
      });
  }
}
