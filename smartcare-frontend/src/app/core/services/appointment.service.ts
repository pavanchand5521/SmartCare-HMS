import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = `${environment.apiUrl}/api/appointments`;

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  getByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  getByDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  getAvailableSlots(doctorId: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/slots?doctorId=${doctorId}&date=${date}`);
  }

  bookAppointment(data: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, data);
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/status`, { status });
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addPrescription(id: number, diagnosis: string, prescription: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/prescription`, { diagnosis, prescription });
  }
}
