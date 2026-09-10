// import { Component, Input, OnInit, input } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import emailjs from 'emailjs-com';

// import { ToastrService } from 'ngx-toastr';
// import { AdmAssetsService } from '../../../../../services/adminServices/adm-assets.service';
// import { TicketEmailService } from '../../../../../services/notification-services/ticket-email.service';
// import { ExtraFieldService } from '../../../../../services/UserServices/extra-field.service';
// import { TicketService } from '../../../../../services/UserServices/ticket.service';

// // import { EmailService } from '../../../../services/UserServices/email.service';
// import { FeedbackService } from '../../../../../services/UserServices/feedback.service';

// @Component({
//   selector: 'app-create-ticket',
//   standalone: false,
//   templateUrl: './create-ticket.component.html',
//   styleUrl: './create-ticket.component.scss',
// })
// export class CreateTicketComponent implements OnInit {
//   selectedFiles: File[] = [];
//   @Input() inv: any;
//   Id: string | undefined;
//   PropNo: string | undefined;
//   PropList: any = [];
//   Email: string | null = '';
//   fullName: string | null = '';
//   isSubmitted = false;
//   extraFields: any[] = [];
//   incidentForm: FormGroup;
//   email: string | null = null;

//   pendingFeedbackCount = 0;
// canCreateTicket = true;
//   constructor(
//     private fb: FormBuilder,
//     private service: AdmAssetsService,
//     private TicketSer: TicketService,
//     private toastr: ToastrService,
//     // private mailService: EmailService,
//     private ticketEmailService: TicketEmailService,
//     private extraFieldService: ExtraFieldService,
//       private feedbackService: FeedbackService
//   ) {
//     const today = new Date().toISOString().split('T')[0];

//     this.incidentForm = this.fb.group({
//       fullName: [{ value: '', disabled: false }, Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       incidentDate: [today, Validators.required],
//       details: ['', [Validators.required, Validators.minLength(10)]],
//       ticketNumber: ['', Validators.required],
//       PropNo: [null, Validators.required],
//       location: [null, Validators.required],
//       HelpTopic: [null, Validators.required],
//       PriorityLevel: [null, Validators.required],
//     });
//   }
//   ngOnInit(): void {
//     this.loadPropList();
//     this.generateTicketNumber();
//     this.loadExtraFields();
//     this.checkFeedbackLimit();
//     this.Email = localStorage.getItem('Email');
//     if (this.Email) {
//       this.incidentForm.get('email')?.setValue(this.Email);
//     }

//     this.fullName = localStorage.getItem('fullName');
//     if (this.fullName) {
//       this.incidentForm.get('fullName')?.setValue(this.fullName);
//     }
//     //   console.log('✅ fullName from localStorage:', this.fullName);
//     // console.log('✅ form value after patch:', this.incidentForm.value);
//   }
//   HelpTopic = [
//     'Information System',
//     'PPO Technical Supprot',
//     'Technical Support',
//     'Technical Support / Access Issue',
//     'Hardware Issue',
//     'Software Issue',
//     'Internet/ WIFI',
//     'Printing and Coppying',
//   ];
//   PriorityLevel = ['High', 'Medium', 'Low'];
//   Location: string[] = [
//     'OC',
//     'GAD',
//     'HRMO',
//     'PPO',
//     'OVCAD',
//     'OVCAA',
//     'OSA',
//     'Accounting',
//     'HRDO',
//     'COA',
//     'CPDO',
//     'OAEX',
//     'LEGAL OFFICE',
//     'SOM',
//     'OUR',
//   ];
//   get f() {
//     return this.incidentForm.controls;
//   }
//   addTickets() {
//     const form = this.incidentForm.value;

//     const extraData: any = {};

//     this.extraFields.forEach((field: any) => {
//       extraData[field.FieldName] = form[field.FieldName];
//     });

//     const formData = new FormData();
//     formData.append('TicketNumber', form.ticketNumber);
//     formData.append('PropNo', form.PropNo);
//     formData.append('FullName', form.fullName);
//     formData.append('Email', form.email);
//     formData.append('HelpTopic', form.HelpTopic);
//     formData.append('IssueDesc', form.details);
//     formData.append('Location', form.location);
//     formData.append('PriorityLevel', form.PriorityLevel);
//     formData.append('CurrentStatus', 'Pending');
//     formData.append('AgentAssigned', '');
//     formData.append('ExtraFields', JSON.stringify(extraData)); // ⭐ HERE

