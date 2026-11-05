import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SavedPmLogHeader, ItoPmsLogService } from '../../../../services/UserServices/ito-pms-log.service';

@Component({
  selector: 'app-ito-pms-list',
  standalone: false,
  templateUrl: './ito-pms-list.component.html',
  styleUrls: ['./ito-pms-list.component.scss']
})
export class ItoPmsListComponent implements OnInit {
  savedLogs: SavedPmLogHeader[] = [];
  filteredLogs: SavedPmLogHeader[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';

  @Output() selectLog = new EventEmitter<number>();
  @Output() createNew = new EventEmitter<void>();

  constructor(private pmsLogService: ItoPmsLogService) {}

  ngOnInit(): void {
    this.loadAllSavedLogs();
  }

  loadAllSavedLogs(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.pmsLogService.getAllLogs().subscribe({
      next: (data) => {
        this.savedLogs = data;
        this.filteredLogs = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching logs:', err);
        this.errorMessage = 'Unable to connect to database or fetch saved logs.';
        this.isLoading = false;
      }
    });
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) {
      this.filteredLogs = this.savedLogs;
      return;
    }

    this.filteredLogs = this.savedLogs.filter(log =>
      (log.DocumentCode && log.DocumentCode.toLowerCase().includes(term)) ||
      (log.Department && log.Department.toLowerCase().includes(term)) ||
      (log.BuildingRoom && log.BuildingRoom.toLowerCase().includes(term)) ||
      (log.Custodian && log.Custodian.toLowerCase().includes(term)) ||
      (log.TechName && log.TechName.toLowerCase().includes(term))
    );
  }

  viewForm(id: number): void {
    this.selectLog.emit(id);
  }

  createNewForm(): void {
    this.createNew.emit();
  }

  deleteForm(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete log record #${id}?`)) {
      this.pmsLogService.deleteLog(id).subscribe({
        next: () => {
          this.loadAllSavedLogs();
        },
        error: (err) => alert(`Error deleting record: ${err.message || 'Server error'}`)
      });
    }
  }
}