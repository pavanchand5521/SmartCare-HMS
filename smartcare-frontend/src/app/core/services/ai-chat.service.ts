import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatRequest {
  messages: Array<{ role: string, content: string }>;
}

export interface ChatResponse {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private apiUrl = `${environment.apiUrl}/api/ai`;

  constructor(private http: HttpClient) { }

  sendMessage(messages: Array<{ role: string, content: string }>): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiUrl}/chat`, { messages });
  }
}
