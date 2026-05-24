import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { Appointment } from '../../../core/models/models';

@Component({
  selector: 'app-my-appointments',
  standalone: true,
  imports: [CommonModule],
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
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let apt of appointments">
                <td><strong>Dr. {{ apt.doctorName }}</strong></td>
                <td>{{ apt.doctorSpecialization }}</td>
                <td>{{ apt.appointmentDate }}</td>
                <td>{{ apt.slot }}</td>
                <td>
                  <span class="badge"
                        [class.badge-pending]="apt.status === 'PENDING'"
                        [class.badge-approved]="apt.status === 'APPROVED'"
                        [class.badge-completed]="apt.status === 'COMPLETED'"
                        [class.badge-cancelled]="apt.status === 'CANCELLED'">
                    {{ apt.status }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-danger"
                          *ngIf="apt.status === 'PENDING' || apt.status === 'APPROVED'"
                          (click)="cancelAppointment(apt.id)">
                    <i class="fas fa-times"></i> Cancel
                  </button>
                  <button class="btn btn-sm btn-secondary"
                          *ngIf="apt.status === 'COMPLETED' && (apt.prescription || apt.diagnosis)"
                          (click)="openPrescriptionModal(apt)">
                    <i class="fas fa-eye"></i> View Prescription
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state card fade-in-up" *ngIf="appointments.length === 0">
          <i class="fas fa-calendar-times"></i>
          <h3>No appointments found</h3>
          <p>You haven't booked any appointments yet.</p>
        </div>
      </div>
    </div>

    <!-- View Prescription Modal -->
    <div class="modal-overlay fade-in-up" *ngIf="selectedAppointment">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fas fa-file-medical"></i> Prescription Details</h2>
          <button class="close-btn" (click)="closePrescriptionModal()">&times;</button>
        </div>
        <div class="modal-body">
          <div class="modal-meta">
            <p><strong>Dr. {{ selectedAppointment.doctorName }}</strong> ({{ selectedAppointment.doctorSpecialization }})</p>
            <p><i class="fas fa-calendar"></i> {{ selectedAppointment.appointmentDate }}</p>
          </div>
          
          <div class="prescription-box">
            <h4><i class="fas fa-stethoscope"></i> Diagnosis</h4>
            <div class="p-text">{{ selectedAppointment.diagnosis || 'No diagnosis provided.' }}</div>
          </div>
          
          <div class="prescription-box mt-3">
            <h4><i class="fas fa-prescription"></i> Prescription & Advice</h4>
            <div class="p-text">{{ selectedAppointment.prescription || 'No prescription provided.' }}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" (click)="closePrescriptionModal()">Close</button>
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
    .empty-state { text-align: center; padding: 60px 20px; }
    .empty-state i { font-size: 3rem; color: var(--primary-200); margin-bottom: 16px; }
    .empty-state h3 { margin-bottom: 8px; }
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
    
    .prescription-box {
      background: var(--primary-50);
      padding: 18px;
      border-radius: var(--radius);
      border-left: 4px solid var(--primary);
    }
    .prescription-box h4 {
      margin-top: 0; margin-bottom: 10px; font-size: 1rem; color: var(--text-primary);
      display: flex; align-items: center; gap: 8px;
    }
    .prescription-box h4 i { color: var(--primary); font-size: 0.9rem; }
    .mt-3 { margin-top: 16px; }
    .p-text { white-space: pre-wrap; color: var(--text-secondary); line-height: 1.6; font-size: 0.92rem; }
    
    .modal-footer {
      display: flex; justify-content: flex-end; padding: 16px 24px;
      border-top: 1px solid var(--border);
    }
  `]
})
export class MyAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  selectedAppointment: Appointment | null = null;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.patientService.getPatientByEmail(user.email).subscribe({
        next: (p) => {
          this.appointmentService.getByPatient(p.id).subscribe(a => this.appointments = a);
        }
      });
    }
  }

  cancelAppointment(id: number): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(id).subscribe(() => {
        this.appointments = this.appointments.map(a =>
          a.id === id ? { ...a, status: 'CANCELLED' as const } : a
        );
      });
    }
  }

  openPrescriptionModal(apt: Appointment) {
    this.selectedAppointment = apt;
  }

  closePrescriptionModal() {
    this.selectedAppointment = null;
  }
}
