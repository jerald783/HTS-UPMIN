import { Component, OnInit } from '@angular/core';
import { AdmZoomScheduleService } from '../../../../../services/UserServices/zoom-schedule.service';

export interface Holiday {
  name: string;
  type: 'Regular Holiday' | 'Special Non-Working' | 'Tentative Holiday';
  isHoliday: boolean;
}

@Component({
  selector: 'app-view-zoomsched',
  templateUrl: './view-zoomsched.component.html',
  styleUrls: ['./view-zoomsched.component.scss'],
  standalone: false,
})
export class ViewZoomschedComponent implements OnInit {
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // ===============================
  // 📅 Calendar State
  // ===============================
  days: number[] = [];
  selectedDate = '';

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Storage for static and dynamic holiday mappings: "YYYY-MM-DD" -> Holiday[]
  holidaysMap: { [date: string]: Holiday[] } = {};

  // ===============================
  // 📊 Data
  // ===============================
  schedules: any[] = [];
  allEvents: any[] = [];
  userSchedules: any[] = [];

  calendarEvents: { [date: string]: any[] } = {};

  viewMode: 'month' | 'day' = 'month';

  // ===============================
  // 🧩 Modals
  // ===============================
  selectedSchedule: any = null;
  scheduleToDelete: any = null;

  constructor(private zoomService: AdmZoomScheduleService) {}

  // ===============================
  // 🔄 Lifecycle
  // ===============================
  ngOnInit(): void {
    this.generateDays();
    this.loadHolidaysForYear(this.currentYear);
    this.loadSchedules();
  }

  // -------------------------------
  // 🇵🇭 Holiday Helper Engine
  // -------------------------------
  loadHolidaysForYear(year: number) {
    this.holidaysMap = {};

    // 1. Fixed Regular & Special Holidays (Format: MM-DD)
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

    // 2. Dynamic Movable Holidays (Maundy Thursday, Good Friday, Black Saturday)
    const easter = this.getEasterDate(year);
    
    // Maundy Thursday (Easter - 3 days)
    const maundy = new Date(easter);
    maundy.setDate(easter.getDate() - 3);
    this.addHolidayToMap(this.formatDateKey(maundy), 'Maundy Thursday', 'Regular Holiday');

    // Good Friday (Easter - 2 days)
    const goodFriday = new Date(easter);
    goodFriday.setDate(easter.getDate() - 2);
    this.addHolidayToMap(this.formatDateKey(goodFriday), 'Good Friday', 'Regular Holiday');

    // Black Saturday (Easter - 1 day)
    const blackSat = new Date(easter);
    blackSat.setDate(easter.getDate() - 1);
    this.addHolidayToMap(this.formatDateKey(blackSat), 'Black Saturday', 'Special Non-Working');

    // 3. Tentative / Islamic Holidays (Eid al-Fitr & Eid al-Adha)
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

  // Butcher-Meeus Algorithm for Easter Calculation
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
    const schedules = this.calendarEvents[dateKey] || [];
    const holidays = this.holidaysMap[dateKey] || [];

    const holidayEvents = holidays.map(h => ({
      ActivityName: `${h.type === 'Tentative Holiday' ? '⏳' : '🎉'} ${h.name}`,
      isHoliday: true,
      holidayType: h.type
    }));

    return [...holidayEvents, ...schedules];
  }

  // ===============================
  // ➕ Create callback
  // ===============================
  onScheduleSaved(startDate: string) {
    this.closeModal('zoomSchedModal');

    const start = new Date(startDate);
    this.currentYear = start.getFullYear();
    this.currentMonth = start.getMonth();

    this.loadHolidaysForYear(this.currentYear);
    this.generateDays();
    this.loadSchedules();
    this.selectDate(start.getDate());
  }

  private openModal(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    let modal = (window as any).bootstrap?.Modal?.getInstance(el);
    if (!modal) {
      modal = new (window as any).bootstrap.Modal(el);
    }
    modal.show();
  }

