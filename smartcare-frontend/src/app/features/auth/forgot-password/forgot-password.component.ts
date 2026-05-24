import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
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
            <h2>Password Reset</h2>
            <p>Recover access to your SmartCare account</p>
          </div>
          <div class="auth-illustration">
            <i class="fas fa-key"></i>
          </div>
          <div class="auth-watermark">
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <div class="auth-right">
          <div class="auth-form-header">
            <h2>{{ step === 1 ? 'Forgot Password' : 'Reset Password' }}</h2>
            <p>{{ step === 1 ? 'Enter your email to receive a secure OTP code' : 'Enter the OTP sent to your email and a new password' }}</p>
          </div>

          <div class="error-message" *ngIf="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>
          
          <div class="success-message" *ngIf="successMsg">
            <i class="fas fa-check-circle"></i> {{ successMsg }}
          </div>

          <!-- Step 1: Request OTP -->
          <form *ngIf="step === 1" (ngSubmit)="onRequestOtp()">
            <div class="form-group">
              <label for="email"><i class="fas fa-envelope"></i> Email</label>
              <input type="email" id="email" class="form-control"
                     [(ngModel)]="email" name="email"
                     placeholder="Enter your registered email" required>
            </div>

            <button type="submit" class="btn btn-primary btn-full" [disabled]="loading || !email">
              <span *ngIf="!loading"><i class="fas fa-paper-plane"></i> Send Verification Code</span>
              <span *ngIf="loading"><i class="fas fa-spinner fa-spin"></i> Sending...</span>
            </button>
            <div class="auth-footer" style="margin-top: 15px;">
              <p><a routerLink="/auth/login"><i class="fas fa-arrow-left"></i> Back to Login</a></p>
            </div>
          </form>

          <!-- Step 2: Verify OTP & Reset -->
          <form *ngIf="step === 2" (ngSubmit)="onResetPassword()">
            <div class="form-group">
              <label for="otpCode"><i class="fas fa-shield-alt"></i> OTP Code</label>
              <input type="text" id="otpCode" class="form-control"
                     [(ngModel)]="otpCode" name="otpCode"
                     placeholder="Enter 6-digit OTP" required>
            </div>

            <div class="form-group">
              <label for="newPassword"><i class="fas fa-lock"></i> New Password</label>
              <div class="password-input">
                <input [type]="showPassword ? 'text' : 'password'" id="newPassword"
                       class="form-control" [(ngModel)]="newPassword" name="newPassword"
                       placeholder="Enter new password" required>
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full" [disabled]="loading || !otpCode || !newPassword">
              <span *ngIf="!loading"><i class="fas fa-check"></i> Reset Password</span>
              <span *ngIf="loading"><i class="fas fa-spinner fa-spin"></i> Resetting...</span>
            </button>
            <div class="auth-footer" style="margin-top: 15px;">
              <p><a href="javascript:void(0)" (click)="step = 1; error = ''; successMsg = '';"><i class="fas fa-arrow-left"></i> Resend Code</a></p>
            </div>
          </form>

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
    .auth-brand h2 { font-size: 1.8rem; margin-bottom: 8px; }
    .auth-brand p { opacity: 0.75; font-size: 0.92rem; }
    .auth-illustration { margin-top: 44px; font-size: 5rem; opacity: 0.2; }
    .auth-right {
      background: #fff;
      padding: 48px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .auth-form-header { margin-bottom: 28px; }
    .auth-form-header h2 { font-size: 1.7rem; color: var(--text-primary); margin-bottom: 4px; }
    .auth-form-header p { color: var(--text-muted); }
    .error-message {
      background: var(--error-light); color: var(--error); padding: 12px 16px;
      border-radius: var(--radius); margin-bottom: 20px; font-size: 0.88rem;
      display: flex; align-items: center; gap: 8px; border: 1px solid rgba(217, 48, 37, 0.15);
    }
    .success-message {
      background: var(--success-light); color: var(--success); padding: 12px 16px;
      border-radius: var(--radius); margin-bottom: 20px; font-size: 0.88rem;
      display: flex; align-items: center; gap: 8px; border: 1px solid rgba(15, 155, 88, 0.15);
    }
    .form-group label { display: flex; align-items: center; gap: 6px; }
    .form-group label i { color: var(--primary); font-size: 0.82rem; }
    .password-input { position: relative; }
    .toggle-password {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: var(--text-muted); cursor: pointer;
    }
    .btn-full { width: 100%; padding: 14px; font-size: 1rem; margin-top: 8px; }
    .btn-full:disabled { opacity: 0.7; cursor: not-allowed; }
    .auth-footer { text-align: center; color: var(--text-muted); font-size: 0.88rem; }
    .auth-footer a { color: var(--primary); font-weight: 600; text-decoration: none;}
    @media (max-width: 768px) {
      .auth-container { grid-template-columns: 1fr; }
      .auth-left { display: none; }
    }
  `]
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  otpCode = '';
  newPassword = '';
  error = '';
  successMsg = '';
  loading = false;
  showPassword = false;

  constructor(private authService: AuthService, private router: Router) { }

  onRequestOtp(): void {
    if (!this.email) return;
    this.loading = true;
    this.error = '';
    this.successMsg = '';

    this.authService.forgotPasswordSendOtp(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.step = 2;
        this.successMsg = 'An OTP has been sent to your email address.';
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to send OTP. Please check your email.';
      }
    });
  }

  onResetPassword(): void {
    if (!this.otpCode || !this.newPassword) return;
    this.loading = true;
    this.error = '';
    this.successMsg = '';

    this.authService.forgotPasswordVerify({
      email: this.email,
      otpCode: this.otpCode,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Password has been successfully reset! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to reset password. Please check your OTP.';
      }
    });
  }
}
