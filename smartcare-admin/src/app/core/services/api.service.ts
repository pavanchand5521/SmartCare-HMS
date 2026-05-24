import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Doctor {
  id: number;
  name: string;
  email: string;
  password?: string;
  specialization: string;
  experience: number;
  phone: string;
  status: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDate: string;
  slot: string;
  status: string;
  notes: string;
}

export interface DashboardStats {
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private api = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Dashboard
  getAdminStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.api}/dashboard/admin`);
  }

  // Doctors
  getAllDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.api}/doctors`);
  }

  createDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.api}/doctors`, doctor);
  }

  updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.api}/doctors/${id}`, doctor);
  }

  deactivateDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.api}/doctors/${id}`);
  }

  // Patients
  getAllPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.api}/patients`);
  }

  // Appointments
  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.api}/appointments`);
  }

  updateAppointmentStatus(id: number, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.api}/appointments/${id}/status`, { status });
  }
}
