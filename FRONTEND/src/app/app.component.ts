// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { NgxSpinnerService } from 'ngx-spinner';
// import { OllamaService } from '../services/UserServices/ollama.service';
// import { Router, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';
// import { Subscription } from 'rxjs';

// interface ChatMessage {
//   sender: 'user' | 'ai';
//   message: string;
// }

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   standalone: false,
//   styleUrl: './app.component.scss',
// })
// export class AppComponent implements OnInit {
//   title = 'frontend';
//   aiRequest?: Subscription;
//   chatHistory: ChatMessage[] = [];

//   issueDesc = '';
//   loading = false;

//   aiOpen = false;
//   showAiAssistant = false;

//   @ViewChild('chatBox') chatBox!: ElementRef;

//   constructor(
//     private spinner: NgxSpinnerService,
//     private ollamaService: OllamaService,
//     private router: Router,
//   ) {}

//   ngOnInit() {
//     // =========================
//     // SPINNER (UNCHANGED)
//     // =========================
//     this.spinner.show();

//     setTimeout(() => {
//       this.spinner.hide();
//     }, 2000);

//     // =========================
//     // LOAD SAVED CHAT
//     // =========================
//     const saved = localStorage.getItem('aiChatHistory');

//     if (saved) {
//       this.chatHistory = JSON.parse(saved);
//     }

//     // Initial AI Greeting
//     this.chatHistory.push({
//       sender: 'ai',
//       message: `Hello! I’m iGenie, your technical support assistant. 
// Your wish for IT help is my command.`,
//     });

//     this.scrollToBottom();

//     // =========================
//     // CONTROL WHERE AI APPEARS
//     // =========================
//     this.router.events
//       .pipe(filter((event) => event instanceof NavigationEnd))
//       .subscribe((event: any) => {
//         const allowedRoutes = [
//           '/main',
     
//           '/viewticket',
//           '/crtticket',
//           '/contact',
//           '/UserAsset',
//           '/feedback',
//         ];

//         this.showAiAssistant = allowedRoutes.some((route) =>
//           event.urlAfterRedirects.includes(route),
//         );
//       });
//   }

//   // =========================
//   // ANALYZE ISSUE
//   // =========================
//   analyzeIssue() {
//     if (!this.issueDesc.trim()) return;

//     const userMessage: ChatMessage = {
//       sender: 'user',
//       message: this.issueDesc,
//     };

//     this.chatHistory.push(userMessage);
//     this.saveHistory();

//     this.loading = true;

//     const tempIssue = this.issueDesc;
//     this.issueDesc = '';

//     const aiMessage: ChatMessage = {
//       sender: 'ai',
//       message: 'AI is analyzing your issue...',
//     };

//     this.chatHistory.push(aiMessage);
//     this.saveHistory();

//     // this.ollamaService.analyzeTicket(tempIssue).subscribe({
//     //   next: (res: any) => {
//     //     aiMessage.message = res.analysis;
//     //     this.loading = false;
//     //     this.saveHistory();
//     //     this.scrollToBottom();
//     //   },
//     //   error: (err) => {
//     //     console.error(err);
//     //     aiMessage.message = 'AI failed to analyze the issue. Please try again.';
//     //     this.loading = false;
//     //     this.saveHistory();
//     //   }
//     // });
//     this.aiRequest = this.ollamaService.analyzeTicket(tempIssue).subscribe({
//       next: (res: any) => {
//         aiMessage.message = res.analysis;
//         this.loading = false;
//         this.saveHistory();
//         this.scrollToBottom();
//       },
//       error: (err) => {
//         console.error(err);
//         aiMessage.message = 'AI failed to analyze the issue.';
//         this.loading = false;
//       },
//     });
//   }
//   stopAnalysis() {
//     if (this.aiRequest) {
//       this.aiRequest.unsubscribe();
//     }

//     this.loading = false;

//     // Find the last AI message that contains 'analyzing'
//     const lastAiMessage = this.chatHistory
//       .slice()
//       .reverse()
//       .find((msg) => msg.sender === 'ai' && msg.message.includes('analyzing'));

