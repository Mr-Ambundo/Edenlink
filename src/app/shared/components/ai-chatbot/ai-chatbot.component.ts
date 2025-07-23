import { Component, OnInit } from '@angular/core';
import { AiService } from '../../../core/services/ai.service';

@Component({
  selector: 'app-ai-chatbot',
  templateUrl: './ai-chatbot.component.html',
  styleUrls: ['./ai-chatbot.component.css']
})
export class AiChatbotComponent implements OnInit {
  isChatOpen = false;
  messages: { text: string, fromUser: boolean, timestamp: Date }[] = [];
  newMessage = '';
  
  constructor(private aiService: AiService) { }

  ngOnInit(): void {
    // Initial welcome message
    this.messages.push({
      text: 'Hello! I\'m your Eden Link AI assistant. How can I help you today?',
      fromUser: false,
      timestamp: new Date()
    });
  }
  
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }
  
  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    
    // Add user message
    this.messages.push({
      text: this.newMessage,
      fromUser: true,
      timestamp: new Date()
    });
    
    // Store and clear message input
    const userQuery = this.newMessage;
    this.newMessage = '';
    
    // Get AI response
    this.aiService.getResponse(userQuery).subscribe(
      (response) => {
        this.messages.push({
          text: response,
          fromUser: false,
          timestamp: new Date()
        });
      },
      (error) => {
        console.error('Error getting AI response:', error);
        // Fallback response
        this.messages.push({
          text: 'I\'m having trouble connecting right now. Please try again later.',
          fromUser: false,
          timestamp: new Date()
        });
      }
    );
  }
}