import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../../../../services/UserServices/feedback.service';

@Component({
  selector: 'app-user-feedback-list',
  standalone: false,
  templateUrl: './user-feedback-list.component.html',
  styleUrl: './user-feedback-list.component.scss'
})
export class UserFeedbackListComponent implements OnInit {
  feedbackList: any[] = [];
  filteredList: any[] = [];
  selectedFeedback: any = null; // Holds item for viewing modal/detail
  searchTerm: string = '';

  constructor(private feedbackService: FeedbackService) {}

  ngOnInit(): void {
    this.loadFeedback();
  }

  loadFeedback(): void {
    this.feedbackService.getAllFeedback().subscribe({
      next: (data) => {
        this.feedbackList = data;
        this.filteredList = data;
      },
      error: (err) => console.error('Error fetching feedback list:', err),
    });
  }

  filterFeedback(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.feedbackList.filter(
      (item) =>
        item.TicketNumber?.toLowerCase().includes(term) ||
        item.FullName?.toLowerCase().includes(term) ||
        item.CompanyName?.toLowerCase().includes(term) ||
        item.SupportAgent?.toLowerCase().includes(term)
    );
  }

  viewFeedback(item: any): void {
    // Parse issue types array / helper if string formatted
    this.selectedFeedback = {
      ...item,
      ratingsDetail: {
        responseTime: item.ResponseTime,
        technicalKnowledge: item.TechnicalKnowledge,
        professionalism: item.Professionalism,
        communication: item.Communication,
        resolution: item.Resolution,
      },
    };
  }

  closeModal(): void {
    this.selectedFeedback = null;
  }
}