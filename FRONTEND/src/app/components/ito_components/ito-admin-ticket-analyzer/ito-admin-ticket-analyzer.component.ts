// import { Component, inject } from '@angular/core';
// import { TicketService } from '../../../../services/UserServices/ticket.service';

// @Component({
//   selector: 'app-ito-admin-ticket-analyzer',
//   standalone: false,
//   templateUrl: './ito-admin-ticket-analyzer.component.html',
//   styleUrl: './ito-admin-ticket-analyzer.component.scss'
// })

// export class ItoAdminTicketAnalyzerComponent {
//   private ticketService = inject(TicketService);
//   analysisResult = '';
//   totalAnalyzed = 0;
//   loading = false;

//   onAnalyzeAll() {
//     this.loading = true;
//     this.ticketService.analyzeAllTickets().subscribe({
//       next: (res) => {
//         this.analysisResult = res.analysis;
//         this.totalAnalyzed = res.totalAnalyzed;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }
// }

import { Component, inject } from '@angular/core';
import { TicketService } from '../../../../services/UserServices/ticket.service';

@Component({
  selector: 'app-ito-admin-ticket-analyzer',
  standalone: false,
  templateUrl: './ito-admin-ticket-analyzer.component.html',
  styleUrl: './ito-admin-ticket-analyzer.component.scss'
})
export class ItoAdminTicketAnalyzerComponent {
  private ticketService = inject(TicketService);

  fromDate: string = '';
  toDate: string = '';
  analysisResult = '';
  errorMessage = '';
  totalAnalyzed = 0;
  loading = false;

  onAnalyzeAll() {
    this.loading = true;
    this.analysisResult = '';
    this.errorMessage = '';
    
    this.ticketService.analyzeAllTickets(this.fromDate, this.toDate).subscribe({
      next: (res) => {
        this.analysisResult = res.analysis;
        this.totalAnalyzed = res.totalAnalyzed;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to process diagnostic analysis.';
        this.loading = false;
      }
    });
  }
  printReport() {
    window.print();
  }
}