import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-zoom-schedule',
  standalone: false,
  templateUrl: './user-zoom-schedule.component.html',
  styleUrl: './user-zoom-schedule.component.scss'
})
export class UserZoomScheduleComponent  {

}

// import { Component, OnInit } from '@angular/core';
// import { AdmZoomScheduleService } from '../../../services/UserServices/zoom-schedule.service';

// @Component({
//   selector: 'app-zoom-schedule',
//   standalone: false,
//   templateUrl: './zoom-schedule.component.html',
//   styleUrl: './zoom-schedule.component.scss'
// })
// export class ZoomScheduleComponent implements OnInit {



//      // right panel
//   allEvents: any[] = [];     // calendar (NEW)

//   days: number[] = [];
//   selectedDate = '';
//   schedules: any[] = [];

//   formData: any = {
//     activityName: '',
//     setupType: '',
//     zoomDescription: '',
//     eventDate: '',
//     startDate: '',
//   endDate: '',
//     timeStart: '',
//     timeEnd: '',
//     alternateHosts: '',
//     requireRegistration: 'No',
//     desiredPasscode: '',
//     requesterName: '',
//     requesterEmail: '',
//     officeUnitProject: '',
//     additionalDetails: '',
//     score: 0,
//     emailAddress: '',
//     configFile: '',
//     status: 'Pending'
//   };
// calendarEventsForDay(day: number) {
//   const date = `2026-02-${day.toString().padStart(2, '0')}`;

//   return this.allEvents.filter(e =>
//     date >= e.StartDate && date <= e.EndDate
//   );
// }

//   constructor(private zoomService: AdmZoomScheduleService) {}
// calendarEvents: { [date: string]: any[] } = {};

// ngOnInit(): void {
//   this.days = Array.from({ length: 31 }, (_, i) => i + 1);

//   this.zoomService.getZoomSchedules().subscribe(res => {
//     res.forEach(s => {
//       if (!this.calendarEvents[s.EventDate]) {
//         this.calendarEvents[s.EventDate] = [];
//       }
//       this.calendarEvents[s.EventDate].push(s);
//     });
//   });
// }

//   selectDate(day: number) {
//     this.selectedDate = `2026-02-${day.toString().padStart(2, '0')}`;
//     this.formData.eventDate = this.selectedDate;

//     this.zoomService.getZoomSchedulesByDate(this.selectedDate)
//       .subscribe(res => this.schedules = res);
//   }

//   saveSchedule() {
//     this.zoomService.addZoomSchedule(this.formData)
//       .subscribe(() => {
//         alert('Zoom Schedule Saved');
//         this.selectDate(+this.selectedDate.split('-')[2]);
//         this.resetForm();
//       });
//   }

//   deleteSchedule(id: number) {
//     if (!confirm('Delete this schedule?')) return;

//     this.zoomService.deleteZoomSchedule(id)
//       .subscribe(() => {
//         this.selectDate(+this.selectedDate.split('-')[2]);
//       });
//   }

//   resetForm() {
//     this.formData = {
//       activityName: '',
//       setupType: '',
//       zoomDescription: '',
//       eventDate: this.selectedDate,
//       timeStart: '',
//       timeEnd: '',
//       alternateHosts: '',
//       requireRegistration: 'No',
//       desiredPasscode: '',
//       requesterName: '',
//       requesterEmail: '',
//       officeUnitProject: '',
//       additionalDetails: '',
//       score: 0,
//       emailAddress: '',
//       configFile: '',
//       status: 'Pending'
//     };
//   }
// }