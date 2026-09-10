import { Component, OnInit } from '@angular/core';
import { AdmZoomScheduleService } from '../../../../services/UserServices/zoom-schedule.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ZoomEmailService } from '../../../../services/notification-services/zoom-email.service';
import { ApproveZoomEmailService } from '../../../../services/notification-services/approve-zoom-email.service';

export interface Holiday {
  name: string;
  type: 'Regular Holiday' | 'Special Non-Working' | 'Tentative Holiday';
  isHoliday: boolean;
}

@Component({
  selector: 'app-ito-admin-zoomrequest',
  standalone: false,
  templateUrl: './ito-admin-zoomrequest.component.html',
  styleUrl: './ito-admin-zoomrequest.component.scss',
})
export class ItoAdminZoomrequestComponent implements OnInit {
  showCreateForm = false;
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  days: number[] = [];
  selectedDate = '';
  schedules: any[] = [];
  allEvents: any[] = [];
  calendarEvents: { [date: string]: any[] } = {};

  // Status & Date Scope Filters
  selectedStatusFilter: string = 'All';
  dateScopeFilter: 'month' | 'year' | 'allTime' = 'month';

  holidaysMap: { [date: string]: Holiday[] } = {};
  viewMode: 'month' | 'day' = 'month';

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // 🛑 Status Change Confirmation Modal State
  isConfirmModalOpen = false;
  pendingStatusChange: { schedule: any; targetStatus: string } | null = null;
  modalActionType: 'Approved' | 'Rejected' | 'Pending' = 'Approved';

  // 👁️ View Schedule Details Modal State
  isViewModalOpen = false;
  selectedSchedule: any = null;
  attachmentUrl: SafeResourceUrl | null = null;
  rawAttachmentBlob: Blob | null = null;
  rawAttachmentUrl: string | null = null;

  constructor(
    private zoomService: AdmZoomScheduleService,
    private sanitizer: DomSanitizer,
    private zoomEmailService: ApproveZoomEmailService,
  ) {}

