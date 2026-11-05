import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { TicketService } from '../../../../services/UserServices/ticket.service';

@Component({
  selector: 'app-ito-admin-tickets',
  standalone: false,
  templateUrl: './ito-admin-tickets.component.html',
  styleUrl: './ito-admin-tickets.component.scss',
})
export class ItoAdminTicketsComponent implements OnInit, AfterViewInit, OnDestroy {
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
@ViewChild(MatSort) set sort(sort: MatSort) {
  if (sort) {
    this._sort = sort;
    this.dataSource.sort = this._sort;
  }
}
  private slaInterval: any;
  selection = new SelectionModel<any>(true, []);

  selectedTicket: any = null;
  isLoading: boolean = false; // Added variable for managing state runtime layout

  displayedColumns: string[] = [
    'TicketNumber',
    'RequestDate',
    'FullName',
    'HelpTopic',
    'PriorityLevel',
    'CurrentStatus',
    'DueDate',
    'Overdue',
    'SLA',
    'Agent',
    'Actions',
  ];
  
  showResolved: boolean = false;
  agents: any[] = [];
  selectedAgentId: number | null = null;
  dataSource = new MatTableDataSource<any>();

  constructor(
    private tICKET: TicketService,
    private toastr: ToastrService,
    private router: Router,
    private signalRService: TicketService,
    private dialog: MatDialog,
  ) {}

  filterDate = {
    from: null as Date | null,
    to: null as Date | null,
  };
  Email: string | null = '';

  currentTime = new Date().getTime();

  ngOnInit(): void {
    this.loadAgents();
    this.isLoading = true;
    this.tICKET.updateOverdueTickets().subscribe({
      next: () => this.refreshTicketList(),
      error: () => this.refreshTicketList(),
    });

    this.signalRService.startConnection();
    this.signalRService.TicketAdded$.subscribe(() => {
      this.isLoading = true;
      this.tICKET.updateOverdueTickets().subscribe({
        next: () => this.refreshTicketList(),
        error: () => this.refreshTicketList(),
      });
    });

    this.currentTime = new Date().getTime();
    this.slaInterval = setInterval(() => {
      this.currentTime = new Date().getTime();
    }, 1000);
  }

  loadAgents(): void {
    this.tICKET.getAgents?.().subscribe({
      next: (res: any) => {
        this.agents = res;
      },
      error: () => {
        this.toastr.error('Failed to load agents');
      },
    });
  }

  ngOnDestroy(): void {
    if (this.slaInterval) clearInterval(this.slaInterval);
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

  openTicketDetails(ticket: any): void {
    this.selectedTicket = ticket;
    document.body.classList.add('overflow-hidden');
  }

  closeTicketDetailsModal(): void {
    this.selectedTicket = null;
    document.body.classList.remove('overflow-hidden');
  }

  refreshTicketList(): void {
    this.isLoading = true;
    this.tICKET.getAllTickets()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
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
          
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
        },
        error: () => {
          this.toastr.error('Failed to load tickets');
        }
      });
  }

  assignAgentToTicket(ticket: any): void {
    this.tICKET.assignAgent(ticket.TicketId, ticket.AgentAssigned).subscribe({
      next: () => {
        this.toastr.success(`Assigned to ${ticket.AgentAssigned}`);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to assign agent');
      },
    });
  }

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