//     if (lastAiMessage) {
//       lastAiMessage.message = 'Analysis stopped.';
//     } else {
//       // fallback: push a new message
//       this.chatHistory.push({
//         sender: 'ai',
//         message: 'Analysis stopped.',
//       });
//     }

//     this.saveHistory();
//     this.scrollToBottom();
//   }
//   // =========================
//   // SAVE CHAT HISTORY
//   // =========================
//   saveHistory() {
//     localStorage.setItem('aiChatHistory', JSON.stringify(this.chatHistory));
//   }

//   // =========================
//   // TOGGLE AI PANEL
//   // =========================
//   toggleAiAssistant() {
//     this.aiOpen = !this.aiOpen;
//   }

//   // =========================
//   // AUTO SCROLL CHAT
//   // =========================
//   scrollToBottom() {
//     setTimeout(() => {
//       if (this.chatBox) {
//         this.chatBox.nativeElement.scrollTop =
//           this.chatBox.nativeElement.scrollHeight;
//       }
//     }, 100);
//   }
// }
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { OllamaService } from '../services/UserServices/ollama.service';
import { UserService } from '../services/UserServices/user.service'; // Injected UserService
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface ChatMessage {
  sender: 'user' | 'ai';
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  aiRequest?: Subscription;
  chatHistory: ChatMessage[] = [];

  issueDesc = '';
  loading = false;

  aiOpen = false;
  showAiAssistant = false;
  isStudent = false;

  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(
    private spinner: NgxSpinnerService,
    private ollamaService: OllamaService,
    private userService: UserService, // Injected
    private router: Router,
  ) {}

  ngOnInit() {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);

    const saved = localStorage.getItem('aiChatHistory');

    if (saved) {
      this.chatHistory = JSON.parse(saved);
    } else {
      this.chatHistory.push({
        sender: 'ai',
        message: `Hello! I’m iGenie, your technical support assistant. 
Your wish for IT help is my command.`,
      });
    }

    this.scrollToBottom();

    // CONTROL WHERE AI APPEARS
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Re-check user role on navigation in case login status changed
        const userRole = this.userService.getUserRole();
        this.isStudent = userRole?.toLowerCase() === 'student';

        const allowedRoutes = [
          '/main',
          '/viewticket',
          '/crtticket',
          '/contact',
          '/UserAsset',
          '/feedback',
        ];

        // Only show if the route matches AND the user is NOT a student
        const isAllowedRoute = allowedRoutes.some((route) =>
          event.urlAfterRedirects.includes(route),
        );

        this.showAiAssistant = isAllowedRoute && !this.isStudent;
      });
  }

  analyzeIssue() {
    if (!this.issueDesc.trim()) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      message: this.issueDesc,
    };

    this.chatHistory.push(userMessage);
    this.saveHistory();

    this.loading = true;

    const tempIssue = this.issueDesc;
    this.issueDesc = '';

    const aiMessage: ChatMessage = {
      sender: 'ai',
      message: 'AI is analyzing your issue...',
    };

    this.chatHistory.push(aiMessage);
    this.saveHistory();

    this.aiRequest = this.ollamaService.analyzeTicket(tempIssue).subscribe({
      next: (res: any) => {
        aiMessage.message = res.analysis;
        this.loading = false;
        this.saveHistory();
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        aiMessage.message = 'AI failed to analyze the issue.';
        this.loading = false;
      },
    });
  }

  stopAnalysis() {
    if (this.aiRequest) {
      this.aiRequest.unsubscribe();
    }

    this.loading = false;

    const lastAiMessage = this.chatHistory
      .slice()
      .reverse()
      .find((msg) => msg.sender === 'ai' && msg.message.includes('analyzing'));

    if (lastAiMessage) {
      lastAiMessage.message = 'Analysis stopped.';
    } else {
      this.chatHistory.push({
        sender: 'ai',
        message: 'Analysis stopped.',
      });
    }

    this.saveHistory();
    this.scrollToBottom();
  }

  saveHistory() {
    localStorage.setItem('aiChatHistory', JSON.stringify(this.chatHistory));
  }

  toggleAiAssistant() {
    this.aiOpen = !this.aiOpen;
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop =
          this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }
}