  ngOnInit(): void {
    this.generateDays();
    this.loadHolidaysForYear(this.currentYear);
    this.loadSchedules();

    // SignalR real-time updates
    this.zoomService.startConnection().then(() => {
      this.zoomService.ZoomScheduleAdded$.subscribe((z) => {
        if (z) {
          this.loadSchedules();
        }
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

  getEvents(day: number) {
    if (!day) return [];
    const dateKey = this.getDateForDay(day);
    let schedules = this.calendarEvents[dateKey] || [];

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

  generateDays() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
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
    return `${this.currentYear}-${(this.currentMonth + 1)
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
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

  loadSchedules() {
    this.zoomService.getZoomSchedules().subscribe((res) => {
      this.allEvents = res;
      this.buildCalendarEvents();
      this.updateScheduleList();
    });
  }

  buildCalendarEvents() {
    this.calendarEvents = {};

    this.allEvents.forEach((event) => {
      const start = new Date(event.StartDate || event.startDate);
      const end = new Date(event.EndDate || event.endDate);
      const current = new Date(start);

      while (current <= end) {
        if (
          current.getFullYear() === this.currentYear &&
          current.getMonth() === this.currentMonth
        ) {
          const key = current.toISOString().split('T')[0];
          if (!this.calendarEvents[key]) {
            this.calendarEvents[key] = [];
          }
          this.calendarEvents[key].push(event);
        }
        current.setDate(current.getDate() + 1);
      }
    });
  }

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

  updateScheduleList() {
    let filtered = [...this.allEvents];

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

    if (this.selectedStatusFilter !== 'All') {
      filtered = filtered.filter(
        (e) => (e.Status || '').toLowerCase() === this.selectedStatusFilter.toLowerCase()
      );
    }

    this.schedules = filtered;
  }

  selectDate(day: number) {
    if (!day) return;
    this.viewMode = 'day';
    this.selectedDate = this.getDateForDay(day);
    this.updateScheduleList();
  }

  showMonthSchedules() {
    this.viewMode = 'month';
    this.selectedDate = '';
    this.updateScheduleList();
  }

  // -------------------------------
  // 🛑 Status Selection Interceptor
  // -------------------------------
  onStatusSelectChange(schedule: any, event: Event) {
    const selectElem = event.target as HTMLSelectElement;
    const targetStatus = selectElem.value;

    if (schedule.Status === targetStatus) return;

    // Reset dropdown visually until user clicks Proceed
    selectElem.value = schedule.Status;

    this.pendingStatusChange = { schedule, targetStatus };
    this.modalActionType = targetStatus as 'Approved' | 'Rejected' | 'Pending';
    this.isConfirmModalOpen = true;
  }

  confirmStatusChange() {
    if (!this.pendingStatusChange) return;

    const { schedule, targetStatus } = this.pendingStatusChange;
    this.updateStatus(schedule, targetStatus);

    this.cancelStatusChange();
  }

  cancelStatusChange() {
    this.isConfirmModalOpen = false;
    this.pendingStatusChange = null;
  }

updateStatus(schedule: any, newStatus: string) {
  const currentStatus = schedule.Status || schedule.status;
  if (currentStatus?.toLowerCase() === newStatus?.toLowerCase()) return;

  const scheduleId = schedule.Id || schedule.id;

  this.zoomService
    .updateZoomScheduleStatus(scheduleId, newStatus)
    .subscribe({
      next: () => {
        // 1. Update status locally across properties
        schedule.Status = newStatus;
        if (schedule.status !== undefined) {
          schedule.status = newStatus;
        }

        // 2. Refresh Calendar and List views
        this.buildCalendarEvents();
        this.updateScheduleList();

        // 3. Extract recipient email safely
        let recipientEmail =
          schedule.RequesterEmail ||
          schedule.requesterEmail ||
          schedule.Email ||
          schedule.email;

        // ----------------------------------------------------
        // Helper function to send email & log detailed errors
        // ----------------------------------------------------
        const triggerEmailDispatch = (targetSchedule: any) => {
          console.log(`✉️ Dispatching email notification for status [${newStatus}] to: ${recipientEmail}`);

          this.zoomEmailService
            .sendStatusEmail(targetSchedule, newStatus)
            .subscribe({
              next: (response) => {
                console.log(`✅ [SUCCESS] Email sent for status [${newStatus}]:`, response);
              },
              error: (emailErr) => {
                // 🛑 CRITICAL ERROR LOGGING FOR APPROVED / REJECTED / PENDING
                console.error(`❌ [EMAIL ERROR - ${newStatus.toUpperCase()}] Failed to send email to ${recipientEmail}!`);
                console.error(`📋 Target Schedule ID:`, scheduleId);
                console.error(`🔴 Raw Error Details:`, emailErr);

                if (emailErr.status) {
                  console.error(`🌐 HTTP Status Code: ${emailErr.status} - ${emailErr.statusText}`);
                }
                if (emailErr.error) {
                  console.error(`📄 Server Response Payload:`, emailErr.error);
                }
              },
            });
        };

        // 4. Handle email triggering or fallback fetch
        const targetStatuses = ['approved', 'rejected', 'pending'];
        if (targetStatuses.includes(newStatus.toLowerCase())) {

          if (!recipientEmail) {
            console.warn(`⚠️ [WARNING - ${newStatus.toUpperCase()}] Missing recipient email on summary object. Fetching full schedule details...`);

            // Fallback: Fetch complete schedule object by ID if email field was omitted in list
            this.zoomService.getZoomScheduleById(scheduleId).subscribe({
              next: (res: any) => {
                const fullSchedule = Array.isArray(res) ? res[0] : res;
                recipientEmail =
                  fullSchedule?.RequesterEmail ||
                  fullSchedule?.requesterEmail ||
                  fullSchedule?.Email ||
                  fullSchedule?.email;

                if (!recipientEmail) {
                  console.error(`❌ [EMAIL ERROR - ${newStatus.toUpperCase()}] Failed to send email! No valid email address found even after fetching full details for Schedule ID: ${scheduleId}`);
                  return;
                }

                triggerEmailDispatch(fullSchedule);
              },
              error: (fetchErr) => {
                console.error(`❌ [FETCH ERROR - ${newStatus.toUpperCase()}] Could not fetch details for Schedule ID: ${scheduleId}`, fetchErr);
              }
            });
          } else {
            // Email address is already present on the schedule object
            triggerEmailDispatch(schedule);
          }
        }
      },
      error: (statusErr) => {
        console.error(`❌ [STATUS UPDATE ERROR] Failed to update status to [${newStatus}] for Schedule ID: ${scheduleId}`, statusErr);
      },
    });
}

  // -------------------------------
  // 👁️ View Schedule Details Modal & Attachment Preview Handler
  // -------------------------------
  viewSchedule(schedule: any) {
    this.zoomService.getZoomScheduleById(schedule.Id).subscribe((res: any) => {
      this.selectedSchedule = res[0];

      // Reset attachment state
      this.attachmentUrl = null;
      this.rawAttachmentBlob = null;
      this.rawAttachmentUrl = null;

      if (this.selectedSchedule?.ConfigFile) {
        this.zoomService
          .getAttachment(this.selectedSchedule.ConfigFile)
          .subscribe({
            next: (blob: Blob) => {
              this.rawAttachmentBlob = blob;
              this.rawAttachmentUrl = URL.createObjectURL(blob);
              this.attachmentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawAttachmentUrl);
            },
            error: (err) => {
              console.error('❌ Failed to load attachment:', err);
              this.attachmentUrl = null;
              this.rawAttachmentBlob = null;
              this.rawAttachmentUrl = null;
            },
          });
      }

      this.isViewModalOpen = true;
    });
  }

  closeModal() {
    this.isViewModalOpen = false;
    this.selectedSchedule = null;
    this.attachmentUrl = null;

    if (this.rawAttachmentUrl) {
      URL.revokeObjectURL(this.rawAttachmentUrl);
      this.rawAttachmentUrl = null;
    }
    this.rawAttachmentBlob = null;
  }

  downloadAttachment() {
    if (!this.rawAttachmentUrl || !this.selectedSchedule?.ConfigFile) return;

    const link = document.createElement('a');
    link.href = this.rawAttachmentUrl;
    link.download = this.selectedSchedule.ConfigFile;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewAttachmentFullScreen() {
    if (this.rawAttachmentUrl) {
      window.open(this.rawAttachmentUrl, '_blank');
    } else if (this.selectedSchedule?.ConfigFile) {
      this.zoomService.getAttachment(this.selectedSchedule.ConfigFile).subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
        },
        error: () => {
          alert('Attachment file not found or failed to load.');
        },
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
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const statusSuffix = this.selectedStatusFilter !== 'All' ? `_${this.selectedStatusFilter}` : '';
    const scopeSuffix = `_${this.dateScopeFilter}`;
    const dateStr = this.selectedDate || `${this.monthNames[this.currentMonth]}_${this.currentYear}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `zoom_schedules_${dateStr}${scopeSuffix}${statusSuffix}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
// import { Component, OnInit } from '@angular/core';
// import { AdmZoomScheduleService } from '../../../../services/UserServices/zoom-schedule.service';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { ZoomEmailService } from '../../../../services/notification-services/zoom-email.service';
// import { ApproveZoomEmailService } from '../../../../services/notification-services/approve-zoom-email.service';
// import { Modal } from 'bootstrap';

// export interface Holiday {
//   name: string;
//   type: 'Regular Holiday' | 'Special Non-Working' | 'Tentative Holiday';
//   isHoliday: boolean;
// }

// @Component({
//   selector: 'app-ito-admin-zoomrequest',
//   standalone: false,
//   templateUrl: './ito-admin-zoomrequest.component.html',
//   styleUrl: './ito-admin-zoomrequest.component.scss',
// })
// export class ItoAdminZoomrequestComponent implements OnInit {
//   showCreateForm = false;
//   weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//   days: number[] = [];
//   selectedDate = '';
//   schedules: any[] = [];
//   allEvents: any[] = [];
//   calendarEvents: { [date: string]: any[] } = {};

//   // 🔍 Status Filter: 'All' | 'Pending' | 'Approved' | 'Rejected'
//   selectedStatusFilter: string = 'All';

//   // 📅 Scope Filter: 'month' (Current Month) | 'year' (Entire Selected Year) | 'allTime' (All Years)
//   dateScopeFilter: 'month' | 'year' | 'allTime' = 'month';

//   // Storage for static and dynamic holiday mappings: "YYYY-MM-DD" -> Holiday[]
//   holidaysMap: { [date: string]: Holiday[] } = {};

//   viewMode: 'month' | 'day' = 'month';

//   currentYear: number = new Date().getFullYear();
//   currentMonth: number = new Date().getMonth();
//   monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December',
//   ];

//   constructor(
//     private zoomService: AdmZoomScheduleService,
//     private sanitizer: DomSanitizer,
//     private zoomEmailService: ApproveZoomEmailService,
//   ) {}

//   ngOnInit(): void {
//     this.generateDays();
//     this.loadHolidaysForYear(this.currentYear);
//     this.loadSchedules();

//     // SignalR real-time updates
//     this.zoomService.startConnection().then(() => {
//       this.zoomService.ZoomScheduleAdded$.subscribe((z) => {
//         if (z) {
//           this.loadSchedules();
//         }
//       });
//     });
//   }

//   // -------------------------------
//   // 🇵🇭 Holiday Helper Engine
//   // -------------------------------
//   loadHolidaysForYear(year: number) {
//     this.holidaysMap = {};

//     // 1. Fixed Regular & Special Holidays (Format: MM-DD)
//     const fixedHolidays: { [key: string]: { name: string; type: Holiday['type'] } } = {
//       '01-01': { name: "New Year's Day", type: 'Regular Holiday' },
//       '04-09': { name: 'Day of Valor (Araw ng Kagitingan)', type: 'Regular Holiday' },
//       '05-01': { name: 'Labor Day', type: 'Regular Holiday' },
//       '06-12': { name: 'Independence Day', type: 'Regular Holiday' },
//       '08-21': { name: 'Ninoy Aquino Day', type: 'Special Non-Working' },
//       '11-01': { name: "All Saints' Day", type: 'Special Non-Working' },
//       '11-02': { name: "All Souls' Day", type: 'Special Non-Working' },
//       '11-30': { name: 'Bonifacio Day', type: 'Regular Holiday' },
//       '12-08': { name: 'Feast of the Immaculate Conception', type: 'Special Non-Working' },
//       '12-25': { name: 'Christmas Day', type: 'Regular Holiday' },
//       '12-30': { name: 'Rizal Day', type: 'Regular Holiday' },
//       '12-31': { name: 'Last Day of the Year', type: 'Special Non-Working' }
//     };

//     Object.entries(fixedHolidays).forEach(([mmdd, h]) => {
//       const dateKey = `${year}-${mmdd}`;
//       this.addHolidayToMap(dateKey, h.name, h.type);
//     });

//     // 2. Dynamic Movable Holidays (Maundy Thursday, Good Friday)
//     const easter = this.getEasterDate(year);

//     const maundy = new Date(easter);
//     maundy.setDate(easter.getDate() - 3);
//     this.addHolidayToMap(this.formatDateKey(maundy), 'Maundy Thursday', 'Regular Holiday');

//     const goodFriday = new Date(easter);
//     goodFriday.setDate(easter.getDate() - 2);
//     this.addHolidayToMap(this.formatDateKey(goodFriday), 'Good Friday', 'Regular Holiday');

//     const blackSat = new Date(easter);
//     blackSat.setDate(easter.getDate() - 1);
//     this.addHolidayToMap(this.formatDateKey(blackSat), 'Black Saturday', 'Special Non-Working');

//     // 3. Tentative / Islamic Holidays
//     this.addHolidayToMap(`${year}-03-31`, 'Eid al-Fitr (Tentative)', 'Tentative Holiday');
//     this.addHolidayToMap(`${year}-06-06`, 'Eid al-Adha (Tentative)', 'Tentative Holiday');
//   }

//   private addHolidayToMap(dateKey: string, name: string, type: Holiday['type']) {
//     if (!this.holidaysMap[dateKey]) {
//       this.holidaysMap[dateKey] = [];
//     }
//     this.holidaysMap[dateKey].push({ name, type, isHoliday: true });
//   }

//   private formatDateKey(d: Date): string {
//     return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
//   }

//   private getEasterDate(year: number): Date {
//     const a = year % 19;
//     const b = Math.floor(year / 100);
//     const c = year % 100;
//     const d = Math.floor(b / 4);
//     const e = b % 4;
//     const f = Math.floor((b + 8) / 25);
//     const g = Math.floor((b - f + 1) / 3);
//     const h = (19 * a + b - d - g + 15) % 30;
//     const i = Math.floor(c / 4);
//     const k = c % 4;
//     const L = (32 + 2 * e + 2 * i - h - k) % 7;
//     const m = Math.floor((a + 11 * h + 22 * L) / 451);
//     const month = Math.floor((h + L - 7 * m + 114) / 31) - 1;
//     const day = ((h + L - 7 * m + 114) % 31) + 1;
//     return new Date(year, month, day);
//   }

//   getHolidaysForDay(day: number): Holiday[] {
//     if (!day) return [];
//     return this.holidaysMap[this.getDateForDay(day)] || [];
//   }

//   getEvents(day: number) {
//     if (!day) return [];
//     const dateKey = this.getDateForDay(day);
//     let schedules = this.calendarEvents[dateKey] || [];

//     // Filter cell badges by selected status
//     if (this.selectedStatusFilter !== 'All') {
//       schedules = schedules.filter(
//         (s) => (s.Status || '').toLowerCase() === this.selectedStatusFilter.toLowerCase()
//       );
//     }

//     const holidays = this.holidaysMap[dateKey] || [];
//     const holidayEvents = holidays.map(h => ({
//       ActivityName: `${h.type === 'Tentative Holiday' ? '⏳' : '🎉'} ${h.name}`,
//       isHoliday: true,
//       holidayType: h.type
//     }));

//     return [...holidayEvents, ...schedules];
//   }

//   onScheduleSaved(startDate: string) {
//     this.closeCreateModal();
//     const start = new Date(startDate);
//     this.currentYear = start.getFullYear();
//     this.currentMonth = start.getMonth();

//     this.loadHolidaysForYear(this.currentYear);
//     this.generateDays();
//     this.loadSchedules();
//     this.selectDate(start.getDate());
//   }

//   closeCreateModal() {
//     const modalEl = document.getElementById('zoomSchedModal');
//     if (!modalEl) return;
//     (window as any)['$']('#zoomSchedModal').modal('hide');
//   }

//   generateDays() {
//     const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
//     const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
//     const startOffset = firstDay;

//     this.days = [];
//     for (let i = 0; i < startOffset; i++) {
//       this.days.push(0);
//     }
//     for (let i = 1; i <= daysInMonth; i++) {
//       this.days.push(i);
//     }
//   }

//   getDateForDay(day: number): string {
//     return `${this.currentYear}-${(this.currentMonth + 1)
//       .toString()
//       .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
//   }

//   getMonthRange() {
//     const start = new Date(this.currentYear, this.currentMonth, 1);
//     const end = new Date(this.currentYear, this.currentMonth + 1, 0);

//     const startStr = start.toISOString().split('T')[0];
//     const endStr = end.toISOString().split('T')[0];

//     return { startStr, endStr };
//   }

//   loadSchedules() {
//     this.zoomService.getZoomSchedules().subscribe((res) => {
//       this.allEvents = res;
//       this.buildCalendarEvents();
//       this.updateScheduleList();
//     });
//   }

//   buildCalendarEvents() {
//     this.calendarEvents = {};

//     this.allEvents.forEach((event) => {
//       const start = new Date(event.StartDate || event.startDate);
//       const end = new Date(event.EndDate || event.endDate);
//       const current = new Date(start);

//       while (current <= end) {
//         if (
//           current.getFullYear() === this.currentYear &&
//           current.getMonth() === this.currentMonth
//         ) {
//           const key = current.toISOString().split('T')[0];
//           if (!this.calendarEvents[key]) {
//             this.calendarEvents[key] = [];
//           }
//           this.calendarEvents[key].push(event);
//         }
//         current.setDate(current.getDate() + 1);
//       }
//     });
//   }

//   // -------------------------------
//   // 🔘 Filter Event Handlers
//   // -------------------------------
//   onStatusFilterChange(status: string) {
//     this.selectedStatusFilter = status;
//     this.updateScheduleList();
//   }

//   onDateScopeChange(scope: 'month' | 'year' | 'allTime') {
//     this.dateScopeFilter = scope;
//     if (scope === 'year' || scope === 'allTime') {
//       this.viewMode = 'month'; // Reset day view when expanding date scope
//     }
//     this.updateScheduleList();
//   }

//   // -------------------------------
//   // 🔄 Update Schedule List (Date Scope + Status Filters)
//   // -------------------------------
//   updateScheduleList() {
//     let filtered = [...this.allEvents];

//     // 1. Date Scope Filtering
//     if (this.viewMode === 'day' && this.selectedDate) {
//       // Single Selected Day
//       filtered = filtered.filter(
//         (e) =>
//           this.selectedDate >= (e.StartDate || e.startDate) &&
//           this.selectedDate <= (e.EndDate || e.endDate)
//       );
//     } else if (this.dateScopeFilter === 'month') {
//       // Current Month
//       const { startStr, endStr } = this.getMonthRange();
//       filtered = filtered.filter(
//         (e) =>
//           (e.StartDate || e.startDate) <= endStr &&
//           (e.EndDate || e.endDate) >= startStr
//       );
//     } else if (this.dateScopeFilter === 'year') {
//       // Entire Selected Year (e.g., 2026-01-01 to 2026-12-31)
//       const yearStart = `${this.currentYear}-01-01`;
//       const yearEnd = `${this.currentYear}-12-31`;
//       filtered = filtered.filter(
//         (e) =>
//           (e.StartDate || e.startDate) <= yearEnd &&
//           (e.EndDate || e.endDate) >= yearStart
//       );
//     }
//     // If dateScopeFilter === 'allTime', no date condition is applied!

//     // 2. Status Filtering ('Pending' | 'Approved' | 'Rejected' | 'All')
//     if (this.selectedStatusFilter !== 'All') {
//       filtered = filtered.filter(
//         (e) => (e.Status || '').toLowerCase() === this.selectedStatusFilter.toLowerCase()
//       );
//     }

//     this.schedules = filtered;
//   }

//   prevMonth() {
//     if (this.currentMonth === 0) {
//       this.currentMonth = 11;
//       this.currentYear--;
//     } else {
//       this.currentMonth--;
//     }

//     this.loadHolidaysForYear(this.currentYear);
//     this.generateDays();
//     this.buildCalendarEvents();

//     this.viewMode = 'month';
//     this.selectedDate = '';
//     this.updateScheduleList();
//   }

//   nextMonth() {
//     if (this.currentMonth === 11) {
//       this.currentMonth = 0;
//       this.currentYear++;
//     } else {
//       this.currentMonth++;
//     }

//     this.loadHolidaysForYear(this.currentYear);
//     this.generateDays();
//     this.buildCalendarEvents();

//     this.viewMode = 'month';
//     this.selectedDate = '';
//     this.updateScheduleList();
//   }

//   selectDate(day: number) {
//     if (!day) return;
//     this.viewMode = 'day';
//     this.selectedDate = this.getDateForDay(day);
//     this.updateScheduleList();
//   }

//   showMonthSchedules() {
//     this.viewMode = 'month';
//     this.selectedDate = '';
//     this.updateScheduleList();
//   }

//   updateStatus(schedule: any, newStatus: string) {
//     if (schedule.Status === newStatus) return;

//     this.zoomService
//       .updateZoomScheduleStatus(schedule.Id, newStatus)
//       .subscribe({
//         next: () => {
//           schedule.Status = newStatus;
//           this.updateScheduleList(); // Auto-refresh to respect status filters immediately

//           if (newStatus === 'Approved' || newStatus === 'Rejected') {
//             if (!schedule.RequesterEmail) {
//               console.error('❌ No requester email found!');
//               return;
//             }

//             this.zoomEmailService
//               .sendStatusEmail(schedule, newStatus)
//               .subscribe({
//                 next: () => console.log('✅ Email sent'),
//                 error: (err) => console.error('❌ Email failed:', err),
//               });
//           }
//         },
//         error: (err) => console.error('❌ Status update failed:', err),
//       });
//   }

//   selectedSchedule: any = null;
//   attachmentUrl: SafeResourceUrl | null = null;

//   viewSchedule(schedule: any) {
//     this.zoomService.getZoomScheduleById(schedule.Id).subscribe((res: any) => {
//       this.selectedSchedule = res[0];

//       if (this.selectedSchedule.ConfigFile) {
//         this.zoomService
//           .getAttachment(this.selectedSchedule.ConfigFile)
//           .subscribe({
//             next: (blob: Blob) => {
//               const url = URL.createObjectURL(blob);
//               this.attachmentUrl =
//                 this.sanitizer.bypassSecurityTrustResourceUrl(url);
//             },
//             error: () => {
//               this.attachmentUrl = null;
//             },
//           });
//       }

//       const modalElement = document.getElementById('viewScheduleModal');
//       if (modalElement) {
//         const modal = new Modal(modalElement);
//         modal.show();
//       }
//     });
//   }

//   downloadAttachment() {
//     if (!this.attachmentUrl || !this.selectedSchedule) return;

//     const link = document.createElement('a');
//     link.href = (
//       this.attachmentUrl as any
//     ).changingThisBreaksApplicationSecurity;
//     link.download = this.selectedSchedule.ConfigFile;
//     link.click();
//   }

//   viewAttachmentFullScreen() {
//     if (!this.selectedSchedule?.ConfigFile) return;

//     this.zoomService.getAttachment(this.selectedSchedule.ConfigFile).subscribe({
//       next: (blob: Blob) => {
//         const url = URL.createObjectURL(blob);
//         window.open(url, '_blank');
//       },
//       error: () => {
//         console.error('Attachment not found');
//         alert('Attachment not found.');
//       },
//     });
//   }

//   closeModal() {
//     this.attachmentUrl = null;
//     const modalElement = document.getElementById('viewScheduleModal');
//     if (modalElement) {
//       const modal =
//         Modal.getInstance(modalElement) ||
//         new Modal(modalElement);
//       modal.hide();
//     }
//   }

//   getPickerDateString(): string {
//     if (this.selectedDate) {
//       return this.selectedDate;
//     }
//     const day = '01';
//     const month = (this.currentMonth + 1).toString().padStart(2, '0');
//     return `${this.currentYear}-${month}-${day}`;
//   }

//   onDatePickerChange(newDateStr: string) {
//     if (!newDateStr) return;

//     const parsedDate = new Date(newDateStr);
//     if (isNaN(parsedDate.getTime())) return;

//     this.currentYear = parsedDate.getFullYear();
//     this.currentMonth = parsedDate.getMonth();

//     this.loadHolidaysForYear(this.currentYear);
//     this.generateDays();
//     this.buildCalendarEvents();

//     this.viewMode = 'day';
//     this.selectedDate = newDateStr;
//     this.updateScheduleList();
//   }

//   downloadCSV(): void {
//     if (!this.schedules || this.schedules.length === 0) return;

//     const headers = [
//       'Activity Name', 'Setup Type', 'Description', 'Start Date',
//       'End Date', 'Start Time', 'End Time', 'Status',
//       'Requester Name', 'Requester Email', 'Additional Details'
//     ];

//     const rows = this.schedules.map(s => [
//       `"${(s.ActivityName || '').replace(/"/g, '""')}"`,
//       `"${(s.SetupType || '').replace(/"/g, '""')}"`,
//       `"${(s.ZoomDescription || '').replace(/"/g, '""')}"`,
//       `"${s.StartDate || ''}"`,
//       `"${s.EndDate || ''}"`,
//       `"${s.TimeStart || ''}"`,
//       `"${s.TimeEnd || ''}"`,
//       `"${s.Status || ''}"`,
//       `"${(s.RequesterName || '').replace(/"/g, '""')}"`,
//       `"${(s.RequesterEmail || '').replace(/"/g, '""')}"`,
//       `"${(s.AdditionalDetails || '').replace(/"/g, '""')}"`
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...rows.map(r => r.join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');

//     const statusSuffix = this.selectedStatusFilter !== 'All' ? `_${this.selectedStatusFilter}` : '';
//     const scopeSuffix = `_${this.dateScopeFilter}`;
//     const dateStr = this.selectedDate || `${this.monthNames[this.currentMonth]}_${this.currentYear}`;
    
//     link.setAttribute('href', url);
//     link.setAttribute('download', `zoom_schedules_${dateStr}${scopeSuffix}${statusSuffix}.csv`);
//     link.style.visibility = 'hidden';

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//   }
// }