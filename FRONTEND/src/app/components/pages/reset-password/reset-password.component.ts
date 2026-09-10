// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { EmailService } from '../../../../services/notification-services/email.service';
// import { ToastrService } from 'ngx-toastr';

// @Component({
//   selector: 'app-reset-password',
//   standalone: false,
//   templateUrl: './reset-password.component.html',
//   styleUrl: './reset-password.component.scss',
// })
// export class ResetPasswordComponent implements OnInit {

//   token: string = '';

//   newPassword: string = '';
//   confirmPassword: string = '';

//   isSubmitting: boolean = false;

//   showPassword: boolean = false;
//   showConfirmPassword: boolean = false;

//   passwordPattern: string =
//     '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

//   constructor(
//     private route: ActivatedRoute,
//     private emailService: EmailService,
//     private router: Router,
//     private toastr: ToastrService,
//   ) {}

//   ngOnInit() {
//     this.route.queryParams.subscribe(params => {
//       this.token = params['token'];

//       if (!this.token) {
//         this.toastr.error('Invalid reset link.');
//       }
//     });
//   }

//   get passwordMismatch(): boolean {
//     return (
//       !!this.newPassword &&
//       !!this.confirmPassword &&
//       this.newPassword !== this.confirmPassword
//     );
//   }

//   togglePassword() {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPassword() {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   resetPassword() {

//     const regex = new RegExp(this.passwordPattern);

//     // VALIDATION 1: TOKEN
//     if (!this.token) {
//       this.toastr.error('Invalid token.');
//       return;
//     }

//     // VALIDATION 2: PASSWORD RULES
//     if (!regex.test(this.newPassword)) {
//       this.toastr.error(
//         'Password must contain uppercase, lowercase, number, and special character.'
//       );
//       return;
//     }

//     // VALIDATION 3: MATCH
//     if (this.passwordMismatch) {
//       this.toastr.error('Passwords do not match.');
//       return;
//     }

//     this.isSubmitting = true;

//     const data = {
//       token: this.token,
//       newPassword: this.newPassword,
//     };

//     this.emailService.resetPassword(data).subscribe({
//       next: () => {

//         this.toastr.success('Password reset successful.');

//         // IMPORTANT: clear session locally
//         localStorage.clear();
//         sessionStorage.clear();

//         setTimeout(() => {
//           this.router.navigate(['/login']);
//         }, 1500);

//         this.isSubmitting = false;
//       },

//       error: (err) => {
//         this.toastr.error(
//           err?.error?.message || 'Reset failed.'
//         );

//         this.isSubmitting = false;
//       }
//     });
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from '../../../../services/notification-services/email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {

  token: string = '';

  newPassword: string = '';
  confirmPassword: string = '';

  isSubmitting: boolean = false;

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  passwordPattern: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (!this.token) {
        this.toastr.error('Invalid reset link.');
      }
    });
  }

  get passwordMismatch(): boolean {
    return (
      !!this.newPassword &&
      !!this.confirmPassword &&
      this.newPassword !== this.confirmPassword
    );
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ====================================
  // REQ CHECKERS (Called by Template)
  // ====================================
  hasUppercase(val: string): boolean {
    return /[A-Z]/.test(val);
  }

  hasLowercase(val: string): boolean {
    return /[a-z]/.test(val);
  }

  hasNumber(val: string): boolean {
    return /[0-9]/.test(val);
  }

  hasSpecialChar(val: string): boolean {
    return /[@$!%*?&]/.test(val);
  }

  resetPassword() {
    const regex = new RegExp(this.passwordPattern);

    // VALIDATION 1: TOKEN
    if (!this.token) {
      this.toastr.error('Invalid token.');
      return;
    }

    // VALIDATION 2: PASSWORD RULES
    if (!regex.test(this.newPassword)) {
      this.toastr.error(
        'Password must contain uppercase, lowercase, number, and special character.'
      );
      return;
    }

    // VALIDATION 3: MATCH
    if (this.passwordMismatch) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    this.isSubmitting = true;

    const data = {
      token: this.token,
      newPassword: this.newPassword,
    };

    this.emailService.resetPassword(data).subscribe({
      next: () => {
        this.toastr.success('Password reset successful.');

        // IMPORTANT: clear session locally
        localStorage.clear();
        sessionStorage.clear();

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);

        this.isSubmitting = false;
      },

      error: (err) => {
        this.toastr.error(
          err?.error?.message || 'Reset failed.'
        );

        this.isSubmitting = false;
      }
    });
  }
}