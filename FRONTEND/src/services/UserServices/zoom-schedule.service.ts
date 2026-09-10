import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppInitService } from '../app-init.service';
import * as signalR from '@microsoft/signalr'
@Injectable({
  providedIn: 'root',
})
export class AdmZoomScheduleService {

  constructor(
    private http: HttpClient,
    private appInit: AppInitService
  ) {}
private hubConnection!: signalR.HubConnection;

  // 🔹 Base API
  private get apiUrl(): string {
    return `${this.appInit.apiURL}/api`;
  }
  private ZoomScheduleAddedSubject = new BehaviorSubject<any>(null);
  ZoomScheduleAdded$ = this.ZoomScheduleAddedSubject.asObservable();

startConnection(): Promise<void> {
  const signalRUrl = `${this.appInit.apiURL}/hubs/notification`;

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(signalRUrl, { withCredentials: true })
    .withAutomaticReconnect()
    .build();

  // Subscribe to hub events
  this.hubConnection.on('ZoomScheduleAdded', (schedule) => {
    this.ZoomScheduleAddedSubject.next(schedule);
  });

  // Return the Promise from start()
  return this.hubConnection
    .start()
    .then(() => console.log('✅ SignalR connected'))
    .catch((err) => {
      console.error('❌ SignalR error:', err);
      throw err; // rethrow so the caller can handle it
    });
}



  // 🔹 Zoom Schedule API
  get apiUrlZoomSchedule(): string {
    return `${this.appInit.apiURL}/api/ZoomSchedule`;
  }

  // ===============================
  // 📌 REPOSITORY METHODS
  // ===============================

  // GET ALL SCHEDULES
  getZoomSchedules(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlZoomSchedule);
  }

  // GET SCHEDULES BY DATE (CALENDAR CLICK)
  getZoomSchedulesByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrlZoomSchedule}/bydate/${date}`
    );
  }
  getZoomScheduleById(id: number) {
  return this.http.get<any[]>(`${this.apiUrl}/ZoomSchedule/${id}`);
}
getAttachment(fileName: string) {
  return this.http.get(`${this.apiUrlZoomSchedule}/attachment/${fileName}`, {
    responseType: 'blob',
  });

}


  // ADD NEW SCHEDULE
addZoomSchedule(data: FormData) {
  return this.http.post(this.apiUrl + '/ZoomSchedule', data);
}

updateZoomSchedule(id: number, formData: FormData) {
  return this.http.put(`${this.apiUrl}/ZoomSchedule/${id}`, formData);
}

  // UPDATE SCHEDULE
updateZoomScheduleStatus(id: number, status: string) {
  return this.http.put(
    this.apiUrl + '/ZoomSchedule/status/' + id,
    { status: status }
  );
}


  // DELETE SCHEDULE
  deleteZoomSchedule(id: number) {
    return this.http.delete(
      `${this.apiUrlZoomSchedule}/${id}`
    );
  }
getZoomSchedulesByUser(email: string) {
  return this.http.get<any[]>(`${this.apiUrl}/ZoomSchedule/user/${email}`);
}

// ===============================
// GET ZOOM STATS BY MONTH/YEAR
// ===============================
getZoomStats(fromDate?: string, toDate?: string): Observable<any[]> {
  let url = `${this.apiUrlZoomSchedule}/zoomstats`;

  // Add query parameters if provided
  const params: string[] = [];
  if (fromDate) params.push(`fromDate=${fromDate}`);
  if (toDate) params.push(`toDate=${toDate}`);
  if (params.length) url += `?${params.join('&')}`;

  return this.http.get<any[]>(url);
}
}
