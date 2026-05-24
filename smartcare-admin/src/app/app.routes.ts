import { Routes } from '@angular/router';
import { adminGuard, noAdminAuthGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [noAdminAuthGuard],
    loadComponent: () => import('./features/login/login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'doctors',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/doctors/doctors.component').then(m => m.ManageDoctorsComponent)
  },
  {
    path: 'patients',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/patients/patients.component').then(m => m.ManagePatientsComponent)
  },
  {
    path: 'appointments',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/appointments/appointments.component').then(m => m.ManageAppointmentsComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
