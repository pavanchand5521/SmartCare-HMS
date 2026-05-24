import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = `${environment.apiUrl}/api/patients`;

  constructor(private http: HttpClient) {}

  getPatientByEmail(email: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/email/${email}`);
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  getPatientByUserId(userId: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/user/${userId}`);
  }

  updatePatient(id: number, data: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/${id}`, data);
  }
}
