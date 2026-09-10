// import { Component, Inject } from '@angular/core';
// import { TicketDetailsDialogComponent } from '../../../../agents_components/ito-tickets/ticket-details-dialog/ticket-details-dialog.component';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { TicketService } from '../../../../../../services/UserServices/ticket.service';

// @Component({
//   selector: 'app-view-ticket-details-dialog',
//   standalone: false,
//   templateUrl: './view-ticket-details-dialog.component.html',
//   styleUrl: './view-ticket-details-dialog.component.scss',
// })
// export class ViewTicketDetailsDialogComponent {
//   constructor(
//     private tICKET: TicketService,
//     public dialogRef: MatDialogRef<TicketDetailsDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//   ) {}

//   close(): void {
//     this.dialogRef.close();
//   }
//   viewFile(fileName: string) {
//     const url = this.tICKET.getTicketFile(fileName);
//     window.open(url, '_blank');
//   }
  
// }
import { Component, Inject, OnInit } from '@angular/core';
import { TicketDetailsDialogComponent } from '../../../../agents_components/ito-tickets/ticket-details-dialog/ticket-details-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from '../../../../../../services/UserServices/ticket.service';
import { UserService } from '../../../../../../services/UserServices/user.service';

@Component({
  selector: 'app-view-ticket-details-dialog',
  standalone: false,
  templateUrl: './view-ticket-details-dialog.component.html',
  styleUrl: './view-ticket-details-dialog.component.scss',
})
export class ViewTicketDetailsDialogComponent implements OnInit {
  isStudent = false;
  parsedExtraFields: { key: string; value: any }[] = [];

  constructor(
    private tICKET: TicketService,
    private userService: UserService,
    public dialogRef: MatDialogRef<TicketDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const role = this.data?.Role || this.data?.UserRole || this.userService.getUserRole();
    this.isStudent = role?.toLowerCase() === 'student';

    // Parse extra fields if available and user is NOT a student
    if (!this.isStudent && this.data?.ExtraFields) {
      try {
        const fieldsObj = typeof this.data.ExtraFields === 'string' 
          ? JSON.parse(this.data.ExtraFields) 
          : this.data.ExtraFields;

        this.parsedExtraFields = Object.keys(fieldsObj).map((key) => ({
          key,
          value: fieldsObj[key],
        }));
      } catch (e) {
        console.error('Error parsing ExtraFields:', e);
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  viewFile(fileName: string) {
    const url = this.tICKET.getTicketFile(fileName);
    window.open(url, '_blank');
  }
}