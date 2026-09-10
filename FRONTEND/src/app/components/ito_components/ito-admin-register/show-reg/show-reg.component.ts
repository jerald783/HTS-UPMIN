// import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
// import { MatTableDataSource } from '@angular/material/table';
// import { UserService } from '../../../../../services/UserServices/user.service';

// @Component({
//   selector: 'app-show-reg',
//   standalone: false,
//   templateUrl: './show-reg.component.html',
//   styleUrl: './show-reg.component.scss',
// })
// export class ShowRegComponent implements OnInit, AfterViewInit {
//   dataSource = new MatTableDataSource<any>();
//   displayedColumns: string[] = ['FullName', 'Email', 'Actions'];
//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;
//   @ViewChild('openModalBtn') openModalBtn: any;

//   ModalTitle: string | undefined;
//   ActivateAddEditRegComp: boolean = false;
//   events: any;

//   constructor(private userservices: UserService) {}

//   ngOnInit(): void {
//     this.refreshUserList();
//   }

//   ngAfterViewInit(): void {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   refreshUserList(): void {
//     this.userservices.getAllUser().subscribe((data) => {
//       this.dataSource.data = data.sort((a, b) => b.UserId - a.UserId);
//       this.dataSource.paginator = this.paginator;
//       this.dataSource.sort = this.sort;
//     });
//   }

//   addClick() {
//     this.events = {
//       UserId: 0,
//       FullName: '',
//       Email: '',
//       Password: '',
//       RoleId: 2,
//     };

//     this.ActivateAddEditRegComp = true;
//   }

//   closeClick() {
//     this.ActivateAddEditRegComp = false;
//     this.ngOnInit();
//   }
//   applyFilter(event: Event) {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();
//   }
//   editClick(element: any) {
//     this.events = {
//       UserId: element.UserId,
//       FullName: element.FullName,
//       Email: element.Email,
//       Password: element.Password,
//       RoleId: element.RoleId,
//     };

//     this.ActivateAddEditRegComp = true;

//     setTimeout(() => {
//       this.openModalBtn.nativeElement.click();
//     }, 0);
//   }
//   deleteClick(user: any) {
//     if (!user?.UserId) {
//       alert('Invalid user ID');
//       return;
//     }

//     if (!confirm(`Are you sure you want to delete ${user.FullName}?`)) return;

//     this.userservices.deleteUser(Number(user.UserId)).subscribe({
//       next: () => {
//         alert('User deleted successfully');
//         this.refreshUserList();
//       },
//       error: (err) => {
//         console.error('DELETE ERROR:', err);
//         alert(err.error?.message || 'Failed to delete user');
//       },
//     });
//   }
// }
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../../../../services/UserServices/user.service';

@Component({
  selector: 'app-show-reg',
  standalone: false,
  templateUrl: './show-reg.component.html',
  styleUrl: './show-reg.component.scss',
})
export class ShowRegComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['FullName', 'Email', 'Actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('openModalBtn') openModalBtn: any;

  ModalTitle: string | undefined;
  ActivateAddEditRegComp: boolean = false;
  events: any;

  // Delete Modal State
  isDeleteModalOpen: boolean = false;
  selectedUserForDelete: any = null;

  constructor(private userservices: UserService) {}

  ngOnInit(): void {
    this.refreshUserList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refreshUserList(): void {
    this.userservices.getAllUser().subscribe((data) => {
      this.dataSource.data = data.sort((a, b) => b.UserId - a.UserId);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addClick() {
    this.events = {
      UserId: 0,
      FullName: '',
      Email: '',
      Password: '',
      RoleId: 2,
    };

    this.ActivateAddEditRegComp = true;
  }

  closeClick() {
    this.ActivateAddEditRegComp = false;
    this.ngOnInit();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editClick(element: any) {
    this.events = {
      UserId: element.UserId,
      FullName: element.FullName,
      Email: element.Email,
      Password: element.Password,
      RoleId: element.RoleId,
    };

    this.ActivateAddEditRegComp = true;

    setTimeout(() => {
      this.openModalBtn.nativeElement.click();
    }, 0);
  }

  // Triggers the modal instead of browser confirm dialog
  deleteClick(user: any) {
    if (!user?.UserId) {
      alert('Invalid user ID');
      return;
    }
    this.selectedUserForDelete = user;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedUserForDelete = null;
  }

  confirmDelete() {
    if (!this.selectedUserForDelete?.UserId) return;

    this.userservices.deleteUser(Number(this.selectedUserForDelete.UserId)).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.refreshUserList();
      },
      error: (err) => {
        console.error('DELETE ERROR:', err);
        alert(err.error?.message || 'Failed to delete user');
        this.closeDeleteModal();
      },
    });
  }
}