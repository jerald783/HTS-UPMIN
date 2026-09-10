import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../../../../services/them/theme.service';
import { UserService } from '../../../../services/UserServices/user.service';

@Component({
  selector: 'app-user-header',
  standalone: false,
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.scss',
})
export class UserHeaderComponent implements OnInit {
  isDisabled = true;
  isMenuOpen = false;
  isStudent = false;
  // New flags to explicitly manage dropdown states across devices
  isTicketDropdownOpen = false;
  isUserDropdownOpen = false;

  @Output() filterChanged = new EventEmitter<string>();
  isMobileSearchVisible: boolean = false;

  picture: string | null = null;
  Home: any;
  Email: string | null = '';
  fullName: string | null = '';

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.Email = localStorage.getItem('Email');
    this.fullName = localStorage.getItem('fullName');
    const userRole = this.userService.getUserRole();
    this.isStudent = userRole?.toLowerCase() === 'student';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.closeAllDropdowns();
    }
  }

  // Explicit dropdown toggles to guarantee tap responsiveness on tablets and phones
  toggleTicketDropdown(event: Event) {
    event.stopPropagation();
    this.isTicketDropdownOpen = !this.isTicketDropdownOpen;
    this.isUserDropdownOpen = false; // Collapse the other dropdown
  }

  toggleUserDropdown(event: Event) {
    event.stopPropagation();
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    this.isTicketDropdownOpen = false; // Collapse the other dropdown
  }

  closeAllDropdowns() {
    this.isTicketDropdownOpen = false;
    this.isUserDropdownOpen = false;
  }

  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filterChanged.emit(filterValue);
  }

  toggleDark(): void {
    this.themeService.toggleDarkMode();
  }

  toggleMarron(): void {
    this.themeService.toggleMarronMode();
  }

  logOut() {
    this.userService.logout().subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/login']);
    });
  }

  getInitials(name: string | null): string {
    if (!name) return '?';

    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    } else {
      return (
        parts[0].charAt(0).toUpperCase() +
        parts[parts.length - 1].charAt(0).toUpperCase()
      );
    }
  }

  getAvatarColor(fullName: string): string {
    const colors = [
      '#3f51b5', // Indigo
      '#e91e63', // Pink
      '#009688', // Teal
      '#ff5722', // Deep Orange
      '#9c27b0', // Purple
      '#2196f3', // Blue
      '#4caf50', // Green
      '#ffc107', // Amber
    ];

    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  }
}