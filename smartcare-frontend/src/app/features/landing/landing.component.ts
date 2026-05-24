import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-shape shape-1"></div>
        <div class="hero-shape shape-2"></div>
        <div class="hero-shape shape-3"></div>
      </div>
      <div class="hero-content container">
        <div class="hero-text fade-in-up">
          <span class="hero-badge">🏥 Smart Healthcare Platform</span>
          <h1>Your Health, Our <span class="gradient-text">Priority</span></h1>
          <p>Experience seamless healthcare management with SmartCare. Book appointments, consult with top doctors, and manage your health records — all in one place.</p>
          <div class="hero-actions">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">
              <i class="fas fa-user-plus"></i> Get Started Free
            </a>
            <a routerLink="/auth/login" class="btn btn-glass btn-lg">
              <i class="fas fa-sign-in-alt"></i> Sign In
            </a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <span class="stat-number">500+</span>
              <span class="stat-text">Doctors</span>
            </div>
            <div class="hero-stat">
              <span class="stat-number">10K+</span>
              <span class="stat-text">Patients</span>
            </div>
            <div class="hero-stat">
              <span class="stat-number">98%</span>
              <span class="stat-text">Satisfaction</span>
            </div>
          </div>
        </div>
        <div class="hero-visual fade-in-up">
          <div class="hero-card-group">
            <div class="floating-card card-1">
              <i class="fas fa-calendar-check"></i>
              <span>Appointment Booked!</span>
            </div>
            <div class="floating-card card-2">
              <i class="fas fa-user-md"></i>
              <span>Dr. Available</span>
            </div>
            <div class="floating-card card-3">
              <i class="fas fa-shield-alt"></i>
              <span>100% Secure</span>
            </div>
            <div class="hero-illustration">
              <i class="fas fa-hospital-alt"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
      <div class="container">
        <div class="section-header fade-in-up">
          <span class="section-badge">Features</span>
          <h2>Everything You Need for Better Healthcare</h2>
          <p>Our comprehensive platform simplifies every aspect of hospital management</p>
        </div>
        <div class="features-grid">
          <div class="feature-card fade-in-up" *ngFor="let feature of features; let i = index"
               [style.animation-delay]="(i * 0.1) + 's'">
            <div class="feature-icon" [style.background]="feature.bgColor">
              <i [class]="feature.icon"></i>
            </div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-header fade-in-up">
          <span class="section-badge">How It Works</span>
          <h2>Get Started in 3 Simple Steps</h2>
        </div>
        <div class="steps-grid">
          <div class="step-card fade-in-up" *ngFor="let step of steps; let i = index">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-icon">
              <i [class]="step.icon"></i>
            </div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-bg-shapes">
        <div class="cta-shape cta-shape-1"></div>
        <div class="cta-shape cta-shape-2"></div>
      </div>
      <div class="container">
        <div class="cta-content fade-in-up">
          <h2>Ready to Simplify Your Healthcare?</h2>
          <p>Join thousands of patients and doctors who trust SmartCare for their healthcare needs.</p>
          <div class="cta-actions">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">
              <i class="fas fa-rocket"></i> Start Now — It's Free
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="logo">
              <div class="logo-icon-footer">
                <i class="fas fa-heartbeat"></i>
              </div>
              <span>Smart<strong>Care</strong></span>
            </a>
            <p>Modern hospital management for a healthier tomorrow.</p>
          </div>
          <div class="footer-links">
            <h4>Quick Links</h4>
            <a routerLink="/">Home</a>
            <a routerLink="/auth/login">Login</a>
            <a routerLink="/auth/register">Register</a>
          </div>
          <div class="footer-links">
            <h4>Services</h4>
            <a href="#">Appointments</a>
            <a href="#">Consultations</a>
            <a href="#">Health Records</a>
          </div>
          <div class="footer-links">
            <h4>Contact</h4>
            <a href="#"><i class="fas fa-envelope"></i> support&#64;smartcare.com</a>
            <a href="#"><i class="fas fa-phone"></i> +1 (555) 000-0000</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 SmartCare HMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* ═══════════════════════════════════════════
       Hero
       ═══════════════════════════════════════════ */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      background: var(--gradient-hero);
      padding-top: 80px;
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .hero-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.12;
    }

    .shape-1 {
      width: 600px;
      height: 600px;
      background: var(--primary-light);
      top: -150px;
      right: -150px;
      animation: float 8s ease-in-out infinite;
    }

    .shape-2 {
      width: 450px;
      height: 450px;
      background: var(--accent);
      bottom: -80px;
      left: -80px;
      animation: float 6s ease-in-out infinite reverse;
    }

    .shape-3 {
      width: 350px;
      height: 350px;
      background: #5BA8F0;
      top: 50%;
      left: 50%;
      animation: float 10s ease-in-out infinite;
    }

    .hero-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-block;
      padding: 8px 20px;
      background: rgba(10, 77, 162, 0.2);
      border: 1px solid rgba(46, 138, 230, 0.3);
      border-radius: 50px;
      color: var(--accent-light);
      font-size: 0.88rem;
      font-weight: 500;
      margin-bottom: 24px;
      letter-spacing: 0.02em;
    }

    .hero-text h1 {
      font-size: 3.5rem;
      color: #fff;
      margin-bottom: 20px;
      line-height: 1.1;
    }

    .gradient-text {
      background: linear-gradient(135deg, #5BA8F0 0%, #A1C5EF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-text p {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.65);
      margin-bottom: 36px;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 16px;
      margin-bottom: 52px;
    }

    .btn-lg {
      padding: 16px 36px;
      font-size: 1.02rem;
      border-radius: var(--radius);
    }

    .btn-glass {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(12px);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 16px 36px;
      border-radius: var(--radius);
      font-weight: 600;
      font-size: 1.02rem;
      cursor: pointer;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }

    .btn-glass:hover {
      background: rgba(255, 255, 255, 0.18);
      transform: translateY(-2px);
      color: #fff;
    }

    .hero-stats {
      display: flex;
      gap: 44px;
    }

    .hero-stat {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
    }

    .stat-text {
      font-size: 0.82rem;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    /* ── Hero Visual ── */
    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hero-card-group {
      position: relative;
      width: 400px;
      height: 400px;
    }

    .hero-illustration {
      width: 200px;
      height: 200px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 24px 64px rgba(10, 77, 162, 0.35);
    }

    .hero-illustration i {
      font-size: 4rem;
      color: #fff;
    }

    .floating-card {
      position: absolute;
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: var(--radius);
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #fff;
      font-weight: 500;
      font-size: 0.88rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      white-space: nowrap;
    }

    .floating-card i {
      font-size: 1.2rem;
      color: var(--accent-light);
    }

    .card-1 { top: 20px; left: 0; animation: float 4s ease-in-out infinite; }
    .card-2 { top: 50%; right: -20px; animation: float 5s ease-in-out infinite 1s; }
    .card-3 { bottom: 40px; left: 20px; animation: float 6s ease-in-out infinite 0.5s; }

    /* ═══════════════════════════════════════════
       Features
       ═══════════════════════════════════════════ */
    .features {
      padding: 100px 0;
      background: var(--bg-primary);
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-badge {
      display: inline-block;
      padding: 6px 18px;
      background: var(--primary-50);
      color: var(--primary);
      border-radius: 50px;
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .section-header h2 {
      font-size: 2.4rem;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .section-header p {
      color: var(--text-secondary);
      font-size: 1.05rem;
      max-width: 560px;
      margin: 0 auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .feature-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 32px;
      border: 1px solid var(--border);
      transition: var(--transition);
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 0;
      background: var(--gradient-primary);
      transition: width 0.3s ease;
      border-radius: var(--radius-lg) 0 0 var(--radius-lg);
    }

    .feature-card:hover::before {
      width: 4px;
    }

    .feature-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-xl);
      border-color: var(--primary-200);
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin-bottom: 20px;
      color: #fff;
    }

    .feature-card h3 {
      font-size: 1.15rem;
      margin-bottom: 10px;
      color: var(--text-primary);
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.92rem;
      line-height: 1.6;
    }

    /* ═══════════════════════════════════════════
       How It Works
       ═══════════════════════════════════════════ */
    .how-it-works {
      padding: 100px 0;
      background: var(--bg-secondary);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .step-card {
      text-align: center;
      padding: 40px 24px;
      position: relative;
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      transition: var(--transition);
    }

    .step-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .step-number {
      position: absolute;
      top: 16px;
      right: 24px;
      font-family: var(--font-heading);
      font-size: 3rem;
      font-weight: 800;
      color: var(--primary-100);
    }

    .step-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      font-size: 1.6rem;
      color: #fff;
      box-shadow: 0 10px 30px rgba(10, 77, 162, 0.25);
    }

    .step-card h3 {
      font-size: 1.15rem;
      margin-bottom: 10px;
    }

    .step-card p {
      color: var(--text-secondary);
      font-size: 0.92rem;
    }

    /* ═══════════════════════════════════════════
       CTA
       ═══════════════════════════════════════════ */
    .cta {
      padding: 100px 0;
      background: var(--gradient-hero);
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .cta-bg-shapes {
      position: absolute;
      inset: 0;
    }

    .cta-shape {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.1;
    }

    .cta-shape-1 {
      width: 400px;
      height: 400px;
      background: var(--accent);
      top: -100px;
      left: -100px;
    }

    .cta-shape-2 {
      width: 300px;
      height: 300px;
      background: var(--primary-light);
      bottom: -80px;
      right: -80px;
    }

    .cta-content {
      position: relative;
      z-index: 1;
    }

    .cta-content h2 {
      font-size: 2.4rem;
      color: #fff;
      margin-bottom: 16px;
    }

    .cta-content p {
      color: rgba(255, 255, 255, 0.65);
      font-size: 1.1rem;
      margin-bottom: 36px;
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }

    .cta-actions {
      display: flex;
      justify-content: center;
    }

    /* ═══════════════════════════════════════════
       Footer
       ═══════════════════════════════════════════ */
    .footer {
      background: #091420;
      padding: 64px 0 24px;
      color: rgba(255, 255, 255, 0.6);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-brand .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: var(--font-heading);
      font-size: 1.3rem;
      color: #fff;
      text-decoration: none;
      margin-bottom: 14px;
    }

    .logo-icon-footer {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 0.9rem;
    }

    .footer-brand .logo strong {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .footer-brand p {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.92rem;
    }

    .footer-links h4 {
      color: #fff;
      margin-bottom: 16px;
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .footer-links a {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.45);
      font-size: 0.88rem;
      margin-bottom: 10px;
      text-decoration: none;
      transition: var(--transition);
    }

    .footer-links a:hover {
      color: var(--accent-light);
      transform: translateX(4px);
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 24px;
      text-align: center;
      color: rgba(255, 255, 255, 0.25);
      font-size: 0.82rem;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .hero-content {
        grid-template-columns: 1fr;
        text-align: center;
      }
      .hero-text h1 { font-size: 2.2rem; }
      .hero-actions { justify-content: center; flex-wrap: wrap; }
      .hero-stats { justify-content: center; }
      .hero-visual { display: none; }
      .steps-grid { grid-template-columns: 1fr; }
      .footer-grid { grid-template-columns: 1fr 1fr; }
      .section-header h2 { font-size: 1.8rem; }
    }
  `]
})
export class LandingComponent {
  features = [
    {
      icon: 'fas fa-calendar-alt',
      title: 'Easy Appointments',
      description: 'Book appointments with your preferred doctors in just a few clicks. Choose your time slot and get instant confirmation.',
      bgColor: 'linear-gradient(135deg, #0A4DA2, #2E8AE6)'
    },
    {
      icon: 'fas fa-user-md',
      title: 'Expert Doctors',
      description: 'Access our network of experienced and qualified doctors across multiple specializations.',
      bgColor: 'linear-gradient(135deg, #2E8AE6, #5BA8F0)'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with industry-standard security measures.',
      bgColor: 'linear-gradient(135deg, #0F9B58, #0B7A42)'
    },
    {
      icon: 'fas fa-clock',
      title: '24/7 Access',
      description: 'Access your health records, appointments, and prescriptions anytime, anywhere.',
      bgColor: 'linear-gradient(135deg, #E8A317, #C0880E)'
    },
    {
      icon: 'fas fa-file-medical',
      title: 'Digital Records',
      description: 'All your medical history, prescriptions, and reports stored digitally for easy access.',
      bgColor: 'linear-gradient(135deg, #D93025, #B71C1C)'
    },
    {
      icon: 'fas fa-headset',
      title: 'AI Support',
      description: 'Our AI-powered assistant is always ready to help you with any queries or concerns.',
      bgColor: 'linear-gradient(135deg, #0A4DA2, #5BA8F0)'
    }
  ];

  steps = [
    {
      icon: 'fas fa-user-plus',
      title: 'Create Account',
      description: 'Sign up in seconds with your basic information'
    },
    {
      icon: 'fas fa-search',
      title: 'Find Your Doctor',
      description: 'Browse doctors by specialization and availability'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Book & Visit',
      description: 'Select a time slot and confirm your appointment'
    }
  ];
}
