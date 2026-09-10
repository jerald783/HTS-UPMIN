// import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { UserService } from '../../../../services/UserServices/user.service';
// import { SettingsService } from '../../../../services/UserServices/settings.service';
// declare const google: any;
// @Component({
//   selector: 'app-login',
//   standalone: false,
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginComponent implements OnDestroy, OnInit {
//   //Variables for login form
//   Email: string = '';
//   password: string = '';
//   loginMessage: string = '';
//   showPassword: boolean = false;
//   isSubmitting: boolean = false;
//   maxAttempts: number = 5;
//   failedAttempts: number = 0;
//   countdownInterval: any;
//   countdownMinutes: number = 0;
//   countdownSeconds: number = 0;

//   constructor(
//     private userService: UserService,
//     private router: Router,
//     private ngZone: NgZone,
//     private settingsService: SettingsService,
//   ) {}

//   get now(): number {
//     return Date.now();
//   }

//   onLogin(): void {
//     if (this.isSubmitting) return;

//     this.isSubmitting = true;
//     this.loginMessage = '';

//     const Email = this.Email.trim();
//     const password = this.password.trim();

//     if (!Email || !password) {
//       this.loginMessage = 'Please enter both username and password.';
//       this.isSubmitting = false;
//       return;
//     }

//     this.userService.login(Email, password).subscribe({
//       next: (response) => {
//         // SAFE DATA ONLY
//         localStorage.setItem('Email', Email);
//         localStorage.setItem('fullName', response.fullName);
//         localStorage.setItem('userRole', response.role);

//         this.failedAttempts = 0;

//         switch (response.role) {
//           case 'Admin':
//                this.router.navigate([
//             '/adminito',
//             { outlets: { secondary: ['itoadmindashboard'] } },
//           ]);
       
//             break;

//           case 'Agent':
//             this.router.navigate(['/ito']);
//             break;

//           case 'COS':
//           case 'Student':
//           case 'Regular':
//             this.router.navigate(['/main']);
      
//             break;

//           case 'SPMO':
//             this.router.navigate(['/adminspmo']);
//             break;

//           default:
//             this.loginMessage = 'Role not assigned or invalid role.';
//         }

//         this.isSubmitting = false;
//       },

//       error: (error) => {
//         this.loginMessage =
//           error.error?.message || 'Login failed. Please try again.';

//         this.isSubmitting = false;
//       },
//     });
//   }
//   togglePasswordVisibility(): void {
//     this.showPassword = !this.showPassword;
//   }
//   ngOnDestroy(): void {
//     if (this.countdownInterval) clearInterval(this.countdownInterval);
//   }

//   ngOnInit(): void {
//     this.settingsService.getGoogleClientId().subscribe((res: any) => {
//       google.accounts.id.initialize({
//         client_id: res.clientId,
//         callback: (response: any) => {
//           this.handleGoogleLogin(response);
//         },
//       });

//       google.accounts.id.renderButton(document.getElementById('googleBtn'), {
//         theme: 'outline',
//         size: 'large',
//         width: 250,
//       });
//     });
//   }
//   // handleGoogleLogin(response: any) {
//   //   const token = response.credential;

//   //   this.settingsService.googleLogin(token).subscribe(
//   //     (response: any) => {
//   //       // CRITICAL: Wrap the entire success block in ngZone.run
//   //       this.ngZone.run(() => {
//   //         localStorage.setItem('Email', response.email);
//   //         localStorage.setItem('fullName', response.fullName);
//   //                 localStorage.setItem('userRole', response.role);
//   //         this.userService.setAuthData(response.role);
//   //         // Navigation logic

//   //       switch (response.role) {
//   //         case 'Admin':
//   //              this.router.navigate([
//   //           '/adminito',
//   //           { outlets: { secondary: ['itoadmindashboard'] } },
//   //         ]);
//   //           break;

//   //         case 'Agent':
//   //           this.router.navigate(['/ito']);
//   //           break;

//   //         case 'COS':
//   //         case 'Regular':
//   //           this.router.navigate(['/main']);
//   //           break;

//   //         case 'SPMO':
//   //           this.router.navigate(['/adminspmo']);
//   //           break;

//   //         default:
//   //           this.loginMessage = 'Role not assigned or invalid role.';
//   //       }
//   //       });
//   //     },
//   //     (error: any) => {
//   //       const code = error?.error?.code;
//   //       const message = error?.error?.message;

//   //       this.ngZone.run(() => {
//   //         switch (code) {
//   //           case 'NOT_REGISTERED':
//   //             this.loginMessage =
//   //               'Google account is not registered in the system.';
//   //             break;

//   //           case 'LOCKED':
//   //             this.loginMessage = message || 'Account is locked.';
//   //             break;

//   //           case 'INVALID_TOKEN':
//   //             this.loginMessage = 'Invalid login session. Please try again.';
//   //             break;

//   //           default:
//   //             this.loginMessage = message || 'Login failed. Please try again.';
//   //         }
//   //       });
//   //     },
//   //   );
//   // }
//   handleGoogleLogin(response: any): void {
//   // 1. Enter Angular Zone immediately so change detection picks up state changes
//   this.ngZone.run(() => {
//     this.isSubmitting = true;
//     this.loginMessage = '';

//     const token = response.credential;

//     this.settingsService.googleLogin(token).subscribe({
//       next: (res: any) => {
//         localStorage.setItem('Email', res.email);
//         localStorage.setItem('fullName', res.fullName);
//         localStorage.setItem('userRole', res.role);
//         this.userService.setAuthData(res.role);

//         switch (res.role) {
//           case 'Admin':
//             this.router.navigate([
//               '/adminito',
//               { outlets: { secondary: ['itoadmindashboard'] } },
//             ]);
//             break;

//           case 'Agent':
//             this.router.navigate(['/ito']);
//             break;

//           case 'COS':
//           case 'Regular':
//             this.router.navigate(['/main']);
//             break;

//           case 'SPMO':
//             this.router.navigate(['/adminspmo']);
//             break;

//           default:
//             this.loginMessage = 'Role not assigned or invalid role.';
//         }

//         this.isSubmitting = false;
//       },

//       error: (error: any) => {
//         const code = error?.error?.code;
//         const message = error?.error?.message;

//         switch (code) {
//           case 'NOT_REGISTERED':
//             this.loginMessage = 'Google account is not registered in the system.';
//             break;

//           case 'LOCKED':
//             this.loginMessage = message || 'Account is locked.';
//             break;

//           case 'INVALID_TOKEN':
//             this.loginMessage = 'Invalid login session. Please try again.';
//             break;

//           default:
//             this.loginMessage = message || 'Login failed. Please try again.';
//         }

//         this.isSubmitting = false;
//       },
//     });
//   });
// }
//   goToRegister() {
//     this.isSubmitting = true;

//     setTimeout(() => {
//       this.router.navigate(['/pages-register']);
//     }, 800); // 800ms delay
//   }

//   goToForgot() {
//     this.isSubmitting = true;

//     setTimeout(() => {
//       this.router.navigate(['/forgot-password']);
//     }, 800); // 800ms delay
//   }
// }

import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/UserServices/user.service';
import { SettingsService } from '../../../../services/UserServices/settings.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy, OnInit {
  // Variables for login form
  Email: string = '';
  password: string = '';
  loginMessage: string = '';
  showPassword: boolean = false;
  isSubmitting: boolean = false;
  maxAttempts: number = 5;
  failedAttempts: number = 0;
  countdownInterval: any;
  countdownMinutes: number = 0;
  countdownSeconds: number = 0;

  // Network & Google SDK states
  isOnline: boolean = navigator.onLine;
  googleLoadError: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
    private settingsService: SettingsService,
  ) {}

  get now(): number {
    return Date.now();
  }

  ngOnInit(): void {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);

    this.initGoogleSignIn();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  }

  private updateOnlineStatus = (): void => {
    this.ngZone.run(() => {
      this.isOnline = navigator.onLine;
      if (this.isOnline) {
        this.initGoogleSignIn();
      }
    });
  };

  initGoogleSignIn(): void {
    if (!this.isOnline) return;

    this.settingsService.getGoogleClientId().subscribe({
      next: (res: any) => {
        if (typeof google !== 'undefined' && google?.accounts?.id) {
          try {
            google.accounts.id.initialize({
              client_id: res.clientId,
              callback: (response: any) => {
                this.handleGoogleLogin(response);
              },
            });

            const googleBtn = document.getElementById('googleBtn');
            if (googleBtn) {
              google.accounts.id.renderButton(googleBtn, {
                theme: 'outline',
                size: 'large',
                width: 250,
              });
            }
            this.googleLoadError = false;
          } catch (err) {
            this.googleLoadError = true;
          }
        } else {
          this.googleLoadError = true;
        }
      },
      error: () => {
        this.googleLoadError = true;
      },
    });
  }

  onLogin(): void {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.loginMessage = '';

    const Email = this.Email.trim();
    const password = this.password.trim();

    if (!Email || !password) {
      this.loginMessage = 'Please enter both username and password.';
      this.isSubmitting = false;
      return;
    }

    this.userService.login(Email, password).subscribe({
      next: (response) => {
        localStorage.setItem('Email', Email);
        localStorage.setItem('fullName', response.fullName);
        localStorage.setItem('userRole', response.role);

        this.failedAttempts = 0;

        switch (response.role) {
          case 'Admin':
            this.router.navigate([
              '/adminito',
              { outlets: { secondary: ['itoadmindashboard'] } },
            ]);
            break;

          case 'Agent':
            this.router.navigate(['/ito']);
            break;

          case 'COS':
          case 'Student':
          case 'Regular':
            this.router.navigate(['/main']);
            break;

          case 'SPMO':
            this.router.navigate(['/adminspmo']);
            break;

          default:
            this.loginMessage = 'Role not assigned or invalid role.';
        }

        this.isSubmitting = false;
      },

      error: (error) => {
        this.loginMessage =
          error.error?.message || 'Login failed. Please try again.';

        this.isSubmitting = false;
      },
    });
  }

  handleGoogleLogin(response: any): void {
    this.ngZone.run(() => {
      this.isSubmitting = true;
      this.loginMessage = '';

      const token = response.credential;

      this.settingsService.googleLogin(token).subscribe({
        next: (res: any) => {
          localStorage.setItem('Email', res.email);
          localStorage.setItem('fullName', res.fullName);
          localStorage.setItem('userRole', res.role);
          this.userService.setAuthData(res.role);

          switch (res.role) {
            case 'Admin':
              this.router.navigate([
                '/adminito',
                { outlets: { secondary: ['itoadmindashboard'] } },
              ]);
              break;

            case 'Agent':
              this.router.navigate(['/ito']);
              break;

            case 'COS':
            case 'Regular':
              this.router.navigate(['/main']);
              break;

            case 'SPMO':
              this.router.navigate(['/adminspmo']);
              break;

            default:
              this.loginMessage = 'Role not assigned or invalid role.';
          }

          this.isSubmitting = false;
        },

        error: (error: any) => {
          const code = error?.error?.code;
          const message = error?.error?.message;

          switch (code) {
            case 'NOT_REGISTERED':
              this.loginMessage =
                'Google account is not registered in the system.';
              break;

            case 'LOCKED':
              this.loginMessage = message || 'Account is locked.';
              break;

            case 'INVALID_TOKEN':
              this.loginMessage = 'Invalid login session. Please try again.';
              break;

            default:
              this.loginMessage = message || 'Login failed. Please try again.';
          }

          this.isSubmitting = false;
        },
      });
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.isSubmitting = true;

    setTimeout(() => {
      this.router.navigate(['/pages-register']);
    }, 800);
  }

  goToForgot() {
    this.isSubmitting = true;

    setTimeout(() => {
      this.router.navigate(['/forgot-password']);
    }, 800);
  }
}