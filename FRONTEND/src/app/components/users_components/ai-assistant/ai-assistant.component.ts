

import { Component, OnInit } from '@angular/core';
import { OllamaService } from '../../../../services/UserServices/ollama.service';

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: false,
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.scss'],
})
export class AiAssistantComponent implements OnInit {
  issueDesc = '';
  loading = false;

  // Store conversation
  chatHistory: ChatMessage[] = [];

  constructor(private ollamaService: OllamaService) {}

  ngOnInit() {
    // Load previous conversation from localStorage if exists
    const saved = localStorage.getItem('aiChatHistory');
    if (saved) {
      this.chatHistory = JSON.parse(saved);
    }
  }

  analyzeIssue() {
    if (!this.issueDesc.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      message: this.issueDesc,
    };
    this.chatHistory.push(userMessage); // save user message
    this.saveHistory();

    this.loading = true;

    const tempIssue = this.issueDesc;
    this.issueDesc = ''; // clear input

    // add temporary loading AI message
    const aiMessage: ChatMessage = {
      sender: 'ai',
      message: 'AI is analyzing your issue...',
    };
    this.chatHistory.push(aiMessage);
    this.saveHistory();

    this.ollamaService.analyzeTicket(tempIssue).subscribe({
      next: (res: any) => {
        aiMessage.message = res.analysis; // update AI message
        this.loading = false;
        this.saveHistory();
      },
      error: (err) => {
        console.error(err);
        aiMessage.message = 'AI failed to analyze the issue. Please try again.';
        this.loading = false;
        this.saveHistory();
      },
    });
  }

  // Save chat history to localStorage
  saveHistory() {
    localStorage.setItem('aiChatHistory', JSON.stringify(this.chatHistory));
  }
}
