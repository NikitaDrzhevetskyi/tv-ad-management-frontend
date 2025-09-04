import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, SharedMaterialModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public loginForm: FormGroup;
  public isLoading = false;
  public errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    if (this.authService.isAuthenticated()) {
      this.redirectAuthenticatedUser();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
        //   console.log('Login successful:', response);
          this.isLoading = false;
        },
        error: (error) => {
        //   console.error('Login error:', error);
          this.errorMessage = error || 'Login failed. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }

  redirectToSignUp(): void {
    this.router.navigate(['/signup']);
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

}
