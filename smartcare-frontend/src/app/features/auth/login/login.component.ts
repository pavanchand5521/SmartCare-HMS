import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-container fade-in-up">
        <div class="auth-left">
          <div class="auth-brand">
            <div class="auth-logo-icon">
              <i class="fas fa-heartbeat"></i>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to access your SmartCare dashboard</p>
          </div>
          <div class="auth-illustration">
            <i class="fas fa-hospital-user"></i>
          </div>
          <div class="auth-watermark">
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <div class="auth-right">
          <div class="auth-form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials below</p>
          </div>

          <div class="error-message" *ngIf="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>

          <form (ngSubmit)="onLogin()">
            <div class="form-group">
              <label for="email"><i class="fas fa-envelope"></i> Email</label>
              <input type="email" id="email" class="form-control"
                     [(ngModel)]="email" name="email"
                     placeholder="Enter your email" required>
            </div>

            <div class="form-group">
              <div class="password-label-wrapper">
                <label for="password"><i class="fas fa-lock"></i> Password</label>
                <a routerLink="/auth/forgot-password" class="forgot-link">Forgot Password?</a>
              </div>
              <div class="password-input">
                <input [type]="showPassword ? 'text' : 'password'" id="password"
                       class="form-control" [(ngModel)]="password" name="password"
                       placeholder="Enter your password" required>
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
              <span *ngIf="!loading"><i class="fas fa-sign-in-alt"></i> Sign In</span>
              <span *ngIf="loading"><i class="fas fa-spinner fa-spin"></i> Signing in...</span>
            </button>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Register here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--gradient-hero);
      padding: 80px 24px 24px;
    }

    .auth-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 900px;
      width: 100%;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
    }

    .auth-left {
      background: var(--gradient-primary);
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: #fff;
      position: relative;
      overflow: hidden;
    }

    .auth-watermark {
      position: absolute;
      bottom: -40px;
      right: -40px;
      font-size: 12rem;
      opacity: 0.05;
      color: #fff;
      transform: rotate(15deg);
    }

    .auth-logo-icon {
      width: 64px;
      height: 64px;
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
      margin-bottom: 20px;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .auth-brand h2 {
      font-size: 1.8rem;
      margin-bottom: 8px;
    }

    .auth-brand p {
      opacity: 0.75;
      font-size: 0.92rem;
    }

    .auth-illustration {
      margin-top: 44px;
      font-size: 5rem;
      opacity: 0.2;
    }

    .auth-right {
      background: #fff;
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .auth-form-header {
      margin-bottom: 28px;
    }

    .auth-form-header h2 {
      font-size: 1.7rem;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .auth-form-header p {
      color: var(--text-muted);
    }

    .error-message {
      background: var(--error-light);
      color: var(--error);
      padding: 12px 16px;
      border-radius: var(--radius);
      margin-bottom: 20px;
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(217, 48, 37, 0.15);
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .form-group label i {
      color: var(--primary);
      font-size: 0.82rem;
    }

    .password-label-wrapper {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 6px;
    }

    .password-label-wrapper label {
      margin-bottom: 0;
    }

    .forgot-link {
      font-size: 0.82rem;
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .password-input {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
    }

    .btn-full {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
      margin-top: 8px;
    }

    .btn-full:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .auth-footer {
      margin-top: 24px;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .auth-footer a {
      color: var(--primary);
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .auth-container { grid-template-columns: 1fr; }
      .auth-left { display: none; }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;
        // Redirect based on role 
        switch (response.role) {
          case 'PATIENT':
            this.router.navigate(['/patient/dashboard']);
            break;
          case 'DOCTOR':
            this.router.navigate(['/doctor/dashboard']);
            break;
          case 'ADMIN':
            // Admin should use admin portal
            this.error = 'Admin users should login at the Admin Portal (port 4300)';
            this.authService.logout();
            break;
          default:
            this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }
}
