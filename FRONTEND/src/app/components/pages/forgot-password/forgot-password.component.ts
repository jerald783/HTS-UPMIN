// import { Component } from '@angular/core';
// import { EmailService } from '../../../../services/notification-services/email.service';
// import { ToastrService } from 'ngx-toastr';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-forgot-password',
//   standalone: false,
//   templateUrl: './forgot-password.component.html',
//   styleUrl: './forgot-password.component.scss',
// })
// export class ForgotPasswordComponent {
//   email: string = '';
//   message: string = '';

//   constructor(
//     private emailService: EmailService,
//     private toastr: ToastrService,
//     private router: Router,
//   ) {}

//   submit() {
//     if (!this.email) {
//       this.message = 'Email required';
//       return;
//     }

//     this.emailService.forgotPassword(this.email).subscribe({
//       next: (res: any) => {
//         this.toastr.success('Reset link sent to your email.');
//         // this.message = "Reset link sent to your email.";
//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 2000);
//       },
//       error: (err) => {
//         this.toastr.error(err.error?.message || 'Error sending reset email.');
//       },
//     });
//   }
// }

import { Component } from '@angular/core';
import { EmailService } from '../../../../services/notification-services/email.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  email: string = '';
  isLoading: boolean = false;

  // FIX: Change string pattern to a strict RegExp object literal
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@up\.edu\.ph$/;

  constructor(
    private emailService: EmailService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  submit() {
    // Sanitize string value
    this.email = this.email.trim().toLowerCase();

    if (!this.email) {
      this.toastr.error('Email address is required.');
      return;
    }

    // RegEx validation match guard confirmation check block
    if (!this.emailPattern.test(this.email)) {
      this.toastr.error('Please use a valid UP email address (example@up.edu.ph).');
      return;
    }

    this.isLoading = true;

    this.emailService.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.toastr.success('Reset link sent to your UP email account.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Error sending reset email.');
        this.isLoading = false;
      },
    });
  }
}
