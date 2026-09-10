import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild, TemplateRef, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmailService } from '../../../../services/notification-services/email.service';
import { ChatService } from '../../../../services/UserServices/chat.service';
import { TicketService } from '../../../../services/UserServices/ticket.service';
import { TicketDetailsDialogComponent } from './ticket-details-dialog/ticket-details-dialog.component';
import { SlaService } from '../../../../services/notification-services/sla.service';

@Component({
  selector: 'app-ito-tickets',
  standalone: false,
  templateUrl: './ito-tickets.component.html',
  styleUrl: './ito-tickets.component.scss',
})
export class ItoTicketsComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;
  private _paginator!: MatPaginator;
private _sort!: MatSort;

@ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
  if (paginator) {
    this._paginator = paginator;
    this.dataSource.paginator = this._paginator;
  }
}

@ViewChild(MatSort) set sort(sort: MatSort) {
  if (sort) {
    this._sort = sort;
    this.dataSource.sort = this._sort;
  }
}
  
  // 🔔 Target the confirmation templates inside your HTML file
  @ViewChild('deleteConfirmModal') deleteConfirmModal!: TemplateRef<any>;
  @ViewChild('reopenConfirmModal') reopenConfirmModal!: TemplateRef<any>;

  private slaInterval: any;
  private gracePeriodTimers: { [ticketId: number]: any } = {};
  private countdownIntervals: { [ticketId: number]: any } = {};

  revertCountdowns: { [ticketId: number]: number } = {};
  selection = new SelectionModel<any>(true, []);
