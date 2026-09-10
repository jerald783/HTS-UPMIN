
/* =========================
   IMPORTS
========================= */
import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { UserService } from '../../../../../services/UserServices/user.service';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../../../../services/notification-services/email.service';
import { finalize } from 'rxjs/operators';

/* =========================
   COMPONENT
========================= */
@Component({
  selector: 'app-add-edit-reg',
  standalone: false,
  templateUrl: './add-edit-reg.component.html',
  styleUrl: './add-edit-reg.component.scss',
})
export class AddEditRegComponent implements OnInit, OnDestroy {
  @Input() events: any;

  @ViewChildren('otpBox')
  otpBoxes!: QueryList<ElementRef>;

  UserId: number | undefined;

  FullName: string = '';
  Email: string = '';
  password: string = '';
  confirmPassword: string = '';

  RoleId!: number;

  showOtp: boolean = false;
  isLoading: boolean = false;

  // FEEDBACK STATE FOR OTP SECTION
  otpErrorMessage: string = '';
  otpSuccessMessage: string = '';

  // RESEND TIMER STATE
  resendCountdown: number = 0;
  private resendTimer: any;

  // 6-DIGIT OTP ARRAY
  otpDigits: string[] = ['', '', '', '', '', ''];

  // =========================
  // VALIDATION PATTERNS
  // =========================
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@up\\.edu\\.ph$';

  passwordPattern: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

