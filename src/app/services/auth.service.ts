import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface AuthResponse {
  token: string;
}

interface UserPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserPayload | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private authStatusSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.authStatusSubject.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    this.restoreSession();
  }

  /** ------------------------------
   *  Authentication Requests
   * ------------------------------- */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap(({ token }) => this.onLoginSuccess(token)),
        catchError(this.handleHttpError)
      );
  }

  signUp(
    email: string,
    password: string,
    role: string = 'user'
  ): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/auth/signup`, { email, password, role })
      .pipe(catchError(this.handleHttpError));
  }

  /** ------------------------------
   *  Session Management
   * ------------------------------- */
  private onLoginSuccess(token: string): void {
    this.storeToken(token);
    const user = this.decodeToken(token);
    if (!user) return;

    this.currentUserSubject.next(user);
    this.authStatusSubject.next(true);
    this.redirectByRole(user.role);
  }

  private restoreSession(): void {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      const user = this.decodeToken(token);
      this.currentUserSubject.next(user);
      this.authStatusSubject.next(true);
    } else {
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);
    this.authStatusSubject.next(false);
    this.router.navigate(['/login']);
  }

  /** ------------------------------
   *  Token Utilities
   * ------------------------------- */
  private storeToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private decodeToken(token: string): UserPayload | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      console.error('Failed to decode token');
      return null;
    }
  }

  private isTokenValid(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  }

  /** ------------------------------
   *  Role & User Info
   * ------------------------------- */
  getCurrentUser(): UserPayload | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.authStatusSubject.value;
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.getCurrentUser()?.role ?? '');
  }

  /** ------------------------------
   *  Navigation
   * ------------------------------- */
  private redirectByRole(role: string): void {
    const routes: Record<string, string> = {
      admin: '/dashboard',
      user: '/order-advertising',
    };
    this.router.navigate([routes[role] ?? '/login']);
  }

  /** ------------------------------
   *  Error Handling
   * ------------------------------- */
  private handleHttpError = (error: HttpErrorResponse) => {
    const message =
      error.error?.message || error.message || 'An unknown error occurred';
    return throwError(() => message);
  };
}
