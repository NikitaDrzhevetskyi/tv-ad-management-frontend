// signup.component.ts
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, SharedMaterialModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public signupForm: FormGroup;
  public isLoading = false;
  public errorMessage = '';
  public successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );

    if (this.authService.isAuthenticated()) {
      this.redirectAuthenticatedUser();
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.signupForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { email, password } = this.signupForm.value;

      this.authService.signUp(email, password, 'user').subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          this.successMessage = 'Account created successfully! Please login.';
          this.isLoading = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Signup error:', error);
          this.errorMessage = error || 'Signup failed. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }

  private redirectAuthenticatedUser(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      switch (currentUser.role) {
        case 'admin':
          this.router.navigate(['/dashboard']);
          break;
        case 'user':
          this.router.navigate(['/order-advertising']);
          break;
        default:
          this.authService.logout();
          break;
      }
    }
  }

  getConfirmPasswordError(): string {
    const confirmPassword = this.signupForm.get('confirmPassword');

    if (confirmPassword?.hasError('required')) {
      return 'Confirm password is required';
    }

    if (this.signupForm.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }

    return '';
  }
}
