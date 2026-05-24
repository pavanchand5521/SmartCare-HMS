import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/models';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('smartcare_user');
    if (stored) {
      this.currentUserSubject.next(JSON.parse(stored));
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem('smartcare_token', response.token);
          localStorage.setItem('smartcare_user', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('smartcare_token', response.token);
          localStorage.setItem('smartcare_user', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  sendOtp(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, data);
  }

  verifyOtp(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-and-register`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('smartcare_token', response.token);
          localStorage.setItem('smartcare_user', JSON.stringify(response));
          this.currentUserSubject.next(response);
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/password`, { currentPassword, newPassword });
  }

  forgotPasswordSendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/send-otp`, { email });
  }

  forgotPasswordVerify(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password/verify`, data);
  }

  logout(): void {
    localStorage.removeItem('smartcare_token');
    localStorage.removeItem('smartcare_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('smartcare_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  getRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
}
