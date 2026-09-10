import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import SignaturePad from 'signature_pad';
import { FeedbackService } from '../../../../services/UserServices/feedback.service';
import { TicketService } from '../../../../services/UserServices/ticket.service';
import { UserService } from '../../../../services/UserServices/user.service';

@Component({
  selector: 'app-user-feedbackform',
  standalone: false,
  templateUrl: './user-feedbackform.component.html',
  styleUrls: ['./user-feedbackform.component.scss'],
})
export class UserFeedbackformComponent implements OnInit, AfterViewInit {
  @ViewChild('signatureCanvas') signatureCanvas!: ElementRef<HTMLCanvasElement>;
  private signaturePad!: SignaturePad;

  // Track validation status globally on submit attempt
  isSubmitted = false;
  isStudent = false;
  // Ticket list
  TicketNumberList: any[] = [];

  // Signature
  signatureImage: string | null = null;
  signatureImagePath: string = '';

  // Form fields
  TicketNumber: string = '';
  companyName: string = '';
  unit: string = '';
  fullName: string = '';
  email: string = '';
  phone: string = '';
  supportAgent: string = '';

  ticketDate: string = '';
  OtherIssue: string = '';
  DateRequested: string = '';
  feedbackText: string = '';
  rating: number = 0;
  
  ratings = {
    responseTime: '',
    technicalKnowledge: '',
    professionalism: '',
    communication: '',
    resolution: '',
  };

  issueTypes: { [key: string]: boolean } = {
    hardware: false,
    software: false,
    network: false,
    account: false,
  };

  supportChannels: { [key: string]: boolean } = {
    phone: false,
    email: false,
    chat: false,
    onsite: false,
    remote: false,
  };

  constructor(
    private feedbackService: FeedbackService,
    private Ticket: TicketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadTicketNumberList();
    this.email = localStorage.getItem('Email') ?? '';
    this.fullName = localStorage.getItem('fullName') ?? '';
      // Determine user role
  const userRole = this.userService.getUserRole();
  this.isStudent = userRole?.toLowerCase() === 'student';
  }

  ngAfterViewInit(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.resizeCanvas();
    this.signaturePad = new SignaturePad(canvas);
  }

