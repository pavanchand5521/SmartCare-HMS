import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card fade-in-up">
        <div class="login-header">
          <div class="logo-circle">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h1>Admin Portal</h1>
          <p>SmartCare Hospital Management System</p>
        </div>

        <div class="error-msg" *ngIf="error">
          <i class="fas fa-exclamation-triangle"></i> {{ error }}
        </div>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label><i class="fas fa-envelope"></i> Email</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email"
                   placeholder="admin@smartcare.com" required>
          </div>
          <div class="form-group">
            <label><i class="fas fa-lock"></i> Password</label>
            <input type="password" class="form-control" [(ngModel)]="password" name="password"
                   placeholder="Enter admin password" required>
          </div>
          <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
            <span *ngIf="!loading"><i class="fas fa-sign-in-alt"></i> Access Dashboard</span>
            <span *ngIf="loading"><i class="fas fa-spinner fa-spin"></i> Authenticating...</span>
          </button>
        </form>

        <div class="login-footer">
          <p><i class="fas fa-info-circle"></i> This portal is restricted to system administrators only.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
      padding: 24px;
    }

    .login-card {
      background: #fff;
      border-radius: var(--radius-lg);
      padding: 48px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(0,0,0,0.3);
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-circle {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      font-size: 1.8rem;
      color: #fff;
      box-shadow: 0 8px 25px rgba(99,102,241,0.3);
    }

    .login-header h1 {
      font-size: 1.6rem;
      margin-bottom: 4px;
    }

    .login-header p {
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .error-msg {
      background: #fef2f2;
      color: var(--error);
      padding: 12px 16px;
      border-radius: var(--radius);
      margin-bottom: 20px;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid #fee2e2;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .form-group label i {
      color: var(--primary);
      font-size: 0.85rem;
    }

    .btn-full {
      width: 100%;
      padding: 14px;
      font-size: 1rem;
    }

    .btn-full:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 24px;
      text-align: center;
    }

    .login-footer p {
      color: var(--text-muted);
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
  `]
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (authService.isLoggedIn()) {
      router.navigate(['/dashboard']);
    }
  }

  onLogin(): void {
    this.loading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || err.message || 'Login failed. Admin access only.';
      }
    });
  }
}
