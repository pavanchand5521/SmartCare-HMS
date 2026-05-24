import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AppointmentService } from '../../../core/services/appointment.service';
import { DashboardStats, Doctor, Appointment } from '../../../core/models/models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <div class="welcome-banner fade-in-up">
          <div class="welcome-text">
            <h1>Welcome, Dr. {{ doctor?.name || 'Doctor' }}! 👋</h1>
            <p class="subtitle">{{ doctor?.specialization }}</p>
          </div>
          <a routerLink="/doctor/appointments" class="btn btn-primary">
            <i class="fas fa-list"></i> View All Appointments
          </a>
        </div>

        <div class="stats-grid fade-in-up">
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(10,77,162,0.08); color: var(--primary);">
              <i class="fas fa-calendar-day"></i>
            </div>
            <div class="stat-value">{{ stats?.todayAppointments || 0 }}</div>
            <div class="stat-label">Today's Appointments</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(232,163,23,0.08); color: var(--warning);">
              <i class="fas fa-hourglass-half"></i>
            </div>
            <div class="stat-value">{{ stats?.pendingAppointments || 0 }}</div>
            <div class="stat-label">Pending Approval</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(15,155,88,0.08); color: var(--success);">
              <i class="fas fa-check-double"></i>
            </div>
            <div class="stat-value">{{ stats?.completedAppointments || 0 }}</div>
            <div class="stat-label">Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(46,138,230,0.08); color: var(--accent);">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="stat-value">{{ stats?.totalAppointments || 0 }}</div>
            <div class="stat-label">Total Appointments</div>
          </div>
        </div>

        <div class="section fade-in-up">
          <div class="section-title">
            <h2>Recent Appointments</h2>
            <a routerLink="/doctor/appointments" class="view-all">View All <i class="fas fa-arrow-right"></i></a>
          </div>
          <div class="appointments-list" *ngIf="appointments.length > 0">
            <div class="appointment-card" *ngFor="let apt of appointments.slice(0, 5)">
              <div class="apt-info">
                <div class="apt-patient">
                  <div class="apt-avatar">
                    <i class="fas fa-user"></i>
                  </div>
                  <div>
                    <strong>{{ apt.patientName }}</strong>
                    <span>{{ apt.appointmentDate }} at {{ apt.slot }}</span>
                  </div>
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
            <i class="fas fa-calendar-check"></i>
            <h3>No appointments yet</h3>
            <p>Your schedule is currently empty</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page { padding: 100px 0 40px; min-height: 100vh; background: var(--bg-primary); }

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
      top: 0; left: 0; right: 0;
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

    .subtitle { color: var(--text-muted); margin-top: 4px; font-size: 0.92rem; }

    .section {
      background: var(--bg-card); border-radius: var(--radius-lg);
      padding: 28px; border: 1px solid var(--border); box-shadow: var(--shadow-sm);
    }
    .section-title {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
    }
    .section-title h2 { font-size: 1.2rem; }
    .view-all {
      color: var(--primary); font-weight: 600; font-size: 0.88rem;
      display: flex; align-items: center; gap: 6px;
    }
    .appointments-list { display: flex; flex-direction: column; gap: 10px; }
    .appointment-card {
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 20px; border-radius: var(--radius);
      border: 1px solid var(--border); transition: var(--transition);
    }
    .appointment-card:hover {
      border-color: var(--primary-200);
      background: var(--primary-50);
      transform: translateX(4px);
    }
    .apt-patient { display: flex; align-items: center; gap: 12px; }

    .apt-avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--gradient-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1rem;
    }

    .apt-patient strong { display: block; font-size: 0.95rem; }
    .apt-patient span { font-size: 0.82rem; color: var(--text-muted); }
    .empty-state {
      text-align: center; padding: 48px 0; color: var(--text-muted);
    }
    .empty-state i { font-size: 3rem; margin-bottom: 16px; color: var(--primary-200); }

    @media (max-width: 768px) {
      .welcome-banner { flex-direction: column; gap: 16px; align-items: flex-start; }
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  doctor: Doctor | null = null;
  stats: DashboardStats | null = null;
  appointments: Appointment[] = [];

  constructor(
    private authService: AuthService,
    private doctorService: DoctorService,
    private dashboardService: DashboardService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.doctorService.getDoctorByUserId(user.userId).subscribe({
        next: (d) => {
          this.doctor = d;
          this.dashboardService.getDoctorStats(d.id).subscribe(s => this.stats = s);
          this.appointmentService.getByDoctor(d.id).subscribe(a => this.appointments = a);
        }
      });
    }
  }
}
