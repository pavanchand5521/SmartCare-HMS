import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { Appointment } from '../../../core/models/models';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="appointments-page">
      <div class="container">
        <div class="page-header fade-in-up">
          <h1>My Appointments</h1>
        </div>

        <div class="card fade-in-up" *ngIf="appointments.length > 0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Time</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let apt of appointments">
                <td><strong>{{ apt.patientName }}</strong></td>
                <td>{{ apt.appointmentDate }}</td>
                <td>{{ apt.slot }}</td>
                <td>{{ apt.notes || '-' }}</td>
                <td>
                  <span class="badge"
                        [class.badge-pending]="apt.status === 'PENDING'"
                        [class.badge-approved]="apt.status === 'APPROVED'"
                        [class.badge-completed]="apt.status === 'COMPLETED'"
                        [class.badge-cancelled]="apt.status === 'CANCELLED'">
                    {{ apt.status }}
                  </span>
                </td>
                <td class="action-btns">
                  <button class="btn btn-sm btn-success"
                          *ngIf="apt.status === 'PENDING'"
                          (click)="updateStatus(apt.id, 'APPROVED')">
                    <i class="fas fa-check"></i> Approve
                  </button>
                  <button class="btn btn-sm btn-primary"
                          *ngIf="apt.status === 'APPROVED'"
                          (click)="updateStatus(apt.id, 'COMPLETED')">
                    <i class="fas fa-check-double"></i> Complete
                  </button>
                  <button class="btn btn-sm btn-secondary"
                          *ngIf="apt.status === 'COMPLETED'"
                          (click)="openPrescriptionModal(apt)">
                    <i class="fas fa-file-medical"></i> Prescription
                  </button>
                  <button class="btn btn-sm btn-danger"
                          *ngIf="apt.status === 'PENDING' || apt.status === 'APPROVED'"
                          (click)="updateStatus(apt.id, 'CANCELLED')">
                    <i class="fas fa-times"></i> Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state card fade-in-up" *ngIf="appointments.length === 0">
          <i class="fas fa-calendar-check"></i>
          <h3>No appointments</h3>
          <p>You don't have any appointments yet.</p>
        </div>
      </div>
    </div>

    <!-- Prescription Modal -->
    <div class="modal-overlay fade-in-up" *ngIf="selectedAppointment">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-file-medical"></i> Add Prescription</h2>
          <button class="close-btn" (click)="closePrescriptionModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-meta">
            <p><strong>Patient:</strong> {{ selectedAppointment.patientName }}</p>
            <p><i class="fas fa-calendar"></i> {{ selectedAppointment.appointmentDate }} ({{ selectedAppointment.slot }})</p>
          </div>
          
          <div class="form-group">
            <label>Diagnosis</label>
            <textarea class="form-control" [(ngModel)]="prescriptionForm.diagnosis" rows="2" placeholder="Patient's diagnosis"></textarea>
          </div>
          <div class="form-group">
            <label>Prescription & Advice</label>
            <textarea class="form-control" [(ngModel)]="prescriptionForm.prescription" rows="4" placeholder="Medications and strict advice"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closePrescriptionModal()">Cancel</button>
          <button class="btn btn-primary" (click)="submitPrescription()" [disabled]="savingPrescription">
            <i class="fas fa-save" *ngIf="!savingPrescription"></i>
            <i class="fas fa-spinner fa-spin" *ngIf="savingPrescription"></i>
            Save Prescription
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .appointments-page {
      padding: 100px 0 40px;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    .action-btns {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .empty-state {
      text-align: center;
      padding: 60px 20px;
    }
    .empty-state i { font-size: 3rem; color: var(--primary-200); margin-bottom: 16px; }
    .empty-state p { color: var(--text-muted); }
    
    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(13, 27, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      z-index: 1050;
    }
    .modal-content {
      background: #fff; width: 100%; max-width: 600px;
      border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);
      padding: 0; overflow: hidden;
    }
    .modal-header {
      display: flex; justify-content: space-between; align-items: center;
      padding: 20px 24px;
      background: var(--primary-50);
      border-bottom: 1px solid var(--border);
    }
    .modal-header h2 {
      font-size: 1.3rem;
      display: flex; align-items: center; gap: 8px;
    }
    .modal-header h2 i { color: var(--primary); }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); }
    .close-btn:hover { color: var(--error); }
    
    .modal-body { padding: 24px; }
    .modal-meta { margin-bottom: 20px; }
    .modal-meta p { margin-bottom: 4px; color: var(--text-secondary); font-size: 0.92rem; }
    .modal-meta i { color: var(--primary); margin-right: 6px; font-size: 0.85rem; }
    
    .modal-footer {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--border);
    }
  `]
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;
  prescriptionForm = { diagnosis: '', prescription: '' };
  savingPrescription = false;

  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.doctorService.getDoctorByUserId(user.userId).subscribe({
        next: (d) => {
          this.appointmentService.getByDoctor(d.id).subscribe(a => this.appointments = a);
        }
      });
    }
  }

  updateStatus(id: number, status: string): void {
    this.appointmentService.updateStatus(id, status).subscribe({
      next: (updated) => {
        this.appointments = this.appointments.map(a =>
          a.id === id ? { ...a, status: status as any } : a
        );
      }
    });
  }

  openPrescriptionModal(apt: Appointment) {
    this.selectedAppointment = apt;
    this.prescriptionForm.diagnosis = apt.diagnosis || '';
    this.prescriptionForm.prescription = apt.prescription || '';
  }

  closePrescriptionModal() {
    this.selectedAppointment = null;
    this.prescriptionForm = { diagnosis: '', prescription: '' };
  }

  submitPrescription() {
    if (!this.selectedAppointment) return;
    this.savingPrescription = true;
    this.appointmentService.addPrescription(
      this.selectedAppointment.id,
      this.prescriptionForm.diagnosis,
      this.prescriptionForm.prescription
    ).subscribe({
      next: (updated) => {
        this.savingPrescription = false;
        this.appointments = this.appointments.map(a =>
          a.id === updated.id ? updated : a
        );
        this.closePrescriptionModal();
      },
      error: () => {
        this.savingPrescription = false;
      }
    });
  }
}
