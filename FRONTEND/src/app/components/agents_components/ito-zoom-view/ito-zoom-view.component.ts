
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdmZoomScheduleService } from '../../../../services/UserServices/zoom-schedule.service';

export interface Holiday {
  name: string;
  type: 'Regular Holiday' | 'Special Non-Working' | 'Tentative Holiday';
  isHoliday: boolean;
}

@Component({
  selector: 'app-agent-zoom-view',
  standalone: false,
  templateUrl: './ito-zoom-view.component.html',
  styleUrl: './ito-zoom-view.component.scss',
})
export class AgentZoomViewComponent implements OnInit {
  showCreateForm = false;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days: number[] = [];
  selectedDate = '';
  schedules: any[] = [];
  allEvents: any[] = [];
  calendarEvents: { [date: string]: any[] } = {};

  // 🔍 Status Filter: 'All' | 'Pending' | 'Approved' | 'Rejected'
  selectedStatusFilter: string = 'All';

  // 📅 Date Scope Filter: 'month' | 'year' | 'allTime'
  dateScopeFilter: 'month' | 'year' | 'allTime' = 'month';

  // Storage for static and dynamic holiday mappings: "YYYY-MM-DD" -> Holiday[]
  holidaysMap: { [date: string]: Holiday[] } = {};

  viewMode: 'month' | 'day' = 'month';

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();

  // 👁️ Pure Tailwind View Schedule Modal State
  isViewModalOpen = false;
  selectedSchedule: any = null;
  attachmentUrl: SafeResourceUrl | null = null;
  rawAttachmentBlob: Blob | null = null;
  rawAttachmentUrl: string | null = null;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(
    private zoomService: AdmZoomScheduleService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.generateDays();
    this.loadHolidaysForYear(this.currentYear);
    this.loadSchedules();

    this.zoomService.startConnection().then(() => {
      this.zoomService.ZoomScheduleAdded$.subscribe((z) => {
        if (z) this.loadSchedules();
      });
    });
  }

  // -------------------------------
  // 🇵🇭 Holiday Helper Engine
  // -------------------------------
  loadHolidaysForYear(year: number) {
    this.holidaysMap = {};

    const fixedHolidays: { [key: string]: { name: string; type: Holiday['type'] } } = {
      '01-01': { name: "New Year's Day", type: 'Regular Holiday' },
      '04-09': { name: 'Day of Valor (Araw ng Kagitingan)', type: 'Regular Holiday' },
      '05-01': { name: 'Labor Day', type: 'Regular Holiday' },
      '06-12': { name: 'Independence Day', type: 'Regular Holiday' },
      '08-21': { name: 'Ninoy Aquino Day', type: 'Special Non-Working' },
      '11-01': { name: "All Saints' Day", type: 'Special Non-Working' },
      '11-02': { name: "All Souls' Day", type: 'Special Non-Working' },
      '11-30': { name: 'Bonifacio Day', type: 'Regular Holiday' },
      '12-08': { name: 'Feast of the Immaculate Conception', type: 'Special Non-Working' },
      '12-25': { name: 'Christmas Day', type: 'Regular Holiday' },
      '12-30': { name: 'Rizal Day', type: 'Regular Holiday' },
      '12-31': { name: 'Last Day of the Year', type: 'Special Non-Working' }
    };

    Object.entries(fixedHolidays).forEach(([mmdd, h]) => {
      const dateKey = `${year}-${mmdd}`;
      this.addHolidayToMap(dateKey, h.name, h.type);
    });

    const easter = this.getEasterDate(year);
    
    const maundy = new Date(easter);
    maundy.setDate(easter.getDate() - 3);
    this.addHolidayToMap(this.formatDateKey(maundy), 'Maundy Thursday', 'Regular Holiday');

    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    this.addHolidayToMap(this.formatDateKey(goodFriday), 'Good Friday', 'Regular Holiday');

    const blackSat = new Date(easter);
    blackSat.setDate(easter.getDate() - 1);
    this.addHolidayToMap(this.formatDateKey(blackSat), 'Black Saturday', 'Special Non-Working');

    this.addHolidayToMap(`${year}-03-31`, 'Eid al-Fitr (Tentative)', 'Tentative Holiday');
    this.addHolidayToMap(`${year}-06-06`, 'Eid al-Adha (Tentative)', 'Tentative Holiday');
  }

  private addHolidayToMap(dateKey: string, name: string, type: Holiday['type']) {
    if (!this.holidaysMap[dateKey]) {
      this.holidaysMap[dateKey] = [];
    }
    this.holidaysMap[dateKey].push({ name, type, isHoliday: true });
  }

  private formatDateKey(d: Date): string {
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  }

