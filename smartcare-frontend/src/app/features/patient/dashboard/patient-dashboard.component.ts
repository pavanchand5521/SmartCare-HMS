import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PatientService } from '../../../core/services/patient.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DashboardStats, Patient, Appointment } from '../../../core/models/models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="welcome-banner fade-in-up">
          <div class="welcome-text">
            <h1>Welcome, {{ patient?.name || 'Patient' }}! 👋</h1>
            <p class="subtitle">Here's your health overview for today</p>
          </div>
          <a routerLink="/patient/book-appointment" class="btn btn-primary">
            <i class="fas fa-plus"></i> Book Appointment
          </a>
        </div>

        <div class="stats-grid fade-in-up">
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(10,77,162,0.08); color: var(--primary);">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="stat-value">{{ stats?.totalAppointments || 0 }}</div>
            <div class="stat-label">Total Appointments</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(232,163,23,0.08); color: var(--warning);">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-value">{{ stats?.pendingAppointments || 0 }}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(15,155,88,0.08); color: var(--success);">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-value">{{ stats?.completedAppointments || 0 }}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>

        <div class="section fade-in-up">
          <div class="section-title">
            <h2>Upcoming Appointments</h2>
            <a routerLink="/patient/my-appointments" class="view-all">View All <i class="fas fa-arrow-right"></i></a>
          </div>
          <div class="appointments-list" *ngIf="appointments.length > 0">
            <div class="appointment-card" *ngFor="let apt of appointments.slice(0, 5)">
              <div class="apt-info">
                <div class="apt-doctor">
                  <div class="apt-avatar">
                    <i class="fas fa-user-md"></i>
                  </div>
                  <div>
                    <strong>Dr. {{ apt.doctorName }}</strong>
                    <span>{{ apt.doctorSpecialization }}</span>
                  </div>
                </div>
                <div class="apt-time">
                  <i class="fas fa-calendar"></i> {{ apt.appointmentDate }}
                  <i class="fas fa-clock" style="margin-left:12px"></i> {{ apt.slot }}
                </div>
              </div>
              <span class="badge"
                    [class.badge-pending]="apt.status === 'PENDING'"
                    [class.badge-approved]="apt.status === 'APPROVED'"
                    [class.badge-completed]="apt.status === 'COMPLETED'"
                    [class.badge-cancelled]="apt.status === 'CANCELLED'">
                {{ apt.status }}
              </span>
            </div>
          </div>
          <div class="empty-state" *ngIf="appointments.length === 0">
            <i class="fas fa-calendar-plus"></i>
            <h3>No appointments yet</h3>
            <p>Book your first appointment to get started</p>
            <a routerLink="/patient/book-appointment" class="btn btn-primary">Book Now</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 100px 0 40px;
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .welcome-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding: 28px 32px;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }

    .welcome-banner::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--gradient-primary);
    }

    .welcome-banner h1 {
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

    .section {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 28px;
      border: 1px solid var(--border);
      box-shadow: var(--shadow-sm);
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-title h2 {
      font-size: 1.2rem;
    }

    .view-all {
      color: var(--primary);
      font-weight: 600;
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .appointments-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .appointment-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-radius: var(--radius);
      border: 1px solid var(--border);
      transition: var(--transition);
    }

    .appointment-card:hover {
      border-color: var(--primary-200);
      background: var(--primary-50);
      transform: translateX(4px);
    }

    .apt-info {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .apt-doctor {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .apt-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1rem;
    }

    .apt-doctor strong {
      display: block;
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    .apt-doctor span {
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .apt-time {
      color: var(--text-secondary);
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .apt-time i {
      color: var(--primary);
      font-size: 0.82rem;
    }

    .empty-state {
      text-align: center;
      padding: 48px 0;
      color: var(--text-muted);
    }

    .empty-state i {
      font-size: 3rem;
      margin-bottom: 16px;
      color: var(--primary-200);
    }

    .empty-state h3 {
      margin-bottom: 8px;
      color: var(--text-primary);
    }

    .empty-state p {
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .apt-info { flex-direction: column; gap: 8px; align-items: flex-start; }
      .appointment-card { flex-direction: column; gap: 12px; align-items: flex-start; }
      .welcome-banner { flex-direction: column; gap: 16px; align-items: flex-start; }
    }
  `]
})
export class PatientDashboardComponent implements OnInit {
  patient: Patient | null = null;
  stats: DashboardStats | null = null;
  appointments: Appointment[] = [];

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private dashboardService: DashboardService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.patientService.getPatientByEmail(user.email).subscribe({
        next: (p) => {
          this.patient = p;
          this.dashboardService.getPatientStats(p.id).subscribe(s => this.stats = s);
          this.appointmentService.getByPatient(p.id).subscribe(a => this.appointments = a);
        }
      });
    }
  }
}
