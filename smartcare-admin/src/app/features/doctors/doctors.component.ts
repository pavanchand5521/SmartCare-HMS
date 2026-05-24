import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Doctor } from '../../core/services/api.service';

@Component({
  selector: 'app-manage-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page fade-in-up">
      <div class="page-header-dash">
        <div>
          <h1><i class="fas fa-user-md"></i> Manage Doctors</h1>
          <p class="subtitle">Add, edit, and manage doctor accounts</p>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()">
          <i class="fas fa-plus"></i> Add Doctor
        </button>
      </div>

      <div class="card">
        <table class="data-table" *ngIf="doctors.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let doc of doctors">
              <td><strong>Dr. {{ doc.name }}</strong></td>
              <td>{{ doc.email }}</td>
              <td>{{ doc.specialization }}</td>
              <td>{{ doc.experience }} yrs</td>
              <td>{{ doc.phone || '-' }}</td>
              <td>
                <span class="badge" [class.badge-active]="doc.status === 'ACTIVE'"
                      [class.badge-inactive]="doc.status === 'INACTIVE'">
                  {{ doc.status }}
                </span>
              </td>
              <td class="action-cell">
                <button class="btn btn-sm btn-primary" (click)="openEditModal(doc)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" *ngIf="doc.status === 'ACTIVE'"
                        (click)="deactivateDoctor(doc.id)">
                  <i class="fas fa-ban"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty" *ngIf="doctors.length === 0">
          <i class="fas fa-user-md" style="font-size:2rem;color:var(--primary-200);margin-bottom:12px"></i>
          <p>No doctors added yet. Click "Add Doctor" to create one.</p>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal (Moved outside .page to avoid flex/transform constraints) -->
    <div class="modal-overlay" *ngIf="showModal" (click)="showModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <h2><i class="fas fa-user-md"></i> {{ editMode ? 'Edit Doctor' : 'Add New Doctor' }}</h2>

          <div class="error-msg" *ngIf="modalError">
            <i class="fas fa-exclamation-circle"></i> {{ modalError }}
          </div>

          <form (ngSubmit)="saveDoctor()">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="form.name" name="name"
                     placeholder="Dr. Full Name" required>
            </div>
            <div class="form-group" *ngIf="!editMode">
              <label>Email</label>
              <input type="email" class="form-control" [(ngModel)]="form.email" name="email"
                     placeholder="doctor@hospital.com" required>
            </div>
            <div class="form-group" *ngIf="!editMode">
              <label>Password</label>
              <input type="password" class="form-control" [(ngModel)]="form.password" name="password"
                     placeholder="Create password" required>
            </div>
            <div class="form-group">
              <label>Specialization</label>
              <select class="form-control" [(ngModel)]="form.specialization" name="specialization" required>
                <option value="">Select Specialization</option>
                <option *ngFor="let s of specializations" [value]="s">{{ s }}</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Experience (Years)</label>
                <input type="number" class="form-control" [(ngModel)]="form.experience" name="experience"
                       min="0" placeholder="Years">
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input type="tel" class="form-control" [(ngModel)]="form.phone" name="phone"
                       placeholder="+1 555-000-0000">
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" (click)="showModal = false"
                      style="background:var(--bg-primary);color:var(--text-secondary);border:1px solid var(--border);">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="saving">
                <span *ngIf="!saving">{{ editMode ? 'Update' : 'Create' }} Doctor</span>
                <span *ngIf="saving"><i class="fas fa-spinner fa-spin"></i> Saving...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
  `,
  styles: [`
    .page-header-dash {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;
    }
    .page-header-dash h1 {
      font-size: 1.6rem; display: flex; align-items: center; gap: 10px;
    }
    .page-header-dash h1 i { color: var(--primary); }
    .subtitle { color: var(--text-muted); margin-top: 2px; }
    .action-cell { display: flex; gap: 6px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .empty { text-align: center; padding: 48px; color: var(--text-muted); }
    .error-msg {
      background: #fef2f2; color: var(--error); padding: 12px 16px; border-radius: var(--radius);
      margin-bottom: 20px; font-size: 0.95rem; display: flex; align-items: center; gap: 10px;
      border: 1px solid #fee2e2; justify-content: center;
    }
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center; z-index: 9999;
    }
    .modal-content {
      background: #fff; width: 100%; max-width: 500px; padding: 32px;
      border-radius: var(--radius-xl); box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      animation: modalFadeIn 0.3s ease-out;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
    .modal-actions button { flex: 1; padding: 12px; font-weight: 600; }
  `]
})
export class ManageDoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  showModal = false;
  editMode = false;
  editId: number | null = null;
  saving = false;
  modalError = '';

  form: Doctor = {
    id: 0, name: '', email: '', password: '', specialization: '',
    experience: 0, phone: '', status: 'ACTIVE'
  };

  specializations = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'General Medicine', 'Neurology', 'Oncology', 'Ophthalmology',
    'Orthopedics', 'Pediatrics', 'Psychiatry', 'Pulmonology',
    'Radiology', 'Surgery', 'Urology'
  ];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.apiService.getAllDoctors().subscribe(d => this.doctors = d);
  }

  openAddModal(): void {
    this.editMode = false;
    this.editId = null;
    this.modalError = '';
    this.form = { id: 0, name: '', email: '', password: '', specialization: '', experience: 0, phone: '', status: 'ACTIVE' };
    this.showModal = true;
  }

  openEditModal(doc: Doctor): void {
    this.editMode = true;
    this.editId = doc.id;
    this.modalError = '';
    this.form = { ...doc };
    this.showModal = true;
  }

  saveDoctor(): void {
    this.saving = true;
    this.modalError = '';

    if (this.editMode && this.editId) {
      this.apiService.updateDoctor(this.editId, this.form).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.loadDoctors();
        },
        error: (err) => {
          this.saving = false;
          this.modalError = err.error?.error || 'Failed to update doctor';
        }
      });
    } else {
      this.apiService.createDoctor(this.form).subscribe({
        next: () => {
          this.saving = false;
          this.showModal = false;
          this.loadDoctors();
        },
        error: (err) => {
          this.saving = false;
          this.modalError = err.error?.error || 'Failed to create doctor';
        }
      });
    }
  }

  deactivateDoctor(id: number): void {
    if (confirm('Deactivate this doctor? They will no longer be able to login.')) {
      this.apiService.deactivateDoctor(id).subscribe(() => this.loadDoctors());
    }
  }
}
