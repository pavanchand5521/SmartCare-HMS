import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService, DashboardStats, Appointment } from '../../core/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard fade-in-up">
      <div class="page-header-dash">
        <div>
          <h1>Dashboard</h1>
          <p class="subtitle">Hospital management overview</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(99,102,241,0.1); color: var(--primary);">
            <i class="fas fa-user-md"></i>
          </div>
          <div class="stat-value">{{ stats?.totalDoctors || 0 }}</div>
          <div class="stat-label">Total Doctors</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(14,165,233,0.1); color: var(--accent);">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-value">{{ stats?.totalPatients || 0 }}</div>
          <div class="stat-label">Total Patients</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(245,158,11,0.1); color: var(--warning);">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <div class="stat-value">{{ stats?.totalAppointments || 0 }}</div>
          <div class="stat-label">Total Appointments</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(239,68,68,0.1); color: var(--error);">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-value">{{ stats?.pendingAppointments || 0 }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(16,185,129,0.1); color: var(--success);">
            <i class="fas fa-calendar-day"></i>
          </div>
          <div class="stat-value">{{ stats?.todayAppointments || 0 }}</div>
          <div class="stat-label">Today</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: rgba(16,185,129,0.1); color: var(--success);">
            <i class="fas fa-check-double"></i>
          </div>
          <div class="stat-value">{{ stats?.completedAppointments || 0 }}</div>
          <div class="stat-label">Completed</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2><i class="fas fa-history"></i> Recent Appointments</h2>
          <a routerLink="/appointments" class="view-all">View All <i class="fas fa-arrow-right"></i></a>
        </div>
        <table class="data-table" *ngIf="recentAppointments.length > 0">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let apt of recentAppointments">
              <td>{{ apt.patientName }}</td>
              <td>Dr. {{ apt.doctorName }}</td>
              <td>{{ apt.appointmentDate }}</td>
              <td>{{ apt.slot }}</td>
              <td>
                <span class="badge" [class]="'badge-' + apt.status.toLowerCase()">{{ apt.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty" *ngIf="recentAppointments.length === 0">
          <p>No appointments yet</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header-dash {
      margin-bottom: 28px;
    }
    .page-header-dash h1 {
      font-size: 1.8rem;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .subtitle { color: var(--text-muted); margin-top: 2px; }
    .card-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;
    }
    .card-header h2 { font-size: 1.2rem; display: flex; align-items: center; gap: 8px; }
    .card-header h2 i { color: var(--primary); }
    .view-all {
      color: var(--primary); font-weight: 600; font-size: 0.85rem;
      display: flex; align-items: center; gap: 4px;
    }
    .empty { text-align: center; padding: 40px; color: var(--text-muted); }
  `]
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentAppointments: Appointment[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAdminStats().subscribe(s => this.stats = s);
    this.apiService.getAllAppointments().subscribe(a => this.recentAppointments = a.slice(0, 10));
  }
}