showScrollTop = false;

  // Listen for window scroll events
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    // Show button when scrolled down past 200px
    this.showScrollTop = window.scrollY > 200;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  displayedColumns: string[] = [
    'select',
    'Messages',
    'TicketNumber',
    'RequestDate',
    'FullName',
    'HelpTopic',
    'PriorityLevel',
    'CurrentStatus',
    'Overdue',
    'SLA',
    'Actions',
  ];
  notifCounts: { [ticketId: number]: number } = {};
  notifications: any[] = [];
  showResolved: boolean = false;
  isLoading: boolean = false;

  dataSource = new MatTableDataSource<any>();

  constructor(
    private tICKET: TicketService,
    private toastr: ToastrService,
    private router: Router,
    private signalRService: TicketService,
    private dialog: MatDialog,
    private chatService: ChatService,
    private mailService: EmailService,
    private slaService: SlaService,
  ) {}

  filterDate = {
    from: null as Date | null,
    to: null as Date | null,
  };
  Email: string | null = '';
  private revertTimers: { [ticketId: number]: any } = {};
  showRevert: { [ticketId: number]: boolean } = {};
  currentTime = new Date().getTime();

  ngOnInit(): void {
    this.Email = localStorage.getItem('Email');
    this.loadUnreadCounts();

    this.tICKET.updateOverdueTickets().subscribe({
      next: () => this.refreshTicketList(),
      error: () => this.refreshTicketList(),
    });

    this.signalRService.startConnection();
    this.signalRService.TicketAdded$.subscribe(() => {
      this.tICKET.updateOverdueTickets().subscribe({
        next: () => this.refreshTicketList(),
        error: () => this.refreshTicketList(),
      });
    });

    this.chatService.startConnection();
    this.chatService.Notification$.subscribe((msg) => {
      if (!msg || msg.SenderEmail === this.Email) return;
      const ticketId = msg.TicketId ?? msg.ticketId ?? msg.TicketNumber;
      if (!ticketId) return;
      this.notifCounts[ticketId] = (this.notifCounts[ticketId] || 0) + 1;
    });

    this.currentTime = new Date().getTime();

    setInterval(() => {
      this.currentTime = new Date().getTime();
    }, 1000);

    this.slaInterval = setInterval(() => {
      this.slaService.checkSlaNotifications(
        this.dataSource.data,
        this.getRemainingTime.bind(this),
      );
    }, 60000);
  }

  confirmDeleteSelected(): void {
    if (this.selection.selected.length === 0) {
      this.toastr.warning('No tickets selected for deletion.');
      return;
    }

    const dialogRef = this.dialog.open(this.deleteConfirmModal, {
      width: '420px',
      autoFocus: false,
      backdropClass: ['backdrop-blur-sm', 'bg-slate-900/45']
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.executeDeleteSelected();
      }
    });
  }

  private executeDeleteSelected(): void {
    const idsToDelete = this.selection.selected.map((item) => item.TicketId);

    idsToDelete.forEach((id) => {
      this.tICKET.deleteMessagesByTicket(id).subscribe({
        next: () => {
          this.tICKET.deleteTicket(id).subscribe(() => {
            this.toastr.error(`Ticket ${id} and its messages deleted`);
          });
        },
        error: (err) => {
          console.error(`Failed to delete messages for ticket ${id}`, err);
        },
      });
    });

    setTimeout(() => {
      this.refreshTicketList();
      this.selection.clear();
    }, 500);
  }

  confirmReopenTicket(ticket: any): void {
    const dialogRef = this.dialog.open(this.reopenConfirmModal, {
      width: '420px',
      data: ticket,
      autoFocus: false,
      backdropClass: ['backdrop-blur-sm', 'bg-slate-900/45']
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.updateTicketStatus(ticket, 'Reopened');
      }
    });
  }

  updateTicketStatus(ticket: any, newStatus: string): void {
    const ticketId = ticket.TicketId;

    if (newStatus === 'Resolved') {
      if (this.gracePeriodTimers[ticketId]) return;

      this.revertCountdowns[ticketId] = 5;
      this.showRevert[ticketId] = true;

      this.countdownIntervals[ticketId] = setInterval(() => {
        if (this.revertCountdowns[ticketId] > 1) {
          this.revertCountdowns[ticketId]--;
        } else {
          clearInterval(this.countdownIntervals[ticketId]);
        }
      }, 1000);

      this.gracePeriodTimers[ticketId] = setTimeout(() => {
        this.cleanupGracePeriod(ticketId);
        this.executeStatusUpdate(ticket, 'Resolved');
      }, 5000);

      return;
    }

    if (newStatus === 'Pending' && this.gracePeriodTimers[ticketId]) {
      clearTimeout(this.gracePeriodTimers[ticketId]);
      clearInterval(this.countdownIntervals[ticketId]);
      
      this.cleanupGracePeriod(ticketId);

      this.toastr.info('Resolution canceled. Ticket remains unchanged.', 'Canceled');
      this.refreshTicketList();
      return;
    }

    this.executeStatusUpdate(ticket, newStatus);
  }

  private cleanupGracePeriod(ticketId: number): void {
    delete this.gracePeriodTimers[ticketId];
    delete this.countdownIntervals[ticketId];
    delete this.revertCountdowns[ticketId];
    this.showRevert[ticketId] = false;
  }

  private executeStatusUpdate(ticket: any, newStatus: string): void {
    if (ticket.lastStatusNotified === newStatus) return;

    this.tICKET.updateTicketStatus(ticket.TicketId, newStatus).subscribe({
      next: (res) => {
        this.toastr.success(res.message, 'Update Successful');
        ticket.CurrentStatus = res.updatedStatus;
        ticket.LastUpdated = res.lastUpdated;

        if (newStatus === 'Resolved' || newStatus === 'Reopened') {
          this.slaService.sendStatusEmail(ticket, newStatus);
          ticket.lastStatusNotified = newStatus;
        }

        if (newStatus === 'Resolved') {
          ticket.slaNotified = true;
          ticket.overdueNotified = true;

          this.dataSource.data = this.dataSource.data.filter(
            (t: any) => t.TicketId !== ticket.TicketId
          );
        }

        if (newStatus === 'Reopened') {
          ticket.slaNotified = false;
          ticket.overdueNotified = false;
          ticket.Overdue = false;

          if (this.showResolved) {
            this.showResolved = false;
          }
          setTimeout(() => this.refreshTicketList(), 200);
        }

        if (newStatus === 'Pending') {
          this.refreshTicketList();
        }
      },
      error: (err) => {
        this.toastr.error('Failed to update ticket status', 'Error');
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.slaInterval) clearInterval(this.slaInterval);
    
    Object.keys(this.countdownIntervals).forEach(key => {
      clearInterval(this.countdownIntervals[+key]);
    });
    Object.keys(this.gracePeriodTimers).forEach(key => {
      clearTimeout(this.gracePeriodTimers[+key]);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleResolved(): void {
    this.showResolved = !this.showResolved;
    this.refreshTicketList();
  }

  applyDateFilter(): void {
    this.refreshTicketList();
  }

  clearDateFilter(): void {
    this.filterDate = { from: null, to: null };
    this.refreshTicketList();
  }

  clearFilters(): void {
    this.filterDate = { from: null, to: null };
    this.showResolved = false;
    this.refreshTicketList();
  }

  openTicketDetails(ticket: any): void {
    this.dialog.open(TicketDetailsDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: ticket,
      backdropClass: ['backdrop-blur-sm', 'bg-black/45']
    });
  }

  goToChatRoom(ticket: any): void {
    if (this.notifCounts[ticket.TicketId]) {
      this.notifCounts[ticket.TicketId] = 0;
    }
    this.router.navigate(['/chat-room', ticket.TicketId]);
  }

  refreshTicketList(): void {
    this.isLoading = true;
    this.tICKET.getAllTickets().subscribe({
      next: (data) => {
        let filtered = data;

        if (this.showResolved) {
          filtered = filtered.filter(
            (ticket: any) => ticket.CurrentStatus === 'Resolved',
          );
        } else {
          filtered = filtered.filter(
            (ticket: any) =>
              ticket.CurrentStatus !== 'Resolved' ||
              ticket.CurrentStatus === 'Reopened',
          );
        }

        if (this.filterDate.from || this.filterDate.to) {
          filtered = filtered.filter((ticket: any) => {
            if (!ticket.RequestDate) return false;

            const requestDate = new Date(ticket.RequestDate);
            requestDate.setHours(0, 0, 0, 0);

            let isValid = true;

            if (this.filterDate.from) {
              const from = new Date(this.filterDate.from);
              from.setHours(0, 0, 0, 0);
              isValid = isValid && requestDate >= from;
            }

            if (this.filterDate.to) {
              const to = new Date(this.filterDate.to);
              to.setHours(0, 0, 0, 0);
              isValid = isValid && requestDate <= to;
            }

            return isValid;
          });
        }

        this.dataSource.data = filtered
          .sort(
            (a: { TicketId: number }, b: { TicketId: number }) =>
              b.TicketId - a.TicketId,
          )
          .map((ticket: any) => ({
            ...ticket,
            slaNotified: ticket.slaNotified ?? false,
            overdueNotified: ticket.overdueNotified ?? false,
          }));

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching tickets', err);
      }
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /**
   * Helper: Calculates remaining business time in milliseconds between two dates.
   * Business Hours: 8:00 AM to 5:00 PM (9 hours/day), Mon - Fri.
   * Any request outside this window pauses timer until 8:00 AM next business day.
   */
  private getBusinessMsRemaining(startTimeMs: number, endTimeMs: number): number {
    if (startTimeMs >= endTimeMs) return 0;

    let totalMs = 0;
    let current = new Date(startTimeMs);
    const target = new Date(endTimeMs);

    const START_HOUR = 8;
    const END_HOUR = 17;

    while (current < target) {
      const day = current.getDay();
      const isWeekend = (day === 0 || day === 6);

      if (!isWeekend) {
        const currentHour = current.getHours();

        if (currentHour >= START_HOUR && currentHour < END_HOUR) {
          const nextHour = new Date(current.getTime() + 60 * 60 * 1000);
          const stepEnd = nextHour > target ? target : nextHour;

          const endOfBusinessDay = new Date(current);
          endOfBusinessDay.setHours(END_HOUR, 0, 0, 0);

          const actualEnd = stepEnd > endOfBusinessDay ? endOfBusinessDay : stepEnd;
          const diff = actualEnd.getTime() - current.getTime();

          if (diff > 0) {
            totalMs += diff;
          }
        }
      }

      // Step forward by 1 hour
      current = new Date(current.getTime() + 60 * 60 * 1000);

      // Fast-forward outside business hours
      if (current.getHours() >= END_HOUR) {
        current.setDate(current.getDate() + 1);
        current.setHours(START_HOUR, 0, 0, 0);
      } else if (current.getHours() < START_HOUR) {
        current.setHours(START_HOUR, 0, 0, 0);
      }
    }

    return totalMs;
  }

  getRemainingTime(ticket: any): string {
    if (ticket.CurrentStatus === 'Resolved') {
      return 'Resolved';
    }

    if (!ticket.DueDate) {
      return '';
    }

    const due = new Date(ticket.DueDate).getTime();

    if (this.currentTime >= due) {
      return 'Overdue';
    }

    const totalMs = this.getBusinessMsRemaining(this.currentTime, due);

    if (totalMs <= 0) {
      return 'Overdue';
    }

    const WORK_DAY_MS = 9 * 60 * 60 * 1000; // 9 working hours per day (8 AM - 5 PM)
    const businessDays = Math.floor(totalMs / WORK_DAY_MS);
    const remainderMs = totalMs % WORK_DAY_MS;

    const hours = Math.floor(remainderMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainderMs % (1000 * 60 * 60)) / (1000 * 60));

    if (businessDays > 0) {
      return `${businessDays} Business Day(s) ${hours}h ${minutes}m`;
    }

    return `${hours}h ${minutes}m`;
  }

  getSlaClass(ticket: any): string {
    if (!ticket.DueDate || ticket.CurrentStatus === 'Resolved') {
      return '';
    }

    const due = new Date(ticket.DueDate).getTime();

    if (this.currentTime >= due) {
      return 'sla-overdue';
    }

    const totalMs = this.getBusinessMsRemaining(this.currentTime, due);
    const WORK_DAY_MS = 9 * 60 * 60 * 1000;

    // Highlight warning if 1 business day or less remains (<= 9 business hours)
    if (totalMs <= WORK_DAY_MS) {
      return 'sla-warning';
    }

    return 'sla-normal';
  }

  loadUnreadCounts() {
    if (!this.Email) return;

    this.chatService.getNotifications(this.Email).subscribe((data) => {
      this.notifCounts = {};

      data
        .filter((n) => !n.IsRead)
        .forEach((n) => {
          this.notifCounts[n.TicketId] =
            (this.notifCounts[n.TicketId] || 0) + 1;
        });
    });
  }

  downloadCSV(): void {
  const itemsToExport = this.selection.hasValue() 
    ? this.selection.selected 
    : this.dataSource.data;

  if (!itemsToExport || itemsToExport.length === 0) {
    return;
  }

  const headers = ['Ticket Number', 'Request Date', 'Client', 'Help Topic', 'Priority', 'Status', 'Overdue'];
  
  const csvRows = [
    headers.join(','),
    ...itemsToExport.map(row => [
      `"${row.TicketNumber || ''}"`,
      `"${row.RequestDate || ''}"`,
      `"${(row.FullName || '').replace(/"/g, '""')}"`,
      `"${(row.HelpTopic || '').replace(/"/g, '""')}"`,
      `"${row.PriorityLevel || ''}"`,
      `"${row.CurrentStatus || ''}"`,
      `"${row.Overdue ? 'Yes' : 'No'}"`
    ].join(','))
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `support_tickets_${new Date().getTime()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
}