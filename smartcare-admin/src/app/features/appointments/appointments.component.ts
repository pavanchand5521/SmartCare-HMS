import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Appointment } from '../../core/services/api.service';

@Component({
  selector: 'app-manage-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page fade-in-up">
      <div class="page-header-dash">
        <div>
          <h1><i class="fas fa-calendar-alt"></i> Manage Appointments</h1>
          <p class="subtitle">View and manage all appointments</p>
        </div>
        <div class="filter-bar">
          <select class="form-control filter-select" [(ngModel)]="statusFilter" (change)="applyFilter()">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div class="card">
        <table class="data-table" *ngIf="filteredAppointments.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let apt of filteredAppointments">
              <td>#{{ apt.id }}</td>
              <td>{{ apt.patientName }}</td>
              <td>Dr. {{ apt.doctorName }}</td>
              <td>{{ apt.doctorSpecialization }}</td>
              <td>{{ apt.appointmentDate }}</td>
              <td>{{ apt.slot }}</td>
              <td>
                <span class="badge" [class]="'badge-' + apt.status.toLowerCase()">{{ apt.status }}</span>
              </td>
              <td class="action-cell">
                <button class="btn btn-sm btn-success"
                        *ngIf="apt.status === 'PENDING'"
                        (click)="updateStatus(apt.id, 'APPROVED')">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-primary"
                        *ngIf="apt.status === 'APPROVED'"
                        (click)="updateStatus(apt.id, 'COMPLETED')"
                        style="background:var(--accent)">
                  <i class="fas fa-check-double"></i>
                </button>
                <button class="btn btn-sm btn-danger"
                        *ngIf="apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED'"
                        (click)="updateStatus(apt.id, 'CANCELLED')">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty" *ngIf="filteredAppointments.length === 0">
          <p>No appointments found{{ statusFilter ? ' with status: ' + statusFilter : '' }}</p>
        </div>
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
    .filter-select { max-width: 200px; }
    .action-cell { display: flex; gap: 6px; }
    .empty { text-align: center; padding: 48px; color: var(--text-muted); }
  `]
})
export class ManageAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  statusFilter = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments(): void {
    this.apiService.getAllAppointments().subscribe(a => {
      this.appointments = a;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (this.statusFilter) {
      this.filteredAppointments = this.appointments.filter(a => a.status === this.statusFilter);
    } else {
      this.filteredAppointments = [...this.appointments];
    }
  }

  updateStatus(id: number, status: string): void {
    this.apiService.updateAppointmentStatus(id, status).subscribe(() => {
      this.appointments = this.appointments.map(a =>
        a.id === id ? { ...a, status } : a
      );
      this.applyFilter();
    });
  }
}
