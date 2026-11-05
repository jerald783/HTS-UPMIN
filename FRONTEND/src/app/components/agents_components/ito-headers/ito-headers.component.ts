import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../services/them/theme.service';
import { ChatService } from '../../../../services/UserServices/chat.service';
import { UserService } from '../../../../services/UserServices/user.service';

@Component({
  selector: 'app-ito-headers',
  standalone: false,
  templateUrl: './ito-headers.component.html',
  styleUrls: ['./ito-headers.component.scss'],
})
export class ItoHeadersComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<string>();

  Email: string | null = '';
  fullName: string | null = '';

  notifications: any[] = [];
  notifCount: number = 0;
  
  // Controlled Angular state flags for dropdown windows
  isMenuOpen = false;
  isNotifOpen = false;
  isUserDropdownOpen = false; // Added to decouple user menu from raw CSS or native BS bundles
  isMasterFileMenuOpen = false;
  opened = true;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private chatService: ChatService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.Email = localStorage.getItem('Email');
    this.fullName = localStorage.getItem('fullName');

    this.loadNotifications();

    this.chatService.startConnection();

    this.chatService.Notification$.subscribe((msg) => {
      if (!msg) return;

      // Normalize property names to match your template
      const normalized = {
        NotificationId: msg.NotificationId ?? msg.notificationId ?? 0,
        TicketId: msg.TicketId ?? msg.ticketId,
        SenderEmail: msg.SenderEmail ?? msg.senderEmail ?? '',
        Message: msg.Message ?? msg.message ?? '',
        read: false,
      };

      // Ignore notifications sent by yourself
      if (normalized.SenderEmail === this.Email) return;

      this.notifications.unshift(normalized);
      this.updateNotifCount();
    });

    // Listen for cleared notifications
    this.chatService.NotificationCleared$.subscribe((ticketId: number) => {
      this.notifications = this.notifications.filter(
        (n) => n.TicketId !== ticketId,
      );
      this.updateNotifCount();
    });
  }

  // ======================
  // INTERACTION FLOW MANAGERS
  // ======================
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.closeAllDropdowns();
    }
  }

  toggleNotifDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation(); // Stops immediate closing from event bubbling
    this.isNotifOpen = !this.isNotifOpen;
    this.isUserDropdownOpen = false; // Mutually exclusive window
  }

  toggleUserDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation(); // Stops immediate closing from event bubbling
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isNotifOpen = false; // Mutually exclusive window
  }

  toggleMasterFileMenu() {
    this.isMasterFileMenuOpen = !this.isMasterFileMenuOpen;
  }

  closeAllDropdowns() {
    this.isNotifOpen = false;
    this.isUserDropdownOpen = false;
  }

  // ======================
  // SEARCH
  // ======================
  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filterChanged.emit(filterValue);
  }

  // ======================
  // NOTIFICATIONS
  // ======================
  loadNotifications() {
    if (!this.Email) return;

    this.chatService.getNotifications(this.Email).subscribe((res) => {
      // Convert backend IsRead to read flag
      this.notifications = res.map((n) => ({
        ...n,
        read: n.IsRead,
      }));
      this.updateNotifCount();
    });
  }

  openTicket(ticketId: number, notificationId: number) {
    this.closeAllDropdowns();
    this.isMenuOpen = false; // Close mobile sidebar on navigation
    this.router.navigate(['/chat-room', ticketId]);
    
    // Find the index of the clicked notification
    const notifIndex = this.notifications.findIndex(
      (n) => n.NotificationId === notificationId,
    );
    if (notifIndex !== -1) {
      // Remove it from the notifications array
      this.notifications.splice(notifIndex, 1);

      // Update unread count
      this.updateNotifCount();

      // mark it as read in the backend
      this.chatService.markNotificationRead(notificationId).subscribe();
    }
  }

  updateNotifCount() {
    this.notifCount = this.notifications.filter((n) => !n.read).length;
  }

  // ======================
  // UTILS
  // ======================
  getInitials(name: string | null): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }

  getAvatarColor(fullName: string): string {
    const colors = [
      '#3f51b5',
      '#e91e63',
      '#009688',
      '#ff5722',
      '#9c27b0',
      '#2196f3',
      '#4caf50',
      '#ffc107',
    ];
    let hash = 0;
    for (let i = 0; i < fullName.length; i++)
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash % colors.length)];
  }

  logOut() {
    this.closeAllDropdowns();
    this.isMenuOpen = false;
    this.userService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }
}