//     this.selectedFiles.forEach((file) =>
//       formData.append('Files', file, file.name),
//     );

//     this.TicketSer.addTicketWithFiles(formData).subscribe({
//       next: () => {
//         this.toastr.success('Ticket submitted successfully!', 'Success');

//         // send email
//         this.ticketEmailService.sendTicketNotification(form).subscribe();

//         this.incidentForm.reset();
//         this.selectedFiles = [];
//         this.generateTicketNumber();
//       },

//       error: (err) => {
//         console.error('❌ Error submitting ticket:', err);
//         this.toastr.error('Failed to submit ticket.', 'Error');
//       },
//     });
//   }
//   selectedLocation: string = '';
//   ticketNumber: string = '';

//   generateTicketNumber(): void {
//     const prefix = 'TICKET';
//     const random = Math.floor(100000 + Math.random() * 900000);
//     const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
//     this.ticketNumber = `${prefix}-${datePart}-${random}`;
//     this.incidentForm.get('ticketNumber')?.setValue(this.ticketNumber);
//   }

//   // submitForm() {
//   //   this.isSubmitted = true;
//   //   if (this.incidentForm.invalid) {
//   //     this.incidentForm.markAllAsTouched(); // 🔥 KEY FIX

//   //     this.toastr.error(
//   //       'Please complete all required fields.',
//   //       'Form Incomplete',
//   //     );
//   //     return;
//   //   }

//   //   this.addTickets();
//   // }
//   submitForm() {

//   if (!this.canCreateTicket) {
//     this.toastr.error(
//       'You must complete your pending feedback forms before creating another ticket.',
//       'Ticket Creation Blocked'
//     );
//     return;
//   }

//   this.isSubmitted = true;

//   if (this.incidentForm.invalid) {
//     this.incidentForm.markAllAsTouched();

//     this.toastr.error(
//       'Please complete all required fields.',
//       'Form Incomplete'
//     );
//     return;
//   }

//   this.addTickets();
// }
//   loadPropList() {
//     const loggedInEmail = localStorage.getItem('Email');

//     if (!loggedInEmail) {
//       console.error('❌ No username found in localStorage.');
//       return;
//     }

//     this.service.getAssetsByUser(loggedInEmail).subscribe((data: any) => {
//       this.PropList = data;

//       if (this.inv) {
//         this.PropNo = this.inv.PropNo;
//       } else {
//         console.warn('⚠️ this.inv is undefined.');
//       }
//     });
//   }

//   onFileSelected(event: any) {
//     if (event.target.files && event.target.files.length > 0) {
//       this.selectedFiles = Array.from(event.target.files);
//     } else {
//       this.selectedFiles = [];
//     }
//   }

//   loadExtraFields() {
//     this.extraFieldService.getFields().subscribe((res: any) => {
//       this.extraFields = res;

//       res.forEach((field: any) => {
//         this.incidentForm.addControl(
//           field.FieldName,
//           field.IsRequired
//             ? this.fb.control('', Validators.required)
//             : this.fb.control(''),
//         );
//       });
//     });  
// }
// checkFeedbackLimit() {
//   const email = localStorage.getItem('Email');

//   if (!email) return;

//   this.TicketSer.getTicketByUser(email).subscribe((tickets: any[]) => {
//     this.feedbackService.getFeedbackByUser(email).subscribe((feedbacks: any[]) => {

//       const feedbackTicketNumbers = feedbacks.map(
//         (f) => f.TicketNumber
//       );

//       const resolvedWithoutFeedback = tickets.filter(
//         (t) =>
//           t.CurrentStatus?.toLowerCase() === 'resolved' &&
//           !feedbackTicketNumbers.includes(t.TicketNumber)
//       );

//       this.pendingFeedbackCount = resolvedWithoutFeedback.length;
//       this.canCreateTicket = this.pendingFeedbackCount < 3;

