import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedMaterialModule } from '../../util/shared-material.module';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [SharedMaterialModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  public signUpForm: FormGroup;
  public isLoading = false;
  public errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSignUp() {
    // this.isLoading = false;

    if (this.signUpForm.invalid) {
      return;
    }

    const { email, password } = this.signUpForm.value;
    this.authService.createUser(email, password);
    // if (this.signUpForm.valid) {
    //   this.isLoading = true;
    //   this.errorMessage = '';

    //   const { email, password } = this.signUpForm.value;

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
    //     },
    //   });
    // }
  }
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
