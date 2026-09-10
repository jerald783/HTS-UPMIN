
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { ViewTicketDetailsDialogComponent } from './view-ticket-details-dialog/view-ticket-details-dialog.component';
import { TicketService } from '../../../../../services/UserServices/ticket.service';
import { AdmAssetsService } from '../../../../../services/adminServices/adm-assets.service';
import { SlaService } from '../../../../../services/notification-services/sla.service';
import { ChatService } from '../../../../../services/UserServices/chat.service';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-view-ticket',
  standalone: false,
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.scss',
})
export class ViewTicketComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);
  showResolved: boolean = false;
  notifCounts: { [ticketId: number]: number } = {};
  Email: string | null = '';
  isLoading: boolean = false;

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

  // Modern UI Modal tracking state
  isConfirmingDelete = false;
  isConfirmingReopen = false;
  isConfirmingRevert = false;
  activeTicketContext: any = null;

  displayedColumns: string[] = [
    'select',
    'Messages',
    'TicketNumber',
    'RequestDate',
    'HelpTopic',
    'PriorityLevel',
    'CurrentStatus',
    'Actions',
  ];

  dataSource = new MatTableDataSource<any>();
  filterDate = {
    from: null as Date | null,
    to: null as Date | null,
  };

  constructor(
    private service: AdmAssetsService,
    private toastr: ToastrService,
    private router: Router,
    private tICKET: TicketService,
    private dialog: MatDialog,
    private slaService: SlaService,
    private chatService: ChatService,
  ) {}

  // --- CUSTOM DIALOG: DELETE LOGIC ---
  openDeleteConfirmation(): void {
    if (this.selection.selected.length === 0) {
      this.toastr.warning('No tickets selected for deletion.');
      return;
    }
    this.isConfirmingDelete = true;
  }

  closeDeleteConfirmation(): void {
    this.isConfirmingDelete = false;
  }

  confirmDelete(): void {
    this.isConfirmingDelete = false;
    this.isLoading = true;

    const deletionTasks = this.selection.selected.map((item) => {
      const id = item.TicketId;
      return this.tICKET.deleteMessagesByTicket(id).pipe(
        switchMap(() => this.tICKET.deleteTicket(id))
      );
    });

    forkJoin(deletionTasks).subscribe({
      next: () => {
        this.toastr.error(`${this.selection.selected.length} ticket(s) and their messages deleted.`);
        this.selection.clear();
        this.refreshTicketList();
      },
      error: (err) => {
        console.error('Failed to complete all deletion requests', err);
        this.toastr.error('An error occurred while deleting the selected tickets.');
        this.isLoading = false;
      }
    });
  }

  // --- CUSTOM DIALOG: REOPEN LOGIC ---
  openReopenConfirmation(ticket: any): void {
    this.activeTicketContext = ticket;
    this.isConfirmingReopen = true;
  }

  closeReopenConfirmation(): void {
    this.isConfirmingReopen = false;
    this.activeTicketContext = null;
  }

  confirmReopen(): void {
    if (!this.activeTicketContext) return;
    const ticket = this.activeTicketContext;
    this.isConfirmingReopen = false;
    this.isLoading = true;

    this.tICKET.updateTicketStatus(ticket.TicketId, 'Reopened').subscribe({
      next: (res) => {
        ticket.CurrentStatus = 'Reopened';
        if (this.slaService) {
          this.slaService.sendStatusEmail(ticket, 'Reopened');
        }
        this.toastr.success(`Ticket ${ticket.TicketNumber} reopened successfully`);
        this.refreshTicketList();
        this.activeTicketContext = null;
      },
      error: (err) => {
        console.error('Failed to reopen ticket:', err);
        this.toastr.error('Failed to reopen ticket');
        this.isLoading = false;
        this.activeTicketContext = null;
      },
    });
  }

  // --- CUSTOM DIALOG: REVERT LOGIC ---
  openRevertConfirmation(ticket: any): void {
    this.activeTicketContext = ticket;
    this.isConfirmingRevert = true;
  }

  closeRevertConfirmation(): void {
    this.isConfirmingRevert = false;
    this.activeTicketContext = null;
  }

  confirmRevert(): void {
    if (!this.activeTicketContext) return;
    const ticket = this.activeTicketContext;
    this.isConfirmingRevert = false;
    this.isLoading = true;

    this.tICKET.updateTicketStatus(ticket.TicketId, 'Resolved').subscribe({
      next: () => {
        ticket.CurrentStatus = 'Resolved';
        this.toastr.info(`Ticket ${ticket.TicketNumber} reverted successfully`);
        this.refreshTicketList();
        this.activeTicketContext = null;
      },
      error: (err) => {
        console.error('Failed to revert ticket:', err);
        this.toastr.error('Failed to revert ticket');
        this.isLoading = false;
        this.activeTicketContext = null;
      },
    });
  }

  ngOnInit(): void {
    this.Email = localStorage.getItem('Email');

    this.loadUnreadCounts();
    this.refreshTicketList();
    this.chatService.startConnection();

    this.chatService.Notification$.subscribe((msg) => {
      if (!msg) return;

      const ticketId = msg.TicketId ?? msg.ticketId ?? msg.TicketNumber;
      if (!ticketId) return;

      this.notifCounts[ticketId] = (this.notifCounts[ticketId] || 0) + 1;
    });
  }

  clearDateFilter(): void {
    this.filterDate = { from: null, to: null };
    this.refreshTicketList();
  }

  applyDateFilter(): void {
    this.refreshTicketList();
  }

  loadUnreadCounts(): void {
    if (!this.Email) return;

    this.chatService.getNotifications(this.Email).subscribe({
      next: (data: any[]) => {
        this.notifCounts = {};

        data
          .filter((n) => !n.IsRead)
          .forEach((n) => {
            this.notifCounts[n.TicketId] = (this.notifCounts[n.TicketId] || 0) + 1;
          });
      },
      error: (err) => {
        console.error('Failed to load notifications', err);
      },
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

  goToChatRoom(ticket: any): void {
    this.router.navigate(['/chat-room', ticket.TicketId]);
  }

  openTicketDetails(ticket: any): void {
    this.dialog.open(ViewTicketDetailsDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: ticket,
      backdropClass: ['backdrop-blur-sm', 'bg-black/30']
    });
  }

  refreshTicketList(): void {
    const loggedInEmail = localStorage.getItem('Email');

    if (!loggedInEmail) {
      console.error('❌ No Email found in localStorage.');
      return;
    }

    this.isLoading = true;

    this.tICKET.getTicketByUser(loggedInEmail).subscribe({
      next: (data) => {
        let filtered = data || [];

        // 1. Status Filter
        if (this.showResolved) {
          filtered = filtered.filter(
            (ticket: any) => ticket.CurrentStatus === 'Resolved',
          );
        } else {
          filtered = filtered.filter(
            (ticket: any) => ticket.CurrentStatus !== 'Resolved',
          );
        }

        // 2. Assignment Window Date Filter
        if (this.filterDate.from || this.filterDate.to) {
          filtered = filtered.filter((ticket: any) => {
            if (!ticket.RequestDate) return false;
            
            const ticketDate = new Date(ticket.RequestDate);
            ticketDate.setHours(0, 0, 0, 0);

            if (this.filterDate.from) {
              const fromDate = new Date(this.filterDate.from);
              fromDate.setHours(0, 0, 0, 0);
              if (ticketDate < fromDate) return false;
            }

            if (this.filterDate.to) {
              const toDate = new Date(this.filterDate.to);
              toDate.setHours(23, 59, 59, 999);
              if (ticketDate > toDate) return false;
            }

            return true;
          });
        }

        // Sort descending by ID
        this.dataSource.data = filtered.sort(
          (a: { TicketId: number }, b: { TicketId: number }) => b.TicketId - a.TicketId,
        );

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to get user tickets', err);
        this.isLoading = false;
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
}