import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AiChatComponent } from './shared/ai-chat/ai-chat.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, AiChatComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-ai-chat *ngIf="isPatient"></app-ai-chat>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'SmartCare HMS';
  isPatient = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isPatient = user?.role === 'PATIENT';
    });
  }
}
