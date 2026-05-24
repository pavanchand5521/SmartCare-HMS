import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { PatientService } from '../../../core/services/patient.service';
import { Doctor, Patient } from '../../../core/models/models';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-page">
      <div class="container">
        <div class="page-header fade-in-up">
          <h1><i class="fas fa-calendar-plus"></i> Book Appointment</h1>
        </div>

        <div class="booking-form card fade-in-up">
          <div class="success-message" *ngIf="success">
            <i class="fas fa-check-circle"></i> {{ success }}
          </div>
          <div class="error-message" *ngIf="error">
            <i class="fas fa-exclamation-circle"></i> {{ error }}
          </div>

          <div class="form-section">
            <h3><i class="fas fa-user-md"></i> Select Doctor</h3>
            <div class="doctor-grid">
              <div class="doctor-card" *ngFor="let doc of doctors"
                   [class.selected]="selectedDoctor?.id === doc.id"
                   (click)="selectDoctor(doc)">
                <div class="doctor-avatar">
                  <i class="fas fa-user-md"></i>
                </div>
                <div class="doctor-info">
                  <strong>Dr. {{ doc.name }}</strong>
                  <span class="spec">{{ doc.specialization }}</span>
                  <span class="exp">{{ doc.experience }} yrs exp</span>
                </div>
                <i class="fas fa-check-circle check-icon" *ngIf="selectedDoctor?.id === doc.id"></i>
              </div>
            </div>
          </div>

          <div class="form-section" *ngIf="selectedDoctor">
            <h3><i class="fas fa-calendar-day"></i> Select Date</h3>
            <input type="date" class="form-control date-input"
                   [(ngModel)]="selectedDate" (change)="loadSlots()"
                   [min]="minDate">
          </div>

          <div class="form-section" *ngIf="availableSlots.length > 0">
            <h3><i class="fas fa-clock"></i> Available Slots</h3>
            <div class="slots-grid">
              <button *ngFor="let slot of availableSlots"
                      class="slot-btn" [class.selected]="selectedSlot === slot"
                      (click)="selectedSlot = slot">
                {{ slot }}
              </button>
            </div>
          </div>

          <div class="form-section" *ngIf="selectedSlot">
            <h3><i class="fas fa-sticky-note"></i> Notes (Optional)</h3>
            <textarea class="form-control" [(ngModel)]="notes" rows="3"
                      placeholder="Describe your symptoms or reason for visit..."></textarea>
          </div>

          <button class="btn btn-primary btn-full" *ngIf="selectedSlot"
                  (click)="bookAppointment()" [disabled]="loading">
            <span *ngIf="!loading"><i class="fas fa-check"></i> Confirm Booking</span>
            <span *ngIf="loading"><i class="fas fa-spinner fa-spin"></i> Booking...</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-page {
      padding: 100px 0 40px;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .booking-form {
      max-width: 800px;
    }

    .form-section {
      margin-bottom: 32px;
    }

    .form-section h3 {
      font-size: 1.05rem;
      margin-bottom: 16px;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-section h3 i {
      color: var(--primary);
      font-size: 0.95rem;
    }

    .doctor-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 12px;
    }

    .doctor-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 2px solid var(--border);
      border-radius: var(--radius);
      cursor: pointer;
      transition: var(--transition);
      position: relative;
    }

    .doctor-card:hover {
      border-color: var(--primary-200);
      background: var(--primary-50);
    }

    .doctor-card.selected {
      border-color: var(--primary);
      background: var(--primary-50);
      box-shadow: 0 0 0 3px rgba(10, 77, 162, 0.1);
    }

    .doctor-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;
      font-size: 0.95rem;
    }

    .doctor-info strong {
      display: block;
      font-size: 0.92rem;
    }

    .doctor-info .spec {
      display: block;
      font-size: 0.78rem;
      color: var(--primary);
      font-weight: 500;
    }

    .doctor-info .exp {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .check-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      color: var(--primary);
      font-size: 1rem;
    }

    .date-input {
      max-width: 300px;
    }

    .slots-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .slot-btn {
      padding: 10px 22px;
      border: 2px solid var(--border);
      border-radius: 24px;
      background: #fff;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
      font-size: 0.88rem;
    }

    .slot-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }

    .slot-btn.selected {
      background: var(--gradient-primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(10, 77, 162, 0.2);
      transform: translateY(-1px);
    }

    .btn-full {
      width: 100%;
      padding: 16px;
      font-size: 1.02rem;
    }

    .success-message {
      background: var(--success-light);
      color: var(--success);
      padding: 12px 16px;
      border-radius: var(--radius);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(15, 155, 88, 0.15);
    }

    .error-message {
      background: var(--error-light);
      color: var(--error);
      padding: 12px 16px;
      border-radius: var(--radius);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid rgba(217, 48, 37, 0.15);
    }
  `]
})
export class BookAppointmentComponent implements OnInit {
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  selectedDate = '';
  availableSlots: string[] = [];
  selectedSlot = '';
  notes = '';
  loading = false;
  success = '';
  error = '';
  patient: Patient | null = null;

  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.doctorService.getActiveDoctors().subscribe(d => this.doctors = d);
    const user = this.authService.getCurrentUser();
    if (user) {
      this.patientService.getPatientByEmail(user.email).subscribe(p => this.patient = p);
    }
  }

  selectDoctor(doctor: Doctor): void {
    this.selectedDoctor = doctor;
    this.availableSlots = [];
    this.selectedSlot = '';
    if (this.selectedDate) this.loadSlots();
  }

  loadSlots(): void {
    if (this.selectedDoctor && this.selectedDate) {
      this.appointmentService.getAvailableSlots(this.selectedDoctor.id, this.selectedDate)
        .subscribe(slots => this.availableSlots = slots);
    }
  }

  bookAppointment(): void {
    if (!this.patient || !this.selectedDoctor || !this.selectedSlot) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.appointmentService.bookAppointment({
      patientId: this.patient.id,
      doctorId: this.selectedDoctor.id,
      appointmentDate: this.selectedDate,
      slot: this.selectedSlot,
      notes: this.notes
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Appointment booked successfully!';
        setTimeout(() => this.router.navigate(['/patient/my-appointments']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Failed to book appointment';
      }
    });
  }
}
