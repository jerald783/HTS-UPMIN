import { Component } from '@angular/core';

@Component({
  selector: 'app-pm-log-container',
  standalone: false,
  templateUrl: './pm-log-container.component.html',
  styleUrls: ['./pm-log-container.component.scss']
})
export class PmLogContainerComponent {
  currentView: 'list' | 'form' = 'list';
  activeLogId: number = 0;

  openLogForm(id: number): void {
    this.activeLogId = id;
    this.currentView = 'form';
  }

  openNewForm(): void {
    this.activeLogId = 0;
    this.currentView = 'form';
  }

  showSavedList(): void {
    this.currentView = 'list';
  }
}