  resizeCanvas() {
    const canvas = this.signatureCanvas.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = 200 * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);
  }

  clearSignature() {
    this.signaturePad.clear();
    this.signatureImage = null;
    this.signatureImagePath = '';
  }

  saveSignature() {
    if (this.signaturePad.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }
    this.signatureImage = this.signaturePad.toDataURL();
    this.signatureImagePath = this.signatureImage;
  }

  /* ==========================================
     VALIDATION HELPER METHODS
     ========================================== */
  
  isIssueTypeValid(): boolean {
    return Object.values(this.issueTypes).some(val => val === true) || !!this.OtherIssue.trim();
  }

  isSupportChannelValid(): boolean {
    return Object.values(this.supportChannels).some(val => val === true);
  }

  isTableRatingValid(): boolean {
    return Object.values(this.ratings).every(val => val !== '');
  }

  isFormValid(): boolean {
    return (
      !!this.companyName.trim() &&
      !!this.TicketNumber &&
      this.isIssueTypeValid() &&
      this.isSupportChannelValid() &&
      this.rating > 0 &&
      this.isTableRatingValid() &&
      !!this.signatureImagePath
    );
  }

  /* ==========================================
     SUBMIT FEEDBACK
     ========================================== */
  submitFeedback() {
    this.isSubmitted = true;

    // Check validation and handle scrolling to elements elegantly
    if (!this.isFormValid()) {
      setTimeout(() => {
        // Looks for tailwind custom red border variants or invalid class triggers
        const firstErrorElement = document.querySelector('.border-red-500, .bg-red-50\\/10');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    const selectedIssues = (
      Object.keys(this.issueTypes) as (keyof typeof this.issueTypes)[]
    )
      .filter((key) => this.issueTypes[key])
      .concat(this.OtherIssue ? [this.OtherIssue] : [])
      .join(', ');

    const selectedChannels = (
      Object.keys(this.supportChannels) as (keyof typeof this.supportChannels)[]
    )
      .filter((key) => this.supportChannels[key])
      .join(',');

    const payload = {
      TicketNumber: this.TicketNumber,
      CompanyName: this.companyName,
      Unit: this.unit,
      FullName: this.fullName,
      Email: this.email,
      Phone: this.phone,
      SupportAgent: this.supportAgent,
      OtherIssue: this.OtherIssue,
      IssueType: selectedIssues,
      SupportChannel: selectedChannels,
      DateRequested:
        this.DateRequested || new Date().toISOString().split('T')[0],
      DateResolved: this.ticketDate || new Date().toISOString().split('T')[0],
      FeedbackText: this.feedbackText,
      Rating: this.rating,
      RatingsDetail: this.ratings,
      SignatureImagePath: this.signatureImagePath,
    };

    console.log('Submitting feedback:', payload);

    this.feedbackService.submitFeedback(payload).subscribe({
      next: () => {
        alert('✅ Feedback submitted successfully!');
        this.clearForm();
      },
      error: (err) => console.error('❌ Error submitting feedback:', err),
    });
  }

  clearForm() {
    this.isSubmitted = false; // Reset error styles
    this.TicketNumber = '';
    this.companyName = '';
    this.unit = '';
    this.phone = '';
    this.supportAgent = '';
    this.OtherIssue = '';
    this.ticketDate = '';
    this.feedbackText = '';
    this.rating = 0;
    this.ratings = {
      responseTime: '',
      technicalKnowledge: '',
      professionalism: '',
      communication: '',
      resolution: '',
    };
    this.issueTypes = {
      hardware: false,
      software: false,
      network: false,
      account: false,
    };
    this.supportChannels = {
      phone: false,
      email: false,
      chat: false,
      onsite: false,
      remote: false,
    };
    this.signatureImage = null;
    this.signatureImagePath = '';
    this.signaturePad.clear();
  }

  loadTicketNumberList() {
    const loggedInEmail = localStorage.getItem('Email');
    if (!loggedInEmail) return;

    this.Ticket.getTicketByUser(loggedInEmail).subscribe((tickets: any[]) => {
      const resolvedTickets = tickets
        .filter((t) => t.CurrentStatus?.toLowerCase() === 'resolved')
        .sort((a, b) => parseInt(b.TicketNumber) - parseInt(a.TicketNumber));

      this.feedbackService
        .getFeedbackByUser(loggedInEmail)
        .subscribe((feedbackTickets: any[]) => {
          const feedbackTicketNumbers = feedbackTickets.map(
            (f) => f.TicketNumber,
          );
          this.TicketNumberList = resolvedTickets.filter(
            (t) => !feedbackTicketNumbers.includes(t.TicketNumber),
          );

          if (this.TicketNumberList.length > 0) {
            this.TicketNumber = this.TicketNumberList[0].TicketNumber;
            this.onTicketChange(this.TicketNumber);
          }
        });
    });
  }

  onTicketChange(ticketNumber: string) {
    const selectedTicket = this.TicketNumberList.find(
      (t) => t.TicketNumber === ticketNumber
    );

    if (selectedTicket) {
      this.supportAgent = selectedTicket.AgentAssigned || '';
      this.companyName = selectedTicket.CompanyName || '';
      this.unit = selectedTicket.Location || '';
      this.phone = selectedTicket.Phone || '';
      this.DateRequested = selectedTicket.RequestDate
        ? new Date(selectedTicket.RequestDate).toISOString().split('T')[0]
        : '';
      this.ticketDate = selectedTicket.LastUpdated
        ? new Date(selectedTicket.LastUpdated).toISOString().split('T')[0]
        : '';
    }
  }
}