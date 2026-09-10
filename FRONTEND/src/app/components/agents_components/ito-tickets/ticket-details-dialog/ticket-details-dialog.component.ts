import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from '../../../../../services/UserServices/ticket.service';

@Component({
  selector: 'app-ticket-details-dialog',
  templateUrl: './ticket-details-dialog.component.html',
  styleUrls: ['./ticket-details-dialog.component.scss'],
  standalone: false,
})
export class TicketDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TicketDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private signalRService: TicketService,
    private tICKET: TicketService,
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  viewFile(fileName: string) {
    const url = this.tICKET.getTicketFile(fileName);
    window.open(url, '_blank');
  }
}