  roles: { id: number; name: string }[] = [];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private emailverificationService: EmailService,
  ) {}

  // ====================================
  // INIT & DESTROY
  // ====================================
  ngOnInit(): void {
    if (this.events) {
      this.UserId = this.events.UserId;
      this.FullName = this.events.FullName || '';
      this.Email = this.events.Email || '';
      this.RoleId = this.events.RoleId || 4;

      this.password = '';
      this.confirmPassword = '';
      this.showOtp = false;
    }

    this.loadAllowedRoles();
  }

  ngOnDestroy(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
    }
  }

  // ====================================
  // MODAL CONTROL
  // ====================================
  closeOtpModal(): void {
    this.showOtp = false;
    this.otpErrorMessage = '';
    this.otpSuccessMessage = '';
    this.otpDigits = ['', '', '', '', '', ''];
  }

  // ====================================
  // COMPUTED PROPERTIES & HELPERS
  // ====================================
  get otp(): string {
    return this.otpDigits.join('');
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

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

  // ====================================
  // OTP INPUT HANDLERS
  // ====================================
  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 1) {
      value = value.slice(-1);
    }

    input.value = value;
    this.otpDigits[index] = value;

    this.otpErrorMessage = '';
    this.checkAndAutoVerify();
  }

  onOtpKeyUp(event: KeyboardEvent, index: number): void {
    if (
      event.key === 'Backspace' ||
      event.key === 'Shift' ||
      event.key === 'Tab'
    ) {
      return;
    }

    if (this.otpDigits[index] && index < this.otpDigits.length - 1) {
      this.otpBoxes.toArray()[index + 1].nativeElement.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      this.otpErrorMessage = '';
      if (input.value) {
        input.value = '';
        this.otpDigits[index] = '';
      } else if (index > 0) {
        const prev = this.otpBoxes.toArray()[index - 1].nativeElement as HTMLInputElement;
        prev.focus();
        prev.value = '';
        this.otpDigits[index - 1] = '';
      }
      event.preventDefault();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text').trim();
    const numbersOnly = pastedText.replace(/\D/g, '').slice(0, this.otpDigits.length);

    if (numbersOnly.length > 0) {
      this.otpErrorMessage = '';

      for (let i = 0; i < this.otpDigits.length; i++) {
        this.otpDigits[i] = numbersOnly[i] || '';
      }

      event.preventDefault();

      const targetIndex = Math.min(numbersOnly.length, this.otpDigits.length - 1);
      setTimeout(() => {
        const boxesArray = this.otpBoxes.toArray();
        if (boxesArray[targetIndex]) {
          boxesArray[targetIndex].nativeElement.focus();
        }
      }, 0);

      this.checkAndAutoVerify();
    }
  }

  checkAndAutoVerify(): void {
    if (this.otp.length === 6 && !this.isLoading && !this.UserId) {
      this.verifyAndRegister();
    }
  }

  // ====================================
  // RESEND OTP
  // ====================================
  resendOtp(): void {
    if (this.resendCountdown > 0 || this.isLoading) return;

    if (this.resendTimer) clearInterval(this.resendTimer);

    this.sendVerificationCode();

    this.resendCountdown = 60;
    this.resendTimer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.resendTimer);
      }
    }, 1000);
  }

  // ====================================
  // LOAD ROLES
  // ====================================
  loadAllowedRoles(): void {
    this.userService.getRoleId().subscribe({
      next: (roles) => {
        const allowedRoles = [1, 2, 3, 4,5,6];
        this.roles = roles.filter((role: any) =>
          allowedRoles.includes(role.id),
        );
      },
      error: () => {
        this.toastr.error('Unable to load roles');
      },
    });
  }

  // ====================================
  // MAIN SUBMIT
  // ====================================
  onSubmit(): void {
    if (this.isLoading) return;

    this.FullName = this.FullName.trim();
    this.Email = this.Email.trim().toLowerCase();

    if (!this.validateForm()) {
      return;
    }

    if (this.UserId) {
      this.updateUser();
      return;
    }

    if (!this.showOtp) {
      this.sendVerificationCode();
      return;
    }

    this.verifyAndRegister();
  }

  // ====================================
  // VALIDATE FORM
  // ====================================
  validateForm(): boolean {
    if (!this.FullName || this.FullName.length < 3) {
      this.toastr.error('Enter valid full name');
      return false;
    }

    const emailRegex = new RegExp(this.emailPattern);
    if (!emailRegex.test(this.Email)) {
      this.toastr.error('Use valid UP email');
      return false;
    }

    if (!this.UserId || this.password.length > 0) {
      const passwordRegex = new RegExp(this.passwordPattern);

      if (!passwordRegex.test(this.password)) {
        this.toastr.error(
          'Password must contain uppercase, lowercase, number, special character, and minimum 8 characters',
        );
        return false;
      }

      if (this.password !== this.confirmPassword) {
        this.toastr.error('Passwords do not match');
        return false;
      }
    }

    if (!this.UserId && this.showOtp) {
      if (!this.otp || this.otp.trim().length !== 6) {
        this.otpErrorMessage = 'Please enter complete 6-digit verification code.';
        return false;
      }
    }

    if (!this.RoleId) {
      this.toastr.error('Please select role');
      return false;
    }

    return true;
  }

  // ====================================
  // SEND EMAIL VERIFICATION
  // ====================================
  sendVerificationCode(): void {
    this.isLoading = true;
    this.otpErrorMessage = '';
    this.otpSuccessMessage = '';

    const payload = {
      email: this.Email,
    };

    this.emailverificationService
      .sendVerification(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.showOtp = true;
          this.otpDigits = ['', '', '', '', '', ''];

          setTimeout(() => {
            this.otpBoxes?.first?.nativeElement.focus();
          }, 100);
        },
        error: () => {
          this.toastr.error('Unable to process request');
        },
      });
  }

  // ====================================
  // VERIFY OTP + REGISTER
  // ====================================
  verifyAndRegister(): void {
    if (this.otp.length < 6) {
      this.otpErrorMessage = 'Please enter complete 6-digit verification code.';
      return;
    }

    this.isLoading = true;
    this.otpErrorMessage = '';
    this.otpSuccessMessage = '';

    const SAFE_ROLE_ID = [1, 2, 3, 4, 5, 6].includes(this.RoleId) ? this.RoleId : 4;

    const user = {
      FullName: this.FullName,
      Email: this.Email,
      Password: this.password,
      Otp: this.otp,
      RoleId: SAFE_ROLE_ID,
    };

    this.emailverificationService
      .verifyAndRegister(user)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.otpSuccessMessage = 'Valid OTP! Registration successful.';

          setTimeout(() => {
            this.clearForm();
          }, 1200);
        },
        error: (err) => {
          const errorMessage = err?.error?.message || 'Invalid verification code. Please check and try again.';
          this.otpErrorMessage = errorMessage;

          this.otpDigits = ['', '', '', '', '', ''];
          setTimeout(() => {
            this.otpBoxes?.first?.nativeElement.focus();
          }, 100);
        },
      });
  }

  // ====================================
  // UPDATE USER
  // ====================================
  // updateUser(): void {
  //   this.isLoading = true;

  //   const payload = {
  //     FullName: this.FullName,
  //     Email: this.Email,
  //     RoleId: this.RoleId,
  //   };

  //   this.userService
  //     .updateUser(this.UserId!, payload)
  //     .pipe(finalize(() => (this.isLoading = false)))
  //     .subscribe({
  //       next: () => {
  //         this.toastr.success('User updated successfully');
  //         this.clearForm();
  //       },
  //       error: (err) => {
  //         this.toastr.error(err.error?.message || 'Update failed');
  //       },
  //     });
  // }
updateUser(): void {
  this.isLoading = true;

  const payload: any = {
    FullName: this.FullName,
    Email: this.Email,
    RoleId: this.RoleId,
  };

  // Only attach Password if provided (e.g., when resetting/changing password)
  if (this.password && this.password.trim().length > 0) {
    payload.Password = this.password;
  }

  this.userService
    .updateUser(this.UserId!, payload)
    .pipe(finalize(() => (this.isLoading = false)))
    .subscribe({
      next: () => {
        this.toastr.success('User updated successfully');
        this.clearForm();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Update failed');
      },
    });
}
  // ====================================
  // CLEAR FORM
  // ====================================
  clearForm(): void {
    this.UserId = undefined;

    this.FullName = '';
    this.Email = '';
    this.password = '';
    this.confirmPassword = '';
    this.otpDigits = ['', '', '', '', '', ''];

    this.RoleId = 3;

    this.showOtp = false;
    this.isLoading = false;
    this.otpErrorMessage = '';
    this.otpSuccessMessage = '';
  }
}




