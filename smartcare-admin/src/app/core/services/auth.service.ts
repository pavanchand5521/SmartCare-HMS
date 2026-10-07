import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  role: string;
  name: string;
  email: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('admin_user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.role !== 'ADMIN') {
            throw new Error('Access denied. Admin accounts only.');
          }
          localStorage.setItem('admin_token', response.token);
          localStorage.setItem('admin_user', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }
}
