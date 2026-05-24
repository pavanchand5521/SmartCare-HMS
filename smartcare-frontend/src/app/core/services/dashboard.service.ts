import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardStats } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  constructor(private http: HttpClient) {}

  getAdminStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/admin`);
  }

  getDoctorStats(doctorId: number): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getPatientStats(patientId: number): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/patient/${patientId}`);
  }
}
