import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmailService } from '../../../../services/notification-services/email.service';
import { UserService } from '../../../../services/UserServices/user.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pages-register',
  standalone: false,
  templateUrl: './pages-register.component.html',
  styleUrl: './pages-register.component.scss',
})
export class PagesRegisterComponent implements OnInit {
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

  // FEEDBACK STATE FOR OTP MODAL
  otpErrorMessage: string = '';
  otpSuccessMessage: string = '';

  // VALIDATION
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@up\\.edu\\.ph$';

  passwordPattern: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';

  roles: { id: number; name: string }[] = [];
  otpDigits: string[] = ['', '', '', '', '', ''];

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private emailverificationService: EmailService,
  ) {}

  // ====================================
  // INIT
  // ====================================
  ngOnInit(): void {
    this.loadAllowedRoles();
  }

  get otp(): string {
    return this.otpDigits.join('');
  }

  // ====================================
  // PASSWORD CRITERIA CHECKERS FOR TEMPLATE
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

  // Add this helper method to keep DOM elements anchored to their index
  trackByIndex(index: number, item: any): number {
    return index;
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
  // OTP INPUT HANDLERS
  // ====================================
  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Numeric only

    if (value.length > 1) {
      value = value.slice(-1); // Keep only the last character typed
    }

    input.value = value;
    this.otpDigits[index] = value;
    
    // Clear error message when user starts typing again
    this.otpErrorMessage = '';

    // Auto-verify if all 6 digits are populated
    this.checkAndAutoVerify();
  }

  onOtpKeyUp(event: KeyboardEvent, index: number): void {
    // Safe keys that shouldn't trigger forward movement
    if (event.key === 'Backspace' || event.key === 'Shift' || event.key === 'Tab') {
      return;
    }

    // Only move focus forward during the keyup phase if a value exists
    if (this.otpDigits[index] && index < this.otpDigits.length - 1) {
      this.otpBoxes.toArray()[index + 1].nativeElement.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      this.otpErrorMessage = ''; // Reset inline error on backspace
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
    // 1. Get the pasted data from the clipboard
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text').trim();

    // 2. Filter out non-numeric characters and limit to 6 digits
    const numbersOnly = pastedText.replace(/\D/g, '').slice(0, this.otpDigits.length);

    if (numbersOnly.length > 0) {
      this.otpErrorMessage = '';

      // 3. Distribute the numbers across the array slots
      for (let i = 0; i < this.otpDigits.length; i++) {
        this.otpDigits[i] = numbersOnly[i] || '';
      }

      // 4. Prevent the browser's default single-box paste behavior
      event.preventDefault();

      // 5. Shift focus to the target box
      const targetIndex = Math.min(numbersOnly.length, this.otpDigits.length - 1);
      setTimeout(() => {
        const boxesArray = this.otpBoxes.toArray();
        if (boxesArray[targetIndex]) {
          boxesArray[targetIndex].nativeElement.focus();
        }
      }, 0);

      // 6. Check for automatic verification on paste
      this.checkAndAutoVerify();
    }
  }

  // ====================================
  // AUTO-VERIFICATION TRIGGER
  // ====================================
  checkAndAutoVerify(): void {
    if (this.otp.length === 6 && !this.isLoading) {
      this.verifyAndRegister();
    }
  }

  // ====================================
  // LOAD SAFE ROLES ONLY
  // ====================================
  loadAllowedRoles(): void {
    this.userService.getRoleId().subscribe({
      next: (roles) => {
        // ONLY USER ROLES
        const allowedRoles = [3, 4, 6];

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

    // CLEAN INPUTS
    this.FullName = this.FullName.trim();
    this.Email = this.Email.trim().toLowerCase();

    // VALIDATE
    if (!this.validateForm()) {
      return;
    }

    // STEP 1 -> SEND OTP
    if (!this.showOtp) {
      this.sendVerificationCode();
      return;
    }

    // STEP 2 -> VERIFY + REGISTER
    this.verifyAndRegister();
  }

  // ====================================
  // VALIDATE FORM
  // ====================================
  validateForm(): boolean {
    // FULL NAME
    if (!this.FullName || this.FullName.length < 3) {
      this.toastr.error('Enter valid full name');
      return false;
    }

    // EMAIL
    const emailRegex = new RegExp(this.emailPattern);

    if (!emailRegex.test(this.Email)) {
      this.toastr.error('Use valid UP email');
      return false;
    }

    // PASSWORD
    const passwordRegex = new RegExp(this.passwordPattern);

    if (!passwordRegex.test(this.password)) {
      this.toastr.error(
        'Password must contain uppercase, lowercase, number, special character, and minimum 8 characters',
      );

      return false;
    }

    // MATCH PASSWORD
    if (this.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return false;
    }

    // OTP VALIDATION
    if (this.showOtp) {
      if (!this.otp || this.otp.trim().length !== 6) {
        this.otpErrorMessage = 'Please enter valid 6-digit verification code.';
        // this.toastr.error('Enter valid 6-digit verification code');
        return false;
      }
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
          // this.toastr.success('Verification code sent to your UP email');

          // Auto focus first OTP input box after modal opens
          setTimeout(() => {
            this.otpBoxes?.first?.nativeElement.focus();
          }, 100);
        },

        error: () => {
          // DO NOT DISCLOSE IF EMAIL EXISTS
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

    // NEVER TRUST FRONTEND ROLE
    // FORCE SAFE ROLE
    const SAFE_ROLE_ID = [3, 4, 6].includes(this.RoleId) ? this.RoleId : 3;

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
          // this.toastr.success('Registration successful');

          // Give user 1.2s to see the green success banner inside the modal before navigating
          setTimeout(() => {
            this.clearForm();
            this.router.navigate(['/login']);
          }, 1200);
        },

        error: (err) => {
          const errorMessage = err?.error?.message || 'Invalid verification code. Please check and try again.';
          
          this.otpErrorMessage = errorMessage;
          this.toastr.error(errorMessage);

          // Reset OTP digits and re-focus first input box
          this.otpDigits = ['', '', '', '', '', ''];
          setTimeout(() => {
            this.otpBoxes?.first?.nativeElement.focus();
          }, 100);
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
  // 1. Add these properties to your class declarations
resendCountdown: number = 0;
private resendTimer: any;

// 2. Add the resendOtp() method
resendOtp(): void {
  if (this.resendCountdown > 0 || this.isLoading) return;

  // Clear previous timer if any
  if (this.resendTimer) clearInterval(this.resendTimer);

  // Trigger your existing method to resend email
  this.sendVerificationCode();

  // Start 60-second cooldown
  this.resendCountdown = 60;
  this.resendTimer = setInterval(() => {
    this.resendCountdown--;
    if (this.resendCountdown <= 0) {
      clearInterval(this.resendTimer);
    }
  }, 1000);
}

// 3. Clean up timer when component gets destroyed to prevent memory leaks
ngOnDestroy(): void {
  if (this.resendTimer) {
    clearInterval(this.resendTimer);
  }
}
}