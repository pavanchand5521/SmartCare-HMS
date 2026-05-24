import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="admin-layout" *ngIf="authService.isLoggedIn(); else loginView">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <i class="fas fa-heartbeat"></i>
          <span>Smart<strong>Care</strong></span>
          <small>Admin Portal</small>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <i class="fas fa-th-large"></i>
            <span>Dashboard</span>
          </a>
          <a routerLink="/doctors" routerLinkActive="active" class="nav-item">
            <i class="fas fa-user-md"></i>
            <span>Doctors</span>
          </a>
          <a routerLink="/patients" routerLinkActive="active" class="nav-item">
            <i class="fas fa-users"></i>
            <span>Patients</span>
          </a>
          <a routerLink="/appointments" routerLinkActive="active" class="nav-item">
            <i class="fas fa-calendar-alt"></i>
            <span>Appointments</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-info">
            <i class="fas fa-user-shield"></i>
            <div>
              <strong>{{ authService.getCurrentUser()?.name }}</strong>
              <small>Administrator</small>
            </div>
          </div>
          <button class="logout-btn" (click)="authService.logout()">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <ng-template #loginView>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: 260px;
      background: var(--bg-sidebar);
      color: #fff;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
    }

    .sidebar-brand {
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .sidebar-brand i {
      font-size: 2rem;
      color: var(--primary-light);
      margin-bottom: 8px;
    }

    .sidebar-brand span {
      font-family: var(--font-heading);
      font-size: 1.3rem;
    }

    .sidebar-brand strong {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .sidebar-brand small {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius);
      color: rgba(255,255,255,0.6);
      text-decoration: none;
      transition: var(--transition);
      font-weight: 500;
      font-size: 0.95rem;
    }

    .nav-item:hover {
      background: rgba(255,255,255,0.08);
      color: #fff;
    }

    .nav-item.active {
      background: var(--gradient-primary);
      color: #fff;
      box-shadow: 0 4px 12px rgba(99,102,241,0.3);
    }

    .nav-item i {
      font-size: 1.1rem;
      width: 22px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .user-info i {
      font-size: 1.4rem;
      color: var(--primary-light);
    }

    .user-info strong {
      display: block;
      font-size: 0.9rem;
    }

    .user-info small {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .logout-btn {
      background: rgba(239,68,68,0.15);
      border: none;
      color: #ef4444;
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition);
    }

    .logout-btn:hover {
      background: rgba(239,68,68,0.3);
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
      padding: 32px;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
