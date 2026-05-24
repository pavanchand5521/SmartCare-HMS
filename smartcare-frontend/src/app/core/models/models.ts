export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  enabled: boolean;
}

export interface AuthResponse {
  token: string;
  role: string;
  name: string;
  email: string;
  userId: number;
}

export interface Doctor {
  id: number;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  phone: string;
  status: string;
  profileImage?: string;
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  profileImage?: string;
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
  status: 'PENDING' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  diagnosis?: string;
  prescription?: string;
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

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