  private closeModal(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    let modal = (window as any).bootstrap?.Modal?.getInstance(el);
    if (!modal) {
      modal = new (window as any).bootstrap.Modal(el);
    }
    modal.hide();

    // Cleanup leftover backdrop
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      document.querySelectorAll('.modal-backdrop').forEach((x) => x.remove());
      document.body.style.removeProperty('padding-right');
      document.body.style.removeProperty('overflow');
    }, 300);
  }

  // ===============================
  // 📅 Calendar Helpers
  // ===============================
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
    return `${this.currentYear}-${(this.currentMonth + 1)
      .toString()
      .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  getMonthRange() {
    const start = new Date(this.currentYear, this.currentMonth, 1);
    const end = new Date(this.currentYear, this.currentMonth + 1, 0);

    return {
      startStr: start.toISOString().split('T')[0],
      endStr: end.toISOString().split('T')[0],
    };
  }

  loadSchedules() {
    this.zoomService.getZoomSchedules().subscribe((res) => {
      this.allEvents = (res || []).sort((a, b) => b.Id - a.Id);
      this.buildCalendarEvents();
      this.updateScheduleList();
    });

    const userEmail = localStorage.getItem('Email');
    if (!userEmail) return;

    this.zoomService.getZoomSchedulesByUser(userEmail).subscribe((res) => {
      this.userSchedules = (res || []).sort((a, b) => b.Id - a.Id);
    });
  }

  buildCalendarEvents() {
    this.calendarEvents = {};

    this.allEvents.forEach((event) => {
      const start = new Date(event.StartDate || event.startDate);
      const end = new Date(event.EndDate || event.endDate || event.StartDate);
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

  // ===============================
  // 📋 List Filtering
  // ===============================
  updateScheduleList() {
    if (this.viewMode === 'day' && this.selectedDate) {
      this.schedules = this.allEvents.filter(
        (e) =>
          this.selectedDate >= (e.StartDate || e.startDate) &&
          this.selectedDate <= (e.EndDate || e.endDate || e.StartDate),
      );
    } else {
      const { startStr, endStr } = this.getMonthRange();
      this.schedules = this.allEvents.filter(
        (e) =>
          (e.StartDate || e.startDate) <= endStr &&
          (e.EndDate || e.endDate || e.StartDate) >= startStr,
      );
    }
  }

  // ===============================
  // ◀▶ Month Navigation
  // ===============================
  prevMonth() {
    this.currentMonth === 0
      ? ((this.currentMonth = 11), this.currentYear--)
      : this.currentMonth--;

    this.resetToMonthView();
  }

  nextMonth() {
    this.currentMonth === 11
      ? ((this.currentMonth = 0), this.currentYear++)
      : this.currentMonth++;

    this.resetToMonthView();
  }

  resetToMonthView() {
    this.loadHolidaysForYear(this.currentYear);
    this.generateDays();
    this.buildCalendarEvents();
    this.viewMode = 'month';
    this.selectedDate = '';
    this.updateScheduleList();
  }

  // ===============================
  // 🖱 Day Click
  // ===============================
  selectDate(day: number) {
    if (!day) return;

    this.viewMode = 'day';
    this.selectedDate = this.getDateForDay(day);
    this.updateScheduleList();
  }



  // ===============================
  // ✏️ Edit
  // ===============================
  openEditModal(schedule: any) {
    if (schedule.Status === 'Approved' || schedule.Status === 'Rejected') {
      return;
    }

    this.zoomService.getZoomScheduleById(schedule.Id).subscribe((res) => {
      this.selectedSchedule = res[0];
      this.openModal('zoomEditModal');
    });
  }

  closeEditModal() {
    this.closeModal('zoomEditModal');
    this.selectedSchedule = null;
  }

  onScheduleUpdated() {
    this.closeEditModal();
    this.loadSchedules();
  }

  // ===============================
  // 🗑 Delete
  // ===============================
  openDeleteModal(schedule: any) {
    if (schedule.Status === 'Approved' || schedule.Status === 'Rejected') {
      return;
    }

    this.scheduleToDelete = schedule;
    this.openModal('deleteConfirmModal');
  }

  closeDeleteModal() {
    this.closeModal('deleteConfirmModal');
    this.scheduleToDelete = null;
  }

  confirmDelete() {
    if (!this.scheduleToDelete) return;

    if (
      this.scheduleToDelete.Status === 'Approved' ||
      this.scheduleToDelete.Status === 'Rejected'
    ) {
      return;
    }

    this.zoomService
      .deleteZoomSchedule(this.scheduleToDelete.Id)
      .subscribe(() => {
        this.closeDeleteModal();
        this.loadSchedules();
      });
  }

  updateStatus(schedule: any, newStatus: string) {
    schedule.Status = newStatus;

    this.zoomService
      .updateZoomScheduleStatus(schedule.Id, newStatus)
      .subscribe(() => this.loadSchedules());
  }

  // -------------------------------
  // 📅 Date Picker Bindings
  // -------------------------------
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

    const parsedDate = new Date(newDateStr);
    if (isNaN(parsedDate.getTime())) return;

    this.currentYear = parsedDate.getFullYear();
    this.currentMonth = parsedDate.getMonth();

    this.loadHolidaysForYear(this.currentYear);
    this.generateDays();
    this.buildCalendarEvents();

    this.viewMode = 'day';
    this.selectedDate = newDateStr;

    this.updateScheduleList();
  }
}