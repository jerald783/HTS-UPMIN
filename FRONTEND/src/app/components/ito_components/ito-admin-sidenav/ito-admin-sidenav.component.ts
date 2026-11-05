// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

// @Component({
//   selector: 'app-ito-admin-sidenav',
//   standalone: false,
//   templateUrl: './ito-admin-sidenav.component.html',
//   styleUrl: './ito-admin-sidenav.component.scss',
// })
// export class ItoAdminSidenavComponent implements OnInit {
//   picture: string | null = null;
//   Email: string | null = null;
//   fullName: string | null = null;
// isMobile = false; // <-- Add this
//   opened = true;
//   isMasterFileMenuOpen = false;

//   constructor(
//     private router: Router,
//     private breakpointObserver: BreakpointObserver,
//   ) {}

// ngOnInit() {
//   this.Email = localStorage.getItem('Email');
//   this.fullName = localStorage.getItem('fullName');

//   // Detect mobile screen
//   this.breakpointObserver
//     .observe([Breakpoints.Handset])
//     .subscribe((result) => {
//       this.isMobile = result.matches; // <-- Set the flag here

//       if (this.isMobile) {
//         this.opened = false; // mobile → closed
//       } else {
//         this.opened = true;  // desktop → open
//       }
//     });
// }

//   toggleMasterFileMenu() {
//     this.isMasterFileMenuOpen = !this.isMasterFileMenuOpen;
//   }

//   logOut() {
//     localStorage.clear();
//     this.router.navigate(['login']);
//   }

//   getInitials(name: string | null): string {
//     if (!name) return '?';

//     const parts = name.trim().split(' ');
//     if (parts.length === 1) {
//       return parts[0].charAt(0).toUpperCase();
//     } else {
//       return (
//         parts[0].charAt(0).toUpperCase() +
//         parts[parts.length - 1].charAt(0).toUpperCase()
//       );
//     }
//   }

//   getAvatarColor(fullName: string): string {
//     const colors = [
//       '#3f51b5',
//       '#e91e63',
//       '#009688',
//       '#ff5722',
//       '#9c27b0',
//       '#2196f3',
//       '#4caf50',
//       '#ffc107',
//     ];

//     let hash = 0;
//     for (let i = 0; i < fullName.length; i++) {
//       hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
//     }

//     const index = Math.abs(hash % colors.length);
//     return colors[index];
//   }
// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ito-admin-sidenav',
  standalone: false,
  templateUrl: './ito-admin-sidenav.component.html',
  styleUrl: './ito-admin-sidenav.component.scss',
})
export class ItoAdminSidenavComponent implements OnInit, OnDestroy {
  Email: string | null = null;
  fullName: string | null = null;

  isMobile = false;
  opened = true;          // Controls mobile overlay drawer
  isCollapsed = false;    // Controls desktop collapse state
  isMasterFileMenuOpen = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.Email = localStorage.getItem('Email');
    this.fullName = localStorage.getItem('fullName');

    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isMobile = result.matches;

        if (this.isMobile) {
          this.opened = false;
          this.isCollapsed = false;
        } else {
          this.opened = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav(): void {
    if (this.isMobile) {
      this.opened = !this.opened;
    } else {
      this.isCollapsed = !this.isCollapsed;
      // Close open submenus when collapsing sidebar on desktop
      if (this.isCollapsed) {
        this.isMasterFileMenuOpen = false;
      }
    }
  }

  closeMobileMenu(): void {
    if (this.isMobile) {
      this.opened = false;
    }
  }

  toggleMasterFileMenu(): void {
    // If desktop sidebar is collapsed, expand sidebar first
    if (this.isCollapsed && !this.isMobile) {
      this.isCollapsed = false;
      this.isMasterFileMenuOpen = true;
    } else {
      this.isMasterFileMenuOpen = !this.isMasterFileMenuOpen;
    }
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  getInitials(name: string | null): string {
    if (!name) return '?';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
}