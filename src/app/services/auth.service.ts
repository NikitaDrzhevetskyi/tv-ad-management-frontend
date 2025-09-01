// auth.service.ts (example implementation)
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IAuthData } from '../interfaces/auth-data';

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {}

  createUser(email: string, password: string) {
    const authData: IAuthData = { email: email, password: password };

    this.http
      .post('http://localhost:3001/api/users/signup', authData)
      .subscribe((response) => {
        console.log(response);
      });
  }
  loginUser(email: string, password: string) {
    const authData: IAuthData = { email: email, password: password };
    this.http.post('http://localhost:3001/api/users/login', authData);
  }
}
