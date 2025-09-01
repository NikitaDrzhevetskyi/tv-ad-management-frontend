// login.component.ts (updated with AuthService integration)
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
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.loginUser(email, password);
    console.log(email, password);

    // if (this.loginForm.valid) {
    //   this.isLoading = true;
    //   this.errorMessage = '';

    //   const { email, password } = this.loginForm.value;

    //   this.authService.login(email, password).subscribe({
    //     next: (user) => {
    //       this.isLoading = false;
    //       console.log('Login successful:', user);
    //       this.router.navigate(['/dashboard']);
    //     },
    //     error: (error) => {
    //       this.isLoading = false;
    //       this.errorMessage = 'Login failed. Please check your credentials.';
    //       console.error('Login error:', error);
    //     }
    //   });
    // }
  }
  redirectToSignUp() {
    this.router.navigate(['/signup']);
  }
}