  private getEasterDate(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const L = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * L) / 451);
    const month = Math.floor((h + L - 7 * m + 114) / 31) - 1;
    const day = ((h + L - 7 * m + 114) % 31) + 1;
    return new Date(year, month, day);
  }

  getHolidaysForDay(day: number): Holiday[] {
    if (!day) return [];
    return this.holidaysMap[this.getDateForDay(day)] || [];
  }

  getEvents(day: number): any[] {
    if (!day) return [];
    const dateKey = this.getDateForDay(day);
    let schedules = this.calendarEvents[dateKey] || [];

    // Filter day cell badges by selected status filter
    if (this.selectedStatusFilter !== 'All') {
      schedules = schedules.filter(
        (s) => (s.Status || '').toLowerCase() === this.selectedStatusFilter.toLowerCase()
      );
    }

    const holidays = this.holidaysMap[dateKey] || [];
    const holidayEvents = holidays.map(h => ({
      ActivityName: `${h.type === 'Tentative Holiday' ? '⏳' : '🎉'} ${h.name}`,
      isHoliday: true,
      holidayType: h.type
    }));

    return [...holidayEvents, ...schedules];
  }

  onScheduleSaved(startDate: string): void {
    this.closeCreateModal();
    const start = new Date(startDate);
    this.currentYear = start.getFullYear();
    this.currentMonth = start.getMonth();

    this.loadHolidaysForYear(this.currentYear);
    this.generateDays();
    this.loadSchedules();
    this.selectDate(start.getDate());
  }

  closeCreateModal(): void {
    this.closeModal();
  }

  generateDays() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(
      this.currentYear,
      this.currentMonth + 1,
      0,
    ).getDate();

    const startOffset = firstDay;
    this.days = [];

    for (let i = 0; i < startOffset; i++) {
      this.days.push(0);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(i);
    }
  }

  getDateForDay(day: number): string {
    return `${this.currentYear}-${(this.currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

getMonthRange() {
  const start = new Date(this.currentYear, this.currentMonth, 1);
  const end = new Date(this.currentYear, this.currentMonth + 1, 0); // Gets last day of currentMonth

  // Format using local date values to prevent UTC timezone shifts from .toISOString()
  const formatISO = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

  return { 
    startStr: formatISO(start), 
    endStr: formatISO(end) 
  };
}

  loadSchedules(): void {
    this.zoomService.getZoomSchedules().subscribe((res) => {
      this.allEvents = res;
      this.buildCalendarEvents();
      this.updateScheduleList();
    });
  }

  buildCalendarEvents(): void {
    this.calendarEvents = {};
    this.allEvents.forEach((event) => {
      const start = new Date(event.StartDate || event.startDate);
      const end = new Date(event.EndDate || event.endDate);
      let current = new Date(start);

      while (current <= end) {
        if (current.getFullYear() === this.currentYear && current.getMonth() === this.currentMonth) {
          const key = current.toISOString().split('T')[0];
          if (!this.calendarEvents[key]) this.calendarEvents[key] = [];
          this.calendarEvents[key].push(event);
        }
        current.setDate(current.getDate() + 1);
      }
    });
  }

  // -------------------------------
  // 🔘 Filter Handlers
  // -------------------------------
  onStatusFilterChange(status: string) {
    this.selectedStatusFilter = status;
    this.updateScheduleList();
  }

  onDateScopeChange(scope: 'month' | 'year' | 'allTime') {
    this.dateScopeFilter = scope;
    if (scope === 'year' || scope === 'allTime') {
      this.viewMode = 'month';
    }
    this.updateScheduleList();
  }

  // -------------------------------
  // 🔄 Update Schedule List (Date Scope + Status Filters)
  // -------------------------------
  updateScheduleList() {
    let filtered = [...this.allEvents];

    // 1. Date Scope Filtering
    if (this.viewMode === 'day' && this.selectedDate) {
      filtered = filtered.filter(
        (e) =>
          this.selectedDate >= (e.StartDate || e.startDate) &&
          this.selectedDate <= (e.EndDate || e.endDate)
      );
    } else if (this.dateScopeFilter === 'month') {
      const { startStr, endStr } = this.getMonthRange();
      filtered = filtered.filter(
        (e) =>
          (e.StartDate || e.startDate) <= endStr &&
          (e.EndDate || e.endDate) >= startStr
      );
    } else if (this.dateScopeFilter === 'year') {
      const yearStart = `${this.currentYear}-01-01`;
      const yearEnd = `${this.currentYear}-12-31`;
      filtered = filtered.filter(
        (e) =>
          (e.StartDate || e.startDate) <= yearEnd &&
          (e.EndDate || e.endDate) >= yearStart
      );
    }

    // 2. Status Filtering ('Pending' | 'Approved' | 'Rejected' | 'All')
    if (this.selectedStatusFilter !== 'All') {
      filtered = filtered.filter(
        (e) => (e.Status || '').toLowerCase() === this.selectedStatusFilter.toLowerCase()
      );
    }

    this.schedules = filtered;
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.resetToMonthView();
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.resetToMonthView();
  }

  private resetToMonthView(): void {
    this.loadHolidaysForYear(this.currentYear);
    this.generateDays();
    this.buildCalendarEvents();
    this.viewMode = 'month';
    this.selectedDate = '';
    this.updateScheduleList();
  }

  selectDate(day: number): void {
    this.viewMode = 'day';
    this.selectedDate = this.getDateForDay(day);
    this.updateScheduleList();
  }

  showMonthSchedules(): void {
    this.viewMode = 'month';
    this.selectedDate = '';
    this.updateScheduleList();
  }

  updateStatus(schedule: any, newStatus: string): void {
    schedule.Status = newStatus;
    this.zoomService.updateZoomScheduleStatus(schedule.Id, newStatus).subscribe(() => {
      this.loadSchedules();
    });
  }

  // -------------------------------
  // 👁️ Pure Tailwind View Schedule Modal & Attachment Handling
  // -------------------------------
  viewSchedule(schedule: any): void {
    this.zoomService.getZoomScheduleById(schedule.Id).subscribe((res: any) => {
      this.selectedSchedule = res[0] || schedule;

      // Reset attachment state
      this.clearAttachmentState();

      const fileName = this.getFileName();
      if (fileName) {
        this.zoomService.getAttachment(fileName).subscribe({
          next: (blob: Blob) => {
            this.rawAttachmentBlob = blob;
            this.rawAttachmentUrl = URL.createObjectURL(blob);
            this.attachmentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawAttachmentUrl);
          },
          error: (err) => {
            console.error('❌ Failed to load attachment:', err);
            this.clearAttachmentState();
          }
        });
      }

      this.isViewModalOpen = true;
    });
  }

  closeModal(): void {
    this.isViewModalOpen = false;
    this.selectedSchedule = null;
    this.clearAttachmentState();
  }

  hasAttachment(): boolean {
    return !!this.getFileName();
  }

  private getFileName(): string | null {
    if (!this.selectedSchedule) return null;
    return (
      this.selectedSchedule.ConfigFile ||
      this.selectedSchedule.configFile ||
      this.selectedSchedule.AttachmentPath ||
      this.selectedSchedule.FilePath ||
      null
    );
  }

  private clearAttachmentState(): void {
    this.attachmentUrl = null;
    if (this.rawAttachmentUrl) {
      URL.revokeObjectURL(this.rawAttachmentUrl);
      this.rawAttachmentUrl = null;
    }
    this.rawAttachmentBlob = null;
  }

  downloadAttachment(): void {
    const fileName = this.getFileName();
    if (!this.rawAttachmentUrl || !fileName) return;

    const link = document.createElement('a');
    link.href = this.rawAttachmentUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewAttachmentFullScreen(): void {
    const fileName = this.getFileName();
    if (this.rawAttachmentUrl) {
      window.open(this.rawAttachmentUrl, '_blank');
    } else if (fileName) {
      this.zoomService.getAttachment(fileName).subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: () => alert('Attachment file not found or failed to load.')
      });
    }
  }

  getPickerDateString(): string {
    if (this.selectedDate) {
      return this.selectedDate;
    }
    const day = '01';
    const month = (this.currentMonth + 1).toString().padStart(2, '0');
    return `${this.currentYear}-${month}-${day}`;
  }

onDatePickerChange(newDateStr: string) {
  if (!newDateStr) return;

  // Handles 'YYYY-MM-DD' safely without UTC timezone offset
  const [yearStr, monthStr] = newDateStr.split('-');
  const parsedYear = parseInt(yearStr, 10);
  const parsedMonth = parseInt(monthStr, 10) - 1;

  if (isNaN(parsedYear) || isNaN(parsedMonth)) return;

  this.currentYear = parsedYear;
  this.currentMonth = parsedMonth;

  this.loadHolidaysForYear(this.currentYear);
  this.generateDays();
  this.buildCalendarEvents();

  // Set modes to 'month' so updateScheduleList filters from 1st to last day
  this.viewMode = 'month';
  this.dateScopeFilter = 'month';
  this.selectedDate = newDateStr;

  this.updateScheduleList();
}

  downloadCSV(): void {
    if (!this.schedules || this.schedules.length === 0) return;

    const headers = [
      'Activity Name', 'Setup Type', 'Description', 'Start Date',
      'End Date', 'Start Time', 'End Time', 'Status',
      'Requester Name', 'Requester Email', 'Additional Details'
    ];

    const rows = this.schedules.map(s => [
      `"${(s.ActivityName || '').replace(/"/g, '""')}"`,
      `"${(s.SetupType || '').replace(/"/g, '""')}"`,
      `"${(s.ZoomDescription || '').replace(/"/g, '""')}"`,
      `"${s.StartDate || ''}"`,
      `"${s.EndDate || ''}"`,
      `"${s.TimeStart || ''}"`,
      `"${s.TimeEnd || ''}"`,
      `"${s.Status || ''}"`,
      `"${(s.RequesterName || '').replace(/"/g, '""')}"`,
      `"${(s.RequesterEmail || '').replace(/"/g, '""')}"`,
      `"${(s.AdditionalDetails || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const statusSuffix = this.selectedStatusFilter !== 'All' ? `_${this.selectedStatusFilter}` : '';
    const scopeSuffix = `_${this.dateScopeFilter}`;
    const filename = `zoom_schedules_${this.selectedDate || this.currentYear}${scopeSuffix}${statusSuffix}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}