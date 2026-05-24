import { Routes } from '@angular/router';
import { authGuard, roleGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'auth/login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/forgot-password',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'patient',
    canActivate: [roleGuard],
    data: { roles: ['PATIENT'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/patient/dashboard/patient-dashboard.component').then(m => m.PatientDashboardComponent)
      },
      {
        path: 'book-appointment',
        loadComponent: () => import('./features/patient/book-appointment/book-appointment.component').then(m => m.BookAppointmentComponent)
      },
      {
        path: 'my-appointments',
        loadComponent: () => import('./features/patient/my-appointments/my-appointments.component').then(m => m.MyAppointmentsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/patient/profile/patient-profile.component').then(m => m.PatientProfileComponent)
      }
    ]
  },
  {
    path: 'doctor',
    canActivate: [roleGuard],
    data: { roles: ['DOCTOR'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/doctor/dashboard/doctor-dashboard.component').then(m => m.DoctorDashboardComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('./features/doctor/appointments/doctor-appointments.component').then(m => m.DoctorAppointmentsComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/doctor/profile/doctor-profile.component').then(m => m.DoctorProfileComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
