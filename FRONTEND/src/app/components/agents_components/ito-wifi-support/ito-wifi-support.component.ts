import { Component, OnInit, ViewChild } from '@angular/core';
import { WifiSupportRequestService } from '../../../../services/UserServices/wifi-support-request.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TicketEmailService } from '../../../../services/notification-services/ticket-email.service';

@Component({
  selector: 'app-ito-wifi-support',
  standalone: false,
  templateUrl: './ito-wifi-support.component.html',
  styleUrl: './ito-wifi-support.component.scss',
})
export class ItoWifiSupportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  supportRequests: any[] = [];
  showModal: boolean = false;
  
  // Custom Delete Modal State Vars
  showDeleteModal: boolean = false;
  requestIdToDelete: number | null = null;

  dataSource = new MatTableDataSource<any>();
  emailPattern: string = '^[a-zA-Z0-9._%+-]+@up\\.edu\\.ph$';
  usernamePattern: string = '^[a-zA-Z0-9._%+-]+@upmin\\.edu\\.ph$';
  isEditMode: boolean = false;
  request: any = {
    name: '',
    upEmail: '',
    requestDate: '',
    category: '',
    courseDept: '',
    concern: '',
    status: 'Pending',
    username: '',
    password: '',
    dateResolved: '',
    notes: '',
  };
  concernOptions: string[] = ['No Credential', "Can't Connect", 'Reactivation'];

  categoryOptions: string[] = ['Project Staff', 'Faculty', 'Student'];

  statusOptions: string[] = ['Resolved', 'Unresolved'];
  constructor(
    private supportService: WifiSupportRequestService,
    private ticketEmailService: TicketEmailService,
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(value: string) {
    const filterValue = value.trim().toLowerCase();

    this.dataSource.filter = filterValue;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  generatePassword(): string {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    let chars = [];

    for (let i = 0; i < 3; i++) {
      chars.push(letters.charAt(Math.floor(Math.random() * letters.length)));
    }

    for (let i = 0; i < 3; i++) {
      chars.push(numbers.charAt(Math.floor(Math.random() * numbers.length)));
    }

    // Shuffle
    chars = chars.sort(() => Math.random() - 0.5);

    return chars.join('');
  }
  // =========================================================
  // LOAD REQUESTS
  // =========================================================
  loadRequests(): void {
    this.supportService.getAllSupportRequests().subscribe({
      next: (res) => {
        this.dataSource.data = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // =========================================================
  // EDIT REQUEST
  // =========================================================
  editRequest(item: any): void {
    this.request = {
      ...item,
    };
  }

  // =========================================================
  // DELETE REQUEST TRIPPERS & HANDLERS
  // =========================================================
  deleteRequest(id: number): void {
    this.requestIdToDelete = id;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.requestIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.requestIdToDelete === null) return;

    this.supportService.deleteSupportRequest(this.requestIdToDelete).subscribe({
      next: (res) => {
        console.log(res);
        this.loadRequests();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================
  openAddModal(): void {
    this.isEditMode = false;

    this.request = {
      name: '',
      upEmail: '',
      requestDate: '',
      category: '',
      courseDept: '',
      concern: '',
      status: 'Pending',
      username: '',
      password: this.generatePassword(),
      dateResolved: '',
      notes: '',
    };

    this.showModal = true;
  }

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================
  openEditModal(item: any): void {
    this.isEditMode = true;

    this.request = {
      ...item,
    };

    this.showModal = true;
  }

  // =========================================================
  // CLOSE MODAL
  // =========================================================
  closeModal(): void {
    this.showModal = false;
  }

  // =========================================================
  // AFTER SAVE
  // =========================================================
  addRequest(): void {
    if (!this.validateForm()) {
      return;
    }

    this.supportService.addSupportRequest(this.request).subscribe({
      next: (res) => {
        console.log(res);
        this.ticketEmailService.sendUserCredentialsEmail({
          name: this.request.name,
          email: this.request.upEmail,
          username: this.request.username,
          password: this.request.password,
        });
        this.loadRequests();

        this.closeModal();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  // =========================================================
  // AFTER UPDATE
  // =========================================================
updateRequest(): void {
  if (!this.validateForm()) {
    return;
  }

  this.supportService
    .updateSupportRequest(this.request.id, this.request)
    .subscribe({
      next: (res) => { // <-- Change 'box' to 'next' here
        console.log(res);

        this.loadRequests();

        this.closeModal();
      },
      error: (err) => {
        console.log(err);
      },
    });
}
  validateForm(): boolean {
    if (!this.request.name?.trim()) {
      alert('Name is required');
      return false;
    }

    if (!this.request.upEmail?.trim()) {
      alert('UP Email is required');
      return false;
    }

    const emailRegex = new RegExp(this.emailPattern);

    if (!emailRegex.test(this.request.upEmail)) {
      alert('Invalid UP Email');
      return false;
    }

    if (!this.request.requestDate) {
      alert('Date is required');
      return false;
    }

    if (!this.request.category) {
      alert('Category is required');
      return false;
    }

    if (!this.request.courseDept?.trim()) {
      alert('Course/Department is required');
      return false;
    }

    if (!this.request.concern) {
      alert('Concern is required');
      return false;
    }

    if (!this.request.password?.trim()) {
      alert('Password is required');
      return false;
    }

    if (this.request.password.length < 6) {
      alert('Password must be at least 6 characters');
      return false;
    }

    if (this.request.username) {
      const usernameRegex = new RegExp(this.usernamePattern);

      if (!usernameRegex.test(this.request.username)) {
        alert('Username must be valid UPMin email');
        return false;
      }
    }

    return true;
  }
}