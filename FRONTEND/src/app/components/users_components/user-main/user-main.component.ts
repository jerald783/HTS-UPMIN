// import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
// import { ToastrService } from 'ngx-toastr';
// import { Subject } from 'rxjs';
// import { UserService } from '../../../../services/UserServices/user.service';

// @Component({
//   selector: 'app-main',
//   standalone: false,
//   templateUrl: './user-main.component.html',
//   styleUrl: './user-main.component.scss',
// })
// export class UserMainComponent implements OnInit, OnDestroy {
//   // EventsList: any[] = [];
//   private destroy$ = new Subject<void>();
// isStudent = false;


//   constructor (private toastr: ToastrService, private userService: UserService) {}

//   ngOnInit(): void {}

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//     const userRole = this.userService.getUserRole();
//     this.isStudent = userRole?.toLowerCase() === 'student';
//   }

//   @HostListener('window:scroll', [])
//   onWindowScroll(): void {
//     const myButton = document.getElementById('myBtn');
//     if (myButton) {
//       myButton.style.display = window.scrollY > 20 ? 'block' : 'none';
//     }
//   }
// }
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { UserService } from '../../../../services/UserServices/user.service';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './user-main.component.html',
  styleUrl: './user-main.component.scss',
})
export class UserMainComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  isStudent = false;

  constructor(
    private toastr: ToastrService, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Determine student role when component initializes
    const userRole = this.userService.getUserRole();
    this.isStudent = userRole?.toLowerCase() === 'student';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const myButton = document.getElementById('myBtn');
    if (myButton) {
      myButton.style.display = window.scrollY > 20 ? 'block' : 'none';
    }
  }
}