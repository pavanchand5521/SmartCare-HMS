import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" [class.scrolled]="scrolled" [class.is-dark-bg]="isDarkBg">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <div class="logo-icon">
            <i class="fas fa-heartbeat"></i>
          </div>
          <span>Smart<strong>Care</strong></span>
        </a>

        <button class="mobile-toggle" (click)="menuOpen = !menuOpen">
          <i [class]="menuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
        </button>

        <div class="nav-links" [class.active]="menuOpen">
          <ng-container *ngIf="!authService.isLoggedIn()">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/auth/login" class="btn btn-nav-login">Sign In</a>
            <a routerLink="/auth/register" class="btn btn-nav-register">Register</a>
          </ng-container>

          <ng-container *ngIf="authService.isLoggedIn()">
            <a *ngIf="authService.getRole() === 'PATIENT'" routerLink="/patient/dashboard" routerLinkActive="active">Dashboard</a>
            <a *ngIf="authService.getRole() === 'PATIENT'" routerLink="/patient/book-appointment" routerLinkActive="active">Book Appointment</a>
            <a *ngIf="authService.getRole() === 'PATIENT'" routerLink="/patient/my-appointments" routerLinkActive="active">My Appointments</a>

            <a *ngIf="authService.getRole() === 'DOCTOR'" routerLink="/doctor/dashboard" routerLinkActive="active">Dashboard</a>
            <a *ngIf="authService.getRole() === 'DOCTOR'" routerLink="/doctor/appointments" routerLinkActive="active">Appointments</a>

            <div class="user-menu">
              <a *ngIf="authService.getRole() === 'PATIENT'" routerLink="/patient/profile" class="user-name" routerLinkActive="active-profile">
                <div class="user-avatar-sm">
                  <i class="fas fa-user"></i>
                </div>
                {{ authService.getCurrentUser()?.name }}
              </a>
              <a *ngIf="authService.getRole() === 'DOCTOR'" routerLink="/doctor/profile" class="user-name" routerLinkActive="active-profile">
                <div class="user-avatar-sm">
                  <i class="fas fa-user-md"></i>
                </div>
                {{ authService.getCurrentUser()?.name }}
              </a>
              <button class="btn-logout" (click)="authService.logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </ng-container>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: 14px 0;
      transition: var(--transition-slow);
      background: transparent;
    }

    .navbar.scrolled {
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 1px 24px rgba(10, 77, 162, 0.08);
      padding: 8px 0;
      border-bottom: 1px solid rgba(10, 77, 162, 0.06);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* ── Logo ── */
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-heading);
      font-size: 1.4rem;
      color: var(--text-primary);
      text-decoration: none;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 1rem;
    }

    .logo strong {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .navbar.is-dark-bg:not(.scrolled) .logo {
      color: #fff;
    }

    /* ── Nav Links ── */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
    }

    .nav-links a:not(.btn):not(.user-name) {
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.92rem;
      text-decoration: none;
      position: relative;
      padding: 4px 0;
    }

    .nav-links a:not(.btn):not(.user-name):hover,
    .nav-links a:not(.btn):not(.user-name).active {
      color: var(--primary);
    }

    .nav-links a:not(.btn):not(.user-name)::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2.5px;
      background: var(--gradient-primary);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .nav-links a:not(.btn):not(.user-name):hover::after,
    .nav-links a:not(.btn):not(.user-name).active::after {
      width: 100%;
    }

    .navbar.is-dark-bg:not(.scrolled) .nav-links a:not(.btn):not(.user-name) {
      color: rgba(255, 255, 255, 0.8);
    }

    .navbar.is-dark-bg:not(.scrolled) .nav-links a:not(.btn):not(.user-name):hover,
    .navbar.is-dark-bg:not(.scrolled) .nav-links a:not(.btn):not(.user-name).active {
      color: #fff;
    }

    /* ── Nav Buttons ── */
    .btn-nav-login {
      padding: 8px 22px;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--primary) !important;
      background: transparent;
      border: 1.5px solid var(--primary);
      border-radius: 8px;
      transition: var(--transition);
    }

    .btn-nav-login:hover {
      background: var(--primary);
      color: #fff !important;
      transform: translateY(-1px);
    }

    .btn-nav-register {
      padding: 8px 22px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #fff !important;
      background: var(--gradient-primary);
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(10, 77, 162, 0.2);
      transition: var(--transition);
    }

    .btn-nav-register:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 18px rgba(10, 77, 162, 0.3);
    }

    .navbar.is-dark-bg:not(.scrolled) .btn-nav-login {
      color: #fff !important;
      border-color: rgba(255, 255, 255, 0.5);
    }

    .navbar.is-dark-bg:not(.scrolled) .btn-nav-login:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #fff;
    }

    /* ── User Menu ── */
    .user-menu {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .user-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: var(--text-primary);
      text-decoration: none;
      cursor: pointer;
      font-size: 0.92rem;
    }

    .user-avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-50);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      border: 2px solid var(--primary-100);
    }

    .navbar.is-dark-bg:not(.scrolled) .user-name {
      color: #fff;
    }

    .navbar.is-dark-bg:not(.scrolled) .user-avatar-sm {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-logout {
      padding: 7px 16px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--error);
      background: var(--error-light);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-logout:hover {
      background: var(--error);
      color: #fff;
      transform: translateY(-1px);
    }

    /* ── Mobile ── */
    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      font-size: 1.4rem;
      color: var(--text-primary);
      cursor: pointer;
    }

    .navbar.is-dark-bg:not(.scrolled) .mobile-toggle {
      color: #fff;
    }

    @media (max-width: 768px) {
      .mobile-toggle { display: block; }

      .nav-links {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        background: #fff;
        padding: 20px;
        box-shadow: var(--shadow-lg);
        border-radius: 0 0 var(--radius-lg) var(--radius-lg);
        gap: 16px;
      }

      .nav-links.active { display: flex; }

      .user-menu {
        flex-direction: column;
        width: 100%;
        gap: 12px;
      }
    }
  `]
})
export class NavbarComponent {
  scrolled = false;
  menuOpen = false;
  isDarkBg = false;

  constructor(public authService: AuthService, private router: Router) {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.scrolled = window.scrollY > 50;
      });
    }

    const checkDarkBg = (url: string) => {
      return url === '/' || url.startsWith('/auth');
    };

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isDarkBg = checkDarkBg(event.urlAfterRedirects) || checkDarkBg(event.url);
    });

    this.isDarkBg = checkDarkBg(this.router.url);
  }
}
