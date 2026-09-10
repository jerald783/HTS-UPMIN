import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppInitService } from '../../../../services/app-init.service';
import { ChatService } from '../../../../services/UserServices/chat.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  ticketId!: number;
  ticketNumber: string = '';
  messages: any[] = [];
  newMessage: string = '';

  selectedFile: File | null = null;

  currentUserEmail: string = localStorage.getItem('Email') || '';

  private shouldAutoScroll = true;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private signalRService: ChatService,
    public appInit: AppInitService,
  ) {}

  ngOnInit(): void {
    this.ticketId = +this.route.snapshot.paramMap.get('ticketId')!;
    this.loadMessages();
    this.chatService.getTicketNumber(this.ticketId).subscribe({
      next: (res) => {
        console.log('Ticket Number:', res.TicketNumber);
        this.ticketNumber = res.TicketNumber;
      },
      error: (err) => {
        console.error('Error fetching ticket number:', err);
      },
    });

    // SignalR
    this.signalRService.startConnection();
    this.signalRService.ChatAdded$.subscribe((message) => {
      if (message) {
        this.loadMessages(true);
      }
    });
    //     this.chatService.markTicketNotificationsRead(this.ticketId, this.currentUserEmail).subscribe(() => {
    //   // Notify ItoHeadersComponent to remove these notifications
    //   this.chatService.NotificationCleared$.next(this.ticketId);
    // });
    this.chatService
      .markTicketNotificationsRead(this.ticketId, this.currentUserEmail)
      .subscribe(() => {
        // Notify ItoHeadersComponent to remove these notifications
        this.chatService.notifyCleared(this.ticketId); // call the service method
      });
  }

  ngAfterViewInit(): void {
    this.messagesContainer.nativeElement.addEventListener('scroll', () => {
      const el = this.messagesContainer.nativeElement;
      const threshold = 120;
      const atBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      this.shouldAutoScroll = atBottom;
    });
  }

  loadMessages(forceScroll: boolean = false): void {
    this.chatService.getMessages(this.ticketId).subscribe((data) => {
      this.messages = data;

      setTimeout(() => {
        if (forceScroll || this.shouldAutoScroll) {
          this.scrollToBottom();
        }
      }, 50);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }
  sendMessage(): void {
    const email = localStorage.getItem('Email');
    if (!email) return;

    const hasText = this.newMessage && this.newMessage.trim().length > 0;
    const hasFile = this.selectedFile !== null;

    if (!hasText && !hasFile) return;

    let tempMessage: any = null;

    // If file exists -> multipart/form-data
    if (hasFile) {
      // Create a temporary message to show immediately
      tempMessage = {
        MessageId: 0, // temporary
        TicketId: this.ticketId,
        SenderEmail: email,
        Message: hasText ? this.newMessage.trim() : '',
        Timestamp: new Date(),
        FileName: this.selectedFile?.name,
        FilePath: URL.createObjectURL(this.selectedFile!), // TEMPORARY preview
        FileType: this.selectedFile?.type,
        FileSize: this.selectedFile?.size,
        pending: true, // custom flag
      };

      this.messages.push(tempMessage);
      this.scrollToBottom();

      // Send to server
      const formData = new FormData();
      formData.append('ticketId', this.ticketId.toString());
      formData.append('senderEmail', email);
      formData.append('message', hasText ? this.newMessage.trim() : '');
      formData.append('file', this.selectedFile as File);

      this.chatService.sendMessageWithFile(formData).subscribe(
        (savedMessage) => {
          // Replace temp message with server message
          const index = this.messages.indexOf(tempMessage);
          if (index > -1) {
            this.messages[index] = savedMessage;
          }
          this.newMessage = '';
          this.selectedFile = null;
          this.scrollToBottom();
        },
        (err) => {
          console.error('File upload failed', err);
          // Optionally remove temp message or mark as failed
          tempMessage!.pending = false;
        },
      );

      return;
    }

    // Normal text message
    const payload = {
      ticketId: this.ticketId,
      senderEmail: email,
      message: this.newMessage.trim(),
    };

    this.chatService.sendMessage(payload).subscribe((savedMessage) => {
      this.messages.push(savedMessage);
      this.newMessage = '';
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    if (!this.messagesContainer) return;
    const el = this.messagesContainer.nativeElement;
    el.scrollTop = el.scrollHeight;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
  onEnter(event: any): void {
    if (event.ctrlKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}