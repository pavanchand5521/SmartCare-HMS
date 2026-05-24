import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { Patient } from '../../../core/models/models';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page fade-in-up">
      <div class="profile-container">
        <div class="page-header">
          <div>
            <h1>My Profile</h1>
            <p class="subtitle">Manage your personal information and security</p>
          </div>
        </div>

        <div class="profile-grid" *ngIf="patient">
          <!-- Personal Details Card -->
          <div class="card profile-card">
            <div class="card-accent"></div>
            <div class="card-header">
              <h3><i class="fas fa-user"></i> Personal Details</h3>
            </div>
            <div class="card-body">
              <div class="photo-upload-container">
                 <div class="profile-photo">
                   <img [src]="patient.profileImage || 'assets/default-avatar.png'" alt="Profile Photo">
                   <div class="photo-overlay" (click)="fileInput.click()">
                     <i class="fas fa-camera"></i>
                   </div>
                 </div>
                 <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none;">
              </div>

              <div class="alert success-alert" *ngIf="profileMessage">
                <i class="fas fa-check-circle"></i> {{ profileMessage }}
              </div>

              <form (ngSubmit)="updateProfile()">
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" class="form-control" [(ngModel)]="patient.name" name="name" required>
                </div>
                
                <div class="form-row">
                  <div class="form-group half">
                    <label>Age</label>
                    <input type="number" class="form-control" [(ngModel)]="patient.age" name="age">
                  </div>
                  <div class="form-group half">
                    <label>Gender</label>
                    <select class="form-control" [(ngModel)]="patient.gender" name="gender">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label>Phone</label>
                  <input type="tel" class="form-control" [(ngModel)]="patient.phone" name="phone">
                </div>

                <div class="form-group">
                  <label>Address</label>
                  <textarea class="form-control" [(ngModel)]="patient.address" name="address" rows="3"></textarea>
                </div>

                <button type="submit" class="btn btn-primary" [disabled]="savingProfile">
                  <i class="fas fa-save" *ngIf="!savingProfile"></i>
                  <i class="fas fa-spinner fa-spin" *ngIf="savingProfile"></i>
                  Save Profile
                </button>
              </form>
            </div>
          </div>

          <!-- Security Card -->
          <div class="card security-card">
            <div class="card-accent"></div>
            <div class="card-header">
              <h3><i class="fas fa-lock"></i> Change Password</h3>
            </div>
            <div class="card-body">
              <div class="alert success-alert" *ngIf="passwordSuccess">
                <i class="fas fa-check-circle"></i> {{ passwordSuccess }}
              </div>
              <div class="alert error-alert" *ngIf="passwordError">
                <i class="fas fa-exclamation-circle"></i> {{ passwordError }}
              </div>

              <form (ngSubmit)="updatePassword()">
                <div class="form-group">
                  <label>Current Password</label>
                  <div class="password-input">
                    <input [type]="showCurrentPassword ? 'text' : 'password'" class="form-control" [(ngModel)]="passwords.current" name="currentPassword" required>
                    <button type="button" class="toggle-password" (click)="showCurrentPassword = !showCurrentPassword">
                      <i [class]="showCurrentPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>
                
                <div class="form-group">
                  <label>New Password</label>
                  <div class="password-input">
                    <input [type]="showNewPassword ? 'text' : 'password'" class="form-control" [(ngModel)]="passwords.new" name="newPassword" required>
                    <button type="button" class="toggle-password" (click)="showNewPassword = !showNewPassword">
                      <i [class]="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <div class="form-group">
                  <label>Confirm New Password</label>
                  <div class="password-input">
                    <input [type]="showConfirmPassword ? 'text' : 'password'" class="form-control" [(ngModel)]="passwords.confirm" name="confirmPassword" required>
                    <button type="button" class="toggle-password" (click)="showConfirmPassword = !showConfirmPassword">
                      <i [class]="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                </div>

                <button type="submit" class="btn btn-secondary" [disabled]="savingPassword || !passwords.current || !passwords.new || !passwords.confirm">
                  <i class="fas fa-key" *ngIf="!savingPassword"></i>
                  <i class="fas fa-spinner fa-spin" *ngIf="savingPassword"></i>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      padding: 100px 0 40px;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .page-header {
      margin-bottom: 28px;
    }

    .page-header h1 {
      font-size: 1.6rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      color: var(--text-muted);
      margin-top: 4px;
      font-size: 0.92rem;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 24px;
    }

    .card {
      position: relative;
      overflow: hidden;
    }

    .card-accent {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
    }

    .photo-upload-container {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
    }

    .profile-photo {
      position: relative;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid var(--primary-100);
      box-shadow: 0 4px 16px rgba(10, 77, 162, 0.12);
      cursor: pointer;
    }

    .profile-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .photo-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(10, 77, 162, 0.6);
      color: white;
      text-align: center;
      padding: 8px 0;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .profile-photo:hover .photo-overlay {
      opacity: 1;
    }

    .form-row {
      display: flex;
      gap: 16px;
    }

    .half {
      flex: 1;
    }

    .alert {
      padding: 12px 16px;
      border-radius: var(--radius);
      margin-bottom: 16px;
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .success-alert {
      background: var(--success-light);
      color: #0B6B3A;
      border: 1px solid rgba(15, 155, 88, 0.15);
    }

    .error-alert {
      background: var(--error-light);
      color: #9B1B14;
      border: 1px solid rgba(217, 48, 37, 0.15);
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

    @media (max-width: 768px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class PatientProfileComponent implements OnInit {
  patient: Patient | null = null;
  savingProfile = false;
  profileMessage = '';

  passwords = { current: '', new: '', confirm: '' };
  savingPassword = false;
  passwordSuccess = '';
  passwordError = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(private patientService: PatientService, private authService: AuthService) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user && user.userId) {
      this.patientService.getPatientByUserId(user.userId).subscribe(p => this.patient = p);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (this.patient) {
          this.patient.profileImage = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile() {
    if (!this.patient) return;
    this.savingProfile = true;
    this.profileMessage = '';

    this.patientService.updatePatient(this.patient.id, this.patient).subscribe({
      next: (res) => {
        this.patient = res;
        this.savingProfile = false;
        this.profileMessage = 'Profile updated successfully!';
        setTimeout(() => this.profileMessage = '', 3000);
      },
      error: () => {
        this.savingProfile = false;
      }
    });
  }

  updatePassword() {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (this.passwords.new !== this.passwords.confirm) {
      this.passwordError = 'New passwords do not match.';
      return;
    }

    if (this.passwords.new.length < 6) {
      this.passwordError = 'Password must be at least 6 characters.';
      return;
    }

    this.savingPassword = true;
    this.authService.changePassword(this.passwords.current, this.passwords.new).subscribe({
      next: () => {
        this.savingPassword = false;
        this.passwordSuccess = 'Password updated successfully!';
        this.passwords = { current: '', new: '', confirm: '' };
        setTimeout(() => this.passwordSuccess = '', 3000);
      },
      error: (err) => {
        this.savingPassword = false;
        this.passwordError = err.error?.error || 'Failed to update password.';
      }
    });
  }
}
