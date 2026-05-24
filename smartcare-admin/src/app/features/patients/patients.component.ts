import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Patient } from '../../core/services/api.service';

@Component({
  selector: 'app-manage-patients',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page fade-in-up">
      <div class="page-header-dash">
        <div>
          <h1><i class="fas fa-users"></i> Manage Patients</h1>
          <p class="subtitle">View all registered patients</p>
        </div>
        <div class="patient-count">
          <strong>{{ patients.length }}</strong> patients registered
        </div>
      </div>

      <div class="card">
        <table class="data-table" *ngIf="patients.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of patients">
              <td>#{{ p.id }}</td>
              <td><strong>{{ p.name }}</strong></td>
              <td>{{ p.age || '-' }}</td>
              <td>{{ p.gender || '-' }}</td>
              <td>{{ p.phone || '-' }}</td>
              <td>{{ p.address || '-' }}</td>
            </tr>
          </tbody>
        </table>
        <div class="empty" *ngIf="patients.length === 0">
          <i class="fas fa-users" style="font-size:2rem;color:var(--primary-200);margin-bottom:12px"></i>
          <p>No patients registered yet.</p>
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
    .patient-count {
      background: var(--primary-50); color: var(--primary);
      padding: 8px 16px; border-radius: var(--radius); font-size: 0.9rem;
    }
    .empty { text-align: center; padding: 48px; color: var(--text-muted); }
  `]
})
export class ManagePatientsComponent implements OnInit {
  patients: Patient[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllPatients().subscribe(p => this.patients = p);
  }
}
