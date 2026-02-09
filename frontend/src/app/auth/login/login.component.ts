import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  returnUrl = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

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
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.message || 'Login failed.';
      }
    });
  }
}
