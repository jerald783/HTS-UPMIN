import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spmo-sidenav',
  standalone: false,
  templateUrl: './spmo-sidenav.component.html',
  styleUrl: './spmo-sidenav.component.scss',
})
export class SpmoSidenavComponent implements OnInit {
  picture: string | null = null;
  Email: string | null = null;
  fullName: string | null = null;
  constructor(private router: Router) {}

  ngOnInit() {
    this.Email = localStorage.getItem('Email');
    this.fullName = localStorage.getItem('fullName');
  }
  opened = true;
  isMasterFileMenuOpen = false;

  toggleMasterFileMenu() {
    this.isMasterFileMenuOpen = !this.isMasterFileMenuOpen;
  }
  logOut() {
    this.router.navigate(['login']);
    localStorage.clear();
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