//       if (!this.canCreateTicket) {
//         this.toastr.warning(
//           'You have 3 unresolved feedback forms. Please submit feedback before creating a new ticket.',
//           'Feedback Required'
//         );
//       }
//     });
//   });
// }
// }
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdmAssetsService } from '../../../../../services/adminServices/adm-assets.service';
import { TicketEmailService } from '../../../../../services/notification-services/ticket-email.service';
import { ExtraFieldService } from '../../../../../services/UserServices/extra-field.service';
import { TicketService } from '../../../../../services/UserServices/ticket.service';
import { FeedbackService } from '../../../../../services/UserServices/feedback.service';
import { UserService } from '../../../../../services/UserServices/user.service';

@Component({
  selector: 'app-create-ticket',
  standalone: false,
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent implements OnInit {
  selectedFiles: File[] = [];
  @Input() inv: any;
  Id: string | undefined;
  PropNo: string | undefined;
  PropList: any = [];
  Email: string | null = '';
  fullName: string | null = '';
  isSubmitted = false;
  extraFields: any[] = [];
  incidentForm: FormGroup;
  email: string | null = null;

  pendingFeedbackCount = 0;
  canCreateTicket = true;

  // Track whether current user is a student
  isStudent = false;

  // Program options list for students
  ProgramList: string[] = ['CHSS', 'SOMED', 'SOM', 'CSM'];

  constructor(
    private fb: FormBuilder,
    private service: AdmAssetsService,
    private TicketSer: TicketService,
    private toastr: ToastrService,
    private ticketEmailService: TicketEmailService,
    private extraFieldService: ExtraFieldService,
    private feedbackService: FeedbackService,
    private userService: UserService
  ) {
    const today = new Date().toISOString().split('T')[0];

    this.incidentForm = this.fb.group({
      fullName: [{ value: '', disabled: false }, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      incidentDate: [today, Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
      ticketNumber: ['', Validators.required],
      PropNo: [null, Validators.required],
      location: [null, Validators.required],
      HelpTopic: [null, Validators.required],
      PriorityLevel: [null, Validators.required],
    });
  }

// ngOnInit(): void {
//   // Determine user role
//   const userRole = this.userService.getUserRole();
//   this.isStudent = userRole?.toLowerCase() === 'student';

//   // Apply dynamic validation based on role
//   this.applyRoleValidators();

//   if (!this.isStudent) {
//     this.loadPropList();
//   }

//   this.generateTicketNumber();
//   this.loadExtraFields();
//   this.checkFeedbackLimit();

//   this.Email = this.userService.getUserEmail();
//   if (this.Email) {
//     this.incidentForm.get('email')?.setValue(this.Email);
//   }

//   this.fullName = localStorage.getItem('fullName');
//   if (this.fullName) {
//     this.incidentForm.get('fullName')?.setValue(this.fullName);
//   }
// }
ngOnInit(): void {
  // Determine user role
  const userRole = this.userService.getUserRole();
  this.isStudent = userRole?.toLowerCase() === 'student';

  this.applyRoleValidators();

  if (!this.isStudent) {
    this.loadPropList();
    this.loadExtraFields(); // Load extra fields ONLY for non-students
  }

  this.generateTicketNumber();
  this.checkFeedbackLimit();

  this.Email = this.userService.getUserEmail();
  if (this.Email) {
    this.incidentForm.get('email')?.setValue(this.Email);
  }

  this.fullName = localStorage.getItem('fullName');
  if (this.fullName) {
    this.incidentForm.get('fullName')?.setValue(this.fullName);
  }
}
applyRoleValidators(): void {
  const locationControl = this.incidentForm.get('location');

  if (this.isStudent) {
    // If location/unit is only for non-students, clear its required validator
    locationControl?.clearValidators();
  } else {
    // Keep it required for non-students
    locationControl?.setValidators([Validators.required]);
  }

  // Update validation status after altering rules
  locationControl?.updateValueAndValidity();
}

  HelpTopic = [
    'Information System',
    'PPO Technical Supprot',
    'Technical Support',
    'Technical Support / Access Issue',
    'Hardware Issue',
    'Software Issue',
    'Internet/ WIFI',
    'Printing and Coppying',
  ];

  CSRSList = [
    'CSRS - Computerized System for Research and Services',
    'CSRS - Computerized System for Research and Services / Access Issue',
  ];

  PriorityLevel = ['High', 'Medium', 'Low'];

  Location: string[] = [
    'OC',
    'GAD',
    'HRMO',
    'PPO',
    'OVCAD',
    'OVCAA',
    'OSA',
    'Accounting',
    'HRDO',
    'COA',
    'CPDO',
    'OAEX',
    'LEGAL OFFICE',
    'SOM',
    'OUR',
  ];

  CourseList: string[] = ['BSIT', 'BSCS'];

  get f() {
    return this.incidentForm.controls;
  }

  addTickets() {
    const form = this.incidentForm.value;
    const extraData: any = {};

    this.extraFields.forEach((field: any) => {
      extraData[field.FieldName] = form[field.FieldName];
    });

    const formData = new FormData();
    formData.append('TicketNumber', form.ticketNumber);
    formData.append('PropNo', form.PropNo);
    formData.append('FullName', form.fullName);
    formData.append('Email', form.email);
    formData.append('HelpTopic', form.HelpTopic);
    formData.append('IssueDesc', form.details);
    formData.append('Location', form.location);
    formData.append('PriorityLevel', form.PriorityLevel);
    formData.append('CurrentStatus', 'Pending');
    formData.append('AgentAssigned', '');
    formData.append('ExtraFields', JSON.stringify(extraData));

    this.selectedFiles.forEach((file) =>
      formData.append('Files', file, file.name)
    );

    this.TicketSer.addTicketWithFiles(formData).subscribe({
      next: () => {
        this.toastr.success('Ticket submitted successfully!', 'Success');

        this.ticketEmailService.sendTicketNotification(form).subscribe();

        this.incidentForm.reset();
        this.selectedFiles = [];
        this.generateTicketNumber();
      },
      error: (err) => {
        console.error('❌ Error submitting ticket:', err);
        this.toastr.error('Failed to submit ticket.', 'Error');
      },
    });
  }

  selectedLocation: string = '';
  ticketNumber: string = '';

  generateTicketNumber(): void {
    const prefix = 'TICKET';
    const random = Math.floor(100000 + Math.random() * 900000);
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    this.ticketNumber = `${prefix}-${datePart}-${random}`;
    this.incidentForm.get('ticketNumber')?.setValue(this.ticketNumber);
  }

  submitForm() {
    if (!this.canCreateTicket) {
      this.toastr.error(
        'You must complete your pending feedback forms before creating another ticket.',
        'Ticket Creation Blocked'
      );
      return;
    }

    this.isSubmitted = true;

    if (this.incidentForm.invalid) {
      this.incidentForm.markAllAsTouched();
      this.toastr.error(
        'Please complete all required fields.',
        'Form Incomplete'
      );
      return;
    }

    this.addTickets();
  }

  loadPropList() {
    const loggedInEmail = this.userService.getUserEmail();

    if (!loggedInEmail) {
      console.error('❌ No user email found.');
      return;
    }

    this.service.getAssetsByUser(loggedInEmail).subscribe((data: any) => {
      this.PropList = data;

      if (this.inv) {
        this.PropNo = this.inv.PropNo;
      } else {
        console.warn('⚠️ this.inv is undefined.');
      }
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    } else {
      this.selectedFiles = [];
    }
  }

  loadExtraFields() {
    this.extraFieldService.getFields().subscribe((res: any) => {
      this.extraFields = res;

      res.forEach((field: any) => {
        this.incidentForm.addControl(
          field.FieldName,
          field.IsRequired
            ? this.fb.control('', Validators.required)
            : this.fb.control('')
        );
      });
    });
  }

  checkFeedbackLimit() {
    const email = this.userService.getUserEmail();

    if (!email) return;

    this.TicketSer.getTicketByUser(email).subscribe((tickets: any[]) => {
      this.feedbackService
        .getFeedbackByUser(email)
        .subscribe((feedbacks: any[]) => {
          const feedbackTicketNumbers = feedbacks.map((f) => f.TicketNumber);

          const resolvedWithoutFeedback = tickets.filter(
            (t) =>
              t.CurrentStatus?.toLowerCase() === 'resolved' &&
              !feedbackTicketNumbers.includes(t.TicketNumber)
          );

          this.pendingFeedbackCount = resolvedWithoutFeedback.length;
          this.canCreateTicket = this.pendingFeedbackCount < 3;

          if (!this.canCreateTicket) {
            this.toastr.warning(
              'You have 3 unresolved feedback forms. Please submit feedback before creating a new ticket.',
              'Feedback Required'
            );
          }
        });
    });
  }
}