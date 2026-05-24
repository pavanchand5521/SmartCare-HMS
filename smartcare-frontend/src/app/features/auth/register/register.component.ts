import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
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
            <h2>Join SmartCare</h2>
            <p>Create your account and start managing your health</p>
          </div>
          <div class="auth-features">
            <div class="auth-feature">
              <i class="fas fa-check-circle"></i>
              <span>Instant registration</span>
            </div>
            <div class="auth-feature">
              <i class="fas fa-check-circle"></i>
              <span>Digital health records</span>
            </div>
            <div class="auth-feature">
              <i class="fas fa-check-circle"></i>
              <span>Expert doctor network</span>
            </div>
          </div>
          <div class="auth-watermark">
            <i class="fas fa-plus"></i>
          </div>
        </div>
        <div class="auth-right">
          <div class="auth-form-header">
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <div class="error-message" *ngIf="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>

          <form *ngIf="step === 1" (ngSubmit)="sendOtp()">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" class="form-control"
                       [(ngModel)]="formData.name" name="name"
                       placeholder="John Doe" required>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" class="form-control"
                       [(ngModel)]="formData.email" name="email"
                       placeholder="john@example.com" required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" class="form-control"
                       [(ngModel)]="formData.phone" name="phone"
                       placeholder="+1 555-000-0000">
              </div>
              <div class="form-group">
                <label for="age">Age</label>
                <input type="number" id="age" class="form-control"
                       [(ngModel)]="formData.age" name="age"
                       placeholder="25" min="1" max="150">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" class="form-control"
                        [(ngModel)]="formData.gender" name="gender">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <input type="text" id="address" class="form-control"
                       [(ngModel)]="formData.address" name="address"
                       placeholder="City, State">
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-input">
                <input [type]="showPassword ? 'text' : 'password'" id="password"
                       class="form-control" [(ngModel)]="formData.password" name="password"
                       placeholder="Create a strong password" required>
                <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
              <span *ngIf="!loading">Continue <i class="fas fa-arrow-right"></i></span>
              <span *ngIf="loading"><i class="fas fa-spinner fa-spin"></i> Processing...</span>
            </button>
          </form>

          <form *ngIf="step === 2" (ngSubmit)="verifyOtp()">
            <div class="form-group">
              <label for="otp">Enter 6-digit OTP</label>
              <input type="text" id="otp" class="form-control text-center fw-bold"
                     style="letter-spacing: 4px; font-size: 1.2rem;"
                     [(ngModel)]="otpCode" name="otp"
                     placeholder="000000" maxlength="6" required>
            </div>
            <button type="submit" class="btn btn-primary btn-full" [disabled]="loading">
              <span *ngIf="!loading">Verify & Register <i class="fas fa-check"></i></span>
              <span *ngIf="loading"><i class="fas fa-spinner fa-spin"></i> Verifying...</span>
            </button>
            <div class="auth-footer" style="margin-top: 15px;">
              <button type="button" class="btn-link" style="background: none; border: none; color: var(--text-muted); cursor: pointer; text-decoration: underline;" (click)="step = 1">
                <i class="fas fa-arrow-left"></i> Back to details
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
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
      grid-template-columns: 1fr 1.3fr;
      max-width: 960px;
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
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
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
      margin-bottom: 32px;
    }

    .auth-features {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .auth-feature {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.92rem;
      opacity: 0.85;
    }

    .auth-feature i {
      color: #a7f3d0;
    }

    .auth-right {
      background: #fff;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .auth-form-header {
      margin-bottom: 24px;
    }

    .auth-form-header h2 {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .auth-form-header p {
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .error-message {
      background: var(--error-light);
      color: var(--error);
      padding: 12px 16px;
      border-radius: var(--radius);
      margin-bottom: 16px;
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(217, 48, 37, 0.15);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
      display: block;
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
      margin-top: 4px;
    }

    .btn-full:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .auth-footer {
      margin-top: 20px;
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
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class RegisterComponent {
  formData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    age: null as number | null,
    gender: '',
    address: ''
  };
  error = '';
  loading = false;
  showPassword = false;
  step = 1;
  otpCode = '';

  constructor(private authService: AuthService, private router: Router) { }

  sendOtp(): void {
    if (!this.formData.email || !this.formData.password || !this.formData.name) {
      this.error = 'Please fill in all required fields';
      return;
    }
    this.loading = true;
    this.error = '';

    this.authService.sendOtp(this.formData).subscribe({
      next: () => {
        this.loading = false;
        this.step = 2;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to send OTP. Please try again.';
      }
    });
  }

  verifyOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.error = 'Please enter a valid 6-digit OTP';
      return;
    }
    this.loading = true;
    this.error = '';

    const payload = { ...this.formData, otpCode: this.otpCode };

    this.authService.verifyOtp(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/patient/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Verification failed. Please try again.';
      }
    });
  }
}
