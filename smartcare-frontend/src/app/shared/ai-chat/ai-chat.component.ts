import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService } from '../../core/services/ai-chat.service';
import { AiMessage } from '../../core/models/models';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Chat Button -->
    <button class="chat-toggle-btn" [class.active]="isOpen" (click)="toggleChat()" aria-label="Open AI Assistant">
      <i class="fas fa-robot" *ngIf="!isOpen"></i>
      <i class="fas fa-times" *ngIf="isOpen"></i>
    </button>

    <!-- Chat Modal -->
    <div class="chat-container fade-in-up" *ngIf="isOpen">
      <div class="chat-header">
        <div class="header-icon">
          <i class="fas fa-robot"></i>
        </div>
        <div class="header-info">
          <h3>SmartCare AI</h3>
          <p><span class="online-dot"></span> Online & ready to help</p>
        </div>
      </div>

      <div class="chat-messages" #scrollMe>
        <!-- Initial welcome message -->
        <div class="message assistant" *ngIf="messages.length === 0">
          <div class="msg-avatar"><i class="fas fa-robot"></i></div>
          <div class="msg-bubble">
            Hello! I am your SmartCare Assistant. How can I help you today with your appointments or health records?
          </div>
        </div>

        <div class="message" *ngFor="let msg of messages" [ngClass]="msg.role">
          <div class="msg-avatar" *ngIf="msg.role === 'assistant'"><i class="fas fa-robot"></i></div>
          <div class="msg-bubble">
            {{ msg.content }}
          </div>
          <div class="msg-avatar user-avatar" *ngIf="msg.role === 'user'"><i class="fas fa-user"></i></div>
        </div>

        <!-- Typing Indicator -->
        <div class="message assistant typing" *ngIf="isTyping">
          <div class="msg-avatar"><i class="fas fa-robot"></i></div>
          <div class="msg-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <div class="chat-input-area">
        <input 
          type="text" 
          placeholder="Type your question..." 
          [(ngModel)]="newMessage" 
          (keyup.enter)="sendMessage()"
          [disabled]="isTyping"
        />
        <button class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim() || isTyping">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* ── Chat Toggle Button ── */
    .chat-toggle-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      font-size: 1.5rem;
      border: none;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(10, 77, 162, 0.35);
      z-index: 9999;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse-glow 3s ease-in-out infinite;
    }
    .chat-toggle-btn:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 10px 30px rgba(10, 77, 162, 0.45);
      animation: none;
    }
    .chat-toggle-btn.active {
      transform: rotate(90deg);
      background: var(--error);
      box-shadow: 0 4px 15px rgba(217, 48, 37, 0.35);
      animation: none;
    }

    /* ── Chat Container ── */
    .chat-container {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 360px;
      height: 500px;
      max-height: calc(100vh - 120px);
      background: rgba(255, 255, 255, 0.97);
      backdrop-filter: blur(16px);
      border-radius: var(--radius-xl);
      box-shadow: 0 12px 48px rgba(10, 77, 162, 0.15);
      display: flex;
      flex-direction: column;
      z-index: 9998;
      overflow: hidden;
      border: 1px solid var(--border);
    }

    /* ── Header ── */
    .chat-header {
      padding: 18px 20px;
      background: var(--gradient-primary);
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-icon {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      backdrop-filter: blur(8px);
    }
    .header-info h3 { margin: 0; font-size: 1.05rem; font-weight: 600; font-family: var(--font-heading); }
    .header-info p { margin: 2px 0 0; font-size: 0.78rem; opacity: 0.85; display: flex; align-items: center; gap: 6px; }
    
    .online-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ADE80;
      display: inline-block;
    }

    /* ── Messages Area ── */
    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: var(--bg-primary);
    }

    /* ── Message Bubbles ── */
    .message {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      max-width: 85%;
    }
    .message.user { align-self: flex-end; flex-direction: row; }
    .message.assistant { align-self: flex-start; }
    
    .msg-avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      background: var(--primary-50);
      color: var(--primary);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem;
      flex-shrink: 0;
    }
    .msg-avatar.user-avatar {
      background: var(--bg-card); color: var(--text-secondary);
      border: 1px solid var(--border);
    }

    .msg-bubble {
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 0.88rem;
      line-height: 1.55;
      box-shadow: var(--shadow-sm);
    }

    .message.assistant .msg-bubble {
      background: #fff;
      color: var(--text-primary);
      border-bottom-left-radius: 4px;
    }
    
    .message.user .msg-bubble {
      background: var(--primary);
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    /* ── Typing Indicator ── */
    .typing .msg-bubble {
      display: flex;
      gap: 4px;
      padding: 14px 16px;
    }
    .dot {
      width: 6px; height: 6px;
      background: var(--text-muted);
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    /* ── Input Area ── */
    .chat-input-area {
      padding: 14px 16px;
      background: #fff;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 10px;
    }
    .chat-input-area input {
      flex: 1;
      padding: 11px 16px;
      border: 1.5px solid var(--border);
      border-radius: 24px;
      outline: none;
      font-size: 0.9rem;
      font-family: var(--font-body);
      transition: var(--transition);
      background: var(--bg-primary);
    }
    .chat-input-area input:focus {
      border-color: var(--primary);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(10, 77, 162, 0.1);
    }
    .send-btn {
      width: 42px; height: 42px;
      border-radius: 50%;
      background: var(--gradient-primary);
      color: white;
      border: none;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: var(--transition);
      box-shadow: 0 2px 8px rgba(10, 77, 162, 0.2);
    }
    .send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 4px 16px rgba(10, 77, 162, 0.3); }
    .send-btn:disabled { background: var(--border); color: var(--text-muted); cursor: not-allowed; box-shadow: none; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .fade-in-up { animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `]
})
export class AiChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  isOpen = false;
  messages: AiMessage[] = [];
  newMessage = '';
  isTyping = false;

  constructor(private aiService: AiChatService) {}

  ngOnInit(): void {
    // We could load history here if persisted
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage(): void {
    const text = this.newMessage.trim();
    if (!text || this.isTyping) return;

    // Add user message
    this.messages.push({
      role: 'user',
      content: text,
      timestamp: new Date()
    });

    this.newMessage = '';
    this.isTyping = true;
    
    this.scrollToBottom();

    // Call backend service
    const chatHistory = this.messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    this.aiService.sendMessage(chatHistory).subscribe({
      next: (res) => {
        this.isTyping = false;
        this.messages.push({
          role: 'assistant',
          content: res.reply,
          timestamp: new Date()
        });
        this.scrollToBottom();
      },
      error: (err) => {
        this.isTyping = false;
        this.messages.push({
          role: 'assistant',
          content: 'I apologize, but I am currently experiencing technical difficulties. Please try again later.',
          timestamp: new Date()
        });
        this.scrollToBottom();
      }
    });
  }
}
